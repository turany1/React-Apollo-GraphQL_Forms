import React from 'react';
import { Response, Question } from '../store/api/types.ts';
import { ResponseWithTimestamp } from '../pages/FormResponsesPage.tsx';
import { ResponseListItem } from './ResponseListItem.tsx';
import './UI/ResponseList.css';

interface ResponseListProps {
    responses: ResponseWithTimestamp[];
    questions: Question[];
    formatAnswer: (questionId: string, responseAnswers: Response['answers']) => string;
}

export const ResponseList: React.FC<ResponseListProps> = ({ responses, questions, formatAnswer }) => {
    return (
        <div className="response-list-wrapper">
            <h2>Responses</h2>
            <div className="response-list">
                {responses.map((response, index) => (
                    <ResponseListItem
                        key={response.id}
                        response={response}
                        questions={questions}
                        formatAnswer={formatAnswer}
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
};