import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { User, Test, Question, PDFMetadata, AppSettings } from './src/types';
import { INITIAL_TESTS, INITIAL_QUESTIONS, INITIAL_PDFS } from './src/data/initialData';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'mojilo_manish_tet1_secret_key_2026';

app.use(cors({ origin: true, credentials: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure upload directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.pdf';
    cb(null, 'pdf-' + uniqueSuffix + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('માત્ર PDF ફાઇલ અપલોડ કરી શકાય છે!'));
    }
  }
});

// Database Files Directory
const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const usersFile = path.join(dbDir, 'users.json');
const testsFile = path.join(dbDir, 'tests.json');
const questionsFile = path.join(dbDir, 'questions.json');
const pdfsFile = path.join(dbDir, 'pdfs.json');
const settingsFile = path.join(dbDir, 'settings.json');

// In-Memory Database Cache backed by JSON
let users: (User & { passwordHash: string })[] = [];
let tests: Test[] = [];
let questions: Question[] = [];
let pdfs: PDFMetadata[] = [];
let appSettings: AppSettings = {
  supabase: { url: '', anonKey: '', isConnected: false },
  cloudflareR2: {
    accountId: '',
    accessKeyId: '',
    secretAccessKey: '',
    bucketName: '',
    publicDomain: '',
    isConnected: false
  }
};

// Seed & Load Initial Data
async function initDatabase() {
  // Users
  if (fs.existsSync(usersFile)) {
    try {
      users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    } catch (e) {
      console.error('Error reading users json', e);
    }
  }

  if (users.length === 0) {
    const adminPasswordHash = bcrypt.hashSync('Manish@2006', 10);
    const studentPasswordHash = bcrypt.hashSync('student123', 10);

    users = [
      {
        id: 'usr-admin-01',
        name: 'મનીષ પટેલ (એડમિન)',
        mobile: '7096684982',
        role: 'ADMIN',
        isActive: true,
        passwordHash: adminPasswordHash,
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr-student-01',
        name: 'મનીષ વ્યાસ (વિદ્યાર્થી)',
        mobile: '9998887776',
        role: 'STUDENT',
        isActive: true,
        activeDeviceId: null,
        activeDeviceName: null,
        passwordHash: studentPasswordHash,
        createdAt: new Date().toISOString()
      }
    ];
    saveUsers();
  } else {
    // Ensure 7096684982 Admin account exists and has the correct password
    let adminUser = users.find((u) => u.mobile === '7096684982' || u.role === 'ADMIN');
    if (adminUser) {
      adminUser.mobile = '7096684982';
      adminUser.role = 'ADMIN';
      adminUser.isActive = true;
      adminUser.passwordHash = bcrypt.hashSync('Manish@2006', 10);
    } else {
      users.push({
        id: 'usr-admin-01',
        name: 'મનીષ પટેલ (એડમિન)',
        mobile: '7096684982',
        role: 'ADMIN',
        isActive: true,
        passwordHash: bcrypt.hashSync('Manish@2006', 10),
        createdAt: new Date().toISOString()
      });
    }
    saveUsers();
  }

  // Tests
  if (fs.existsSync(testsFile)) {
    try {
      tests = JSON.parse(fs.readFileSync(testsFile, 'utf-8'));
    } catch (e) {
      console.error('Error reading tests json', e);
    }
  }
  if (tests.length === 0) {
    tests = INITIAL_TESTS;
    saveTests();
  }

  // Questions
  if (fs.existsSync(questionsFile)) {
    try {
      questions = JSON.parse(fs.readFileSync(questionsFile, 'utf-8'));
    } catch (e) {
      console.error('Error reading questions json', e);
    }
  }
  if (questions.length === 0) {
    questions = INITIAL_QUESTIONS;
    saveQuestions();
  }

  // PDFs
  if (fs.existsSync(pdfsFile)) {
    try {
      pdfs = JSON.parse(fs.readFileSync(pdfsFile, 'utf-8'));
    } catch (e) {
      console.error('Error reading pdfs json', e);
    }
  }
  if (pdfs.length === 0) {
    pdfs = INITIAL_PDFS;
    savePdfs();
  }

  // Settings
  if (fs.existsSync(settingsFile)) {
    try {
      appSettings = JSON.parse(fs.readFileSync(settingsFile, 'utf-8'));
    } catch (e) {
      console.error('Error reading settings json', e);
    }
  }
}

