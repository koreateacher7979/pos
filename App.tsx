
import React, { useState, useEffect } from 'react';
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
  Key,
  AlertCircle,
  Stars,
  MessageSquareHeart
} from 'lucide-react';

// window 객체에 aistudio가 이미 AIStudio 타입으로 정의되어 있을 수 있으므로 이를 준수합니다.
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    aistudio: AIStudio;
  }
}

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
  const [hasKey, setHasKey] = useState(true);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    if (window.aistudio) {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    }
  };

  const handleOpenKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true); // 선택 후 성공했다고 가정하고 진행
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.location || !formData.topic) {
      setError("장소와 주제는 필수 입력 사항이에요. 정성을 담아 채워주세요! 😊");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await generatePosts(formData);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다. 다시 시도해 주세요.");
      if (err.message.includes("API 키")) {
        setHasKey(false);
      }
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
    <div className="min-h-screen bg-[#fffcf9] pb-20 selection:bg-rose-100">
      {/* Header - Artistic Pastel Theme */}
      <header className="bg-gradient-to-br from-rose-50 via-white to-orange-50 py-16 px-4 text-center relative overflow-hidden border-b border-orange-100">
        <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
          <div className="absolute top-[-50px] left-[5%] w-72 h-72 bg-rose-200 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-50px] right-[5%] w-80 h-80 bg-orange-100 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full text-rose-500 text-sm font-bold border border-rose-100 shadow-sm flex items-center gap-2">
              <Palette size={16} />
              가치있는 미래교육 연구소 | 대표 김병찬
            </div>
            
            {!hasKey && (
              <button 
                onClick={handleOpenKey}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-full text-xs font-bold transition-all animate-bounce shadow-lg"
              >
                <Key size={14} />
                API 키 활성화가 필요합니다 (클릭)
              </button>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-6 tracking-tight flex items-center justify-center gap-4 flex-wrap">
            나만의 <span className="text-rose-400">감성 강의</span> 기록 작가 ✍️
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            미술 교사의 감수성과 AI의 전문성으로<br/>
            대표님의 강의 현장을 가장 가치 있게 기록해 드릴게요.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Section */}
          <div className="lg:col-span-5 bg-white/90 backdrop-blur-xl rounded-[3rem] shadow-2xl p-8 md:p-12 border border-rose-100/50">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-4 bg-rose-50 rounded-3xl">
                <MessageSquareHeart size={28} className="text-rose-400 fill-rose-400" />
              </div>
              <h2 className="text-2xl font-black text-slate-800">강의 이야기</h2>
            </div>
            
            <div className="space-y-8">
              <InputGroup label="어디에서 함께하셨나요?" name="location" value={formData.location} onChange={handleInputChange} placeholder="출강 장소 입력" />
              <InputGroup label="언제였나요?" name="dateTime" value={formData.dateTime} onChange={handleInputChange} placeholder="강의 날짜와 시간" />
              <InputGroup label="누구를 만나셨나요?" name="target" value={formData.target} onChange={handleInputChange} placeholder="교육 대상자" />
              <InputGroup label="무엇을 나누셨나요?" name="topic" value={formData.topic} onChange={handleInputChange} placeholder="강의 주제 및 핵심 키워드" />
              
              <div className="space-y-3">
                <label className="text-[15px] font-bold text-slate-700 flex items-center gap-2 px-1">
                  <Stars size={18} className="text-amber-400" />
                  그날의 특별했던 분위기
                </label>
                <textarea
                  name="reaction"
                  value={formData.reaction}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-6 py-5 rounded-[2rem] border border-slate-100 focus:ring-4 focus:ring-rose-50 focus:border-rose-200 transition-all bg-slate-50/50 text-slate-800 outline-none resize-none placeholder:text-slate-300 font-medium"
                  placeholder="교육생들의 반응이나 기억에 남는 에피소드를 자유롭게 들려주세요."
                />
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-500 px-6 py-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-shake">
                  <AlertCircle size={20} />
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className={`w-full py-6 rounded-[2rem] font-black text-white shadow-xl shadow-rose-200/50 transition-all transform hover:-translate-y-1 active:scale-95 text-xl flex items-center justify-center gap-3 ${
                  isLoading ? 'bg-slate-300 cursor-not-allowed' : 'bg-gradient-to-r from-rose-400 to-orange-400 hover:from-rose-500 hover:to-orange-500'
                }`}
              >
                {isLoading ? <RefreshCw className="animate-spin" size={28} /> : <Sparkles size={28} />}
                {isLoading ? '작가님이 정성껏 쓰는 중...' : '포스팅 생성하기'}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7 space-y-10">
            {!result && !isLoading && (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-slate-300 py-20 border-3 border-dashed border-rose-100 rounded-[3rem] bg-white/40 backdrop-blur-sm">
                <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-8">
                  <Palette size={48} className="text-rose-200" />
                </div>
                <h3 className="text-2xl font-black text-slate-400 mb-4">멋진 글이 곧 태어날 거예요!</h3>
                <p className="text-center font-medium leading-relaxed opacity-60">
                  왼쪽의 강의 정보를 채워주시면<br/>
                  인스타그램과 블로그용 글이 마법처럼 생성됩니다.
                </p>
              </div>
            )}

            {isLoading && (
              <div className="space-y-10">
                <div className="h-56 bg-white/80 rounded-[3rem] shadow-sm animate-pulse border border-slate-50"></div>
                <div className="h-[600px] bg-white/80 rounded-[3rem] shadow-sm animate-pulse border border-slate-50"></div>
              </div>
            )}

            {result && !isLoading && (
              <div className="space-y-10 animate-fade-in">
                <ResultCard 
                  title="인스타그램 (감성 피드)" 
                  icon={<Instagram size={24} className="text-rose-400" />}
                  content={result.instagram}
                  onCopy={() => handleCopy(result.instagram, 'insta')}
                  onRegenerate={handleGenerate}
                  isCopied={copiedStatus === 'insta'}
                  color="rose"
                  badge="인기 해시태그 5개"
                />

                <ResultCard 
                  title="네이버 블로그 (상세 포스팅)" 
                  icon={<BookOpen size={24} className="text-emerald-400" />}
                  content={result.naverBlog}
                  onCopy={() => handleCopy(result.naverBlog, 'naver')}
                  onRegenerate={handleGenerate}
                  isCopied={copiedStatus === 'naver'}
                  color="emerald"
                  badge="2,000자 이상 장문 & 노출 최적화"
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
    <div className="space-y-3">
      <label className="text-[15px] font-bold text-slate-700 px-2">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-6 py-5 rounded-[2rem] border border-slate-100 focus:ring-4 focus:ring-rose-50 focus:border-rose-200 transition-all bg-slate-50/50 text-slate-800 outline-none font-semibold placeholder:text-slate-300"
        placeholder={placeholder}
      />
    </div>
  );
}

function ResultCard({ title, icon, content, onCopy, onRegenerate, isCopied, color, badge }: any) {
  const colorClass = color === 'rose' ? 'border-rose-100' : 'border-emerald-100';
  const iconBg = color === 'rose' ? 'bg-rose-50' : 'bg-emerald-50';
  
  return (
    <div className={`bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border ${colorClass} flex flex-col transition-all hover:shadow-rose-100/50`}>
      <div className="px-10 py-8 bg-slate-50/30 border-b border-slate-50 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 ${iconBg} rounded-2xl`}>{icon}</div>
          <div>
            <h3 className="font-black text-slate-800 text-lg">{title}</h3>
            {badge && <span className="text-[11px] font-black text-rose-400 uppercase tracking-tighter">{badge}</span>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onRegenerate} className="p-3 text-slate-300 hover:text-rose-400 transition-all bg-white rounded-2xl border border-slate-100 shadow-sm" title="다시 쓰기">
            <RefreshCw size={22} />
          </button>
          <button 
            onClick={onCopy}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black transition-all shadow-lg ${
              isCopied ? 'bg-emerald-400 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            {isCopied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
            {isCopied ? '복사 성공!' : '전체 복사'}
          </button>
        </div>
      </div>
      <div className="p-10 md:p-12">
        <div className="whitespace-pre-wrap text-slate-700 leading-loose text-[17px] max-h-[700px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-100 pr-4 font-medium">
          {content}
        </div>
      </div>
    </div>
  );
}
