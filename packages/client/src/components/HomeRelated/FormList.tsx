import React from 'react';
import { useGetFormsQuery } from '../../store/api/apiSlice.ts';
import { FormListItem } from './FormListItem'; 
import './UI/FormList.css'; 

interface Form {
    id: string;
    title: string;
    description?: string;
}

function isFetchBaseQueryError(error: any): error is { error: string } {
    return typeof error === 'object' && error !== null && 'error' in error && typeof error.error === 'string';
}

function isErrorWithData(error: any): error is { data: { message?: string, errors?: any[] } } {
    return typeof error === 'object' && error !== null && 'data' in error && error.data !== null;
}
export const FormList: React.FC = () => {
    const { data, isLoading, error } = useGetFormsQuery();
    const forms = data?.forms || [];

    const getErrorMessage = () => {
        if (!error) return null;
        
        if (isFetchBaseQueryError(error)) {
            return `Error: ${error.error}`;
        }
        
        if (isErrorWithData(error)) {
            if (Array.isArray(error.data.errors) && error.data.errors.length > 0) {
                return `Server Error: ${error.data.errors[0].message || 'Unknown GraphQL Error.'}`;
            }
            return error.data.message || 'Unknown Data Error.';
        }
        return 'Unknown Error.';
    };

    const errorMessage = getErrorMessage();

    if (isLoading) {
        return <p className="message-loading">Loading...</p>;
    }

    if (errorMessage) {
        return <p className="message-error">Error: {errorMessage}</p>;
    }

    if (forms.length === 0) {
        return <p className="message-empty">There is no forms yet. Create one!</p>;
    }
    return (
        <div className="form-list-container">
            {forms.map(form => (
                <FormListItem key={form.id} form={form} />
            ))}
        </div>
    );
};