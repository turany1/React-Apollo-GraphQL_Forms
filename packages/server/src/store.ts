// Import our shared types!
import { Form, Response } from '@react-express-graphql-forms/common';

// Our in-memory "database"
const forms: Form[] = [];
const responses: Response[] = [];

export const db = {
  forms,
  responses,
};