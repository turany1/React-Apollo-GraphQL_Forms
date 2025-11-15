// Single source of truth
export enum QuestionType {
  TEXT = 'TEXT',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  CHECKBOX = 'CHECKBOX',
  DATE = 'DATE',
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface Answer {
  questionId: string;
  value?: string; 
  values?: string[]; 
}

export interface Response {
  id: string;
  formId: string;
  answers: Answer[];
}

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