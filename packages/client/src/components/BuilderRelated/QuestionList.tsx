import React, { useState, useCallback} from 'react';
import { QuestionType } from '@react-apollo-graphql-forms/common';
import QuestionCard from './QuestionCard.tsx';
import './styles/QuestionList.css';

export interface FormQuestion {
    tempId: number;
    text: string;
    type: QuestionType;
    options?: string[];
}

interface QuestionListProps {
    onQuestionsChange: (questions: FormQuestion[]) => void;
    isMetadataValid: boolean;
}

let tempIdCounter = 1;

const getNewQuestion = (type: QuestionType): FormQuestion => ({
    tempId: tempIdCounter++,
    text: ``,
    type: type,
    options: (type === QuestionType.MULTIPLE_CHOICE || type === QuestionType.CHECKBOX) ? [''] : undefined,
});

export const QuestionList: React.FC<QuestionListProps> = ({ onQuestionsChange}) => {
    const [questions, setQuestions] = useState<FormQuestion[]>([]);
    React.useEffect(() => {
        onQuestionsChange(questions);
    }, [questions, onQuestionsChange]);

    const handleAddQuestion = useCallback((type: QuestionType) => {
        setQuestions(prevQuestions => [...prevQuestions, getNewQuestion(type)]);
    }, []);

    const handleUpdateQuestion = useCallback((tempId: number, field: keyof FormQuestion, value: any) => {
        setQuestions(prevQuestions => prevQuestions.map(q => 
            q.tempId === tempId ? { ...q, [field]: value } : q
        ));
    }, []);

    const handleUpdateOptions = useCallback((tempId: number, optionsString: string) => {
        const newOptions = optionsString.split('\n'); 
        
        setQuestions(prevQuestions => prevQuestions.map(q => 
            q.tempId === tempId ? { ...q, options: newOptions } : q
        ));
    }, []);
        
    const handleDeleteQuestion = useCallback((tempId: number) => {
        setQuestions(prevQuestions => prevQuestions.filter(q => q.tempId !== tempId));
    }, []);

    return (
        <div className="question-list-wrapper">
            {questions.length === 0 && (
                <p className="empty-list-message">
                    Add your first Question.
                </p>
            )}
            
            <div className="question-cards-container">
                {questions.map((q, index) => (
                    <QuestionCard 
                        key={q.tempId} 
                        question={q} 
                        index={index}
                        onUpdate={handleUpdateQuestion}
                        onUpdateOptions={handleUpdateOptions}
                        onDelete={handleDeleteQuestion}
                    />
                ))}
            </div>

            <div className="add-question-buttons">
                <button 
                    type="button" 
                    className="add-question-btn primary-btn" 
                    onClick={() => handleAddQuestion(QuestionType.TEXT)}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Text
                </button>
                <button 
                    type="button" 
                    className="add-question-btn warning-btn" 
                    onClick={() => handleAddQuestion(QuestionType.MULTIPLE_CHOICE)}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle></svg>
                    MultyChoice
                </button>
                <button 
                    type="button" 
                    className="add-question-btn info-btn" 
                    onClick={() => handleAddQuestion(QuestionType.CHECKBOX)}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                    CheckBOX
                </button>
                <button 
                    type="button" 
                    className="add-question-btn secondary-btn" 
                    onClick={() => handleAddQuestion(QuestionType.DATE)}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    Date
                </button>
            </div>
        </div>
    );
};