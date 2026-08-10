import React, { useState, useEffect } from 'react';
import { Smartphone, Download, CheckCircle2, ShieldCheck, X, Share, MoreVertical } from 'lucide-react';

interface ApkInstallModalProps {
  onClose: () => void;
}

export const ApkInstallModal: React.FC<ApkInstallModalProps> = ({ onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User installed the PWA');
      }
      setDeferredPrompt(null);
      onClose();
    } else {
      alert('તમારા ફોનમાં બ્રાઉઝરના ત્રણ ટપકાં (Menu) માં જઈ "Add to Home Screen" અથવા "Install App" વિકલ્પ પસંદ કરો.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[32px] max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-slate-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-3xl mx-auto flex items-center justify-center text-3xl font-black shadow-inner border border-orange-200">
            <Smartphone className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">એપ તરીકે ઇન્સ્ટોલ કરો</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
              મોજીલો મનીષ – TET-1 મોબાઇલ એપ
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-slate-900 text-sm">ઝડપી & લાઇટવેઇટ અનુભવ</p>
              <p className="text-slate-600 mt-0.5 font-medium">પ્લે સ્ટોર વગર સીધા જ ફોનની હોમ સ્ક્રીન પર હોમ આઇકન સાથે ઉમેરો.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-2 border-t border-slate-200/60">
            <ShieldCheck className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-slate-900 text-sm">ઇન્સ્ટોલેશન રીત:</p>
              <p className="text-slate-600 mt-0.5 font-medium flex items-center gap-1">
                ૧. નીચે આપેલા <strong>"ઇન્સ્ટોલ બટન"</strong> પર ક્લિક કરો.
              </p>
              <p className="text-slate-600 mt-0.5 font-medium flex items-center gap-1">
                ૨. અથવા Chrome બ્રાઉઝરમાં <MoreVertical className="w-3.5 h-3.5 inline text-slate-700" /> મેનુમાંથી <strong>"Add to Home Screen"</strong> કરો.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleInstallClick}
          className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-orange-600/30 transition"
        >
          <Download className="w-5 h-5" />
          <span>ઇન્સ્ટોલ કરો (Install Mobile App)</span>
        </button>
      </div>
    </div>
  );
};

