import React, { useState } from 'react';
import { Question, Response } from '@react-apollo-graphql-forms/common';
import { ResponseWithTimestamp } from '../../pages/FormResponsesPage.tsx';
import './styles/ResponseListItem.css';

interface ResponseListItemProps {
    response: ResponseWithTimestamp;
    questions: Question[];
    formatAnswer: (questionId: string, responseAnswers: Response['answers']) => string;
    index: number;
}

export const ResponseListItem: React.FC<ResponseListItemProps> = ({ 
    response, 
    questions, 
    formatAnswer, 
    index 
}) => {
    const [isExpanded, setIsExpanded] = useState(false);



    return (
        <div className="response-list-item">
            <div className="response-header" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="response-summary">
                    <span className="response-index">#{index + 1}</span>
                    <span className="response-id">
                        ID: {response.id.substring(0, 8)}...
                    </span>
                </div>
                <div className="expand-icon">
                    {isExpanded ? '▲' : '▼'}
                </div>
            </div>

            {isExpanded && (
                <div className="response-details">
                    {questions.map((question) => {
                        const answerText = formatAnswer(question.id, response.answers);
                        return (
                            <div key={question.id} className="answer-pair">
                                <p className="answer-question">
                                    {question.text}
                                </p>
                                <p className={`answer-value ${answerText === '—' ? 'empty-answer' : ''}`}>
                                    {answerText}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};