// Single source of truth for question types
export enum QuestionType {
  TEXT = 'TEXT',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  CHECKBOX = 'CHECKBOX',
  DATE = 'DATE',
}

// --- Types for Database (and for client) ---

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[]; // Used for MC and CHECKBOX
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface Answer {
  questionId: string;
  value?: string;    // For TEXT, DATE, MULTIPLE_CHOICE
  values?: string[]; // For CHECKBOX
}

export interface Response {
  id: string;
  formId: string;
  answers: Answer[];
}

// --- Types for GraphQL Inputs (Mutation Arguments) ---

export interface QuestionInput {
  text: string;
  type: QuestionType;
  options?: string[];
}

export interface AnswerInput {
  questionId: string;
  value?: string;
  values?: string[];
}

export interface CreateFormArgs {
  title: string;
  description?: string;
  questions: QuestionInput[];
}

export interface SubmitResponseArgs {
  formId: string;
  answers: AnswerInput[];
}