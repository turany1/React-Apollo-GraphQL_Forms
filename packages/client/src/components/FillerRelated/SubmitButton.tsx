import React from 'react';
import './styles/SubmitButton.css';

interface SubmitButtonProps {
    isSubmitting: boolean;
    isDisabled: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting, isDisabled }) => {
    return (
        <div className="submit-btn-container">
            <button
                type="submit"
                className="submit-response-btn"
                disabled={isSubmitting || isDisabled}
            >
                {isSubmitting ? (
                    <>
                        <div className="spinner"></div>
                        Submiting...
                    </>
                ) : (
                    'Submit'
                )}
            </button>
        </div>
    );
};