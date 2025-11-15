// Single source of truth for question types, imported from the common package
import { QuestionType } from '@react-apollo-graphql-forms/common'; 

// --- Core Types (Mirroring common/types for convenience, ensuring consistency) ---

// 1. Types for Form Field (Питання)
export interface Question {
    id: string;
    text: string;
    type: QuestionType; // Імпортується з "common"
    options?: string[]; // Для RADIO/CHECKBOX
}

// 2. Types for Form (Форма)
export interface Form {
  id: string;
  title: string;
  description?: string; 
  questions: Question[];
}

// --- Common/Types Exports for Inputs and Responses ---

// Відповідь на одне запитання
export interface Answer {
  questionId: string;
  value?: string;    // For TEXT, DATE, MULTIPLE_CHOICE
  values?: string[]; // For CHECKBOX
}

// Об'єкт відповіді (звіт)
export interface Response {
  id: string;
  formId: string;
  answers: Answer[];
  // createdAt: string; // ВИДАЛЕНО: Цього поля немає в схемі сервера
}

// Тип вхідних даних для створення запитання
export interface QuestionInput {
  text: string;
  type: QuestionType;
  options?: string[];
}

// Тип вхідних даних для відповіді (використовується в мутації)
export interface AnswerInput {
  questionId: string;
  value?: string;
  values?: string[];
}

// Тип вхідних даних для створення форми (без id, який генерує сервер)
export interface CreateFormArgs {
  title: string;
  description?: string;
  questions: QuestionInput[];
}

// Тип вхідних даних для надсилання відповіді
export interface SubmitResponseArgs {
  formId: string;
  answers: AnswerInput[];
}

// ====================================================================
// ТИПИ ДЛЯ RTK QUERY (ВІДПОВІДІ)
// ====================================================================

// Відповідь для запиту всіх форм
export interface GetFormsResponse {
  forms: Form[];
}

// Відповідь для запиту однієї форми
export interface GetFormResponse {
    form: Form;
}

// Відповідь для запиту всіх відповідей на форму
export interface GetFormResponsesResponse { 
    responses: Response[]; 
}

// Відповідь для мутації створення форми
export interface CreateFormResponse {
    createForm: Form;
}

// Відповідь для мутації надсилання відповіді
export interface SubmitResponseResponse {
    submitResponse: Response;
}