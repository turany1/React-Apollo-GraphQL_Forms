import { gql } from 'apollo-server';

// This schema must mirror the types in 'common'
export const typeDefs = gql`
  enum QuestionType {
    TEXT
    MULTIPLE_CHOICE
    CHECKBOX
    DATE
  }

  type Form {
    id: ID!
    title: String!
    description: String
    questions: [Question!]!
  }

  type Question {
    id: ID!
    text: String!
    type: QuestionType!
    options: [String!]
  }

  type Response {
    id: ID!
    formId: ID!
    answers: [Answer!]!
  }

  type Answer {
    questionId: ID!
    value: String
    values: [String!]
  }

  input QuestionInput {
    text: String!
    type: QuestionType!
    options: [String!]
  }

  input AnswerInput {
    questionId: ID!
    value: String
    values: [String!]
  }

  type Query {
    forms: [Form!]!
    form(id: ID!): Form
    responses(formId: ID!): [Response!]!
  }

  type Mutation {
    createForm(
      title: String!
      description: String
      questions: [QuestionInput!]!
    ): Form!

    submitResponse(
      formId: ID!
      answers: [AnswerInput!]!
    ): Response!
  }
`;