function saveUsers() {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function saveTests() {
  fs.writeFileSync(testsFile, JSON.stringify(tests, null, 2));
}

function saveQuestions() {
  fs.writeFileSync(questionsFile, JSON.stringify(questions, null, 2));
}

function savePdfs() {
  fs.writeFileSync(pdfsFile, JSON.stringify(pdfs, null, 2));
}

function saveSettings() {
  fs.writeFileSync(settingsFile, JSON.stringify(appSettings, null, 2));
}

initDatabase();

// Auth Middleware
interface AuthRequest extends Request {
  user?: User;
  token?: string;
}

function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'પ્રમાણીકરણ ટોકન મળ્યો નથી. ફરી લોગિન કરો.' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'ટોકન અમાન્ય અથવા કાલગ્રસ્ત થયો છે.' });
    }

    const foundUser = users.find((u) => u.id === decoded.userId);
    if (!foundUser) {
      return res.status(404).json({ error: 'વપરાશકર્તા મળ્યો નથી.' });
    }

    if (!foundUser.isActive) {
      return res.status(403).json({ error: 'તમારું account હાલમાં બંધ છે.' });
    }

    // Verify Device Session for Student
    if (foundUser.role === 'STUDENT' && decoded.deviceId) {
      if (foundUser.activeDeviceId && foundUser.activeDeviceId !== decoded.deviceId) {
        return res.status(403).json({
          error: 'આ account બીજા device પર પહેલેથી Login છે.',
          code: 'DEVICE_LOCKED'
        });
      }
    }

    const { passwordHash, ...userWithoutPassword } = foundUser;
    req.user = userWithoutPassword;
    req.token = token;
    next();
  });
}

function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'આ કાર્ય માટે એડમિન પરવાનગી જરૂરી છે.' });
  }
  next();
}

// API ROUTES

// 1. LOGIN API
app.post('/api/auth/login', (req, res) => {
  const { mobile, password, deviceId, deviceName } = req.body;

  if (!mobile || !password) {
    return res.status(400).json({ error: 'મોબાઇલ નંબર અને પાસવર્ડ બંને જરૂરી છે.' });
  }

  const user = users.find((u) => u.mobile.trim() === mobile.trim());

  if (!user) {
    return res.status(401).json({ error: 'મોબાઇલ નંબર અથવા પાસવર્ડ ખોટો છે.' });
  }

  // Check Account Status
  if (!user.isActive) {
    return res.status(403).json({ error: 'તમારું account હાલમાં બંધ છે.' });
  }

  // Verify Password
  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'મોબાઇલ નંબર અથવા પાસવર્ડ ખોટો છે.' });
  }

  // Handle One-Device Login Lock for Students
  const clientDeviceId = deviceId || 'device-' + Math.random().toString(36).substring(2, 9);
  const clientDeviceName = deviceName || 'Android Web App';

  if (user.role === 'STUDENT') {
    if (user.activeDeviceId && user.activeDeviceId !== clientDeviceId) {
      return res.status(403).json({
        error: 'આ account બીજા device પર પહેલેથી Login છે.',
        code: 'DEVICE_LOCKED'
      });
    }

    // Lock session to this device
    user.activeDeviceId = clientDeviceId;
    user.activeDeviceId = clientDeviceId;
    user.activeDeviceName = clientDeviceName;
    user.lastLoginAt = new Date().toISOString();
    saveUsers();
  }

  // Generate JWT Token
  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
      mobile: user.mobile,
      deviceId: clientDeviceId
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  const { passwordHash, ...userWithoutPassword } = user;

  res.json({
    message: 'સફળતાપૂર્વક લોગિન થયું!',
    token,
    user: userWithoutPassword,
    deviceId: clientDeviceId
  });
});

