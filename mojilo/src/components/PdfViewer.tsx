import React, { useState, useEffect } from 'react';
import { PDFMetadata } from '../types';
import { api, apiUrl } from '../lib/api';
import { FileText, Download, Eye, ArrowLeft, Search, Filter, BookOpen, ExternalLink, X } from 'lucide-react';

interface PdfViewerProps {
  onBack: () => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ onBack }) => {
  const [pdfs, setPdfs] = useState<PDFMetadata[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .getPdfs()
      .then((res) => {
        if (res.pdfs) {
          setPdfs(res.pdfs);
        }
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const categories = [
    { id: 'ALL', label: 'તમામ વિષયો (All)' },
    { id: 'બાળ વિકાસ અને મનોવિજ્ઞાન', label: 'બાળ વિકાસ અને મનોવિજ્ઞાન' },
    { id: 'ગુજરાતી ભાષા અને વ્યાકરણ', label: 'ગુજરાતી વ્યાકરણ' },
    { id: 'ગણિત અને પર્યાવરણ', label: 'ગણિત અને પર્યાવરણ' },
    { id: 'શૈક્ષણિક યોજનાઓ', label: 'શૈક્ષણિક યોજનાઓ & RTE' }
  ];

  const filteredPdfs = pdfs.filter((pdf) => {
    const matchesCat = selectedCategory === 'ALL' || pdf.category === selectedCategory;
    const matchesSearch = pdf.title.toLowerCase().includes(searchQuery.toLowerCase()) || pdf.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-md border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition"
            title="પાછા જાઓ"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📄 અભ્યાસ સામગ્રી (PDF Materials)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">TET-1 પરીક્ષા તૈયારી માટે જરૂરી તમામ પીડીએફ વાંચવા તથા ડાઉનલોડ કરવા માટે</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="શોધો (Search)..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
              selectedCategory === cat.id
                ? 'bg-amber-500 text-indigo-950 shadow-md border border-amber-400'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* PDF List Cards */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-500 mt-2">PDF લોડ થઈ રહી છે...</p>
        </div>
      ) : filteredPdfs.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-3xl shadow-sm border border-slate-100 space-y-2">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">કોઈ PDF ફાઇલ મળી નથી</h3>
          <p className="text-xs text-slate-500">બીજી કેટેગરી અથવા શોધ શબ્દ બદલીને પ્રયાસ કરો.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPdfs.map((pdf) => (
            <div
              key={pdf.id}
              className="bg-white p-5 rounded-3xl shadow-md hover:shadow-xl border border-slate-100 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {pdf.category}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 leading-snug">{pdf.title}</h3>
                <p className="text-xs text-slate-500 font-medium">
                  તારીખ: {pdf.uploadDate} | કદ: {pdf.fileSize || '1.8 MB'}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    setPreviewPdfUrl(apiUrl(pdf.fileUrl));
                    setPreviewTitle(pdf.title);
                  }}
                  className="flex-1 py-2.5 px-3 bg-indigo-900 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow transition"
                >
                  <Eye className="w-4 h-4" />
                  <span>વાંચો (Read PDF)</span>
                </button>

                <a
                  href={apiUrl(pdf.fileUrl)}
                  download={pdf.fileKey || `${pdf.title}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-indigo-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>ડાઉનલોડ</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Embedded PDF Preview Modal */}
      {previewPdfUrl && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-3xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 bg-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold truncate max-w-md">{previewTitle}</h3>
              </div>
              <button
                onClick={() => setPreviewPdfUrl(null)}
                className="p-1.5 bg-indigo-900 hover:bg-indigo-800 text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded Iframe */}
            <div className="flex-1 bg-slate-100">
              <iframe src={previewPdfUrl} title={previewTitle} className="w-full h-full border-none" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
