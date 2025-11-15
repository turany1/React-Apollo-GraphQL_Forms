import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';
import { 
    GetFormsResponse, 
    GetFormResponse, 
    CreateFormResponse, 
    CreateFormArgs,        
    SubmitResponseArgs,    
    SubmitResponseResponse,
    GetFormResponsesResponse
} from './types.ts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/graphql';

// Тег для інвалідації списку форм
const formListTag = { type: 'Form' as const, id: 'LIST' };

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: graphqlRequestBaseQuery({ url: API_URL }),
  tagTypes: ['Form'], 
  
  endpoints: (builder) => ({
    getForms: builder.query<GetFormsResponse, void>({
      query: () => ({
        document: `
          query GetForms {
            forms {
              id
              title
              description
            }
          }
        `,
        variables: {},
      }),
      providesTags: () => [formListTag],
    }),

    getForm: builder.query<GetFormResponse, string>({
        query: (id) => ({
            document:`
                query GetForm($id: ID!) {
                    form(id: $id) {
                        id
                        title
                        description
                        questions {
                            id
                            text
                            type
                            options
                        }
                    }
                }
            `,
            variables: { id },
        }),
        providesTags: (_result, _error, id) => [{ type: 'Form', id }],
    }),

    // 3. МУТАЦІЯ: Створення нової форми
    createForm: builder.mutation<CreateFormResponse, CreateFormArgs>({
        query: (newFormData) => ({
            document:`
                mutation CreateForm($title: String!, $description: String, $questions: [QuestionInput!]!) {
                    createForm(title: $title, description: $description, questions: $questions) {
                        id
                        title
                    }
                }
            `,
            variables: newFormData,
        }),
        invalidatesTags: [formListTag],
    }),

    // 4. МУТАЦІЯ: Надсилання відповіді на форму
    submitResponse: builder.mutation<SubmitResponseResponse, SubmitResponseArgs>({
        query: ({ formId, answers }) => ({
            document: `
                mutation SubmitResponse($formId: ID!, $answers: [AnswerInput!]!) {
                    submitResponse(formId: $formId, answers: $answers) {
                        id
                        formId
                        answers {
                            questionId
                            value
                            values
                        }
                    }
                }
            `,
            variables: { formId, answers },
        }),
    }),
    
    // 5. QUERY: Отримання відповідей для форми
    getFormResponses: builder.query<GetFormResponsesResponse, string>({ 
        query: (formId) => ({
            document: `
                query GetFormResponses($formId: ID!) {
                    responses(formId: $formId) {
                        id
                        formId
                        answers {
                            questionId
                            value
                            values
                        }
                    }
                }
            `,
            variables: { formId },
        }),
    }),
  }),
});

// Експортуємо хуки
export const { 
    useGetFormsQuery, 
    useGetFormQuery, 
    useCreateFormMutation, 
    useSubmitResponseMutation,
    useGetFormResponsesQuery 
} = apiSlice;