import React from 'react';
import { Question } from '../store/api/types.ts'; 
import { LocalAnswerState } from '../pages/FormFillerPage.tsx'; 
import AnswerCard from './AnswerCard.tsx';
import './UI/AnswerList.css';

interface AnswerListProps {
    questions: Question[];
    description?: string;
    currentAnswers: LocalAnswerState[];
    handleAnswerChange: (questionIndex: number, newValue: string | string[], type: QuestionType) => void;
    handleCheckboxChange: (questionIndex: number, optionValue: string, isChecked: boolean) => void;
}

export const AnswerList: React.FC<AnswerListProps> = ({ 
    questions, 
    description, 
    currentAnswers,
    handleAnswerChange,
    handleCheckboxChange
}) => {
    
    return (
        <div className="answer-list-container">
            {description && (
                <div className="form-info">
                    <p>{description}</p>
                </div>
            )}
            <div className="answer-cards-wrapper">
                {questions.map((question, index) => (
                    <AnswerCard
                        key={question.id}
                        question={question}
                        index={index}
                        answerState={currentAnswers[index]}
                        handleAnswerChange={handleAnswerChange}
                        handleCheckboxChange={handleCheckboxChange}
                    />
                ))}
            </div>
        </div>
    );
};