import React, { useMemo } from 'react';
import { QuestionType } from '@react-apollo-graphql-forms/common';
import { Question } from '../store/api/types.ts'; 
import { LocalAnswerState } from '../pages/FormFillerPage.tsx'; 
import './UI/AnswerCard.css';

interface AnswerCardProps {
    question: Question;
    index: number;
    answerState: LocalAnswerState | undefined;
    handleAnswerChange: (questionIndex: number, newValue: string | string[], type: QuestionType) => void;
    handleCheckboxChange: (questionIndex: number, optionValue: string, isChecked: boolean) => void;
}

const AnswerCard: React.FC<AnswerCardProps> = ({ 
    question, 
    index, 
    answerState, 
    handleAnswerChange, 
    handleCheckboxChange 
}) => {
    
    const answerValue = answerState?.value || '';
    const answerValues = answerState?.values || [];

    const onSimpleChange = useMemo(() => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        handleAnswerChange(index, e.target.value, question.type);
    }, [handleAnswerChange, index, question.type]);

    const onCheckboxClick = useMemo(() => (e: React.ChangeEvent<HTMLInputElement>, option: string) => {
        handleCheckboxChange(index, option, e.target.checked);
    }, [handleCheckboxChange, index]);

    const renderInput = () => {
        const { type, options, id } = question;

        switch (type) {
            case QuestionType.TEXT:
                return (
                    <textarea 
                        className="input-text" 
                        rows={3}
                        value={answerValue}
                        onChange={onSimpleChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void} 
                        placeholder="Answer there..."
                    />
                );

            case QuestionType.DATE:
                return (
                    <input 
                        className="input-date" 
                        type="date" 
                        value={answerValue}
                        onChange={onSimpleChange as (e: React.ChangeEvent<HTMLInputElement>) => void} 
                    />
                );

            case QuestionType.MULTIPLE_CHOICE:
                return (
                    <div className="options-group">
                        {options?.map((option, optIndex) => (
                            <label key={optIndex} className="option-item">
                                <input
                                    type="radio"
                                    name={`question-${id}`}
                                    value={option}
                                    checked={answerValue === option}
                                    onChange={onSimpleChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                                    className="option-input"
                                />
                                <span className="custom-radio"></span>
                                {option}
                            </label>
                        ))}
                    </div>
                );

            case QuestionType.CHECKBOX:
                return (
                    <div className="options-group">
                        {options?.map((option, optIndex) => (
                            <label key={optIndex} className="option-item">
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={answerValues.includes(option)}
                                    onChange={(e) => onCheckboxClick(e, option)}
                                    className="option-input"
                                />
                                <span className="custom-checkbox"></span>
                                {option}
                            </label>
                        ))}
                    </div>
                );

            default:
                return <p className="error-message">Unknown question type.</p>;
        }
    };

    return (
        <div className="answer-card">
            <div className="answer-card-header">
                <span className="question-number">{index + 1}.</span>
                <span className="question-text">{question.text}</span>
            </div>
            
            <div className="answer-input-area">
                {renderInput()}
            </div>
        </div>
    );
};

export default AnswerCard;