
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TaskType, FeedbackResult, SentenceImprovement, InlineSuggestion, OutlineSection, DictionaryResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-3-flash-preview';

export const lookupWord = async (word: string): Promise<DictionaryResult> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      word: { type: Type.STRING },
      phonetic: { type: Type.STRING },
      definition: { type: Type.STRING },
      example: { type: Type.STRING },
      vietnameseDefinition: { type: Type.STRING },
    },
    required: ["word", "phonetic", "definition", "example", "vietnameseDefinition"],
  };

  const systemInstruction = `ACT AS A B1-C1 ENGLISH DICTIONARY. 
  Lookup the word: "${word}".
  Provide:
  1. The word.
  2. Phonetic (IPA).
  3. Simple English definition.
  4. A clear example sentence in English.
  5. Vietnamese definition (meaning).
  
  Keep it concise and accurate for English learners.
  Return JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Lookup word: "${word}"`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.2,
      }
    });

    return JSON.parse(response.text) as DictionaryResult;
  } catch (error) {
    console.error("Dictionary error:", error);
    throw error;
  }
};

export const generateWritingTask = async (type: TaskType): Promise<string> => {
  // Updated list based on the user's curriculum image (Modules 1-6)
  const ALLOWED_TOPICS = [
    "Animals (pets, wildlife, zoos, protecting animals)", 
    "Customs and Traditions (festivals, celebrations, weddings, special days)", 
    "History (historical figures, old buildings, past events, museums)", 
    "Transport (public transport, private cars, travelling, traffic)", 
    "Environment (pollution, recycling, climate change, nature)", 
    "Health and Fitness (sports, diet, sleep, exercise, healthy lifestyle)"
  ];

  const ESSAY_TYPES = [
    "Discussion essay: Discuss advantages and disadvantages",
    "Opinion essay: Do you agree or disagree? To what extent?",
    "Problem-Solution essay: Describe problems and suggest solutions",
    "Cause-Effect essay: Describe causes and consequences"
  ];

  const systemInstruction = `You are an expert Cambridge and Vstep Writing examiner. 
  
  STRICT CONSTRAINTS:
  1. The task topic MUST be chosen strictly from this list: ${ALLOWED_TOPICS.join(', ')}.
  2. The output must be ONLY the prompt text.

  IF TASK TYPE IS 'informal_letter':
  - Create a standard B1 Part 1 task.
  - TONE: STRICTLY INFORMAL. Use casual language, contractions (e.g., I'm, it's), and friendly openings/closings.
  - Context: You received an email/letter from your English friend (e.g., Jane, Alex, Sam).
  - Content: Provide a short text box snippet of their letter.
  - The friend's letter must ask 3 distinct questions or mention 3 points the student needs to respond to regarding the chosen topic.
  - Format Example:
    You received an email from your English friend, Alex. Read part of the email below.
    "I'm so happy to hear you are learning about [Topic]. [Question 1]? [Question 2]? Also, [Question 3]?"
    Write an email answering Alex. Write about 120-150 words.

  IF TASK TYPE IS 'essay':
  - This is a FULL ESSAY task according to Vstep standards.
  - Target Length: At least 250 words.
  - Time Limit: 40 minutes.
  - Type: Choose exactly ONE from: ${ESSAY_TYPES.join(', ')}.
  - Structure required: Introduction (Background + Thesis), Body Paragraphs (using reasons and examples), and Conclusion.
  - Example: "Online shopping has grown rapidly recently. Write an essay to discuss the advantages and disadvantages of online shopping. You should write at least 250 words."

  IF TASK TYPE IS 'translation':
  - Generate a cohesive paragraph in VIETNAMESE (Tiếng Việt) about the chosen topic.
  - Length: Approximately 4-6 sentences (around 80-100 words).
  - Level: The vocabulary and grammar required to translate it should be appropriate for B1/B2 level.
  - The output must be purely the Vietnamese text to be translated.
  `;

  try {
    let taskRequest = "";
    if (type === TaskType.InformalLetter) taskRequest = "Part 1 Informal Letter task";
    else if (type === TaskType.Essay) taskRequest = "Part 2 Paragraph task";
    else taskRequest = "Vietnamese to English Translation task";

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Generate a ${taskRequest}. Pick a random topic from the allowed list.`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.95,
      }
    });
    
    return response.text || "Failed to generate prompt. Please try again.";
  } catch (error) {
    console.error("Error generating task:", error);
    throw new Error("Could not generate a writing task.");
  }
};

export const generateModelAnswer = async (type: TaskType, prompt: string): Promise<string> => {
  const systemInstruction = `You are a B1/B2 English Writing Tutor.
  Task: Write a PERFECT sample answer for the student's prompt.
  
  Constraints:
  1. Level: B1 to B2 level. Correct grammar, varied vocabulary (collocations), complex sentences.
  2. Length: 
     - If Informal Letter: 120-150 words.
     - If Essay: Approximately 250 words.
  3. Tone:
     - If Informal Letter: Very friendly, use contractions (I'm, can't), refer to the questions in the prompt.
     - If Essay: Professional Vstep structure (Introduction with Thesis, 2 Body Paragraphs with topic sentences/support/examples, Conclusion with summary/opinion). Formal/Academic tone.
     - If Translation: Provide the correct English translation.
  
  Output: JUST the sample text. No explanations.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Task Type: ${type}\nPrompt: "${prompt}"\n\nWrite the model answer now.`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });
    
    return response.text || "Could not generate sample.";
  } catch (error) {
    console.error("Error generating model answer:", error);
    return "Could not generate sample answer at this time.";
  }
};

// Internal function to get just the analysis (without sample answer) for speed
const analyzeWritingContent = async (type: TaskType, prompt: string, userText: string): Promise<Omit<FeedbackResult, 'sampleVersion'>> => {
  // Schema excluding sampleVersion to save token generation time
  const analysisSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.NUMBER, description: "Score 0-10 based on Vstep/B1 criteria." },
      generalComment: { type: Type.STRING, description: "Feedback on Content, Organization (Task Fulfilment, Coherence), Vocabulary and Grammar (in English)." },
      improvedVersion: { 
        type: Type.STRING, 
        description: "A rewritten version of the User's text. Fix ALL grammar errors and improve flow. For essays, ensure it meets the target length (250 words) and structure if the original was too short. Keep internal meaning similar." 
      },
      grammarCorrections: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            original: { type: Type.STRING },
            correction: { type: Type.STRING },
            explanation: { type: Type.STRING, description: "Explain the error in VIETNAMESE." },
            grammarStructure: { type: Type.STRING, description: "The grammatical formula/structure. e.g. 'S + V(ed)' or 'Adj + enough + to V'" }
          }
        }
      },
      betterVocabulary: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Better word choices." },
      structureFeedback: { type: Type.STRING, description: "Comments on sentence structure or flow (in English)." },
      markupText: { 
        type: Type.STRING, 
        description: "The full user text with inline tags for corrections. Format: [type|original|correction]. Example: 'It [grammar|make|makes] me happy.'" 
      }
    },
    required: ["score", "generalComment", "improvedVersion", "grammarCorrections", "betterVocabulary", "structureFeedback", "markupText"]
  };

  const systemInstruction = `You are an expert Vstep (B1-B2-C1) English writing examiner.
  Evaluation standards:
  - Task Fulfillment: Address all parts of the task, required length.
  - Organization: Logical paragraphs, topic sentences, clear introduction and conclusion. Use of cohesive devices.
  - Vocabulary: Use of collocations, varied word choice, few errors.
  - Grammar: Range of complex structures (passive voice, conditionals, relative clauses), accurate spelling/punctuation.

  TARGET LENGTH:
  - INFORMAL LETTER: ~120-150 words.
  - ESSAY: ~250 words.
  
  TASK TYPE: ${type}
  
  CRITICAL INSTRUCTION FOR MARKUP TAGGING (IMPORTANT):
  1. 'markupText' MUST be the User's original text with inline tags inserted where errors occur.
  2. GRANULARITY: You must ONLY wrap the specific words that are incorrect. Do NOT wrap surrounding correct words.
     - WRONG: [grammar|makes young generation gradually lost|makes the younger generation gradually lose]
     - CORRECT: makes [grammar|young|the younger] generation gradually [grammar|lost|lose]
  3. LENGTH LIMIT: DO NOT tag more than 5-8 words in a single block. If a whole sentence is awkward, mark only the key grammatical errors. If the sentence needs a total rewrite, do NOT use markup on the whole sentence; instead, provide the better version in the 'improvedVersion' field.
  4. Format: [type|original_text|correction_text]
     - Types: 'grammar', 'vocab', 'spelling'.
  
  PUNCTUATION AND FORMATTING RULES:
  1. IGNORE whitespace errors before punctuation.
  2. IGNORE double spaces.
  3. ONLY correct punctuation when it is grammatically necessary.
  
  LANGUAGE:
  - 'explanation' fields MUST be in VIETNAMESE.
  
  IF TRANSLATION:
  - Source: "${prompt}"
  - User: "${userText}"
  - Evaluate accuracy and naturalness.
  
  IF WRITING (INFORMAL LETTER):
  - Check for INFORMAL tone (contractions, casual vocabulary).
  
  Return JSON feedback.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Evaluate this writing/translation task.`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.4, // Lower temperature for faster, more deterministic analysis
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");
    
    return JSON.parse(jsonText) as Omit<FeedbackResult, 'sampleVersion'>;
  } catch (error) {
    console.error("Error analyzing writing:", error);
    throw error;
  }
};

export const evaluateWriting = async (type: TaskType, prompt: string, userText: string): Promise<FeedbackResult> => {
  try {
    // Run Analysis AND Sample Generation in PARALLEL to speed up the process
    // This reduces the total wait time to max(analysis_time, sample_time) instead of sum(both)
    const [analysisResult, sampleVersion] = await Promise.all([
      analyzeWritingContent(type, prompt, userText),
      generateModelAnswer(type, prompt)
    ]);

    // Merge the results
    return {
      ...analysisResult,
      sampleVersion: sampleVersion
    };

  } catch (error) {
    console.error("Error in parallel evaluation:", error);
    throw new Error("Could not evaluate your writing at this time.");
  }
};

export const improveSentence = async (text: string): Promise<SentenceImprovement> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      original: { type: Type.STRING },
      improved: { type: Type.STRING },
      explanation: { type: Type.STRING, description: "Explain why it was improved in VIETNAMESE." },
      highlightedChanges: { type: Type.ARRAY, items: { type: Type.STRING } },
      diffMarkup: { 
        type: Type.STRING, 
        description: "Show changes inline using [-removed-] and {+added+}. BE PRECISE." 
      },
      spellingCorrections: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            original: { type: Type.STRING },
            correction: { type: Type.STRING },
            explanation: { type: Type.STRING }
          }
        }
      }
    },
    required: ["original", "improved", "explanation", "highlightedChanges", "diffMarkup"]
  };

  const systemInstruction = `B1 English Tutor. Improve the sentence to be grammatically correct and sound natural. 
  
  DIFF MARKUP RULES:
  - Be extremely granular. Only mark changed words.
  - Keep correct words outside the markup.
  - BAD: [-makes young generation gradually lost-]{+makes the younger generation gradually lose+}
  - GOOD: makes [-young-]{+the younger+} generation gradually [-lost-]{+lose+}
  
  PUNCTUATION: Ignore spacing errors like "word ."
  IMPORTANT: The explanation must be in VIETNAMESE.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Improve: "${text}"`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response");
    
    return JSON.parse(jsonText) as SentenceImprovement;
  } catch (error) {
    console.error("Error improving sentence:", error);
    throw new Error("Could not improve sentence.");
  }
};

export const quickCheckText = async (text: string): Promise<InlineSuggestion[]> => {
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        original: { type: Type.STRING },
        replacement: { type: Type.STRING },
        type: { type: Type.STRING, enum: ['grammar', 'spelling', 'vocabulary'] },
        reason: { type: Type.STRING, description: "Explain the error in VIETNAMESE." },
        grammarStructure: { type: Type.STRING, description: "The grammar formula. e.g. 'S + V + O'" }
      },
      required: ["id", "original", "replacement", "type", "reason"]
    }
  };

  const systemInstruction = `Find B1-level errors in the text.
  
  CRITICAL INSTRUCTION FOR 'original' FIELD:
  - The 'original' string must match EXACTLY the substring in the user text that needs replacing.
  - DO NOT include surrounding words that are correct.
  - Example: User wrote "makes young generation". Error is "young" -> "the younger".
    - WRONG original: "makes young generation"
    - CORRECT original: "young"
  
  IGNORE spacing errors before punctuation (e.g. "word ." is OK).
  Reasons must be in VIETNAMESE.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Find B1-level errors in: "${text}". Return JSON.`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    return JSON.parse(jsonText) as InlineSuggestion[];
  } catch (error) {
    return [];
  }
};

export const generateOutline = async (type: TaskType, prompt: string): Promise<OutlineSection[]> => {
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        sectionTitle: { type: Type.STRING },
        points: { type: Type.ARRAY, items: { type: Type.STRING } },
        structures: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "Useful sentence templates/structures for this section (e.g. 'I suggest that...', 'Why don't we...')"
        }
      },
      required: ["sectionTitle", "points"]
    }
  };

  const systemInstruction = `You are a B1 Writing Coach. Create a structure for: "${prompt}".
  
  For every section, you MUST provide 2 distinct lists:
  1. 'points': Content ideas or vocabulary.
  2. 'structures': Useful sentence templates or grammatical structures appropriate for B1 level for that specific section.

  IF TRANSLATION (Vietnamese source):
  - Section Title: "Segment 1", "Segment 2", etc.
  - Points: Vocabulary/Phrases.
  - Structures: Grammatical patterns found in this segment (e.g., "Passive Voice: S + be + V3", "Relative Clause: ... which ...").

  IF INFORMAL LETTER:
  - Tone: Informal and friendly.
  - Opening: Greetings. Structures: "Hi...", "Thanks for your email", "How are you?".
  - Body Paragraphs: Answering specific questions. Structures: "You asked me about...", "If I were you, I would...", "Why don't you...".
  - Closing: Sign-offs. Structures: "See you soon", "Best,".
  
  IF PARAGRAPH (Essay):
  - Topic Sentence: Structures: "One major problem is...", "There are several advantages to...".
  - Supporting Points: Structures: "For example...", "In addition...", "This is because...".
  - Conclusion: Structures: "In conclusion...", "To sum up...".
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Generate outline and B1 sentence structures for task type ${type}.`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    return JSON.parse(jsonText) as OutlineSection[];
  } catch (error) {
    return [];
  }
};
