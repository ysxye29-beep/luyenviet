
import { SavedItem, SRSData } from '../types';
import { GoogleGenAI, Schema, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-3-flash-preview';

// SuperMemo-2 inspired simplified algorithm
// Intervals (in days) roughly: 1, 3, 7, 14, 30, 90
export const calculateNextReview = (currentLevel: number, rating: 'again' | 'hard' | 'good' | 'easy'): SRSData => {
  let newLevel = currentLevel;
  let interval = 1;

  switch (rating) {
    case 'again':
      newLevel = 0;
      interval = 0; // Review immediately/tomorrow
      break;
    case 'hard':
      newLevel = Math.max(0, currentLevel - 1);
      interval = newLevel === 0 ? 1 : Math.ceil(Math.pow(1.5, newLevel)); 
      break;
    case 'good':
      newLevel = currentLevel + 1;
      interval = Math.ceil(Math.pow(2.2, newLevel));
      break;
    case 'easy':
      newLevel = currentLevel + 2;
      interval = Math.ceil(Math.pow(3.5, newLevel));
      break;
  }

  // Cap at 6 months
  if (interval > 180) interval = 180;

  const now = Date.now();
  const nextReviewDate = now + (interval * 24 * 60 * 60 * 1000);

  return {
    level: newLevel,
    nextReviewDate,
    lastReviewed: now,
    interval
  };
};

export const getItemsDueForReview = (items: SavedItem[]): SavedItem[] => {
  const now = Date.now();
  return items.filter(item => {
    // If no SRS data, it's new, so review it
    if (!item.srs) return true;
    // Otherwise check date
    return item.srs.nextReviewDate <= now;
  });
};

export const checkPracticeSentence = async (structure: string, userSentence: string): Promise<{ isCorrect: boolean; feedback: string }> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      isCorrect: { type: Type.BOOLEAN },
      feedback: { type: Type.STRING, description: "Feedback in Vietnamese explaining if the structure was used correctly." }
    },
    required: ["isCorrect", "feedback"]
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Check if this sentence correctly uses the structure/word: "${structure}".
      User Sentence: "${userSentence}"
      
      Rules:
      1. Is the target structure/word present?
      2. Is it used grammatically correctly?
      3. Is the sentence meaningful?
      
      Respond in Vietnamese.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response");
    return JSON.parse(jsonText);
  } catch (error) {
    console.error(error);
    return { isCorrect: false, feedback: "Lỗi kết nối AI. Vui lòng thử lại." };
  }
};
