import React from 'react';
import { User } from '../types';
import { LogOut, ShieldCheck, UserCheck, Smartphone } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onOpenProfile?: () => void;
  onOpenApkModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onOpenProfile, onOpenApkModal }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs safe-pt">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between safe-px">
        {/* App Title & Logo matching 'મોજીલો મનીષ' */}
        <div className="flex items-center space-x-3">
          <img
            id="app-logo"
            src="/icon.png"
            alt="મોજીલો મનીષ"
            className="w-12 h-12 rounded-2xl object-cover shadow-md border border-orange-200 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight text-orange-600 flex items-center gap-2">
              <span>મોજીલો મનીષ</span>
              <span className="text-slate-300 font-light">|</span>
              <span className="text-slate-800 font-bold text-base sm:text-xl">
                TET-1
              </span>
            </h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:block">વિદ્યાર્થી પેનલ - સફળતાનો માર્ગ</p>
          </div>
        </div>

        {/* User Badge & Actions */}
        {user ? (
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Active Device Badge */}
            <div className="hidden lg:flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-2xl border border-orange-100">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              <span className="text-orange-950 font-bold text-xs">સક્રિય સેશન: Mobile-Locked</span>
            </div>

            {onOpenApkModal && (
              <button
                id="btn-apk-install"
                onClick={onOpenApkModal}
                className="flex items-center gap-1.5 text-xs bg-orange-600 hover:bg-orange-500 text-white font-extrabold px-3 py-2 rounded-2xl transition shadow-md shadow-orange-600/20"
                title="ઇન્સ્ટોલ મોબાઇલ એપ"
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden sm:inline">એપ ઇન્સ્ટોલ કરો</span>
              </button>
            )}

            <button
              id="btn-user-profile"
              onClick={onOpenProfile}
              className="flex items-center gap-2.5 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-2xl border border-slate-200 transition text-left"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white text-xs font-black">
                {user.role === 'ADMIN' ? <ShieldCheck className="w-4 h-4 text-orange-400" /> : <UserCheck className="w-4 h-4 text-slate-200" />}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-extrabold leading-none text-slate-900">{user.name}</p>
                <span className="text-[10px] text-orange-600 font-bold leading-none">
                  {user.role === 'ADMIN' ? 'એડમિન સંચાલક' : 'વિદ્યાર્થી'}
                </span>
              </div>
            </button>

            <button
              id="btn-logout"
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 px-3 py-2 rounded-2xl font-bold transition border border-slate-200"
              title="લૉગઆઉટ કરો"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">લૉગઆઉટ</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            {onOpenApkModal && (
              <button
                id="btn-apk-install-guest"
                onClick={onOpenApkModal}
                className="flex items-center gap-1.5 text-xs bg-orange-600 hover:bg-orange-500 text-white font-extrabold px-3 py-2 rounded-2xl transition shadow-md shadow-orange-600/20"
              >
                <Smartphone className="w-4 h-4" />
                <span>એપ ઇન્સ્ટોલ કરો</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
