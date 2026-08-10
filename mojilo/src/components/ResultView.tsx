import React, { useEffect } from 'react';
import { TestResult } from '../types';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, XCircle, Clock, AlertCircle, ArrowLeft, RotateCcw, HelpCircle } from 'lucide-react';

interface ResultViewProps {
  result: TestResult;
  onBackToHome: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, onBackToHome }) => {
  useEffect(() => {
    // Fire confetti if percentage >= 60%
    if (result.percentage >= 60) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [result.percentage]);

  const formatSeconds = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins} મિનિટ ${remSecs} સેકન્ડ`;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-8 space-y-8">
      {/* Result Top Hero Banner */}
      <div className="bg-slate-900 rounded-[40px] p-8 sm:p-12 text-white shadow-2xl text-center space-y-5 border border-slate-800 relative overflow-hidden">
        <div className="w-20 h-20 bg-orange-500 text-white rounded-3xl mx-auto flex items-center justify-center text-3xl font-black shadow-xl shadow-orange-500/30">
          <Award className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-orange-400 bg-orange-950/80 px-4 py-1.5 rounded-full border border-orange-500/30">
            તમારું ટેસ્ટ પરિણામ (Instant Result)
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white mt-3">{result.testTitle}</h2>
        </div>

        {/* Big Marks Counter */}
        <div className="inline-flex flex-col items-center justify-center bg-slate-800/90 border-2 border-orange-500/40 rounded-3xl px-10 py-5 shadow-inner">
          <div className="text-5xl sm:text-6xl font-black text-orange-400 tracking-tight">
            {result.obtainedMarks} <span className="text-2xl sm:text-3xl font-bold text-slate-300">/ {result.totalMarks}</span>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 mt-2">પ્રાપ્ત ગુણ / કુલ ગુણ ({result.percentage}%)</span>
        </div>

        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-orange-600 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
      </div>

      {/* 4 Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Correct Answers */}
        <div className="bg-white p-5 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-extrabold uppercase tracking-wider">સાચા જવાબો</span>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-slate-900">{result.correctCount}</p>
        </div>

        {/* Wrong Answers */}
        <div className="bg-white p-5 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-red-600">
            <span className="text-xs font-extrabold uppercase tracking-wider">ખોટા જવાબો</span>
            <XCircle className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-slate-900">{result.wrongCount}</p>
        </div>

        {/* Unattempted */}
        <div className="bg-white p-5 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold uppercase tracking-wider">ન આપેલા જવાબ</span>
            <AlertCircle className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-slate-900">{result.unattemptedCount}</p>
        </div>

        {/* Time Taken */}
        <div className="bg-white p-5 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-orange-600">
            <span className="text-xs font-extrabold uppercase tracking-wider">લીધેલો સમય</span>
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-sm font-black text-slate-900">{formatSeconds(result.timeTakenSeconds)}</p>
        </div>
      </div>

      {/* Detailed Question Review & Explanation List */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-xl font-black text-slate-900">પ્રશ્નોત્તરી ચકાસણી અને સચોટ સમજૂતી</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">તમારા જવાબો અને દરેક પ્રશ્નનો સાચો જવાબ જુઓ</p>
        </div>

        <div className="space-y-4">
          {result.questionsWithAnswers.map((item, idx) => {
            const q = item.question;
            const userSelected = item.selectedOption;
            const isCorrect = item.isCorrect;

            return (
              <div
                key={q.id}
                className={`p-6 rounded-2xl border-2 space-y-4 transition ${
                  isCorrect
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : userSelected
                    ? 'bg-red-50/40 border-red-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-extrabold text-base text-slate-900">
                    {idx + 1}. {q.questionText}
                  </h4>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold shrink-0 border ${
                      isCorrect
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : userSelected
                        ? 'bg-red-100 text-red-800 border-red-300'
                        : 'bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                  >
                    {isCorrect ? '✓ સાચો જવાબ' : userSelected ? '✗ ખોટો જવાબ' : 'ન આપેલ'}
                  </span>
                </div>

                {/* 4 Options breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-medium">
                  {[
                    { key: 'A', text: q.optionA },
                    { key: 'B', text: q.optionB },
                    { key: 'C', text: q.optionC },
                    { key: 'D', text: q.optionD }
                  ].map((opt) => {
                    const isRightAnswer = q.correctOption === opt.key;
                    const isUserChoice = userSelected === opt.key;

                    let optClass = 'bg-white border-slate-200 text-slate-700';
                    if (isRightAnswer) {
                      optClass = 'bg-emerald-100 text-emerald-950 font-bold border-emerald-400';
                    } else if (isUserChoice && !isRightAnswer) {
                      optClass = 'bg-red-100 text-red-950 font-bold border-red-400';
                    }

                    return (
                      <div key={opt.key} className={`p-3 rounded-xl border ${optClass} flex items-center justify-between`}>
                        <span>
                          <strong>{opt.key}.</strong> {opt.text}
                        </span>
                        {isRightAnswer && <span className="text-[11px] font-bold text-emerald-700">✓ સાચો જવાબ</span>}
                        {isUserChoice && !isRightAnswer && <span className="text-[11px] font-bold text-red-700">તમારી પસંદગી</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Optional Explanation */}
                {q.explanation && (
                  <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200 text-xs text-orange-950 space-y-1">
                    <span className="font-bold flex items-center gap-1.5 text-orange-900">
                      <HelpCircle className="w-4 h-4 text-orange-600" />
                      <span>સચોટ સમજૂતી (Explanation):</span>
                    </span>
                    <p className="leading-relaxed font-medium">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Return Button */}
      <div className="text-center pt-2">
        <button
          onClick={onBackToHome}
          className="bg-orange-600 hover:bg-orange-500 text-white font-black px-10 py-4 rounded-2xl text-sm shadow-xl shadow-orange-600/20 inline-flex items-center gap-2 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>પાછા હોમ પેજ પર જાઓ</span>
        </button>
      </div>
    </div>
  );
};
