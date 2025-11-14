// packages/client/codegen.ts
import { CodegenConfig } from '@graphql-codegen/cli';

// We import this just to make sure TypeScript can
// find the package, but the string paths are what's important.
import type {} from '@react-express-graphql-forms/common';

const config: CodegenConfig = {
  // Point this to your running GraphQL backend
  schema: 'http://localhost:4000/graphql',
  
  // This will scan your project for .graphql files
  documents: ['src/**/*.graphql'],
  
  generates: {
    // This is the main output file
    './src/store/api/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },

      // --- This is the new configuration block ---
      config: {
        // This tells codegen to map schema types to your imported types
        // The format is 'GraphQLTypeName: 'package-name#TypeName'
        mappers: {
          // --- Main Data Types ---
          Form: '@react-express-graphql-forms/common#Form',
          Question: '@react-express-graphql-forms/common#Question',
          Answer: '@react-express-graphql-forms/common#Answer',
          Response: '@react-express-graphql-forms/common#Response',

          // --- Enum Type ---
          QuestionType: '@react-express-graphql-forms/common#QuestionType',

          // --- Input Types ---
          QuestionInput: '@react-express-graphql-forms/common#QuestionInput',
          AnswerInput: '@react-express-graphql-forms/common#AnswerInput',
        },
      },
      // --- End new config block ---
    },
  },
  ignoreNoDocuments: true,
};

export default config;