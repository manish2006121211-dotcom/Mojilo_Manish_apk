import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, UserCheck, Phone, Lock, ArrowRight, AlertCircle, Smartphone, CheckCircle2 } from 'lucide-react';

interface LoginFormProps {
  onLoginSuccess: (user: any) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [roleTab, setRoleTab] = useState<'STUDENT' | 'ADMIN'>('STUDENT');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!mobile.trim() || !password.trim()) {
      setErrorMsg('કૃપા કરીને મોબાઇલ નંબર અને પાસવર્ડ બંને દાખલ કરો.');
      return;
    }

    setIsLoading(true);

    try {
      const { api } = await import('../lib/api');
      const data = await api.login(mobile.trim(), password.trim());

      if (data.user) {
        if (roleTab === 'ADMIN' && data.user.role !== 'ADMIN') {
          setErrorMsg('આ અકાઉન્ટ એડમિન પરવાનગી ધરાવતું નથી. કૃપા કરીને વિદ્યાર્થી લૉગિન નો ઉપયોગ કરો.');
          setIsLoading(false);
          return;
        }
        onLoginSuccess(data.user);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'લૉગિન કરવામાં નિષ્ફળતા મળી. મોબાઇલ નંબર અને પાસવર્ડ તપાસો.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoStudent = () => {
    setRoleTab('STUDENT');
    setMobile('9998887776');
    setPassword('student123');
    setErrorMsg(null);
  };

  const fillDemoAdmin = () => {
    setRoleTab('ADMIN');
    setMobile('9876543210');
    setPassword('admin123');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-[32px] shadow-2xl border border-slate-100"
      >
        {/* Header */}
        <div className="text-center space-y-3">
          <motion.img
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            src="/icon.png"
            alt="મોજીલો મનીષ"
            className="w-20 h-20 rounded-3xl mx-auto object-cover shadow-lg border border-orange-200 cursor-pointer"
            referrerPolicy="no-referrer"
          />
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              મોજીલો મનીષ <span className="text-orange-600">| TET-1</span>
            </h2>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">શિક્ષક પાત્રતા કસોટી પોર્ટલ</p>
          </div>
        </div>

        {/* Role Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            id="tab-student-login"
            type="button"
            onClick={() => {
              setRoleTab('STUDENT');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition ${
              roleTab === 'STUDENT'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>વિદ્યાર્થી લૉગિન</span>
          </button>
          <button
            id="tab-admin-login"
            type="button"
            onClick={() => {
              setRoleTab('ADMIN');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition ${
              roleTab === 'ADMIN'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>એડમિન લૉગિન</span>
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div id="login-error-alert" className="p-4 bg-red-50 border-l-4 border-red-500 rounded-2xl text-red-700 text-xs sm:text-sm flex items-start gap-2.5 shadow-xs">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
            <div>
              <p className="font-bold">લૉગિન એરર</p>
              <p className="mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              મોબાઇલ નંબર (Mobile Number)
            </label>
            <div className="relative rounded-2xl">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="input-login-mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="દા.ત. 9998887776"
                className="block w-full pl-10 pr-4 py-3 text-sm font-medium border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-slate-50 focus:bg-white transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              પાસવર્ડ (Password)
            </label>
            <div className="relative rounded-2xl">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="input-login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full pl-10 pr-4 py-3 text-sm font-medium border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-slate-50 focus:bg-white transition"
                required
              />
            </div>
          </div>

          <div className="text-xs text-slate-500 font-bold flex items-center gap-1.5 pt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>વન-ડિવાઇસ સિક્યોરિટી પ્રોટેક્ટેડ</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            id="btn-login-submit"
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 px-4 rounded-2xl text-white font-black text-sm shadow-xl shadow-orange-600/20 flex items-center justify-center gap-2 transition ${
              roleTab === 'ADMIN'
                ? 'bg-slate-900 hover:bg-slate-800'
                : 'bg-orange-600 hover:bg-orange-500'
            } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>ચકાસણી થઈ રહી છે...</span>
              </span>
            ) : (
              <>
                <span>લૉગિન કરો</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};
