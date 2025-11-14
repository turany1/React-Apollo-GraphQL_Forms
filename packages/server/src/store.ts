// Import our shared types!
import { Form, Response } from 'common';

// Our in-memory "database"
const forms: Form[] = [];
const responses: Response[] = [];

export const db = {
  forms,
  responses,
};