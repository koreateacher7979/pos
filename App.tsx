
import React, { useState, useCallback } from 'react';
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
  Info
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
      alert("출강 장소와 강의 주제는 필수 입력 사항입니다.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await generatePosts(formData);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류 발생");
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
    <div className="min-h-screen pb-20">
      {/* Header & Branding */}
      <header className="bg-gradient-to-r from-indigo-700 via-blue-800 to-indigo-900 text-white py-12 px-4 shadow-lg text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-50px] right-[-50px] w-80 h-80 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-white/30 tracking-wider animate-pulse">
            개발자: 가치있는 미래교육 연구소 대표 김병찬
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-md">
            감각적인 강의 포스팅 생성기
          </h1>
          <p className="text-indigo-100 text-lg opacity-90 max-w-2xl mx-auto font-light leading-relaxed">
            리더십, 에듀테크, 생성형 AI 전문가를 위한<br/>
            노출 최적화 맞춤형 콘텐츠 제작 솔루션
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Section */}
          <div className="lg:col-span-5 bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
            <div className="flex items-center gap-2 mb-8 text-indigo-700 border-b pb-4">
              <Sparkles size={24} />
              <h2 className="text-xl font-bold">강의 정보 입력</h2>
            </div>
            
            <div className="space-y-6">
              <InputGroup label="출강 장소" name="location" value={formData.location} onChange={handleInputChange} placeholder="예: 삼성전자 인재개발원" />
              <InputGroup label="출강 일시" name="dateTime" value={formData.dateTime} onChange={handleInputChange} placeholder="예: 2024년 5월 20일 오후 2시" />
              <InputGroup label="강의 대상" name="target" value={formData.target} onChange={handleInputChange} placeholder="예: 임직원 50명, 중학교 교사" />
              <InputGroup label="강의 주제" name="topic" value={formData.topic} onChange={handleInputChange} placeholder="예: 생성형 AI를 활용한 생산성 혁신" />
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <Info size={14} className="text-indigo-500"/>
                  현장 반응 및 특이사항
                </label>
                <textarea
                  name="reaction"
                  value={formData.reaction}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 text-slate-800 outline-none resize-none"
                  placeholder="강의장 분위기, 특별했던 질문, 학습자 피드백 등을 입력하세요."
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 ${
                  isLoading ? 'bg-slate-400' : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700'
                }`}
              >
                {isLoading ? (
                  <RefreshCw className="animate-spin" size={20} />
                ) : (
                  <Send size={20} />
                )}
                {isLoading ? '생성 중...' : '포스팅 생성하기'}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7 space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
                <span className="font-bold">Error:</span> {error}
              </div>
            )}

            {!result && !isLoading && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
                <Sparkles size={48} className="mb-4 opacity-20" />
                <p className="text-center font-medium">강의 정보를 입력하고<br/>버튼을 클릭하여 포스팅을 생성해보세요.</p>
              </div>
            )}

            {isLoading && (
              <div className="space-y-6 animate-pulse">
                <div className="h-64 bg-slate-200 rounded-2xl"></div>
                <div className="h-64 bg-slate-200 rounded-2xl"></div>
              </div>
            )}

            {result && !isLoading && (
              <>
                {/* Instagram Result */}
                <ResultCard 
                  title="Instagram Post" 
                  icon={<Instagram size={20} className="text-pink-600" />}
                  content={result.instagram}
                  onCopy={() => handleCopy(result.instagram, 'insta')}
                  onRegenerate={handleGenerate}
                  isCopied={copiedStatus === 'insta'}
                  badge="해시태그 5개 엄선"
                />

                {/* Naver Blog Result */}
                <ResultCard 
                  title="Naver Blog Post" 
                  icon={<BookOpen size={20} className="text-green-600" />}
                  content={result.naverBlog}
                  onCopy={() => handleCopy(result.naverBlog, 'naver')}
                  onRegenerate={handleGenerate}
                  isCopied={copiedStatus === 'naver'}
                  badge="검색 최적화 로직"
                />
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-12 text-center text-slate-400 text-sm">
        <p>&copy; 2024 가치있는 미래교육 연구소. All Rights Reserved.</p>
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
}

function InputGroup({ label, name, value, onChange, placeholder }: InputGroupProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
        <CheckCircle2 size={14} className="text-indigo-500" />
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 text-slate-800 outline-none"
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
}

function ResultCard({ title, icon, content, onCopy, onRegenerate, isCopied, badge }: ResultCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 flex flex-col group transition-all hover:shadow-xl">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="font-bold text-slate-800">{title}</h3>
          {badge && (
            <span className="bg-indigo-50 text-indigo-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onRegenerate}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="다시 생성"
          >
            <RefreshCw size={18} />
          </button>
          <button 
            onClick={onCopy}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-bold text-sm transition-all ${
              isCopied ? 'bg-green-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {isCopied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
            {isCopied ? '복사됨' : '전체 복사'}
          </button>
        </div>
      </div>
      <div className="p-6 bg-white flex-1">
        <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-[15px] max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 pr-2">
          {content}
        </div>
      </div>
    </div>
  );
}
