import React from 'react';
import { Link } from 'react-router-dom';
import './UI/FormListItem.css'; // Імпорт стилів

// Тип даних форми, щоб уникнути залежності від 'types.ts' у цьому файлі
interface Form {
    id: string;
    title: string;
    description?: string;
}

interface FormListItemProps {
    form: Form;
}

/**
 * Відображає одну картку форми з назвою, описом та посиланнями на дії.
 */
export const FormListItem: React.FC<FormListItemProps> = ({ form }) => {
    return (
        <div className="form-card">
            <h3>{form.title}</h3>
            <p>{form.description || 'Без опису'}</p>
            
            <div className="form-actions">
                <Link to={`/forms/${form.id}/fill`} className="action-link action-fill">
                    Заповнити
                </Link>
                <span className="action-separator">|</span>
                <Link to={`/forms/${form.id}/responses`} className="action-link action-answers">
                    Відповіді
                </Link>
            </div>
        </div>
    );
};