import React from 'react';
import { QuestionType } from '@react-apollo-graphql-forms/common';
import { FormQuestion } from './QuestionList.tsx';
import './styles/QuestionCard.css';

interface QuestionCardProps {
    question: FormQuestion;
    index: number;
    onUpdate: (tempId: number, field: keyof FormQuestion, value: any) => void;
    onUpdateOptions: (tempId: number, optionsString: string) => void;
    onDelete: (tempId: number) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, index, onUpdate, onUpdateOptions, onDelete }) => {
    
    const optionsValue = question.options ? question.options.join('\n') : '';

    const requiresOptions = question.type === QuestionType.MULTIPLE_CHOICE || question.type === QuestionType.CHECKBOX;

    return (
        <div className="question-card">
            <div className="card-header">
                <span className="question-label">Question {index + 1}</span>
                <span className={`type-tag type-${question.type.toLowerCase()}`}>{question.type}</span>
                <button 
                    onClick={() => onDelete(question.tempId)}
                    className="delete-btn"
                >
                    &times; Delete
                </button>
            </div>

            <label className="input-label">Question:</label>
            <input
                type="text"
                value={question.text}
                onChange={(e) => onUpdate(question.tempId, 'text', e.target.value)}
                className="question-text-input"
                placeholder="Write there your question"
            />

            {requiresOptions && (
                <div className="options-group">
                    <label className="input-label">Options (one per row):</label>
                    <textarea
                        value={optionsValue}
                        onChange={(e) => onUpdateOptions(question.tempId, e.target.value)}
                        rows={4}
                        className="options-textarea"
                        placeholder="Option 1&#10;Option 2&#10;"
                    />
                </div>
            )}
            

        </div>
    );
};

export default QuestionCard;