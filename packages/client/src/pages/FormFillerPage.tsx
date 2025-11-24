import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { QuestionType } from '@react-apollo-graphql-forms/common';
import { useGetFormQuery, useSubmitResponseMutation } from '../store/api/apiSlice.ts';
import { AnswerInput, Question } from '../store/api/types.ts';

import { AnswerList } from '../components/FillerRelated/AnswerList.tsx';
import { SubmitButton } from '../components/FillerRelated/SubmitButton.tsx';

import './styles/FormFillerPage.css';

export interface LocalAnswerState {
    questionId: string;
    value?: string;
    values?: string[]; 
}

export const FormFillerPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); 
    const navigate = useNavigate();

    const { 
        data: response, 
        isLoading: isFormLoading, 
        error: formError 
    } = useGetFormQuery(
        id as string,
        { skip: !id }
    );

    const [submitResponse, { isLoading: isSubmissionLoading, isSuccess: isSubmissionSuccess }] = useSubmitResponseMutation();

    const form = response?.form;

    const [currentAnswers, setCurrentAnswers] = useState<LocalAnswerState[]>([]);
    const [localError, setLocalError] = useState<string | null>(null);
    
    useEffect(() => {
        if (form && form.questions.length > 0) {
            const initialAnswers: LocalAnswerState[] = form.questions.map((q: Question) => ({
                questionId: q.id,
                value: (q.type === QuestionType.TEXT || q.type === QuestionType.DATE || q.type === QuestionType.MULTIPLE_CHOICE) ? '' : undefined,
                values: q.type === QuestionType.CHECKBOX ? [] : undefined,
            }));
            setCurrentAnswers(initialAnswers);
        }
    }, [form]);

    useEffect(() => {
        if (isSubmissionSuccess) {
            setLocalError('Submited successfully! Redirecting to Dashboard...');
            const timer = setTimeout(() => {
                navigate('/');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isSubmissionSuccess, navigate]);

    const handleAnswerChange = useCallback((questionIndex: number, newValue: string | string[], type: QuestionType) => {
        setLocalError(null);
        
        setCurrentAnswers(prevAnswers => {
            const newAnswers = [...prevAnswers];
            const questions = form?.questions;
            if (!questions) return prevAnswers; 

            const questionId = questions[questionIndex]?.id;
            if (!questionId) return prevAnswers;
            
            let updatedAnswer: LocalAnswerState;

            if (type === QuestionType.TEXT || type === QuestionType.DATE || type === QuestionType.MULTIPLE_CHOICE) {
                updatedAnswer = { questionId, value: newValue as string };
            } else if (type === QuestionType.CHECKBOX) {
                updatedAnswer = { 
                    questionId, 
                    values: Array.isArray(newValue) ? newValue : [newValue as string] 
                };
            } else {
                return prevAnswers;
            }

            if (questionIndex >= newAnswers.length) return prevAnswers;

            newAnswers[questionIndex] = updatedAnswer;
            
            return newAnswers;
        });
    }, [form]);

    const handleCheckboxChange = useCallback((questionIndex: number, optionValue: string, isChecked: boolean) => {
        const questions = form?.questions;
        if (!questions) return;

        const currentAnswer = currentAnswers[questionIndex] || { 
            questionId: questions[questionIndex].id, 
            values: [] 
        };
        let newValues = currentAnswer.values || [];

        if (isChecked) {
            if (!newValues.includes(optionValue)) {
                newValues = [...newValues, optionValue];
            }
        } else {
            newValues = newValues.filter(v => v !== optionValue);
        }
        
        handleAnswerChange(questionIndex, newValues, QuestionType.CHECKBOX);
    }, [form, currentAnswers, handleAnswerChange]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);
        if (!id) return setLocalError('Error: Form ID is missing.'); 

        const answeredInputs = currentAnswers.filter(a => 
            !!(
                (typeof a.value === 'string' && a.value.trim() !== '') || 
                (a.values && a.values.length > 0)
            )
        );

        if (answeredInputs.length === 0) {
            return setLocalError('Answer at least one question before submitting.');
        }

        const answersPayload: AnswerInput[] = answeredInputs as AnswerInput[];

        try {
            await submitResponse({ formId: id, answers: answersPayload }).unwrap(); 
        } catch (err) {
            console.error('Submitting Error:', err);
            setLocalError('An error occurred while submitting the form. Please try again.');
        }
    };
    
    if (!id) {
        return (
            <div className="form-filler-container">
                <p className="local-error-message">Error:Form ID is missing from the URL</p>
            </div>
        );
    }
    
    if (isFormLoading) {
        return (
            <div className="form-filler-container">
                <div className="loading-state">Form loading...</div>
            </div>
        );
    }
    
    if (formError || !form) {
        let errorMessage = 'Not Found.';
        if (formError) {
            try {
                errorMessage = formError ? JSON.stringify(formError, null, 2) : String(formError);
            } catch (e) {
                errorMessage = String(formError);
            }
        }
        
        return (
            <div className="form-filler-container">
                <div className="loading-error-block">
                    <h2>Form getting Error</h2>
                    <pre>{errorMessage}</pre>
                    <p>Check if you request is valid and server response</p>
                </div>
            </div>
        );
    }

    if (!form.questions || form.questions.length === 0) {
        return (
            <div className="form-filler-container">
                <p className="no-questions-message">This form have no questions.</p>
            </div>
        );
    }
    const isFormValid = currentAnswers.filter(a => 
        !!((typeof a.value === 'string' && a.value.trim() !== '') || (a.values && a.values.length > 0))
    ).length > 0;
    
    return (
        <div className="form-filler-container">
            <Link to="/" className="link-back">
                &larr; back to dashboard
            </Link>
            <h1 className="filler-title">{form.title}</h1>

            {isSubmissionSuccess && <p className="submission-success-message">{localError}</p>}
            {localError && !isSubmissionSuccess && <p className="local-error-message">{localError}</p>}

            <form onSubmit={handleSubmit}>
                <AnswerList
                    questions={form.questions}
                    description={form.description}
                    currentAnswers={currentAnswers}
                    handleAnswerChange={handleAnswerChange}
                    handleCheckboxChange={handleCheckboxChange}
                />

                <SubmitButton
                    isSubmitting={isSubmissionLoading}
                    isDisabled={!isFormValid || isSubmissionLoading}
                />
            </form>
        </div>
    );
};