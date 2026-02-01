
import { GoogleGenAI, Type } from "@google/genai";
import { LectureInfo, GenerationResponse } from "./types";

// API 키는 process.env.API_KEY에서 직접 가져옵니다.
const apiKey = process.env.API_KEY || "";

export const generatePosts = async (info: LectureInfo): Promise<GenerationResponse> => {
  const ai = new GoogleGenAI({ apiKey });
  
  // 더 풍성한 결과물을 위해 gemini-3-pro-preview 모델 사용
  const modelName = "gemini-3-pro-preview";

  const prompt = `
    당신은 '가치있는 미래교육연구소' 대표이자 중등 미술교사 출신의 리더십/에듀테크/생성형 AI 전문 강사 김병찬 님의 전담 퍼스널 브랜딩 작가입니다.
    다음 강의 정보를 바탕으로 인스타그램과 네이버 블로그용 홍보 포스팅을 작성해주세요.
    
    [강의 정보]
    - 출강 장소: ${info.location}
    - 출강 일시: ${info.dateTime}
    - 강의 대상: ${info.target}
    - 강의 주제: ${info.topic}
    - 현장 반응 및 특이사항: ${info.reaction}

    [공통 요구사항]
    - 페르소나: 따뜻하고 전문적인 교육 전문가, 디지털 전환을 선도하는 혁신가.
    - 어조: 매우 친근하고 자연스러우며 진정성이 느껴지는 말투.
    - 줄바꿈을 자주 사용하여 모바일에서도 읽기 편하게 가독성을 극대화하세요.

    [인스타그램 포스팅 조건]
    - 감각적이고 세련된 첫 문장으로 시선 강탈.
    - 현장의 에너지가 느껴지는 생생한 묘사.
    - 해시태그는 정확히 5개만 생성 (강의 요청이 많이 들어올 수 있는 고효율 키워드 위주).

    [네이버 블로그 포스팅 조건 - 중요: 분량 대폭 확대]
    - 매우 풍성하고 구체적인 내용을 포함하세요 (최소 1,500자 이상의 긴 호흡).
    - 마치 옆에서 이야기해주는 것처럼 다정한 말투(~해요, ~했어요) 사용.
    - 도입부: 강의를 가게 된 설렘과 장소에 대한 느낌.
    - 본문: 강의 주제의 중요성, 준비 과정, 교육생들과의 호흡, 구체적인 활동 내용 묘사.
    - 현장 반응: 교육생들의 질문이나 반응을 에피소드 형식으로 풍부하게 서술.
    - 마무리: 교육자로서 느끼는 보람과 미래 교육에 대한 가치 전달.
    - 이모티콘(블로그 스티커 느낌)을 문장 사이사이에 아주 풍부하게 사용하여 친근감 유발.
    - 마지막에 네이버 블로그 검색 상위 노출을 위한 최적화 해시태그 10개 이상 포함.

    응답은 반드시 아래 JSON 구조로만 답변하세요:
    {
      "instagram": "인스타그램 포스팅 내용",
      "naverBlog": "네이버 블로그 포스팅 내용"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            instagram: { type: Type.STRING },
            naverBlog: { type: Type.STRING }
          },
          required: ["instagram", "naverBlog"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("API로부터 응답을 받지 못했습니다.");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
