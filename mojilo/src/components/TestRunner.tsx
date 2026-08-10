import React, { useState, useEffect, useRef } from 'react';
import { Test, Question, TestResult } from '../types';
import { api } from '../lib/api';
import { Clock, ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, Send, HelpCircle } from 'lucide-react';

interface TestRunnerProps {
  test: Test;
  onFinishTest: (result: TestResult) => void;
  onCancelTest: () => void;
}

export const TestRunner: React.FC<TestRunnerProps> = ({ test, onFinishTest, onCancelTest }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(test.timerMinutes * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load Test Questions
  useEffect(() => {
    let isMounted = true;
    api
      .getQuestions(test.id)
      .then((res) => {
        if (isMounted) {
          if (res.questions && res.questions.length > 0) {
            setQuestions(res.questions);
          } else {
            setErrorMsg('આ ટેસ્ટમાં કોઈ પ્રશ્ન ઉપલબ્ધ નથી.');
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setErrorMsg(err.message || 'પ્રશ્નો લોડ કરવામાં ભૂલ થઈ.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [test.id]);

  // Countdown Timer
  useEffect(() => {
    if (questions.length === 0 || isSubmitting) return;

    timerRef.current = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [questions, isSubmitting]);

  const handleSelectOption = (option: 'A' | 'B' | 'C' | 'D') => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: option
    }));
  };

  const handleAutoSubmit = () => {
    handleSubmitTest(true);
  };

  const handleSubmitTest = async (isTimeUp = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setShowConfirmSubmit(false);

    const elapsedSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);

    try {
      const res = await api.submitTest(test.id, selectedAnswers, elapsedSeconds);
      if (res.result) {
        onFinishTest(res.result);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'ટેસ્ટ સબમિટ કરવામાં ભૂલ થઈ.');
      setIsSubmitting(false);
    }
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];
  const attemptedCount = Object.keys(selectedAnswers).length;

  if (errorMsg) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl shadow-xl text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h3 className="text-xl font-bold text-slate-900">{errorMsg}</h3>
        <button
          onClick={onCancelTest}
          className="px-6 py-2.5 bg-indigo-900 text-white font-bold text-sm rounded-xl"
        >
          પાછા જાઓ
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-slate-600">ટેસ્ટ લોડ થઈ રહ્યો છે...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Test Top Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-slate-100 flex flex-wrap items-center justify-between gap-4 sticky top-16 z-30">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900">{test.title}</h2>
          <p className="text-xs text-slate-500">
            પ્રશ્ન {currentIndex + 1} / {questions.length} | આપેલા જવાબ: {attemptedCount}
          </p>
        </div>

        {/* Timer Box */}
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-bold text-sm sm:text-base ${
            timeLeftSeconds < 180
              ? 'bg-red-50 text-red-700 border-red-300 animate-pulse'
              : 'bg-amber-50 text-amber-900 border-amber-300'
          }`}
        >
          <Clock className="w-5 h-5 text-amber-600" />
          <span>{formatTime(timeLeftSeconds)}</span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 space-y-6">
        {/* Question Header */}
        <div className="space-y-2 border-b border-slate-100 pb-4">
          <span className="text-xs font-bold text-indigo-900 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            પ્રશ્ન નંબર {currentIndex + 1}
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
            {currentQ.questionText}
          </h3>
        </div>

        {/* 4 Options List */}
        <div className="space-y-3">
          {[
            { key: 'A', text: currentQ.optionA },
            { key: 'B', text: currentQ.optionB },
            { key: 'C', text: currentQ.optionC },
            { key: 'D', text: currentQ.optionD }
          ].map((opt) => {
            const isSelected = selectedAnswers[currentQ.id] === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleSelectOption(opt.key as any)}
                className={`w-full p-4 rounded-2xl border-2 text-left text-sm font-bold transition flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-600/20 scale-[1.01]'
                    : 'bg-slate-50 hover:bg-orange-50/50 text-slate-800 border-slate-200 hover:border-orange-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black border ${
                      isSelected ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    {opt.key}
                  </span>
                  <span>{opt.text}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-white shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Question Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition ${
              currentIndex === 0
                ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
                : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>પાછળ</span>
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              className="px-5 py-2.5 bg-indigo-900 hover:bg-indigo-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow transition"
            >
              <span>આગળ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirmSubmit(true)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg transition"
            >
              <Send className="w-4 h-4" />
              <span>ટેસ્ટ સબમિટ કરો</span>
            </button>
          )}
        </div>
      </div>

      {/* Question Palette Grid */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">પ્રશ્નો ગ્રિડ (Question Palette)</h4>
          <button
            onClick={() => setShowConfirmSubmit(true)}
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            અહીંથી સબમિટ કરો
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => {
            const isAnswered = Boolean(selectedAnswers[q.id]);
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-9 h-9 rounded-xl text-xs font-black transition border flex items-center justify-center ${
                  isCurrent
                    ? 'ring-2 ring-indigo-900 ring-offset-2 font-black'
                    : ''
                } ${
                  isAnswered
                    ? 'bg-emerald-600 text-white border-emerald-700'
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center text-2xl font-bold">
              📝
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">શું આપ ટેસ્ટ સબમિટ કરવા માંગો છો?</h3>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                આપે {questions.length} માંથી {attemptedCount} પ્રશ્નોના જવાબ આપ્યા છે. સબમિટ કર્યા પછી આપનું પરિણામ તરત જ સ્ક્રીન પર બતાવવામાં આવશે.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                ચાલુ રાખો (Cancel)
              </button>
              <button
                onClick={() => handleSubmitTest(false)}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg"
              >
                {isSubmitting ? 'ગણતરી થઈ રહી છે...' : 'હા, સબમિટ કરો'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