// Logout
app.post('/api/auth/logout', authenticateToken, (req: AuthRequest, res) => {
  res.json({ message: 'સફળતાપૂર્વક લોગઆઉટ થયું.' });
});

// Get Current User Profile
app.get('/api/auth/me', authenticateToken, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

// 2. ADMIN STUDENT MANAGEMENT
// Get All Students
app.get('/api/admin/students', authenticateToken, requireAdmin, (req, res) => {
  const studentList = users
    .filter((u) => u.role === 'STUDENT')
    .map(({ passwordHash, ...u }) => u);
  res.json({ students: studentList });
});

// Add New Student
app.post('/api/admin/students', authenticateToken, requireAdmin, (req, res) => {
  const { name, mobile, password } = req.body;

  if (!name || !mobile || !password) {
    return res.status(400).json({ error: 'વિદ્યાર્થીનું નામ, મોબાઇલ નંબર અને પાસવર્ડ જરૂરી છે.' });
  }

  if (users.some((u) => u.mobile.trim() === mobile.trim())) {
    return res.status(400).json({ error: 'આ મોબાઇલ નંબર ધરાવતો વિદ્યાર્થી પહેલેથી નોંધાયેલ છે.' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newStudent: User & { passwordHash: string } = {
    id: 'usr-student-' + Date.now(),
    name,
    mobile: mobile.trim(),
    role: 'STUDENT',
    isActive: true,
    activeDeviceId: null,
    activeDeviceName: null,
    passwordHash: hashedPassword,
    createdAt: new Date().toISOString()
  };

  users.push(newStudent);
  saveUsers();

  const { passwordHash, ...studentData } = newStudent;
  res.status(201).json({ message: 'વિદ્યાર્થી સફળતાપૂર્વક ઉમેરાયો!', student: studentData });
});

// Edit Student
app.put('/api/admin/students/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { name, mobile, isActive } = req.body;

  const student = users.find((u) => u.id === id && u.role === 'STUDENT');
  if (!student) {
    return res.status(404).json({ error: 'વિદ્યાર્થી મળ્યો નથી.' });
  }

  if (mobile && mobile.trim() !== student.mobile) {
    if (users.some((u) => u.mobile.trim() === mobile.trim() && u.id !== id)) {
      return res.status(400).json({ error: 'આ મોબાઇલ નંબર બીજા અકાઉન્ટમાં વપરાયેલ છે.' });
    }
    student.mobile = mobile.trim();
  }

  if (name) student.name = name;
  if (typeof isActive === 'boolean') student.isActive = isActive;

  saveUsers();
  const { passwordHash, ...studentData } = student;
  res.json({ message: 'વિદ્યાર્થીની માહિતી અપડેટ થઈ!', student: studentData });
});

// Reset Password
app.post('/api/admin/students/:id/reset-password', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 4) {
    return res.status(400).json({ error: 'નવો પાસવર્ડ ઓછામાં ઓછો 4 અક્ષરનો હોવો જોઈએ.' });
  }

  const student = users.find((u) => u.id === id && u.role === 'STUDENT');
  if (!student) {
    return res.status(404).json({ error: 'વિદ્યાર્થી મળ્યો નથી.' });
  }

  student.passwordHash = bcrypt.hashSync(newPassword, 10);
  saveUsers();

  res.json({ message: 'વિદ્યાર્થીનો પાસવર્ડ રીસેટ થયો!' });
});

// Reset Device Session Lock
app.post('/api/admin/students/:id/reset-device', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;

  const student = users.find((u) => u.id === id && u.role === 'STUDENT');
  if (!student) {
    return res.status(404).json({ error: 'વિદ્યાર્થી મળ્યો નથી.' });
  }

  student.activeDeviceId = null;
  student.activeDeviceName = null;
  saveUsers();

  res.json({ message: 'વિદ્યાર્થીનું Device સફળતાપૂર્વક રીસેટ કરવામાં આવ્યું છે.' });
});

