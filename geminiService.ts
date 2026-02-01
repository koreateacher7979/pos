
import { GoogleGenAI, Type } from "@google/genai";
import { LectureInfo, GenerationResponse } from "./types";

export const generatePosts = async (info: LectureInfo): Promise<GenerationResponse> => {
  // 호출 시점에 API 키를 가져와 인스턴스를 생성하여 안정성을 높입니다.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  // 가성비와 속도, 안정성이 뛰어난 gemini-3-flash-preview 사용
  const modelName = "gemini-3-flash-preview";

  const prompt = `
    당신은 '가치있는 미래교육연구소' 대표 김병찬 님의 전담 퍼스널 브랜딩 작가입니다.
    김병찬 님은 중등 미술교사 출신의 리더십, 에듀테크, 생성형 AI 전문 강사입니다.
    다음 정보를 바탕으로 인스타그램과 네이버 블로그용 포스팅을 작성하세요.

    [강의 정보]
    - 장소: ${info.location}
    - 일시: ${info.dateTime}
    - 대상: ${info.target}
    - 주제: ${info.topic}
    - 특징: ${info.reaction}

    [네이버 블로그 포스팅 지침 - 분량 최대화]
    1. 어조: 옆에서 다정하게 이야기하는 듯한 '해요체'를 사용하고, 미술 교사 특유의 미적 감수성이 느껴지는 풍부한 형용사를 사용하세요.
    2. 서론: 강의를 준비하며 느꼈던 설렘, 그날의 날씨나 장소의 첫인상을 묘사하며 자연스럽게 시작하세요.
    3. 본론: 강의 주제가 왜 중요한지, 김병찬 대표님만의 특별한 교수법이나 철학이 어떻게 반영되었는지 아주 상세하게 설명하세요. (최소 3~4개 문단 이상)
    4. 에피소드: '현장 반응' 내용을 바탕으로 교육생과의 인터뷰나 특별한 순간을 소설처럼 생생하게 그려내세요.
    5. 결론: 오늘 강의를 통해 얻은 보람과 미래 교육에 대한 대표님의 진심 어린 다짐을 적으세요. 다음 강의 문의를 환영한다는 따뜻한 초대 멘트도 잊지 마세요.
    6. 이모티콘: 네이버 블로그 느낌이 나도록 문장 끝마다 적절한 이모티콘(🌸, ✨, 💻, 🎨 등)을 아끼지 말고 넣어주세요.
    7. 가독성: 한 문장이 너무 길지 않게 줄바꿈을 자주 해주세요.
    8. 해시태그: 하단에 노출 최적화 키워드 10개 이상 포함.

    [인스타그램 포스팅 지침]
    1. 첫 문장은 짧고 강렬하게 (Hooking).
    2. 핵심 내용을 이모티콘과 함께 요약.
    3. 해시태그는 정확히 5개 (노출 최적화 키워드).

    반드시 아래 JSON 형식으로만 응답하세요:
    {
      "instagram": "내용",
      "naverBlog": "내용"
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

    const result = JSON.parse(response.text || "{}");
    return result;
  } catch (error) {
    console.error("API Call Error:", error);
    throw new Error("작성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요!");
  }
};
