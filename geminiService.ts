
import { GoogleGenAI, Type } from "@google/genai";
import { LectureInfo, GenerationResponse } from "./types";

export const generatePosts = async (info: LectureInfo): Promise<GenerationResponse> => {
  // 호출 시점에 최신 API 키를 반영하기 위해 함수 내에서 인스턴스 생성
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const modelName = "gemini-3-flash-preview";

  const prompt = `
    당신은 '가치있는 미래교육연구소' 대표 김병찬 님의 전담 퍼스널 브랜딩 작가입니다.
    김병찬 대표님은 중등 미술교사 출신의 리더십, 에듀테크, 생성형 AI 전문 강사로 활동 중입니다.
    제공된 강의 정보를 바탕으로 아주 정성스럽고 감각적인 포스팅을 작성해주세요.

    [강의 정보]
    - 장소: ${info.location}
    - 일시: ${info.dateTime}
    - 대상: ${info.target}
    - 주제: ${info.topic}
    - 현장 특징: ${info.reaction}

    [네이버 블로그 포스팅 지침 - 분량 매우 길게]
    1. 어조: 매우 다정하고 친근한 '~해요'체를 사용하세요. 미술 교사 출신답게 감성적이고 시각적인 묘사를 풍부하게 넣어주세요.
    2. 분량: 최소 2,000자 이상의 매우 상세한 정보성 후기글로 작성하세요.
    3. 구성:
       - 도입: 강의 장소로 가는 길의 설렘, 현장의 첫인상, 날씨와 분위기 묘사.
       - 중도 1: 이번 강의 주제를 선정한 이유와 대표님만의 교육 철학(가치있는 미래교육) 소개.
       - 중도 2: 강의 준비 과정에서의 고충과 열정, 사용한 디지털 도구(AI 등)의 구체적인 활용법 설명.
       - 중도 3: '현장 특징'을 바탕으로 교육생들과 소통한 구체적인 에피소드(질문, 웃음 소리, 눈빛 등)를 아주 생생하게 서술.
       - 마무리: 교육자로서 느낀 깊은 보람과 미래 교육에 대한 대표님의 진심 어린 생각 전달.
    4. 비주얼: 문장 사이사이에 블로그 스티커를 대신할 귀엽고 따뜻한 이모티콘(🌸, ✨, 💻, 🎨, 🌈, 💡 등)을 매우 많이 사용하세요.
    5. 가독성: 가독성을 위해 한 문장을 짧게 끊고, 줄바꿈을 아주 자주 해주세요.
    6. 해시태그: 하단에 네이버 검색 노출에 최적화된 고성능 해시태그 15개 이상 포함.

    [인스타그램 포스팅 지침]
    1. 첫 줄에 시선을 끄는 감각적인 문장 배치.
    2. 현장의 열기를 요약해서 전달.
    3. 해시태그는 정확히 5개만 엄선 (강의 의뢰가 들어올 수 있는 핵심 키워드).

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
  } catch (error: any) {
    console.error("API Call Error:", error);
    if (error.message?.includes("entity was not found")) {
      throw new Error("API 키가 활성화되지 않았습니다. 상단의 'API 키 활성화' 버튼을 눌러주세요!");
    }
    throw new Error("작성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요!");
  }
};
