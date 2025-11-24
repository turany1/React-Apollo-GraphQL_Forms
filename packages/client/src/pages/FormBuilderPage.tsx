import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QuestionType } from '@react-apollo-graphql-forms/common';
import { useCreateFormMutation } from '../store/api/apiSlice.ts';
import { Question } from '../store/api/types.ts'; 
import { QuestionList, FormQuestion } from '../components/BuilderRelated/QuestionList.tsx';
import { CreateButton } from '../components/BuilderRelated/CreateButton.tsx';
import './styles/FormBuilderPage.css';

type QuestionPayload = Omit<Question, 'id'>;

export const FormBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const [createForm, { isLoading }] = useCreateFormMutation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const [questions, setQuestions] = useState<QuestionPayload[]>([]);
  const [error, setError] = useState('');
  
 const handleQuestionsChange = useCallback((updatedQuestions: FormQuestion[]) => {
      const finalQuestions: QuestionPayload[] = updatedQuestions.map(({ tempId, ...rest }) => {
         const cleanedOptions = rest.options?.filter(opt => opt.trim().length > 0) || undefined;
          
          return {
              ...rest,
              options: cleanedOptions,
          }
      });

      setQuestions(finalQuestions);
  }, []);

  const isFormValid = title.trim().length > 0 && questions.length > 0 && questions.every(q => {
      if (q.text.trim().length === 0) return false;
      if (q.type === QuestionType.MULTIPLE_CHOICE || q.type === QuestionType.CHECKBOX) {
         return (q.options && q.options.length > 0);
      }
      return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isFormValid) {
      setError('Please fill in all required fields and ensure all questions are valid.');
      return;
    }

    try {
        const payload = { title, description, questions };
        await createForm(payload).unwrap();
        navigate('/'); 

    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred while creating the form. Please try again.');
    }
  };

  return (
    <div className="form-builder-container">
      <Link to="/" className="link-back">
        &larr; back to dashboard
      </Link>
      <h1 className="builder-title">Form Builder</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-metadata-card">
            <div className="metadata-input-group">
                <label htmlFor="title">Title *</label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                />
            </div>
            
            <div className="metadata-input-group">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    placeholder="Description (optional)"
                />
            </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <h2 className="section-subtitle">Questions</h2>
        <QuestionList 
            onQuestionsChange={handleQuestionsChange} 
            isMetadataValid={title.trim().length > 0} 
        />
        <CreateButton
          isLoading={isLoading}
          isFormValid={isFormValid}
        />
      </form>
    </div>
  );
};