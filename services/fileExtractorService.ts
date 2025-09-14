// Alternative 1 (ES5 build)
import { getDocument } from 'pdfjs-dist/legacy/build/pdf';
// Alternative 2 (webpack-friendly entry — useful if you use worker bundling)
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import mammoth from 'mammoth';
import { extractTextFromImage } from './geminiService';

// Configure the worker for pdf.js to run in the background
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

/**
 * Converts a File object to a base64 encoded string, stripping the data URL prefix.
 * @param file The file to convert.
 * @returns A promise that resolves with the base64 string.
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.substring(result.indexOf(',') + 1));
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Extracts text content from a PDF file.
 * @param file The PDF file.
 * @returns A promise that resolves with the extracted text.
 */
async function extractTextFromPdf(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const textContent = [];
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const text = await page.getTextContent();
        const pageText = text.items.map(item => ('str' in item ? item.str : '')).join(' ');
        textContent.push(pageText);
    }
    return textContent.join('\n\n');
}

/**
 * Extracts raw text from a DOCX file.
 * @param file The DOCX file.
 * @returns A promise that resolves with the extracted text.
 */
async function extractTextFromDocx(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
    return result.value;
}

/**
 * Extracts text from a supported file (Image, PDF, DOCX).
 * Throws an error for unsupported file types.
 * @param file The file to process.
 * @returns A promise that resolves with the extracted text.
 */
export async function extractTextFromFile(file: File): Promise<string> {
    const fileType = file.type;
    const extension = file.name.split('.').pop()?.toLowerCase() || '';

    // Handle images via Gemini
    if (fileType.startsWith('image/')) {
        const base64Data = await fileToBase64(file);
        return await extractTextFromImage(base64Data, file.type);
    }

    // Handle PDF files
    if (extension === 'pdf' || fileType === 'application/pdf') {
        return await extractTextFromPdf(file);
    }

    // Handle DOCX files
    if (extension === 'docx' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        return await extractTextFromDocx(file);
    }
    
    // Provide guidance for unsupported but common types
    if (['ppt', 'pptx'].includes(extension) || ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'].includes(fileType)) {
         throw new Error(`Automatic text extraction for PowerPoint files is not yet supported. Please copy and paste the text.`);
    }

    if (extension === 'doc'){
      throw new Error('Legacy .doc files are not supported. Please save as .docx and try again.');
    }

    // Generic error for other unsupported types
    throw new Error(`Unsupported file type: .${extension.toUpperCase()}. Please use an Image, PDF, or Word (.docx) document.`);
}
