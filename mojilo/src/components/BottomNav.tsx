import React from 'react';
import { Home, FileText, BookOpen, User as UserIcon, Shield } from 'lucide-react';
import { User } from '../types';

interface BottomNavProps {
  user: User;
  currentView: 'HOME' | 'TEST_LIST' | 'TEST_RUNNER' | 'RESULT' | 'PDF' | 'ADMIN';
  onNavigate: (view: 'HOME' | 'TEST_LIST' | 'PDF' | 'ADMIN') => void;
  onOpenProfile: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  user,
  currentView,
  onNavigate,
  onOpenProfile
}) => {
  // Hide bottom nav while taking a test (TEST_RUNNER) for full focus
  if (currentView === 'TEST_RUNNER') return null;

  const isStudent = user.role === 'STUDENT';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] safe-pb active:translate-y-0">
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-around">
        {isStudent ? (
          <>
            {/* Home Tab */}
            <button
              onClick={() => onNavigate('HOME')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all duration-150 active:scale-90 ${
                currentView === 'HOME'
                  ? 'text-orange-600 font-extrabold'
                  : 'text-slate-400 font-medium hover:text-slate-600'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${currentView === 'HOME' ? 'bg-orange-100 text-orange-600' : ''}`}>
                <Home className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight">હોમ</span>
            </button>

            {/* Test Series Tab */}
            <button
              onClick={() => onNavigate('TEST_LIST')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all duration-150 active:scale-90 ${
                currentView === 'TEST_LIST' || currentView === 'RESULT'
                  ? 'text-orange-600 font-extrabold'
                  : 'text-slate-400 font-medium hover:text-slate-600'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${currentView === 'TEST_LIST' || currentView === 'RESULT' ? 'bg-orange-100 text-orange-600' : ''}`}>
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight">ટેસ્ટ</span>
            </button>

            {/* PDF Material Tab */}
            <button
              onClick={() => onNavigate('PDF')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all duration-150 active:scale-90 ${
                currentView === 'PDF'
                  ? 'text-orange-600 font-extrabold'
                  : 'text-slate-400 font-medium hover:text-slate-600'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${currentView === 'PDF' ? 'bg-orange-100 text-orange-600' : ''}`}>
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight">મટીરીયલ</span>
            </button>

            {/* Profile Tab */}
            <button
              onClick={onOpenProfile}
              className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-slate-400 font-medium hover:text-slate-600 transition-all duration-150 active:scale-90"
            >
              <div className="p-1.5 rounded-xl">
                <UserIcon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight">પ્રોફાઇલ</span>
            </button>
          </>
        ) : (
          /* Admin Bottom Nav */
          <>
            <button
              onClick={() => onNavigate('ADMIN')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all duration-150 active:scale-90 ${
                currentView === 'ADMIN'
                  ? 'text-orange-600 font-extrabold'
                  : 'text-slate-400 font-medium hover:text-slate-600'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${currentView === 'ADMIN' ? 'bg-orange-100 text-orange-600' : ''}`}>
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight">એડમિન પોર્ટલ</span>
            </button>

            <button
              onClick={onOpenProfile}
              className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-slate-400 font-medium hover:text-slate-600 transition-all duration-150 active:scale-90"
            >
              <div className="p-1.5 rounded-xl">
                <UserIcon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight">પ્રોફાઇલ</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
