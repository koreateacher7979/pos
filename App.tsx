
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
  MessageSquareHeart,
  ExternalLink,
  Info
} from 'lucide-react';

// AI Studio API Key 관리 인터페이스를 글로벌 스코프로 이동하여 타입 충돌 및 수식어 불일치 해결
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    readonly aistudio: AIStudio;
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
    const init = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    init();
  }, []);

  const handleOpenKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // race condition 방지를 위해 즉시 true로 설정하고 진행
      setHasKey(true);
      setError(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.location || !formData.topic) {
      setError("출강 장소와 강의 주제는 꼭 적어주셔야 정성스러운 글이 나옵니다! 😊");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await generatePosts(formData);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다.");
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
    <div className="min-h-screen bg-[#fffcf9] pb-20 selection:bg-rose-100 selection:text-rose-900">
      
      {/* API Key Banner - 사용자가 키를 설정하지 않았을 때만 표시 */}
      {!hasKey && (
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-3 flex flex-col md:flex-row items-center justify-center gap-4 animate-fade-in relative z-50">
          <div className="flex items-center gap-2 text-amber-800 text-sm font-medium">
            <Info size={18} />
            <span>서비스 이용을 위해 <strong>유료 프로젝트의 API 키</strong>를 활성화해야 합니다.</span>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-700 text-xs flex items-center gap-1 hover:underline"
            >
              결제 문서 보기 <ExternalLink size={12} />
            </a>
            <button 
              onClick={handleOpenKey}
              className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <Key size={14} />
              지금 API 키 활성화하기
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-br from-rose-50 via-white to-orange-50 py-20 px-4 text-center relative overflow-hidden border-b border-orange-100">
        <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
          <div className="absolute top-[-50px] left-[10%] w-72 h-72 bg-rose-200 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-50px] right-[10%] w-80 h-80 bg-orange-100 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="bg-white/90 backdrop-blur-sm px-8 py-3 rounded-full text-rose-500 text-sm font-black border border-rose-100 shadow-xl flex items-center gap-3 transition-transform hover:scale-105">
              <Palette size={20} />
              가치있는 미래교육 연구소 | 대표 김병찬
            </div>
            {hasKey && (
              <button 
                onClick={handleOpenKey}
                className="text-slate-400 hover:text-rose-500 text-xs font-bold transition-all flex items-center gap-1 opacity-60 hover:opacity-100"
              >
                <Key size={12} /> API 키 변경하기
              </button>
            )}
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-800 mb-8 tracking-tight leading-tight">
            대표님의 강의 열정을<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">빛나는 기록</span>으로 ✨
          </h1>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto font-semibold leading-relaxed">
            미술 교사의 마음으로, AI 작가가 정성을 다해<br/>
            최고의 홍보 포스팅을 완성해 드립니다.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Form Section */}
          <div className="lg:col-span-5 bg-white/95 backdrop-blur-2xl rounded-[3.5rem] shadow-2xl p-10 md:p-14 border border-rose-100/50 relative">
            <div className="flex items-center gap-4 mb-12">
              <div className="p-5 bg-rose-50 rounded-[2rem] shadow-inner">
                <MessageSquareHeart size={32} className="text-rose-400 fill-rose-400" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">강의 정보 입력</h2>
            </div>
            
            <div className="space-y-9">
              <InputGroup label="어디로 다녀오셨나요? (출강 장소)" name="location" value={formData.location} onChange={handleInputChange} placeholder="예: 세종시 교육연수원" />
              <InputGroup label="언제 진행하셨나요? (출강 일시)" name="dateTime" value={formData.dateTime} onChange={handleInputChange} placeholder="예: 2024년 6월 15일(목) 오전 10시" />
              <InputGroup label="누구와 함께하셨나요? (강의 대상)" name="target" value={formData.target} onChange={handleInputChange} placeholder="예: 초중등 교장/교감 선생님들" />
              <InputGroup label="주요 내용은 무엇이었나요? (강의 주제)" name="topic" value={formData.topic} onChange={handleInputChange} placeholder="예: 생성형 AI를 활용한 학교 리더십" />
              
              <div className="space-y-3">
                <label className="text-[16px] font-black text-slate-700 flex items-center gap-2 px-2">
                  <Stars size={20} className="text-amber-400" />
                  그날의 특별했던 분위기와 반응
                </label>
                <textarea
                  name="reaction"
                  value={formData.reaction}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-8 py-6 rounded-[2.5rem] border border-slate-100 focus:ring-4 focus:ring-rose-50 focus:border-rose-200 transition-all bg-slate-50/50 text-slate-800 outline-none resize-none placeholder:text-slate-300 font-semibold leading-relaxed"
                  placeholder="교육생들의 눈빛, 뜨거웠던 질문, 대표님께서 느낀 특별한 감정을 들려주세요."
                />
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-500 px-8 py-5 rounded-[2rem] flex items-start gap-3 text-sm font-bold animate-shake">
                  <AlertCircle size={22} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className={`w-full py-7 rounded-[2.5rem] font-black text-white shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 text-2xl flex items-center justify-center gap-4 ${
                  isLoading ? 'bg-slate-300 cursor-not-allowed' : 'bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 hover:from-rose-500 hover:to-amber-500 shadow-rose-200'
                }`}
              >
                {isLoading ? <RefreshCw className="animate-spin" size={32} /> : <Sparkles size={32} />}
                {isLoading ? '작가님이 집필 중...' : '포스팅 마법 생성'}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7 space-y-12">
            {!result && !isLoading && (
              <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-slate-300 py-20 border-4 border-dashed border-rose-50 rounded-[4rem] bg-white/40 backdrop-blur-md">
                <div className="w-32 h-32 bg-rose-50/50 rounded-full flex items-center justify-center mb-10 shadow-inner">
                  <Palette size={64} className="text-rose-200" />
                </div>
                <h3 className="text-3xl font-black text-slate-400 mb-4">멋진 글이 탄생할 공간입니다!</h3>
                <p className="text-center font-bold text-lg opacity-60 leading-relaxed">
                  왼쪽의 강의 정보를 채워주시면<br/>
                  인스타그램과 블로그용 글이 완성됩니다.
                </p>
              </div>
            )}

            {isLoading && (
              <div className="space-y-12">
                <div className="h-64 bg-white/80 rounded-[3.5rem] shadow-sm animate-pulse border border-slate-50"></div>
                <div className="h-[700px] bg-white/80 rounded-[3.5rem] shadow-sm animate-pulse border border-slate-50"></div>
              </div>
            )}

            {result && !isLoading && (
              <div className="space-y-12 animate-fade-in">
                <ResultCard 
                  title="인스타그램 (감성 브랜딩)" 
                  icon={<Instagram size={28} className="text-rose-400" />}
                  content={result.instagram}
                  onCopy={() => handleCopy(result.instagram, 'insta')}
                  onRegenerate={handleGenerate}
                  isCopied={copiedStatus === 'insta'}
                  color="rose"
                  badge="고효율 해시태그 5개"
                />

                <ResultCard 
                  title="네이버 블로그 (검색 최적화 상세형)" 
                  icon={<BookOpen size={28} className="text-emerald-400" />}
                  content={result.naverBlog}
                  onCopy={() => handleCopy(result.naverBlog, 'naver')}
                  onRegenerate={handleGenerate}
                  isCopied={copiedStatus === 'naver'}
                  color="emerald"
                  badge="장문 후기 & 노출 키워드 포함"
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-24 text-center pb-12">
        <div className="flex items-center justify-center gap-3 text-slate-400 font-black mb-2">
          <Heart size={18} className="text-rose-400 fill-rose-400" />
          가치있는 미래교육 연구소
        </div>
        <p className="text-slate-300 text-sm font-bold tracking-widest">© 2024 Kim Byeong-chan. Professional Branding Service.</p>
      </footer>
    </div>
  );
}

function InputGroup({ label, name, value, onChange, placeholder }: any) {
  return (
    <div className="space-y-3">
      <label className="text-[16px] font-black text-slate-700 px-3">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-8 py-5 rounded-[2.5rem] border border-slate-100 focus:ring-4 focus:ring-rose-50 focus:border-rose-200 transition-all bg-slate-50/50 text-slate-800 outline-none font-bold text-lg placeholder:text-slate-300 shadow-sm"
        placeholder={placeholder}
      />
    </div>
  );
}

function ResultCard({ title, icon, content, onCopy, onRegenerate, isCopied, color, badge }: any) {
  const colorClass = color === 'rose' ? 'border-rose-100 shadow-rose-100/30' : 'border-emerald-100 shadow-emerald-100/30';
  const iconBg = color === 'rose' ? 'bg-rose-50' : 'bg-emerald-50';
  
  return (
    <div className={`bg-white rounded-[4rem] shadow-2xl overflow-hidden border ${colorClass} flex flex-col transition-all hover:scale-[1.01]`}>
      <div className="px-12 py-10 bg-slate-50/40 border-b border-slate-50 flex items-center justify-between flex-wrap gap-6">
        <div className="flex items-center gap-5">
          <div className={`p-4 ${iconBg} rounded-[1.5rem] shadow-sm`}>{icon}</div>
          <div>
            <h3 className="font-black text-slate-800 text-2xl tracking-tight">{title}</h3>
            {badge && <span className="text-[12px] font-black text-rose-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-sm mt-1 inline-block">{badge}</span>}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onRegenerate} 
            className="p-4 text-slate-300 hover:text-rose-400 transition-all bg-white rounded-2xl border border-slate-100 shadow-lg" 
            title="다시 작성하기"
          >
            <RefreshCw size={26} />
          </button>
          <button 
            onClick={onCopy}
            className={`flex items-center gap-3 px-10 py-5 rounded-[2rem] font-black transition-all shadow-xl text-lg ${
              isCopied ? 'bg-emerald-400 text-white shadow-emerald-200' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'
            }`}
          >
            {isCopied ? <CheckCircle2 size={24} /> : <Copy size={24} />}
            {isCopied ? '복사 완료!' : '전체 내용 복사'}
          </button>
        </div>
      </div>
      <div className="p-12 md:p-16">
        <div className="whitespace-pre-wrap text-slate-700 leading-loose text-[18px] max-h-[800px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 pr-6 font-semibold">
          {content}
        </div>
      </div>
    </div>
  );
}
