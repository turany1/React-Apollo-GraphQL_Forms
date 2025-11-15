// Single source of truth imported from common 
import { QuestionType } from '@react-apollo-graphql-forms/common'; 


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

export interface GetFormsResponse {
  forms: Form[];
}

export interface GetFormResponse {
    form: Form;
}

export interface GetFormResponsesResponse { 
    responses: Response[]; 
}

export interface CreateFormResponse {
    createForm: Form;
}

export interface SubmitResponseResponse {
    submitResponse: Response;
}