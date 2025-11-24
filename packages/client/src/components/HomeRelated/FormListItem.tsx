import React from 'react';
import { Link } from 'react-router-dom';
import './styles/FormListItem.css';

interface Form {
    id: string;
    title: string;
    description?: string;
}

interface FormListItemProps {
    form: Form;
}

export const FormListItem: React.FC<FormListItemProps> = ({ form }) => {
    return (
        <div className="form-card">
            <h3>{form.title}</h3>
            <p>{form.description || ''}</p>
            
            <div className="form-actions">
                <Link to={`/forms/${form.id}/fill`} className="action-link action-fill">
                    Fill the Form
                </Link>
                <span className="action-separator">|</span>
                <Link to={`/forms/${form.id}/responses`} className="action-link action-answers">
                    Responses
                </Link>
            </div>
        </div>
    );
};