// Delete Student
app.delete('/api/admin/students/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const index = users.findIndex((u) => u.id === id && u.role === 'STUDENT');

  if (index === -1) {
    return res.status(404).json({ error: 'વિદ્યાર્થી મળ્યો નથી.' });
  }

  users.splice(index, 1);
  saveUsers();
  res.json({ message: 'વિદ્યાર્થી અકાઉન્ટ કાઢી નાખવામાં આવ્યું.' });
});

// 3. TESTS MANAGEMENT
// Get All Tests
app.get('/api/tests', authenticateToken, (req: AuthRequest, res) => {
  const isAdmin = req.user?.role === 'ADMIN';

  const testList = tests
    .filter((t) => (isAdmin ? true : t.isPublished))
    .map((t) => {
      const qCount = questions.filter((q) => q.testId === t.id).length;
      return { ...t, questionCount: qCount };
    });

  res.json({ tests: testList });
});

// Create Test
app.post('/api/admin/tests', authenticateToken, requireAdmin, (req, res) => {
  const { title, description, timerMinutes, totalMarks, isPublished } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'ટેસ્ટનું નામ જરૂરી છે.' });
  }

  const newTest: Test = {
    id: 'test-' + Date.now(),
    title,
    description: description || '',
    timerMinutes: Number(timerMinutes) || 15,
    totalMarks: Number(totalMarks) || 10,
    isPublished: Boolean(isPublished),
    createdAt: new Date().toISOString()
  };

  tests.push(newTest);
  saveTests();

  res.status(201).json({ message: 'નવી ટેસ્ટ બનાવવામાં આવી!', test: newTest });
});

// Update Test
app.put('/api/admin/tests/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { title, description, timerMinutes, totalMarks, isPublished } = req.body;

  const test = tests.find((t) => t.id === id);
  if (!test) {
    return res.status(404).json({ error: 'ટેસ્ટ મળી નથી.' });
  }

  if (title) test.title = title;
  if (description !== undefined) test.description = description;
  if (timerMinutes !== undefined) test.timerMinutes = Number(timerMinutes);
  if (totalMarks !== undefined) test.totalMarks = Number(totalMarks);
  if (isPublished !== undefined) test.isPublished = Boolean(isPublished);

  saveTests();
  res.json({ message: 'ટેસ્ટની માહિતી અપડેટ થઈ!', test });
});

// Delete Test
app.delete('/api/admin/tests/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const index = tests.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'ટેસ્ટ મળી નથી.' });
  }

  tests.splice(index, 1);
  questions = questions.filter((q) => q.testId !== id);

  saveTests();
  saveQuestions();

  res.json({ message: 'ટેસ્ટ અને તેના પ્રશ્નો કાઢી નાખવામાં આવ્યા.' });
});

// 4. QUESTIONS MANAGEMENT
// Get Questions for Test
app.get('/api/tests/:testId/questions', authenticateToken, (req: AuthRequest, res) => {
  const { testId } = req.params;
  const isAdmin = req.user?.role === 'ADMIN';

  const testQuestions = questions.filter((q) => q.testId === testId);

  // If student, remove correctOption from immediate payload until submission
  if (!isAdmin) {
    const studentQuestions = testQuestions.map(({ correctOption, ...q }) => q);
    return res.json({ questions: studentQuestions });
  }

  res.json({ questions: testQuestions });
});

// Add Question
app.post('/api/admin/questions', authenticateToken, requireAdmin, (req, res) => {
  const { testId, questionText, optionA, optionB, optionC, optionD, correctOption, explanation } = req.body;

  if (!testId || !questionText || !optionA || !optionB || !optionC || !optionD || !correctOption) {
    return res.status(400).json({ error: 'પ્રશ્ન, તમામ 4 વિકલ્પો અને સાચો જવાબ પસંદ કરવા જરૂરી છે.' });
  }

  const newQuestion: Question = {
    id: 'q-' + Date.now(),
    testId,
    questionText,
    optionA,
    optionB,
    optionC,
    optionD,
    correctOption: correctOption as 'A' | 'B' | 'C' | 'D',
    explanation: explanation || ''
  };

  questions.push(newQuestion);
  saveQuestions();

  res.status(201).json({ message: 'પ્રશ્ન સફળતાપૂર્વક ઉમેરાયો!', question: newQuestion });
});

