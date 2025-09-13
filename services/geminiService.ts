import { GoogleGenAI, Type } from "@google/genai";
import { QuizData, SummaryData, FlashcardData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const quizSchema = {
  type: Type.OBJECT,
  properties: {
    keyEntities: {
      type: Type.ARRAY,
      description: "A list of 5-10 key terms, people, places, or concepts from the provided text.",
      items: { type: Type.STRING }
    },
    quiz: {
      type: Type.ARRAY,
      description: "An array of 5 unique multiple-choice questions based *only* on the provided text.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description: "The quiz question, directly referencing information in the text."
          },
          options: {
            type: Type.ARRAY,
            description: "An array of exactly 4 possible answers (one correct, three plausible but incorrect distractors).",
            items: { type: Type.STRING }
          },
          correctAnswer: {
            type: Type.STRING,
            description: "The correct answer, which must be an exact match to one of the strings in the 'options' array."
          },
          explanation: {
            type: Type.STRING,
            description: "A brief (1-2 sentence) explanation of why the correct answer is correct, based on the provided text."
          }
        },
        required: ["question", "options", "correctAnswer", "explanation"]
      }
    }
  },
  required: ["keyEntities", "quiz"]
};

const summarySchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "A concise, engaging title for the summary, capturing the main topic of the text."
        },
        summary: {
            type: Type.STRING,
            description: "A well-structured summary of the key points, concepts, and conclusions from the provided text. It should be broken into paragraphs for readability."
        }
    },
    required: ["title", "summary"]
};

const flashcardSchema = {
    type: Type.OBJECT,
    properties: {
        keyConcepts: {
            type: Type.ARRAY,
            description: "A list of 3-5 high-level concepts covered in the material.",
            items: { type: Type.STRING }
        },
        flashcards: {
            type: Type.ARRAY,
            description: "An array of 5-10 flashcards. Each flashcard should focus on a single, specific term or concept from the text.",
            items: {
                type: Type.OBJECT,
                properties: {
                    term: {
                        type: Type.STRING,
                        description: "The key term, name, or concept for the front of the flashcard."
                    },
                    definition: {
                        type: Type.STRING,
                        description: "A clear and concise definition or explanation for the back of the flashcard, derived directly from the text."
                    }
                },
                required: ["term", "definition"]
            }
        }
    },
    required: ["keyConcepts", "flashcards"]
}


export async function generatePracticeQuestions(text: string, studentLevel: string): Promise<QuizData> {
  if (!text.trim()) {
    throw new Error("Input text cannot be empty.");
  }
  try {
    const prompt = `
      You are an expert quiz creator for students. Based on the following study material, create a 5-question multiple-choice quiz tailored for a ${studentLevel} level.

      Tasks:
      1. Identify the most important key entities (people, places, concepts, dates).
      2. Generate a 5-question multiple-choice quiz. Each question must have exactly 4 options, one correct answer, and a brief explanation for why the answer is correct. 
      3. The difficulty, vocabulary, and question structure should be appropriate for a ${studentLevel} student.
      4. The questions, answers, and explanations must be derived *directly* from the provided text.

      Study Material:
      ---
      ${text}
      ---
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        temperature: 0.7,
      },
    });

    const parsedData = JSON.parse(response.text) as QuizData;

    // Validation
    if (!parsedData.quiz || parsedData.quiz.length < 1) {
      throw new Error("AI returned an invalid quiz structure.");
    }
    parsedData.quiz.forEach(q => {
      if (!q.options || q.options.length !== 4) {
        throw new Error(`Question "${q.question}" does not have 4 options.`);
      }
      if (!q.options.includes(q.correctAnswer)) {
        throw new Error(`Correct answer for "${q.question}" is not listed in its options.`);
      }
    });

    return parsedData;

  } catch (error) {
    console.error("Error generating quiz from Gemini:", error);
    throw new Error("Failed to generate practice questions. The model may be overloaded or the input text could not be processed.");
  }
}

export async function summarizeText(text: string): Promise<SummaryData> {
    if (!text.trim()) {
        throw new Error("Input text cannot be empty.");
    }
    try {
        const prompt = `
            You are a skilled academic summarizer. Read the following lecture material and provide a concise title and a well-structured summary. The summary should capture the main arguments, key evidence, and overall conclusion of the text, making it easy for a student to review.

            Lecture Material:
            ---
            ${text}
            ---
        `;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: summarySchema,
                temperature: 0.5,
            }
        });
        return JSON.parse(response.text) as SummaryData;
    } catch (error) {
        console.error("Error summarizing text with Gemini:", error);
        throw new Error("Failed to generate summary.");
    }
}

export async function generateFlashcards(text: string): Promise<FlashcardData> {
    if (!text.trim()) {
        throw new Error("Input text cannot be empty.");
    }
    try {
        const prompt = `
            You are an AI assistant that creates study aids. Based on the provided text, generate a set of 5-10 flashcards. Each flashcard should have a distinct 'term' (a key concept, person, or vocabulary word) and a concise 'definition' based directly on the text. Also, identify 3-5 high-level concepts from the text.

            Study Material:
            ---
            ${text}
            ---
        `;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: flashcardSchema,
                temperature: 0.6,
            }
        });
        const parsedData = JSON.parse(response.text) as FlashcardData;
        if (!parsedData.flashcards || parsedData.flashcards.length === 0) {
            throw new Error("AI failed to generate any flashcards.");
        }
        return parsedData;
    } catch (error) {
        console.error("Error generating flashcards with Gemini:", error);
        throw new Error("Failed to generate flashcards.");
    }
}

export async function translateText(text: string, targetLanguage: string): Promise<string> {
    if (!text.trim()) {
        throw new Error("Input text cannot be empty.");
    }
    try {
        const prompt = `
            You are a highly skilled translator. Translate the following text into ${targetLanguage}.
            Provide only the translated text as a raw string, with no additional commentary, labels, or explanations.

            Text to Translate:
            ---
            ${text}
            ---
        `;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.2,
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error translating text with Gemini:", error);
        throw new Error(`Failed to translate text to ${targetLanguage}.`);
    }
}

export async function extractTextFromImage(base64Data: string, mimeType: string): Promise<string> {
  if (!base64Data || !mimeType) {
    throw new Error("Base64 data and MIME type are required.");
  }
  try {
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Data,
      },
    };
    const textPart = {
      text: "You are an expert at Optical Character Recognition (OCR). Extract all text from the provided image. Preserve the original formatting, including paragraphs and line breaks, as much as possible. Provide only the extracted text as a raw string, with no additional commentary, labels, or explanations.",
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [imagePart, textPart] },
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error extracting text from image with Gemini:", error);
    throw new Error("Failed to extract text from the image. The image may be unsupported or the service is unavailable.");
  }
}