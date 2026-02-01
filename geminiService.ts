
import { GoogleGenAI, Type } from "@google/genai";
import { LectureInfo, GenerationResponse } from "./types";

export const generatePosts = async (info: LectureInfo): Promise<GenerationResponse> => {
  // 요청 시점에 최신 API 키를 반영하기 위해 함수 내부에서 인스턴스 생성
  // 가이드라인: process.env.API_KEY를 직접 사용
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  // 복잡한 텍스트 생성(전문 브랜딩 원고)을 위해 gemini-3-pro-preview 사용
  const modelName = "gemini-3-pro-preview";

  const prompt = `
    당신은 '가치있는 미래교육연구소' 대표 김병찬 님의 전담 퍼스널 브랜딩 작가입니다.
    김병찬 대표님은 중등 미술교사 출신의 리더십, 에듀테크, 생성형 AI 전문 강사입니다.
    제공된 강의 정보를 바탕으로 아주 정성스럽고 감각적인 포스팅을 작성해주세요.

    [강의 정보]
    - 장소: ${info.location}
    - 일시: ${info.dateTime}
    - 대상: ${info.target}
    - 주제: ${info.topic}
    - 현장 특징: ${info.reaction}

    [네이버 블로그 포스팅 지침 - 분량 최대화 & 노출 최적화]
    1. 어조: 매우 다정하고 친근한 '~해요'체를 사용하세요. 미술 교사 출신답게 감성적이고 시각적인 묘사를 풍부하게 넣어주세요.
    2. 분량: 최소 2,500자 이상의 매우 상세한 정보성 후기글로 작성하세요.
    3. 구성:
       - 도입: 강의 장소로 가는 길의 설렘, 그날의 날씨와 현장의 첫인상 묘사.
       - 본론 1: 이번 강의 주제의 핵심 가치와 '가치있는 미래교육연구소'가 추구하는 방향성 설명.
       - 본론 2: 강의 준비 과정에서의 열정과 사용한 디지털 도구/AI 기술의 구체적인 활용 사례.
       - 본론 3: '현장 특징'을 바탕으로 교육생들과 소통한 구체적인 에피소드와 감사한 마음을 소설처럼 생생하게 서술.
       - 마무리: 교육자로서 느낀 보람과 미래 교육에 대한 진심 어린 다짐. 다음 강의 문의 환영 멘트.
    4. 비주얼: 문장 사이사이에 블로그 스티커를 대신할 귀엽고 따뜻한 이모티콘을 아주 많이 사용하세요.
    5. 가독성: 가독성을 위해 한 문장을 짧게 끊고, 줄바꿈을 매우 자주 해주세요.
    6. **해시태그 (필수)**: 글의 가장 마지막 부분에 네이버 블로그 검색 상위 노출을 위한 최적화 해시태그를 15개 이상 '공백'으로 구분하여 나열하세요. 
       (예: #가치있는미래교육연구소 #김병찬강사 #리더십강의 #에듀테크 #AI교육 ...)

    [인스타그램 포스팅 지침]
    1. 첫 줄에 시선을 끄는 감각적인 문장 배치.
    2. 현장의 열기를 요약해서 전달.
    3. 해시태그는 정확히 5개만 엄선하여 하단에 배치.

    반드시 아래 JSON 형식으로만 응답하세요:
    {
      "instagram": "인스타그램 내용",
      "naverBlog": "네이버 블로그 내용 (해시태그 포함)"
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
    if (error.message?.includes("entity was not found") || error.message?.includes("API_KEY")) {
      throw new Error("API 키가 활성화되지 않았거나 권한이 없습니다. 상단의 'API 키 활성화' 버튼을 눌러주세요!");
    }
    throw new Error("작가님이 글을 쓰는 도중 잠시 펜을 놓쳤네요. '다시 생성' 버튼을 눌러주세요! 🙏");
  }
};