// Edit Question
app.put('/api/admin/questions/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { questionText, optionA, optionB, optionC, optionD, correctOption, explanation } = req.body;

  const q = questions.find((item) => item.id === id);
  if (!q) {
    return res.status(404).json({ error: 'પ્રશ્ન મળ્યો નથી.' });
  }

  if (questionText) q.questionText = questionText;
  if (optionA) q.optionA = optionA;
  if (optionB) q.optionB = optionB;
  if (optionC) q.optionC = optionC;
  if (optionD) q.optionD = optionD;
  if (correctOption) q.correctOption = correctOption;
  if (explanation !== undefined) q.explanation = explanation;

  saveQuestions();
  res.json({ message: 'પ્રશ્ન અપડેટ થયો!', question: q });
});

// Delete Question
app.delete('/api/admin/questions/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const index = questions.findIndex((q) => q.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'પ્રશ્ન મળ્યો નથી.' });
  }

  questions.splice(index, 1);
  saveQuestions();
  res.json({ message: 'પ્રશ્ન કાઢી નાખવામાં આવ્યો.' });
});

// 5. TEST SUBMIT / RESULT ENGINE
app.post('/api/tests/:testId/submit', authenticateToken, (req, res) => {
  const { testId } = req.params;
  const { answers, timeTakenSeconds } = req.body;

  const test = tests.find((t) => t.id === testId);
  if (!test) {
    return res.status(404).json({ error: 'ટેસ્ટ મળી નથી.' });
  }

  const testQuestions = questions.filter((q) => q.testId === testId);
  if (testQuestions.length === 0) {
    return res.status(400).json({ error: 'આ ટેસ્ટમાં કોઈ પ્રશ્ન નથી.' });
  }

  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;

  const questionsWithAnswers = testQuestions.map((q) => {
    const selected = answers[q.id];
    let isCorrect = false;

    if (!selected) {
      unattemptedCount++;
    } else if (selected === q.correctOption) {
      correctCount++;
      isCorrect = true;
    } else {
      wrongCount++;
    }

    return {
      question: q,
      selectedOption: selected,
      isCorrect
    };
  });

  const markPerQuestion = test.totalMarks / testQuestions.length;
  const obtainedMarks = Number((correctCount * markPerQuestion).toFixed(2));
  const percentage = Number(((correctCount / testQuestions.length) * 100).toFixed(1));

  const resultPayload = {
    testId: test.id,
    testTitle: test.title,
    totalQuestions: testQuestions.length,
    totalMarks: test.totalMarks,
    obtainedMarks,
    correctCount,
    wrongCount,
    unattemptedCount,
    percentage,
    timeTakenSeconds: timeTakenSeconds || 0,
    questionsWithAnswers
  };

  // Immediate result response. NOT saved to database history per instructions!
  res.json({ message: 'ટેસ્ટ સફળતાપૂર્વક સબમિટ થઈ!', result: resultPayload });
});

// 6. PDF & STUDY MATERIAL
// Get All PDFs
app.get('/api/pdfs', authenticateToken, (req, res) => {
  res.json({ pdfs });
});

