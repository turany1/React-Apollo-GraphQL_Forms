import React from 'react';
import { Link } from 'react-router-dom';
import './UI/MessageBlock.css';

interface MessageBlockProps {
    type: 'error' | 'loading' | 'info'; 
    message: string; 
    details?: string;
}

export const MessageBlock: React.FC<MessageBlockProps> = ({ type, message, details }) => {
    const blockClass = `message-block ${type}`;
    
    let title = '';

    if (type === 'loading') {
        title = 'Loading...';
    } else if (type === 'error') {
        title = 'Error';
    } else if (type === 'info') {
        title = 'No responses yet.';
    }

    return (
        <div className={blockClass}>
            <h2 className="message-title">
                {title}
            </h2>
            {type !== 'loading' && <p className="message-text">{message}</p>}
            
            {details && type === 'error' && (
                <div>
                    <pre className="message-details">
                        {details}
                    </pre>
                    <Link to="/" className="link-back">
                        &larr; back to dashboard
                    </Link> 
                </div>    
            )}
        </div>
    );
};