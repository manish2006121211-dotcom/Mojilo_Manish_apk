import { User, Test, Question, PDFMetadata, AppSettings, TestResult } from '../types';

const TOKEN_KEY = 'mojilo_tet1_token';
const DEVICE_ID_KEY = 'mojilo_tet1_device_id';

const API_BASE_URL = 'https://mojilo-manish-backend.onrender.com';

export function apiUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return API_BASE_URL + (url.startsWith('/') ? url : '/' + url);
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getDeviceId(): string {
  let devId = localStorage.getItem(DEVICE_ID_KEY);
  if (!devId) {
    devId = 'dev-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now().toString(36);
    localStorage.setItem(DEVICE_ID_KEY, devId);
  }
  return devId;
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'X-Device-Id': getDeviceId(),
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Don't override Content-Type for FormData (multipart)
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const res = await fetch(apiUrl(url), { ...options, headers });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'સર્વર સાથે સંપર્ક કરવામાં ભૂલ થઈ.');
    }

    return data;
  } catch (err: any) {
    if (!navigator.onLine) {
      throw new Error('ઈન્ટરનેટ કનેક્શન ઉપલબ્ધ નથી. કૃપા કરીને ઈન્ટરનેટ ચાલુ કરીને ફરી પ્રયાસ કરો.');
    }
    throw err;
  }
}

// API Services
export const api = {
  login: async (mobile: string, password: string) => {
    const deviceId = getDeviceId();
    const deviceName = 'Android App (' + (navigator.platform || 'Mobile') + ')';
    const res = await fetchWithAuth('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ mobile, password, deviceId, deviceName })
    });
    if (res.token) {
      setStoredToken(res.token);
    }
    return res;
  },

  logout: async () => {
    try {
      await fetchWithAuth('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignore logout errors
    } finally {
      removeStoredToken();
    }
  },

  getMe: async () => {
    return await fetchWithAuth('/api/auth/me');
  },

  // Admin - Students
  getStudents: async () => {
    return await fetchWithAuth('/api/admin/students');
  },

  addStudent: async (studentData: { name: string; mobile: string; password: string }) => {
    return await fetchWithAuth('/api/admin/students', {
      method: 'POST',
      body: JSON.stringify(studentData)
    });
  },

  updateStudent: async (id: string, data: { name?: string; mobile?: string; isActive?: boolean }) => {
    return await fetchWithAuth(`/api/admin/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  resetStudentPassword: async (id: string, newPassword: string) => {
    return await fetchWithAuth(`/api/admin/students/${id}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ newPassword })
    });
  },

  resetStudentDevice: async (id: string) => {
    return await fetchWithAuth(`/api/admin/students/${id}/reset-device`, {
      method: 'POST'
    });
  },

  deleteStudent: async (id: string) => {
    return await fetchWithAuth(`/api/admin/students/${id}`, {
      method: 'DELETE'
    });
  },

  // Tests
  getTests: async () => {
    return await fetchWithAuth('/api/tests');
  },

  createTest: async (testData: Partial<Test>) => {
    return await fetchWithAuth('/api/admin/tests', {
      method: 'POST',
      body: JSON.stringify(testData)
    });
  },

  updateTest: async (id: string, testData: Partial<Test>) => {
    return await fetchWithAuth(`/api/admin/tests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testData)
    });
  },

  deleteTest: async (id: string) => {
    return await fetchWithAuth(`/api/admin/tests/${id}`, {
      method: 'DELETE'
    });
  },

  // Questions
  getQuestions: async (testId: string) => {
    return await fetchWithAuth(`/api/tests/${testId}/questions`);
  },

  addQuestion: async (questionData: Partial<Question>) => {
    return await fetchWithAuth('/api/admin/questions', {
      method: 'POST',
      body: JSON.stringify(questionData)
    });
  },

  updateQuestion: async (id: string, questionData: Partial<Question>) => {
    return await fetchWithAuth(`/api/admin/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(questionData)
    });
  },

  deleteQuestion: async (id: string) => {
    return await fetchWithAuth(`/api/admin/questions/${id}`, {
      method: 'DELETE'
    });
  },

  submitTest: async (testId: string, answers: Record<string, 'A' | 'B' | 'C' | 'D'>, timeTakenSeconds: number): Promise<{ message: string; result: TestResult }> => {
    return await fetchWithAuth(`/api/tests/${testId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers, timeTakenSeconds })
    });
  },

  // PDFs
  getPdfs: async () => {
    return await fetchWithAuth('/api/pdfs');
  },

  uploadPdf: async (formData: FormData) => {
    return await fetchWithAuth('/api/admin/pdfs/upload', {
      method: 'POST',
      body: formData
    });
  },

  updatePdf: async (id: string, data: { title?: string; category?: string }) => {
    return await fetchWithAuth(`/api/admin/pdfs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  deletePdf: async (id: string) => {
    return await fetchWithAuth(`/api/admin/pdfs/${id}`, {
      method: 'DELETE'
    });
  },

  // Settings
  getSettings: async () => {
    return await fetchWithAuth('/api/admin/settings');
  },

  saveSettings: async (settingsData: Partial<AppSettings>) => {
    return await fetchWithAuth('/api/admin/settings', {
      method: 'POST',
      body: JSON.stringify(settingsData)
    });
  }
};
