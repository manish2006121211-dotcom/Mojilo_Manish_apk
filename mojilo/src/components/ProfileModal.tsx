import React from 'react';
import { User } from '../types';
import { UserCheck, ShieldCheck, Phone, Smartphone, Calendar, LogOut, X, CheckCircle2 } from 'lucide-react';

interface ProfileModalProps {
  user: User;
  onClose: () => void;
  onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose, onLogout }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-900 to-indigo-700 text-amber-300 rounded-2xl mx-auto flex items-center justify-center text-2xl font-bold shadow-md">
            {user.role === 'ADMIN' ? <ShieldCheck className="w-8 h-8" /> : <UserCheck className="w-8 h-8" />}
          </div>
          <h3 className="text-xl font-black text-slate-900">{user.name}</h3>
          <span className="inline-block text-xs font-bold bg-amber-100 text-amber-900 px-3 py-0.5 rounded-full border border-amber-200">
            {user.role === 'ADMIN' ? 'એડમિન સંચાલક' : 'વિદ્યાર્થી (Student)'}
          </span>
        </div>

        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-slate-200">
            <span className="font-bold text-slate-500 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-indigo-900" />
              <span>મોબાઇલ નંબર:</span>
            </span>
            <span className="font-bold text-slate-900">{user.mobile}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-200">
            <span className="font-bold text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-900" />
              <span>નોંધણી તારીખ:</span>
            </span>
            <span className="font-medium text-slate-700">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('gu-IN') : '2026-08-10'}</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="font-bold text-slate-500 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-indigo-900" />
              <span>ડિવાઇસ લોક સેશન:</span>
            </span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>સક્રિય સેશન</span>
            </span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition"
        >
          <LogOut className="w-4 h-4" />
          <span>લૉગઆઉટ કરો (Logout)</span>
        </button>
      </div>
    </div>
  );
};
