import React, { useState, useEffect } from 'react';
import { User, Test, Question, PDFMetadata, AppSettings } from '../types';
import { api, apiUrl } from '../lib/api';
import {
  Users,
  FileCheck,
  FileText,
  Settings,
  Plus,
  Edit2,
  Trash2,
  KeyRound,
  RefreshCw,
  CheckCircle,
  XCircle,
  Upload,
  Database,
  Cloud,
  Check,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'STUDENTS' | 'TESTS' | 'PDFS' | 'SETTINGS'>('STUDENTS');

  // Students state
  const [students, setStudents] = useState<User[]>([]);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<User | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentMobile, setStudentMobile] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [resetPassModalOpen, setResetPassModalOpen] = useState(false);
  const [selectedStudentForReset, setSelectedStudentForReset] = useState<User | null>(null);
  const [newStudentPassword, setNewStudentPassword] = useState('');

  // Tests & Questions state
  const [tests, setTests] = useState<Test[]>([]);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [testTitle, setTestTitle] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [testTimer, setTestTimer] = useState(15);
  const [testMarks, setTestMarks] = useState(15);
  const [testPublished, setTestPublished] = useState(true);

  // Question Editor View
  const [selectedTestForQuestions, setSelectedTestForQuestions] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [qText, setQText] = useState('');
  const [qOptA, setQOptA] = useState('');
  const [qOptB, setQOptB] = useState('');
  const [qOptC, setQOptC] = useState('');
  const [qOptD, setQOptD] = useState('');
  const [qCorrect, setQCorrect] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [qExplanation, setQExplanation] = useState('');

  // PDFs state
  const [pdfs, setPdfs] = useState<PDFMetadata[]>([]);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [editingPdf, setEditingPdf] = useState<PDFMetadata | null>(null);
  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfCategory, setPdfCategory] = useState('બાળ વિકાસ અને મનોવિજ્ઞાન');
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Settings state
  const [settings, setSettings] = useState<AppSettings>({
    supabase: { url: '', anonKey: '', isConnected: false },
    cloudflareR2: {
      accountId: '',
      accessKeyId: '',
      secretAccessKey: '',
      bucketName: '',
      publicDomain: '',
      isConnected: false
    }
  });

  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initial Load
  useEffect(() => {
    loadStudents();
    loadTests();
    loadPdfs();
    loadSettings();
  }, []);

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // STUDENTS ACTIONS
  const loadStudents = async () => {
    try {
      const res = await api.getStudents();
      setStudents(res.students || []);
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await api.updateStudent(editingStudent.id, {
          name: studentName,
          mobile: studentMobile
        });
        showFeedback('success', 'વિદ્યાર્થી માહિતી અપડેટ થઈ.');
      } else {
        await api.addStudent({
          name: studentName,
          mobile: studentMobile,
          password: studentPassword
        });
        showFeedback('success', 'નવો વિદ્યાર્થી ઉમેરાયો.');
      }
      setStudentModalOpen(false);
      resetStudentForm();
      loadStudents();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  const resetStudentForm = () => {
    setEditingStudent(null);
    setStudentName('');
    setStudentMobile('');
    setStudentPassword('');
  };

  const handleToggleStudentStatus = async (student: User) => {
    try {
      await api.updateStudent(student.id, { isActive: !student.isActive });
      showFeedback('success', `વિદ્યાર્થી અકાઉન્ટ ${!student.isActive ? 'સક્રિય' : 'નિષ્ક્રિય'} કરવામાં આવ્યું.`);
      loadStudents();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  const handleResetDevice = async (studentId: string) => {
    if (!window.confirm('શું આપ ખરેખર આ વિદ્યાર્થીનું લૉગિન ડિવાઇસ રીસેટ કરવા માંગો છો?')) return;
    try {
      await api.resetStudentDevice(studentId);
      showFeedback('success', 'વિદ્યાર્થીનું Device સેશન રીસેટ થયું. તે હવે બીજા ફોન પર લોગિન કરી શકશે.');
      loadStudents();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForReset || !newStudentPassword) return;
    try {
      await api.resetStudentPassword(selectedStudentForReset.id, newStudentPassword);
      showFeedback('success', 'પાસવર્ડ સફળતાપૂર્વક રીસેટ થયો.');
      setResetPassModalOpen(false);
      setNewStudentPassword('');
      setSelectedStudentForReset(null);
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!window.confirm('શું આપ આ વિદ્યાર્થીને કાયમ માટે કાઢી નાખવા માંગો છો?')) return;
    try {
      await api.deleteStudent(studentId);
      showFeedback('success', 'વિદ્યાર્થી અકાઉન્ટ ડીલીટ થયું.');
      loadStudents();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  // TESTS ACTIONS
  const loadTests = async () => {
    try {
      const res = await api.getTests();
      setTests(res.tests || []);
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  const handleSaveTest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTest) {
        await api.updateTest(editingTest.id, {
          title: testTitle,
          description: testDescription,
          timerMinutes: testTimer,
          totalMarks: testMarks,
          isPublished: testPublished
        });
        showFeedback('success', 'ટેસ્ટ અપડેટ થઈ.');
      } else {
        await api.createTest({
          title: testTitle,
          description: testDescription,
          timerMinutes: testTimer,
          totalMarks: testMarks,
          isPublished: testPublished
        });
        showFeedback('success', 'નવી ટેસ્ટ બનાવવામાં આવી.');
      }
      setTestModalOpen(false);
      resetTestForm();
      loadTests();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  const resetTestForm = () => {
    setEditingTest(null);
    setTestTitle('');
    setTestDescription('');
    setTestTimer(15);
    setTestMarks(15);
    setTestPublished(true);
  };

  const handleTogglePublish = async (test: Test) => {
    try {
      await api.updateTest(test.id, { isPublished: !test.isPublished });
      showFeedback('success', `ટેસ્ટ ${!test.isPublished ? 'પબ્લિશ' : 'અન-પબ્લિશ'} કરવામાં આવી.`);
      loadTests();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  const handleDeleteTest = async (testId: string) => {
    if (!window.confirm('શું આપ આ ટેસ્ટ અને તેના તમામ પ્રશ્નો કાઢી નાખવા માંગો છો?')) return;
    try {
      await api.deleteTest(testId);
      showFeedback('success', 'ટેસ્ટ કાઢી નાખવામાં આવી.');
      loadTests();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  // QUESTIONS ACTIONS
  const loadQuestionsForTest = async (test: Test) => {
    setSelectedTestForQuestions(test);
    try {
      const res = await api.getQuestions(test.id);
      setQuestions(res.questions || []);
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTestForQuestions) return;

    try {
      if (editingQuestion) {
        await api.updateQuestion(editingQuestion.id, {
          questionText: qText,
          optionA: qOptA,
          optionB: qOptB,
          optionC: qOptC,
          optionD: qOptD,
          correctOption: qCorrect,
          explanation: qExplanation
        });
        showFeedback('success', 'પ્રશ્ન અપડેટ થયો.');
      } else {
        await api.addQuestion({
          testId: selectedTestForQuestions.id,
          questionText: qText,
          optionA: qOptA,
          optionB: qOptB,
          optionC: qOptC,
          optionD: qOptD,
          correctOption: qCorrect,
          explanation: qExplanation
        });
        showFeedback('success', 'પ્રશ્ન ઉમેરાયો.');
      }
      setQuestionModalOpen(false);
      resetQuestionForm();
      loadQuestionsForTest(selectedTestForQuestions);
      loadTests();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  const resetQuestionForm = () => {
    setEditingQuestion(null);
    setQText('');
    setQOptA('');
    setQOptB('');
    setQOptC('');
    setQOptD('');
    setQCorrect('A');
    setQExplanation('');
  };

  const handleDeleteQuestion = async (qId: string) => {
    if (!window.confirm('શું આપ આ પ્રશ્ન કાઢી નાખવા માંગો છો?')) return;
    try {
      await api.deleteQuestion(qId);
      showFeedback('success', 'પ્રશ્ન કાઢી નાખવામાં આવ્યો.');
      if (selectedTestForQuestions) {
        loadQuestionsForTest(selectedTestForQuestions);
        loadTests();
      }
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  // PDF ACTIONS
  const loadPdfs = async () => {
    try {
      const res = await api.getPdfs();
      setPdfs(res.pdfs || []);
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  const handleSavePdf = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPdf) {
        await api.updatePdf(editingPdf.id, { title: pdfTitle, category: pdfCategory });
        showFeedback('success', 'PDF માહિતી અપડેટ થઈ.');
      } else {
        if (!pdfFile && !pdfTitle) {
          showFeedback('error', 'કૃપા કરીને PDF ફાઇલ પસંદ કરો.');
          return;
        }

        const formData = new FormData();
        formData.append('title', pdfTitle);
        formData.append('category', pdfCategory);
        if (pdfFile) {
          formData.append('pdfFile', pdfFile);
        }

        await api.uploadPdf(formData);
        showFeedback('success', 'PDF સફળતાપૂર્વક અપલોડ થઈ.');
      }
      setPdfModalOpen(false);
      resetPdfForm();
      loadPdfs();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  const resetPdfForm = () => {
    setEditingPdf(null);
    setPdfTitle('');
    setPdfCategory('બાળ વિકાસ અને મનોવિજ્ઞાન');
    setPdfFile(null);
  };

  const handleDeletePdf = async (pdfId: string) => {
    if (!window.confirm('શું આપ આ PDF ફાઇલ કાઢી નાખવા માંગો છો?')) return;
    try {
      await api.deletePdf(pdfId);
      showFeedback('success', 'PDF કાઢી નાખવામાં આવી.');
      loadPdfs();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  // SETTINGS ACTIONS
  const loadSettings = async () => {
    try {
      const res = await api.getSettings();
      if (res.settings) {
        setSettings(res.settings);
      }
    } catch (err: any) {
      // Ignore settings fetch error on first run
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.saveSettings(settings);
      showFeedback('success', 'Supabase અને Cloudflare R2 સેટિંગ્સ સાચવવામાં આવ્યા.');
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      {/* Feedback Toast */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl text-sm font-bold shadow-lg flex items-center justify-between border ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-red-50 text-red-800 border-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
            <span>{feedbackMsg.text}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-xs underline font-normal">
            બંધ કરો
          </button>
        </div>
      )}

      {/* Admin Title & Navigation Tabs */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>👨‍💼 એડમિન કંટ્રોલ પેનલ</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">વિદ્યાર્થીઓ, ટેસ્ટ, પ્રશ્નો અને PDF અભ્યાસ સામગ્રી સંચાલન</p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-xl text-xs font-bold">
          <button
            id="admin-tab-students"
            onClick={() => {
              setActiveTab('STUDENTS');
              setSelectedTestForQuestions(null);
            }}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition ${
              activeTab === 'STUDENTS' ? 'bg-indigo-900 text-white shadow' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>વિદ્યાર્થીઓ ({students.length})</span>
          </button>

          <button
            id="admin-tab-tests"
            onClick={() => setActiveTab('TESTS')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition ${
              activeTab === 'TESTS' ? 'bg-indigo-900 text-white shadow' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>ટેસ્ટ ({tests.length})</span>
          </button>

          <button
            id="admin-tab-pdfs"
            onClick={() => {
              setActiveTab('PDFS');
              setSelectedTestForQuestions(null);
            }}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition ${
              activeTab === 'PDFS' ? 'bg-indigo-900 text-white shadow' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>PDFs ({pdfs.length})</span>
          </button>

          <button
            id="admin-tab-settings"
            onClick={() => {
              setActiveTab('SETTINGS');
              setSelectedTestForQuestions(null);
            }}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition ${
              activeTab === 'SETTINGS' ? 'bg-indigo-900 text-white shadow' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>સેટિંગ્સ</span>
          </button>
        </div>
      </div>

      {/* TAB 1: STUDENTS MANAGEMENT */}
      {activeTab === 'STUDENTS' && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden space-y-4 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">વિદ્યાર્થીઓની યાદી</h3>
              <p className="text-xs text-slate-500">અકાઉન્ટ સ્ટેટસ, પાસવર્ડ રીસેટ અને ડિવાઇસ સેશન કંટ્રોલ</p>
            </div>
            <button
              id="btn-admin-add-student"
              onClick={() => {
                resetStudentForm();
                setStudentModalOpen(true);
              }}
              className="bg-indigo-900 hover:bg-indigo-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow transition"
            >
              <Plus className="w-4 h-4" />
              <span>નવો વિદ્યાર્થી ઉમેરો</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="p-3">વિદ્યાર્થી નામ</th>
                  <th className="p-3">મોબાઇલ નંબર</th>
                  <th className="p-3">અકાઉન્ટ સ્ટેટસ</th>
                  <th className="p-3">એક્ટિવ ડિવાઇસ</th>
                  <th className="p-3 text-right">ક્રિયાઓ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-8 text-slate-400">
                      કોઈ વિદ્યાર્થી નોંધાયેલ નથી.
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 font-bold text-slate-900">{student.name}</td>
                      <td className="p-3">{student.mobile}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleStudentStatus(student)}
                          className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1 w-max ${
                            student.isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          {student.isActive ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span>{student.isActive ? 'સક્રિય' : 'નિષ્ક્રિય'}</span>
                        </button>
                      </td>
                      <td className="p-3">
                        {student.activeDeviceId ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200 font-mono">
                              {student.activeDeviceName || 'Android Mobile'}
                            </span>
                            <button
                              onClick={() => handleResetDevice(student.id)}
                              className="text-xs text-amber-700 hover:text-amber-900 font-bold underline flex items-center gap-0.5"
                              title="Reset Active Device Lock"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>રીસેટ</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">કોઈ ડિવાઇસ લૉક નથી</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedStudentForReset(student);
                              setResetPassModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-indigo-900 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
                            title="પાસવર્ડ રીસેટ"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingStudent(student);
                              setStudentName(student.name);
                              setStudentMobile(student.mobile);
                              setStudentModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-indigo-900 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
                            title="અપડેટ કરો"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className="p-1.5 text-red-600 hover:text-red-800 bg-red-50 rounded-lg hover:bg-red-100 transition"
                            title="ડીલીટ કરો"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: TESTS & QUESTIONS MANAGEMENT */}
      {activeTab === 'TESTS' && (
        <div className="space-y-6">
          {selectedTestForQuestions ? (
            /* QUESTIONS EDITOR VIEW FOR A SELECTED TEST */
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4 sm:p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <button
                  onClick={() => setSelectedTestForQuestions(null)}
                  className="text-xs font-bold text-indigo-900 flex items-center gap-1 hover:underline bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>પાછા ટેસ્ટ લિસ્ટમાં જાઓ</span>
                </button>
                <button
                  onClick={() => {
                    resetQuestionForm();
                    setQuestionModalOpen(true);
                  }}
                  className="bg-indigo-900 hover:bg-indigo-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>નવો પ્રશ્ન ઉમેરો</span>
                </button>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">{selectedTestForQuestions.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">કુલ પ્રશ્નો: {questions.length} | સમય: {selectedTestForQuestions.timerMinutes} મિનિટ</p>
              </div>

              <div className="space-y-4">
                {questions.length === 0 ? (
                  <div className="text-center p-8 bg-slate-50 rounded-2xl text-slate-400">
                    આ ટેસ્ટમાં હજુ સુધી કોઈ પ્રશ્ન ઉમેરવામાં આવ્યો નથી. ઉપરના બટન પર ક્લિક કરીને પ્રશ્ન ઉમેરો.
                  </div>
                ) : (
                  questions.map((q, idx) => (
                    <div key={q.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <p className="font-bold text-sm text-slate-900">
                          {idx + 1}. {q.questionText}
                        </p>
                        <div className="flex items-center space-x-1 shrink-0">
                          <button
                            onClick={() => {
                              setEditingQuestion(q);
                              setQText(q.questionText);
                              setQOptA(q.optionA);
                              setQOptB(q.optionB);
                              setQOptC(q.optionC);
                              setQOptD(q.optionD);
                              setQCorrect(q.correctOption);
                              setQExplanation(q.explanation || '');
                              setQuestionModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-indigo-900 bg-white rounded-lg border border-slate-200 transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="p-1.5 text-red-600 hover:text-red-800 bg-white rounded-lg border border-slate-200 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className={`p-2 rounded-lg border ${q.correctOption === 'A' ? 'bg-emerald-100 text-emerald-900 font-bold border-emerald-300' : 'bg-white text-slate-700 border-slate-200'}`}>
                          A. {q.optionA} {q.correctOption === 'A' && '✓ (સાચો જવાબ)'}
                        </div>
                        <div className={`p-2 rounded-lg border ${q.correctOption === 'B' ? 'bg-emerald-100 text-emerald-900 font-bold border-emerald-300' : 'bg-white text-slate-700 border-slate-200'}`}>
                          B. {q.optionB} {q.correctOption === 'B' && '✓ (સાચો જવાબ)'}
                        </div>
                        <div className={`p-2 rounded-lg border ${q.correctOption === 'C' ? 'bg-emerald-100 text-emerald-900 font-bold border-emerald-300' : 'bg-white text-slate-700 border-slate-200'}`}>
                          C. {q.optionC} {q.correctOption === 'C' && '✓ (સાચો જવાબ)'}
                        </div>
                        <div className={`p-2 rounded-lg border ${q.correctOption === 'D' ? 'bg-emerald-100 text-emerald-900 font-bold border-emerald-300' : 'bg-white text-slate-700 border-slate-200'}`}>
                          D. {q.optionD} {q.correctOption === 'D' && '✓ (સાચો જવાબ)'}
                        </div>
                      </div>

                      {q.explanation && (
                        <p className="text-xs text-slate-600 italic bg-amber-50/80 p-2 rounded-lg border border-amber-200">
                          <strong>સમજૂતી:</strong> {q.explanation}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* TESTS LIST VIEW */
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">ટેસ્ટ યાદી</h3>
                  <p className="text-xs text-slate-500">ટેસ્ટ બનાવો, પ્રશ્નો ઉમેરો અને વિદ્યાર્થીઓ માટે પબ્લિશ કરો</p>
                </div>
                <button
                  id="btn-admin-create-test"
                  onClick={() => {
                    resetTestForm();
                    setTestModalOpen(true);
                  }}
                  className="bg-indigo-900 hover:bg-indigo-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>નવી ટેસ્ટ બનાવો</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tests.map((test) => (
                  <div key={test.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">{test.title}</h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{test.description}</p>
                      </div>
                      <button
                        onClick={() => handleTogglePublish(test)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 ${
                          test.isPublished
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {test.isPublished ? 'પબ્લિશ થયેલ' : 'અન-પબ્લિશ'}
                      </button>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-medium text-slate-600 bg-white p-2.5 rounded-xl border border-slate-150">
                      <span>⏱️ સમય: {test.timerMinutes} મિનિટ</span>
                      <span>🎯 ગુણ: {test.totalMarks}</span>
                      <span>❓ પ્રશ્નો: {test.questionCount || 0}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                      <button
                        onClick={() => loadQuestionsForTest(test)}
                        className="font-bold text-indigo-900 hover:underline flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200"
                      >
                        <span>પ્રશ્નો મેનેજ કરો</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => {
                            setEditingTest(test);
                            setTestTitle(test.title);
                            setTestDescription(test.description);
                            setTestTimer(test.timerMinutes);
                            setTestMarks(test.totalMarks);
                            setTestPublished(test.isPublished);
                            setTestModalOpen(true);
                          }}
                          className="p-1.5 text-slate-600 hover:text-indigo-900 bg-white rounded-lg border border-slate-200"
                          title="અપડેટ કરો"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTest(test.id)}
                          className="p-1.5 text-red-600 hover:text-red-800 bg-white rounded-lg border border-slate-200"
                          title="ડીલીટ કરો"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PDF / STUDY MATERIAL MANAGEMENT */}
      {activeTab === 'PDFS' && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">PDF / અભ્યાસ સામગ્રી સંચાલન</h3>
              <p className="text-xs text-slate-500">Cloudflare R2 Storage પર PDF અપલોડ કરો અને Supabaseમાં metadata સાચવો</p>
            </div>
            <button
              id="btn-admin-upload-pdf"
              onClick={() => {
                resetPdfForm();
                setPdfModalOpen(true);
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow transition"
            >
              <Upload className="w-4 h-4" />
              <span>નવી PDF અપલોડ કરો</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pdfs.map((pdf) => (
              <div key={pdf.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                    {pdf.category}
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-sm">{pdf.title}</h4>
                  <p className="text-[11px] text-slate-500">
                    તારીખ: {pdf.uploadDate} | સાઈઝ: {pdf.fileSize || '2 MB'}
                  </p>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <a
                    href={apiUrl(pdf.fileUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-indigo-900 hover:bg-indigo-100 bg-white rounded-lg border border-slate-200 text-xs font-bold px-2.5 flex items-center gap-1"
                  >
                    <span>જુઓ</span>
                  </a>
                  <button
                    onClick={() => handleDeletePdf(pdf.id)}
                    className="p-1.5 text-red-600 hover:text-red-800 bg-white rounded-lg border border-slate-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SETTINGS (SUPABASE & CLOUDFLARE R2) */}
      {activeTab === 'SETTINGS' && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4 sm:p-6 space-y-6 max-w-4xl">
          <div>
            <h3 className="text-lg font-bold text-slate-900">બેકએન્ડ અને સ્ટોરેજ કન્ફિગ્યુરેશન</h3>
            <p className="text-xs text-slate-500">Supabase Database અને Cloudflare R2 Object Storage કનેક્શન સેટિંગ્સ</p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* Supabase Box */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="flex items-center gap-2 text-indigo-950 font-bold border-b border-slate-200 pb-2">
                <Database className="w-5 h-5 text-indigo-900" />
                <span>Supabase Database Credentials</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Supabase Project URL</label>
                  <input
                    type="url"
                    value={settings.supabase.url}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        supabase: { ...settings.supabase, url: e.target.value }
                      })
                    }
                    placeholder="https://xyz.supabase.co"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Supabase Anon Key</label>
                  <input
                    type="password"
                    value={settings.supabase.anonKey}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        supabase: { ...settings.supabase, anonKey: e.target.value }
                      })
                    }
                    placeholder="eyJhbGciOiJIUzI1NiI..."
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Cloudflare R2 Box */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="flex items-center gap-2 text-amber-950 font-bold border-b border-slate-200 pb-2">
                <Cloud className="w-5 h-5 text-amber-600" />
                <span>Cloudflare R2 PDF Storage Credentials</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">R2 Bucket Name</label>
                  <input
                    type="text"
                    value={settings.cloudflareR2.bucketName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        cloudflareR2: { ...settings.cloudflareR2, bucketName: e.target.value }
                      })
                    }
                    placeholder="tet1-pdf-bucket"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Access Key ID</label>
                  <input
                    type="text"
                    value={settings.cloudflareR2.accessKeyId}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        cloudflareR2: { ...settings.cloudflareR2, accessKeyId: e.target.value }
                      })
                    }
                    placeholder="Access Key String"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-indigo-900 hover:bg-indigo-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition"
            >
              સેટિંગ્સ સેવ કરો
            </button>
          </form>
        </div>
      )}

      {/* MODAL 1: ADD/EDIT STUDENT */}
      {studentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-150">
            <h3 className="text-lg font-black text-slate-900">
              {editingStudent ? 'વિદ્યાર્થી માહિતી અપડેટ કરો' : 'નવો વિદ્યાર્થી એકાઉન્ટ બનાવો'}
            </h3>

            <form onSubmit={handleSaveStudent} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">વિદ્યાર્થીનું નામ</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="દા.ત. અક્ષય પટેલ"
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">મોબાઇલ નંબર</label>
                <input
                  type="tel"
                  value={studentMobile}
                  onChange={(e) => setStudentMobile(e.target.value)}
                  placeholder="10 આંકડાનો મોબાઇલ નંબર"
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              {!editingStudent && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">પાસવર્ડ</label>
                  <input
                    type="text"
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    placeholder="વિદ્યાર્થી માટે પાસવર્ડ સેટ કરો"
                    className="w-full p-2.5 border border-slate-300 rounded-lg"
                    required
                  />
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStudentModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                >
                  રદ કરો
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-900 hover:bg-indigo-800 text-white rounded-lg font-bold">
                  સાચવો
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RESET PASSWORD */}
      {resetPassModalOpen && selectedStudentForReset && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900">
              પાસવર્ડ રીસેટ કરો: {selectedStudentForReset.name}
            </h3>

            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">નવો પાસવર્ડ</label>
                <input
                  type="text"
                  value={newStudentPassword}
                  onChange={(e) => setNewStudentPassword(e.target.value)}
                  placeholder="ઓછામાં ઓછો 4 અક્ષરનો પાસવર્ડ"
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetPassModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                >
                  રદ કરો
                </button>
                <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold">
                  પાસવર્ડ અપડેટ કરો
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE/EDIT TEST */}
      {testModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900">{editingTest ? 'ટેસ્ટ અપડેટ કરો' : 'નવી ટેસ્ટ બનાવો'}</h3>

            <form onSubmit={handleSaveTest} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ટેસ્ટનું નામો/શીર્ષક</label>
                <input
                  type="text"
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  placeholder="દા.ત. TET-1 મોક ટેસ્ટ - ૧"
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">વર્ણન</label>
                <textarea
                  value={testDescription}
                  onChange={(e) => setTestDescription(e.target.value)}
                  placeholder="ટેસ્ટ વિશે ટૂંકી માહિતી..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ટાઈમર (મિનિટ)</label>
                  <input
                    type="number"
                    value={testTimer}
                    onChange={(e) => setTestTimer(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg"
                    min={1}
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">કુલ ગુણ</label>
                  <input
                    type="number"
                    value={testMarks}
                    onChange={(e) => setTestMarks(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg"
                    min={1}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chk-published"
                  checked={testPublished}
                  onChange={(e) => setTestPublished(e.target.checked)}
                  className="w-4 h-4 text-indigo-900 border-slate-300 rounded"
                />
                <label htmlFor="chk-published" className="font-bold text-slate-700">
                  વિદ્યાર્થીઓ માટે તરત પબ્લિશ કરો
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTestModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold"
                >
                  રદ કરો
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-900 text-white rounded-lg font-bold">
                  સાચવો
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CREATE/EDIT QUESTION */}
      {questionModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black text-slate-900">{editingQuestion ? 'પ્રશ્ન અપડેટ કરો' : 'નવો પ્રશ્ન ઉમેરો'}</h3>

            <form onSubmit={handleSaveQuestion} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">પ્રશ્નનું લખાણ (Gujarati Unicode)</label>
                <textarea
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="પ્રશ્ન અહીં લખો..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg h-20"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">વિકલ્પ A</label>
                  <input
                    type="text"
                    value={qOptA}
                    onChange={(e) => setQOptA(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">વિકલ્પ B</label>
                  <input
                    type="text"
                    value={qOptB}
                    onChange={(e) => setQOptB(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">વિકલ્પ C</label>
                  <input
                    type="text"
                    value={qOptC}
                    onChange={(e) => setQOptC(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">વિકલ્પ D</label>
                  <input
                    type="text"
                    value={qOptD}
                    onChange={(e) => setQOptD(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">સાચો જવાબ પસંદ કરો</label>
                <select
                  value={qCorrect}
                  onChange={(e) => setQCorrect(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-bold"
                >
                  <option value="A">A - {qOptA || 'વિકલ્પ A'}</option>
                  <option value="B">B - {qOptB || 'વિકલ્પ B'}</option>
                  <option value="C">C - {qOptC || 'વિકલ્પ C'}</option>
                  <option value="D">D - {qOptD || 'વિકલ્પ D'}</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">જવાબની સમજૂતી (Optional Explanation)</label>
                <textarea
                  value={qExplanation}
                  onChange={(e) => setQExplanation(e.target.value)}
                  placeholder="જવાબ પાછળનું કારણ અથવા વિગત..."
                  className="w-full p-2 border border-slate-300 rounded-lg h-16"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuestionModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold"
                >
                  રદ કરો
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-900 text-white rounded-lg font-bold">
                  પ્રશ્ન સાચવો
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: UPLOAD/EDIT PDF */}
      {pdfModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900">{editingPdf ? 'PDF શીર્ષક અપડેટ કરો' : 'Cloudflare R2 પર PDF અપલોડ કરો'}</h3>

            <form onSubmit={handleSavePdf} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">PDF શીર્ષક</label>
                <input
                  type="text"
                  value={pdfTitle}
                  onChange={(e) => setPdfTitle(e.target.value)}
                  placeholder="દા.ત. TET-1 મનોવિજ્ઞાન નોંધો"
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">કેટેગરી</label>
                <select
                  value={pdfCategory}
                  onChange={(e) => setPdfCategory(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-medium"
                >
                  <option value="બાળ વિકાસ અને મનોવિજ્ઞાન">બાળ વિકાસ અને મનોવિજ્ઞાન</option>
                  <option value="ગુજરાતી ભાષા અને વ્યાકરણ">ગુજરાતી ભાષા અને વ્યાકરણ</option>
                  <option value="ગણિત અને પર્યાવરણ">ગણિત અને પર્યાવરણ</option>
                  <option value="સામાજિક વિજ્ઞાન અને જ્ઞાન">સામાજિક વિજ્ઞાન અને જ્ઞાન</option>
                  <option value="શૈક્ષણિક યોજનાઓ">શૈક્ષણિક યોજનાઓ અને RTE</option>
                </select>
              </div>

              {!editingPdf && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">PDF ફાઇલ પસંદ કરો</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPdfModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold"
                >
                  રદ કરો
                </button>
                <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded-lg font-bold">
                  અપલોડ કરો
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
