
import React, { useState } from 'react';
import { LectureInfo, GenerationResponse } from './types';
import { generatePosts } from './geminiService';
import { 
  Send, 
  RefreshCw, 
  Copy, 
  CheckCircle2, 
  Instagram, 
  BookOpen, 
  Sparkles,
  Heart,
  Palette,
  Lightbulb,
  AlertCircle,
  Stars
} from 'lucide-react';

export default function App() {
  const [formData, setFormData] = useState<LectureInfo>({
    location: '',
    dateTime: '',
    target: '',
    topic: '',
    reaction: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.location || !formData.topic) {
      setError("장소와 주제는 꼭 적어주셔야 제가 정성껏 쓸 수 있어요! 😊");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await generatePosts(formData);
      setResult(data);
    } catch (err) {
      setError("죄송해요, 글을 생성하는 중에 문제가 생겼어요. 다시 한 번 버튼을 눌러주시겠어요? 🙏");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStatus(type);
    setTimeout(() => setCopiedStatus(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb] pb-20 selection:bg-rose-100">
      {/* Header - Warm Pastel Theme */}
      <header className="bg-gradient-to-br from-rose-100 via-orange-50 to-amber-100 py-16 px-4 shadow-sm text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-[-20px] left-[10%] w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-20px] right-[10%] w-80 h-80 bg-rose-200 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md px-6 py-2 rounded-full text-rose-600 text-sm font-bold mb-6 border border-rose-200 shadow-sm">
            <Palette size={16} />
            가치있는 미래교육 연구소 | 대표 김병찬
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-6 tracking-tight">
            따뜻한 감성 강의 <span className="text-rose-500">포스팅 메이커</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            미술 교사의 마음으로, AI의 지혜를 더해<br/>
            오늘의 소중한 강의를 기록으로 남깁니다. ✨
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Section */}
          <div className="lg:col-span-5 bg-white rounded-[2.5rem] shadow-xl p-8 md:p-10 border border-orange-50">
            <div className="flex items-center gap-3 mb-8 text-slate-800">
              <div className="p-3 bg-rose-50 rounded-2xl">
                <Heart size={24} className="text-rose-500 fill-rose-500" />
              </div>
              <h2 className="text-2xl font-bold">강의 기록하기</h2>
            </div>
            
            <div className="space-y-6">
              <InputGroup label="어디에서 함께하셨나요?" name="location" value={formData.location} onChange={handleInputChange} placeholder="장소 입력" />
              <InputGroup label="언제였나요?" name="dateTime" value={formData.dateTime} onChange={handleInputChange} placeholder="날짜와 시간" />
              <InputGroup label="누구를 만나셨나요?" name="target" value={formData.target} onChange={handleInputChange} placeholder="참석자 대상" />
              <InputGroup label="무엇을 나누셨나요?" name="topic" value={formData.topic} onChange={handleInputChange} placeholder="강의 주제" />
              
              <div className="space-y-2">
                <label className="text-[15px] font-bold text-slate-600 flex items-center gap-2 px-1">
                  <Stars size={16} className="text-amber-500" />
                  그날의 특별했던 기억
                </label>
                <textarea
                  name="reaction"
                  value={formData.reaction}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-100 focus:ring-4 focus:ring-rose-50 focus:border-rose-200 transition-all bg-slate-50 text-slate-800 outline-none resize-none placeholder:text-slate-300"
                  placeholder="현장 분위기나 교육생의 반응을 적어주세요."
                />
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-500 px-5 py-3 rounded-xl flex items-center gap-3 text-sm font-medium animate-shake">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className={`w-full py-5 rounded-2xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 text-lg flex items-center justify-center gap-3 ${
                  isLoading ? 'bg-slate-300' : 'bg-gradient-to-r from-rose-400 to-orange-400 hover:from-rose-500 hover:to-orange-500'
                }`}
              >
                {isLoading ? <RefreshCw className="animate-spin" size={24} /> : <Sparkles size={24} />}
                {isLoading ? '멋진 글을 짓는 중...' : '포스팅 생성하기'}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7 space-y-8">
            {!result && !isLoading && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-300 py-20 border-2 border-dashed border-rose-100 rounded-[2.5rem] bg-white/50 backdrop-blur-sm">
                <Lightbulb size={64} className="mb-6 opacity-20" />
                <p className="text-center font-medium leading-relaxed">
                  왼쪽 양식을 채워주시면<br/>
                  전문 작가가 쓴 듯한 포스팅이 나타납니다.
                </p>
              </div>
            )}

            {isLoading && (
              <div className="space-y-8">
                <div className="h-48 bg-white rounded-[2rem] shadow-sm animate-pulse border border-slate-50"></div>
                <div className="h-[500px] bg-white rounded-[2rem] shadow-sm animate-pulse border border-slate-50"></div>
              </div>
            )}

            {result && !isLoading && (
              <div className="space-y-8">
                <ResultCard 
                  title="인스타그램 감성 피드" 
                  icon={<Instagram size={20} className="text-rose-500" />}
                  content={result.instagram}
                  onCopy={() => handleCopy(result.instagram, 'insta')}
                  onRegenerate={handleGenerate}
                  isCopied={copiedStatus === 'insta'}
                  color="rose"
                />

                <ResultCard 
                  title="네이버 블로그 상세 포스팅" 
                  icon={<BookOpen size={20} className="text-emerald-500" />}
                  content={result.naverBlog}
                  onCopy={() => handleCopy(result.naverBlog, 'naver')}
                  onRegenerate={handleGenerate}
                  isCopied={copiedStatus === 'naver'}
                  color="emerald"
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function InputGroup({ label, name, value, onChange, placeholder }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[14px] font-bold text-slate-600 px-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-5 py-4 rounded-2xl border border-slate-100 focus:ring-4 focus:ring-rose-50 focus:border-rose-200 transition-all bg-slate-50 text-slate-800 outline-none font-medium placeholder:text-slate-300"
        placeholder={placeholder}
      />
    </div>
  );
}

function ResultCard({ title, icon, content, onCopy, onRegenerate, isCopied, color }: any) {
  const colorClass = color === 'rose' ? 'border-rose-100' : 'border-emerald-100';
  
  return (
    <div className={`bg-white rounded-[2.5rem] shadow-xl overflow-hidden border ${colorClass} flex flex-col`}>
      <div className="px-8 py-5 bg-slate-50/50 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="font-bold text-slate-800">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onRegenerate} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
            <RefreshCw size={18} />
          </button>
          <button 
            onClick={onCopy}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm transition-all shadow-sm ${
              isCopied ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {isCopied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
            {isCopied ? '복사됨' : '복사'}
          </button>
        </div>
      </div>
      <div className="p-8 md:p-10">
        <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-[16px] max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 pr-4">
          {content}
        </div>
      </div>
    </div>
  );
}
