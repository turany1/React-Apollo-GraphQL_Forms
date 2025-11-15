import React from 'react';
import './UI/CreateButton.css';

interface CreateButtonProps {
    isLoading: boolean;
    isFormValid: boolean;
}

export const CreateButton: React.FC<CreateButtonProps> = ({ isLoading, isFormValid }) => {
    
    return (
        <div className="create-button-wrapper">
            <button
                type="submit"
                className="create-form-button"
                disabled={!isFormValid || isLoading}
            >
                {isLoading ? 'Loading...' : 'Save Form'}
                {isLoading && <span className="spinner"></span>}
            </button>
            {!isFormValid && (
                <p className="validation-tip">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    Fill in all required fields and ensure all questions are valid.
                </p>
            )}
        </div>
    );
};