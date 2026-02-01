
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
  Mic2,
  AlertCircle
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
      setError("출강 장소와 강의 주제는 필수 입력 사항입니다. 😊");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await generatePosts(formData);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("글을 생성하는 중에 문제가 발생했어요. 잠시 후 다시 시도해주세요. (API Key 확인 필요)");
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
    <div className="min-h-screen bg-[#f9fbf9] pb-20">
      {/* Header & Branding - More Friendly Colors */}
      <header className="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 text-white py-14 px-4 shadow-md text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-40px] left-1/4 w-96 h-96 bg-yellow-200 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-40px] right-1/4 w-96 h-96 bg-pink-200 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-xl px-5 py-2 rounded-full text-sm font-bold mb-6 border border-white/40 shadow-sm animate-bounce">
            <Palette size={16} />
            개발자: 가치있는 미래교육 연구소 대표 김병찬
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight drop-shadow-sm flex items-center justify-center gap-3">
            <Sparkles className="text-yellow-300" />
            감성 가득 강의 포스팅 매니저
            <Sparkles className="text-yellow-300" />
          </h1>
          <p className="text-emerald-50 text-lg opacity-95 max-w-2xl mx-auto font-medium leading-relaxed">
            미술 교사의 감성과 AI의 스마트함이 만났습니다.<br/>
            오늘의 소중한 강의 기록을 가장 빛나게 만들어드릴게요! ✨
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Section */}
          <div className="lg:col-span-5 bg-white rounded-[2rem] shadow-2xl p-8 md:p-10 border border-emerald-50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
               <Mic2 size={120} />
            </div>
            
            <div className="flex items-center gap-3 mb-10 text-emerald-700 border-b border-emerald-100 pb-5">
              <div className="p-3 bg-emerald-50 rounded-2xl">
                <Heart size={24} className="fill-emerald-500 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold">강의 이야기 들려주기</h2>
            </div>
            
            <div className="space-y-7">
              <InputGroup label="어디에서 강의하셨나요?" name="location" value={formData.location} onChange={handleInputChange} placeholder="예: 세종특별자치시 교육청" icon={<Palette size={16}/>} />
              <InputGroup label="언제 다녀오셨나요?" name="dateTime" value={formData.dateTime} onChange={handleInputChange} placeholder="예: 2024년 6월 15일 화요일" icon={<Sparkles size={16}/>} />
              <InputGroup label="누구를 만나셨나요?" name="target" value={formData.target} onChange={handleInputChange} placeholder="예: 혁신 성장을 꿈꾸는 초임 교사들" icon={<Heart size={16}/>} />
              <InputGroup label="어떤 주제로 소통하셨나요?" name="topic" value={formData.topic} onChange={handleInputChange} placeholder="예: AI 시대를 여는 창의적 리더십" icon={<Mic2 size={16}/>} />
              
              <div className="space-y-3">
                <label className="text-[15px] font-bold text-slate-700 flex items-center gap-2 px-1">
                  강의 현장의 특별한 분위기는 어땠나요?
                </label>
                <textarea
                  name="reaction"
                  value={formData.reaction}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all bg-slate-50 text-slate-800 outline-none resize-none placeholder:text-slate-400"
                  placeholder="교육생들의 눈빛, 뜨거웠던 질문, 감사한 피드백 등을 자유롭게 적어주세요."
                />
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 px-5 py-3 rounded-xl flex items-center gap-3 text-sm animate-shake">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className={`w-full py-5 rounded-2xl font-extrabold text-white shadow-xl shadow-emerald-200/50 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 active:scale-95 text-lg ${
                  isLoading ? 'bg-slate-300' : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'
                }`}
              >
                {isLoading ? (
                  <RefreshCw className="animate-spin" size={24} />
                ) : (
                  <Sparkles size={24} />
                )}
                {isLoading ? '작가님이 정성껏 작성 중...' : '마법같은 포스팅 생성'}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7 space-y-8">
            {!result && !isLoading && (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-slate-400 py-20 border-3 border-dashed border-emerald-100 rounded-[2.5rem] bg-white/70 backdrop-blur-sm">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                   <Sparkles size={40} className="text-emerald-300 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-slate-600 mb-2">포스팅 준비 완료!</h3>
                <p className="text-center font-medium leading-relaxed">
                  강의 내용을 입력하시면<br/>
                  멋진 인스타그램과 블로그 글이 나타납니다.
                </p>
              </div>
            )}

            {isLoading && (
              <div className="space-y-8 animate-pulse">
                <div className="h-80 bg-white rounded-[2rem] shadow-md border border-slate-100"></div>
                <div className="h-[500px] bg-white rounded-[2rem] shadow-md border border-slate-100"></div>
              </div>
            )}

            {result && !isLoading && (
              <div className="space-y-8">
                {/* Instagram Result */}
                <ResultCard 
                  title="인스타그램 (Insta)" 
                  icon={<div className="p-2 bg-pink-50 rounded-xl"><Instagram size={24} className="text-pink-600" /></div>}
                  content={result.instagram}
                  onCopy={() => handleCopy(result.instagram, 'insta')}
                  onRegenerate={handleGenerate}
                  isCopied={copiedStatus === 'insta'}
                  badge="인기 해시태그 5개 포함"
                  color="border-pink-100"
                />

                {/* Naver Blog Result */}
                <ResultCard 
                  title="네이버 블로그 (Naver Blog)" 
                  icon={<div className="p-2 bg-green-50 rounded-xl"><BookOpen size={24} className="text-green-600" /></div>}
                  content={result.naverBlog}
                  onCopy={() => handleCopy(result.naverBlog, 'naver')}
                  onRegenerate={handleGenerate}
                  isCopied={copiedStatus === 'naver'}
                  badge="긴 호흡 & 검색 최적화"
                  color="border-green-100"
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-20 text-center py-10">
        <div className="flex items-center justify-center gap-2 text-slate-400 mb-2 font-semibold">
           <Heart size={16} className="text-emerald-500 fill-emerald-500" />
           가치있는 미래교육 연구소
        </div>
        <p className="text-slate-300 text-xs">© 2024 Kim Byeong-chan. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// Helper Components
interface InputGroupProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon?: React.ReactNode;
}

function InputGroup({ label, name, value, onChange, placeholder, icon }: InputGroupProps) {
  return (
    <div className="space-y-3">
      <label className="text-[15px] font-bold text-slate-700 flex items-center gap-2 px-1">
        {icon && <span className="text-emerald-500">{icon}</span>}
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all bg-slate-50 text-slate-800 outline-none font-medium placeholder:text-slate-400"
        placeholder={placeholder}
      />
    </div>
  );
}

interface ResultCardProps {
  title: string;
  icon: React.ReactNode;
  content: string;
  onCopy: () => void;
  onRegenerate: () => void;
  isCopied: boolean;
  badge?: string;
  color?: string;
}

function ResultCard({ title, icon, content, onCopy, onRegenerate, isCopied, badge, color }: ResultCardProps) {
  return (
    <div className={`bg-white rounded-[2.5rem] shadow-xl overflow-hidden border ${color || 'border-slate-100'} flex flex-col transition-all hover:shadow-2xl`}>
      <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          {icon}
          <div>
            <h3 className="font-extrabold text-slate-800 text-lg">{title}</h3>
            {badge && (
              <span className="text-emerald-600 text-[11px] font-bold uppercase tracking-wider">
                {badge}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onRegenerate}
            className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all"
            title="다시 생성"
          >
            <RefreshCw size={20} />
          </button>
          <button 
            onClick={onCopy}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold transition-all shadow-sm ${
              isCopied ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {isCopied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
            {isCopied ? '복사 완료!' : '전체 복사'}
          </button>
        </div>
      </div>
      <div className="p-8 md:p-10 bg-white flex-1">
        <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-[16px] scrollbar-thin scrollbar-thumb-emerald-100 scrollbar-track-transparent pr-2 max-h-[600px] overflow-y-auto">
          {content}
        </div>
      </div>
    </div>
  );
}