// Upload PDF File (Admin Only)
app.post('/api/admin/pdfs/upload', authenticateToken, requireAdmin, upload.single('pdfFile'), (req, res) => {
  const { title, category } = req.body;

  if (!title || !category) {
    return res.status(400).json({ error: 'પીડીએફનું શીર્ષક અને કેટેગરી જરૂરી છે.' });
  }

  let fileKey = '';
  let fileUrl = '';
  let fileSize = '1.0 MB';

  if (req.file) {
    fileKey = req.file.filename;
    fileUrl = `/api/pdfs/file/${req.file.filename}`;
    fileSize = (req.file.size / (1024 * 1024)).toFixed(1) + ' MB';
  } else if (req.body.fileUrl) {
    fileUrl = req.body.fileUrl;
    fileKey = req.body.fileKey || 'external_r2_file';
  } else {
    return res.status(400).json({ error: 'પીડીએફ ફાઇલ અથવા R2 URL પસંદ કરો.' });
  }

  const newPdf: PDFMetadata = {
    id: 'pdf-' + Date.now(),
    title,
    category,
    fileKey,
    fileUrl,
    fileSize,
    uploadDate: new Date().toISOString().split('T')[0]
  };

  pdfs.unshift(newPdf);
  savePdfs();

  res.status(201).json({ message: 'PDF અભ્યાસ સામગ્રી અપલોડ થઈ!', pdf: newPdf });
});

// Edit PDF Metadata
app.put('/api/admin/pdfs/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { title, category } = req.body;

  const pdf = pdfs.find((p) => p.id === id);
  if (!pdf) {
    return res.status(404).json({ error: 'PDF મળેલ નથી.' });
  }

  if (title) pdf.title = title;
  if (category) pdf.category = category;

  savePdfs();
  res.json({ message: 'PDF માહિતી અપડેટ થઈ!', pdf });
});

// Delete PDF
app.delete('/api/admin/pdfs/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const index = pdfs.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'PDF મળેલ નથી.' });
  }

  const removedPdf = pdfs[index];
  pdfs.splice(index, 1);
  savePdfs();

  // Try removing local file if stored locally
  if (removedPdf.fileKey && !removedPdf.fileKey.startsWith('external')) {
    const filePath = path.join(uploadsDir, removedPdf.fileKey);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.error('Error deleting local file', e);
      }
    }
  }

  res.json({ message: 'PDF અભ્યાસ સામગ્રી કાઢી નાખવામાં આવી.' });
});

// Serve PDF Files (Local or Generated Sample)
app.get('/api/pdfs/file/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadsDir, filename);

  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/pdf');
    return res.sendFile(filePath);
  }

  // Fallback Sample Document Generator
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

  const samplePdfContent = `%PDF-1.4
1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj
2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj
3 0 obj <</Type /Page /Parent 2 0 R /Resources <</Font <</F1 4 0 R>>>> /MediaBox [0 0 612 792] /Contents 5 0 R>> endobj
4 0 obj <</Type /Font /Subtype /Type1 /BaseFont /Helvetica>> endobj
5 0 obj <</Length 200>>
stream
BT
/F1 20 Tf
50 720 Td
(Mojilo Manish - TET-1 Study Material) Tj
0 -30 Td
/F1 12 Tf
(Gujarati TET-1 Prep Material: ${filename}) Tj
0 -20 Td
(This is a verified TET-1 preparatory document for Gujarat Teacher Eligibility Test.) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000062 00000 n 
00000000117 00000 n 
00000000270 00000 n 
00000000343 00000 n 
trailer <</Size 6 /Root 1 0 R>>
startxref
590
%%EOF`;

  res.send(Buffer.from(samplePdfContent));
});

// 7. SETTINGS API (SUPABASE & CLOUDFLARE R2 CONFIG)
app.get('/api/admin/settings', authenticateToken, requireAdmin, (req, res) => {
  res.json({ settings: appSettings });
});

app.post('/api/admin/settings', authenticateToken, requireAdmin, (req, res) => {
  const { supabase, cloudflareR2 } = req.body;

  if (supabase) {
    appSettings.supabase = {
      ...appSettings.supabase,
      ...supabase,
      isConnected: Boolean(supabase.url && supabase.anonKey)
    };
  }

  if (cloudflareR2) {
    appSettings.cloudflareR2 = {
      ...appSettings.cloudflareR2,
      ...cloudflareR2,
      isConnected: Boolean(cloudflareR2.accessKeyId && cloudflareR2.bucketName)
    };
  }

  saveSettings();
  res.json({ message: 'સેટિંગ્સ સફળતાપૂર્વક સાચવવામાં આવ્યા!', settings: appSettings });
});

// VITE MIDDLEWARE & SERVING
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer();
