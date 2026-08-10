import React, { useState } from 'react';
import { User } from '../types';
import { FileText, BookOpen, UserCheck, ArrowRight, Award, Clock, Play, Sparkles } from 'lucide-react';

interface StudentHomeProps {
  user: User;
  onSelectOption: (option: 'TEST' | 'PDF' | 'PROFILE') => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({ user, onSelectOption }) => {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-8 space-y-8">
      {/* Dark Hero Banner with Glowing Accent */}
      <div className="bg-slate-900 rounded-[40px] p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-slate-800">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <span className="inline-block text-orange-400 font-bold uppercase tracking-widest text-xs sm:text-sm bg-orange-950/80 px-4 py-1.5 rounded-full border border-orange-500/30">
            તાજેતરની ખાસ અપડેટ
          </span>
          <h2 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight text-white">
            નમસ્તે, {user.name}! <br />
            <span className="text-orange-500">TET-1 મોક ટેસ્ટ</span> અને શૈક્ષણિક સામગ્રી તૈયાર છે
          </h2>
          <p className="text-sm sm:text-lg text-slate-300 font-medium max-w-2xl leading-relaxed">
            મોજીલો મનીષ – ગુજરાત TET-1 સફળતા પોર્ટલમાં તમારું સ્વાગત છે. સમયમર્યાદા સાથે ઓનલાઇન ટેસ્ટ આપો અને તમામ PDF મટિરીયલ ડાઉનલોડ કરો.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <span className="bg-white/10 px-5 py-2 rounded-full border border-white/20 text-xs sm:text-sm font-bold">
              TET-1 Special 2026
            </span>
            <span className="bg-white/10 px-5 py-2 rounded-full border border-white/20 text-xs sm:text-sm font-bold">
              લાઇવ રિઝલ્ટ & એનાલિસિસ
            </span>
            <span className="bg-orange-500/20 text-orange-300 px-5 py-2 rounded-full border border-orange-500/30 text-xs sm:text-sm font-bold">
              ઓન-ડિવાઇસ લોક સુરક્ષા
            </span>
          </div>
        </div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-orange-600 rounded-full blur-[100px] opacity-40 pointer-events-none"></div>
      </div>

      {/* Main Options Grid in Bold Typography Theme */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Option 1: ટેસ્ટ (Test) */}
        <button
          id="btn-student-menu-test"
          onClick={() => onSelectOption('TEST')}
          className="group bg-white p-8 rounded-[32px] border-2 border-slate-100 hover:border-orange-500 shadow-xl shadow-slate-200/50 flex flex-col justify-between text-left transition-all duration-300 min-h-[260px]"
        >
          <div>
            <div className="bg-orange-100 p-4 rounded-2xl w-16 h-16 mb-6 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
              <BookOpen className="w-8 h-8" />
            </div>
            <span className="text-3xl sm:text-4xl font-black mb-2 text-slate-800 block">
              📝 ટેસ્ટ
            </span>
            <span className="text-slate-500 font-medium text-base sm:text-lg block mt-1">
              નવી પરીક્ષા શરૂ કરો અને ત્વરિત માર્ક્સ મેળવો
            </span>
          </div>

          <div className="flex items-center justify-between text-sm font-black text-orange-600 pt-4 border-t border-slate-100 mt-6">
            <span>ઓનલાઇન ટેસ્ટ સેક્શન</span>
            <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </button>

        {/* Option 2: અભ્યાસ સામગ્રી (PDF) */}
        <button
          id="btn-student-menu-pdf"
          onClick={() => onSelectOption('PDF')}
          className="group bg-white p-8 rounded-[32px] border-2 border-slate-100 hover:border-blue-500 shadow-xl shadow-slate-200/50 flex flex-col justify-between text-left transition-all duration-300 min-h-[260px]"
        >
          <div>
            <div className="bg-blue-100 p-4 rounded-2xl w-16 h-16 mb-6 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8" />
            </div>
            <span className="text-3xl sm:text-4xl font-black mb-2 text-slate-800 block">
              📄 PDF
            </span>
            <span className="text-slate-500 font-medium text-base sm:text-lg block mt-1">
              અભ્યાસ સામગ્રી વાંચો અને ડાઉનલોડ કરો
            </span>
          </div>

          <div className="flex items-center justify-between text-sm font-black text-blue-600 pt-4 border-t border-slate-100 mt-6">
            <span>પીડીએફ મટિરીયલ</span>
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </button>

        {/* Option 3: પ્રોફાઇલ (Profile) */}
        <button
          id="btn-student-menu-profile"
          onClick={() => onSelectOption('PROFILE')}
          className="group bg-white p-8 rounded-[32px] border-2 border-slate-100 hover:border-slate-800 shadow-xl shadow-slate-200/50 flex flex-col justify-between text-left transition-all duration-300 min-h-[260px]"
        >
          <div>
            <div className="bg-slate-100 p-4 rounded-2xl w-16 h-16 mb-6 flex items-center justify-center text-slate-800 group-hover:scale-110 transition-transform">
              <UserCheck className="w-8 h-8" />
            </div>
            <span className="text-3xl sm:text-4xl font-black mb-2 text-slate-800 block">
              👤 પ્રોફાઇલ
            </span>
            <span className="text-slate-500 font-medium text-base sm:text-lg block mt-1">
              મારી પ્રોફાઇલ અને ડિવાઇસ વિગતો જુઓ
            </span>
          </div>

          <div className="flex items-center justify-between text-sm font-black text-slate-800 pt-4 border-t border-slate-100 mt-6">
            <span>અકાઉન્ટ સ્ટેટસ</span>
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 group-hover:bg-slate-800 group-hover:text-white transition-colors">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </button>
      </div>

      {/* Quick Exam Tips Banner */}
      <div className="bg-orange-50 border border-orange-200 p-6 rounded-[28px] flex items-start gap-4 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
          <Award className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-base font-extrabold text-orange-950">TET-1 પરીક્ષા માર્ગદર્શન:</h4>
          <p className="text-xs sm:text-sm text-orange-900 leading-relaxed font-medium">
            દરેક ઓનલાઇન ટેસ્ટમાં ટાઇમર પૂર્ણ થાય તે પહેલાં તમારા જવાબો સબમિટ કરો. ટેસ્ટ પૂરી થયા બાદ ત્વરિત સાચા અને ખોટા જવાબોની વિગતવાર સમજૂતી (Explanation) ઉપલબ્ધ રહેશે.
          </p>
        </div>
      </div>
    </div>
  );
};
