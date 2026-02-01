
import { GoogleGenAI, Type } from "@google/genai";
import { LectureInfo, GenerationResponse } from "./types";

const apiKey = process.env.API_KEY || "";

export const generatePosts = async (info: LectureInfo): Promise<GenerationResponse> => {
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    당신은 '가치있는 미래교육연구소' 대표 김병찬 님의 전담 퍼스널 브랜딩 작가입니다.
    다음 강의 정보를 바탕으로 인스타그램과 네이버 블로그용 홍보 포스팅을 작성해주세요.
    
    [강의 정보]
    - 출강 장소: ${info.location}
    - 출강 일시: ${info.dateTime}
    - 강의 대상: ${info.target}
    - 강의 주제: ${info.topic}
    - 현장 반응 및 특이사항: ${info.reaction}

    [공통 요구사항]
    - 작성자 페르소나: 중등 미술교사 출신, 리더십/에듀테크/생성형 AI 전문 강사 김병찬.
    - 목적: 강의 현장의 생생함을 전달하고, 다음 강의 의뢰를 유도하는 세련된 홍보.
    - 줄바꿈을 적절히 사용하여 가독성을 극대화하세요.

    [인스타그램 포스팅 조건]
    - 감각적이고 트렌디한 어조.
    - 본문은 핵심 위주로 짧고 강렬하게.
    - 해시태그는 정확히 5개만 생성 (가장 노출이 잘 되고 강의 요청이 들어올만한 키워드로 선별).

    [네이버 블로그 포스팅 조건]
    - 서론, 본론, 결론 구분 없이 자연스럽고 친근한 이야기 형태.
    - 이모티콘을 풍부하게 사용하여 친근감 유발.
    - 정성스럽고 전문적인 느낌을 동시에 주어 신뢰감 형성.
    - 마지막에 블로그 검색 노출에 최적화된 해시태그 10개 내외 포함.

    응답은 반드시 아래 JSON 구조로만 답변하세요:
    {
      "instagram": "인스타그램 포스팅 내용",
      "naverBlog": "네이버 블로그 포스팅 내용"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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

    const result = JSON.parse(response.text || "{}");
    return result;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("포스팅 생성 중 오류가 발생했습니다.");
  }
};
