import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Test, TestResult } from './types';
import { api, getStoredToken } from './lib/api';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { OfflineBanner } from './components/OfflineBanner';
import { LoginForm } from './components/LoginForm';
import { StudentHome } from './components/StudentHome';
import { AdminDashboard } from './components/AdminDashboard';
import { TestRunner } from './components/TestRunner';
import { ResultView } from './components/ResultView';
import { PdfViewer } from './components/PdfViewer';
import { ProfileModal } from './components/ProfileModal';
import { ApkInstallModal } from './components/ApkInstallModal';
import { SplashScreen } from './components/SplashScreen';
import { LoginSuccessAnimation } from './components/LoginSuccessAnimation';
import { Clock, Play, ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [loginSuccessUser, setLoginSuccessUser] = useState<User | null>(null);

  // Active View State
  const [view, setView] = useState<'HOME' | 'TEST_LIST' | 'TEST_RUNNER' | 'RESULT' | 'PDF' | 'ADMIN'>('HOME');

  // Active Test and Result
  const [availableTests, setAvailableTests] = useState<Test[]>([]);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  // Modals
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showApkModal, setShowApkModal] = useState(false);

  // Auto Login Check on Load
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      api
        .getMe()
        .then((res) => {
          if (res.user) {
            setCurrentUser(res.user);
            if (res.user.role === 'ADMIN') {
              setView('ADMIN');
            } else {
              setView('HOME');
            }
          }
        })
        .catch(() => {
          api.logout();
        })
        .finally(() => setIsAuthLoading(false));
    } else {
      setIsAuthLoading(false);
    }
  }, []);

  // Splash Screen Timer (at least 1.6s so users enjoy the brand opening splash)
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 1800);
    return () => clearTimeout(splashTimer);
  }, []);

  // Fetch Published Tests for Student View
  useEffect(() => {
    if (currentUser && currentUser.role === 'STUDENT') {
      api
        .getTests()
        .then((res) => {
          if (res.tests) {
            setAvailableTests(res.tests);
          }
        })
        .catch((e) => console.error(e));
    }
  }, [currentUser, view]);

  const handleLoginSuccess = (user: User) => {
    setLoginSuccessUser(user);
    setTimeout(() => {
      setCurrentUser(user);
      if (user.role === 'ADMIN') {
        setView('ADMIN');
      } else {
        setView('HOME');
      }
      setLoginSuccessUser(null);
    }, 1500);
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setSelectedTest(null);
    setTestResult(null);
    setShowProfileModal(false);
    setView('HOME');
  };

  const handleStudentSelectMenu = (option: 'TEST' | 'PDF' | 'PROFILE') => {
    if (option === 'TEST') {
      setView('TEST_LIST');
    } else if (option === 'PDF') {
      setView('PDF');
    } else if (option === 'PROFILE') {
      setShowProfileModal(true);
    }
  };

  const handleStartTest = (test: Test) => {
    setSelectedTest(test);
    setView('TEST_RUNNER');
  };

  const handleFinishTest = (result: TestResult) => {
    setTestResult(result);
    setView('RESULT');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-300 selection:text-indigo-950">
      {/* Animated App Startup Splash Screen */}
      <AnimatePresence>
        {(showSplash || isAuthLoading) && <SplashScreen key="splash-screen" />}
      </AnimatePresence>

      {/* Animated Login Success Celebration Modal */}
      <AnimatePresence>
        {loginSuccessUser && <LoginSuccessAnimation key="login-success-anim" user={loginSuccessUser} />}
      </AnimatePresence>

      {/* Offline Alert Banner */}
      <OfflineBanner />

      {/* Top Navbar */}
      <Navbar
        user={currentUser}
        onLogout={handleLogout}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenApkModal={() => setShowApkModal(true)}
      />

      {/* Main Body Routing with Smooth Page Transitions */}
      <main className={`flex-1 safe-px ${currentUser ? 'has-bottom-nav' : 'pb-12 safe-pb'}`}>
        <AnimatePresence mode="wait">
          {!currentUser ? (
            /* LOGIN SCREEN */
            <motion.div
              key="login-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <LoginForm onLoginSuccess={handleLoginSuccess} />
            </motion.div>
          ) : currentUser.role === 'ADMIN' ? (
            /* ADMIN PANEL */
            <motion.div
              key="admin-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <AdminDashboard />
            </motion.div>
          ) : (
            /* STUDENT PANEL VIEWS */
            <React.Fragment key={view}>
              {view === 'HOME' && (
                <motion.div
                  key="home-view"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                >
                  <StudentHome user={currentUser} onSelectOption={handleStudentSelectMenu} />
                </motion.div>
              )}

              {view === 'TEST_LIST' && (
                <motion.div
                  key="test-list-view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="max-w-5xl mx-auto py-6 px-4 space-y-6"
                >
                  <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-md border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setView('HOME')}
                        className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition active:scale-95"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <div>
                        <h2 className="text-xl font-black text-slate-900">📝 ઉપલબ્ધ ઓનલાઇન ટેસ્ટ</h2>
                        <p className="text-xs text-slate-500 font-medium">પરીક્ષા તૈયારી માટે કોઈપણ ટેસ્ટ પસંદ કરી શરૂ કરો</p>
                      </div>
                    </div>
                  </div>

                  {availableTests.length === 0 ? (
                    <div className="text-center p-12 bg-white rounded-3xl shadow-sm border border-slate-100 space-y-2">
                      <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                      <h3 className="text-base font-bold text-slate-800">હાલમાં કોઈ ટેસ્ટ ઉપલબ્ધ નથી</h3>
                      <p className="text-xs text-slate-500">એડમિન દ્વારા નવી ટેસ્ટ પબ્લિશ કરવામાં આવશે ત્યારે અહીં દેખાશે.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableTests.map((test) => (
                        <motion.div
                          key={test.id}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className="bg-white p-6 rounded-3xl shadow-md hover:shadow-xl border border-slate-100 transition-all flex flex-col justify-between space-y-4"
                        >
                          <div className="space-y-2">
                            <h3 className="text-lg font-extrabold text-slate-900">{test.title}</h3>
                            <p className="text-xs text-slate-500 font-medium line-clamp-2">{test.description}</p>
                          </div>

                          <div className="flex items-center justify-between text-xs font-bold text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-150">
                            <span className="flex items-center gap-1">⏱️ {test.timerMinutes} મિનિટ</span>
                            <span>🎯 {test.totalMarks} ગુણ</span>
                            <span>❓ {test.questionCount || 0} પ્રશ્નો</span>
                          </div>

                          <button
                            onClick={() => handleStartTest(test)}
                            className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 transition active:scale-95"
                          >
                            <Play className="w-4 h-4 text-amber-300 fill-amber-300" />
                            <span>ટેસ્ટ શરૂ કરો (Start Test)</span>
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {view === 'TEST_RUNNER' && selectedTest && (
                <motion.div
                  key="test-runner-view"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                >
                  <TestRunner
                    test={selectedTest}
                    onFinishTest={handleFinishTest}
                    onCancelTest={() => setView('TEST_LIST')}
                  />
                </motion.div>
              )}

              {view === 'RESULT' && testResult && (
                <motion.div
                  key="result-view"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ResultView result={testResult} onBackToHome={() => setView('HOME')} />
                </motion.div>
              )}

              {view === 'PDF' && (
                <motion.div
                  key="pdf-view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <PdfViewer onBack={() => setView('HOME')} />
                </motion.div>
              )}
            </React.Fragment>
          )}
        </AnimatePresence>
      </main>

      {/* Native Mobile App Bottom Navigation */}
      {currentUser && (
        <BottomNav
          user={currentUser}
          currentView={view}
          onNavigate={(targetView) => setView(targetView)}
          onOpenProfile={() => setShowProfileModal(true)}
        />
      )}

      {/* Profile Modal */}
      {showProfileModal && currentUser && (
        <ProfileModal
          user={currentUser}
          onClose={() => setShowProfileModal(false)}
          onLogout={handleLogout}
        />
      )}

      {/* APK Install Modal */}
      {showApkModal && <ApkInstallModal onClose={() => setShowApkModal(false)} />}
    </div>
  );
}

