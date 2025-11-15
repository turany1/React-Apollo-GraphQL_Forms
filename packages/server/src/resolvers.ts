import { db } from './store';
import {
  Form,
  Response,
  CreateFormArgs,
  SubmitResponseArgs
} from '@react-express-graphql-forms/common';
import crypto from 'crypto';

export const resolvers = {
  Query: {
    forms: (): Form[] => db.forms,

    form: (
      _: unknown,
      { id }: { id: string }
    ): Form | undefined => {
      return db.forms.find((form) => form.id === id);
    },

    responses: (
      _: unknown,
      { formId }: { formId: string }
    ): Response[] => {
      return db.responses.filter((res) => res.formId === formId);
    },
  },

  Mutation: {
    createForm: (
      _: unknown,
      { title, description, questions }: CreateFormArgs // <-- Typed!
    ): Form => {
      const newForm: Form = {
        id: crypto.randomUUID(),
        title,
        description,
        questions: questions.map((q) => ({
          ...q,
          id: crypto.randomUUID(),
        })),
      };

      db.forms.push(newForm);
      return newForm;
    },

    submitResponse: (
      _: unknown,
      { formId, answers }: SubmitResponseArgs // <-- Typed!
    ): Response => {
      const formExists = db.forms.some(f => f.id === formId);
      if (!formExists) {
        throw new Error(`Form with ID ${formId} not found.`);
      }

      const newResponse: Response = {
        id: crypto.randomUUID(),
        formId,
        answers: answers.map(a => ({
          questionId: a.questionId,
          value: a.value,
          values: a.values,
        })),
      };

      db.responses.push(newResponse);
      return newResponse;
    },
  },
};