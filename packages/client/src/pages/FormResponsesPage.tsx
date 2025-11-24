import { useParams, Link } from 'react-router-dom';
import { useGetFormQuery, useGetFormResponsesQuery } from '../store/api/apiSlice.ts';
import { Question, Response } from '../store/api/types.ts';
import { ResponseList } from '../components/ResponsesRelated/ResponseList.tsx';
import { MessageBlock } from '../components/ResponsesRelated/MessageBlock.tsx';
import { formatAnswer } from '../components/ResponsesRelated/utils/answerUtils.ts'; 

import './styles/FormResponsesPage.css';

export interface ResponseWithTimestamp extends Response {
    createdAt: string; 
}

export const FormResponsesPage: React.FC = () => {
    const { id: formId } = useParams<{ id: string }>();

    if (!formId) {
        return <MessageBlock type="error" message="Form ID missing in URL." details="Check your URL." />;
    }

    const { 
        data: formData, 
        isLoading: isFormLoading, 
        error: formError 
    } = useGetFormQuery(formId, { skip: !formId });

    const form = formData?.form;

    const {
        data: responsesData,
        isLoading: isResponsesLoading,
        error: responsesError,
    } = useGetFormResponsesQuery(formId, { skip: !formId });

    const responses: ResponseWithTimestamp[] = (responsesData?.responses as ResponseWithTimestamp[]) || []; 
    const questions: Question[] = form?.questions || [];

    if (isFormLoading || isResponsesLoading) {
        return <MessageBlock type="loading" message="Waiting for response" />;
    }
   
    if (formError) {
        return <MessageBlock type="error" message="Form structure Error." details={JSON.stringify(formError, null, 2)} />;
    }
    if (responsesError) {
        return <MessageBlock type="error" message="Answers Error." details={JSON.stringify(responsesError, null, 2)} />;
    }
    if (!form) {
        return <MessageBlock type="error" message="From not found." details={`ID: ${formId}`} />;
    }
    
    return (
        <div className="responses-container">
            
            <Link to="/" className="link-back">
                &larr; back to dashboard
            </Link>

            <div className="responses-header">
                <h1>Responses to: {form.title}</h1>
                <p>
                    Recieved <strong className="response-count">{responses.length}</strong> responses.
                </p>
            </div>

            {responses.length === 0 ? (
                <MessageBlock type="info" message="After recieving at least one response they will be listed below." />
            ) : (
                <ResponseList 
                    responses={responses} 
                    questions={questions} 
                    formatAnswer={formatAnswer} 
                />
            )}
        </div>
    );
};


