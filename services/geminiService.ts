import { GoogleGenAI, Type } from "@google/genai";
import { Deity, Tier, GeminiResponse } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getDivineGuidance = async (
  deity: Deity,
  wish: string,
  totalDonation: number
): Promise<GeminiResponse> => {
  if (!apiKey) {
    // Fallback for development if no key is present
    return {
      prediction: "心诚则灵，万事胜意。",
      guidance: "API Key未配置，请配置后重试。今日宜修身养性。",
      luckyNumber: 8,
    };
  }

  const modelId = "gemini-2.5-flash";
  
  const systemInstruction = `
    你现在扮演一位中国传统神仙或庙祝（根据用户选择的神仙：${deity.name}）。
    用户正在进行“手机烧香”祈福。
    
    用户的愿望是：${wish || "祈求平安顺遂"}。
    用户供奉的香火钱总额是：${totalDonation}元。

    请根据供奉金额的多少（金额越高，语气越赞赏，但都要保持慈悲），以及愿望的内容，给出一份签文反馈。
    
    返回格式必须是JSON对象，包含以下字段：
    1. prediction (string): 类似签文的四句或八句诗词，古风。
    2. guidance (string): 对签文的白话解释，以及对用户的建议（风趣幽默又不失庄重）。
    3. luckyNumber (integer): 一个1-99的幸运数字。
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: "请赐予签文。",
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prediction: { type: Type.STRING },
            guidance: { type: Type.STRING },
            luckyNumber: { type: Type.INTEGER },
          },
          required: ["prediction", "guidance", "luckyNumber"]
        }
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response");
    
    return JSON.parse(text) as GeminiResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      prediction: "云深不知处，稍后再试。",
      guidance: "网络连接似乎有些波动，神仙正在赶来的路上。请稍后再试。",
      luckyNumber: 6,
    };
  }
};
