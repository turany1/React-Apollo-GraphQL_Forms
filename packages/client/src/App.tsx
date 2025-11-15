import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage.tsx';
import { FormBuilderPage } from './pages/FormBuilderPage.tsx';
import { FormFillerPage } from './pages/FormFillerPage.tsx';
import { FormResponsesPage } from './pages/FormResponsesPage.tsx';
import { QuestionType } from '@react-apollo-graphql-forms/common';

const App: React.FC = () => {
  console.log('Shared type test:', QuestionType.TEXT);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/forms/new" element={<FormBuilderPage />} />
      <Route path="/forms/:id/fill" element={<FormFillerPage />} />
      <Route path="/forms/:id/responses" element={<FormResponsesPage />} />
    </Routes>
  );
}

export default App;