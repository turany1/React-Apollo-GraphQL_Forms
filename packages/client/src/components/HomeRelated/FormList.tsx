import React from 'react';
import { useGetFormsQuery } from '../../store/api/apiSlice.ts'; // Імпорт запиту API
import { FormListItem } from './FormListItem'; 
import './UI/FormList.css'; // Імпорт стилів

// Типи, які використовуються в цьому компоненті
interface Form {
    id: string;
    title: string;
    description?: string;
}

// Утиліти для коректної обробки помилок RTK Query
function isFetchBaseQueryError(error: any): error is { error: string } {
    return typeof error === 'object' && error !== null && 'error' in error && typeof error.error === 'string';
}

function isErrorWithData(error: any): error is { data: { message?: string, errors?: any[] } } {
    return typeof error === 'object' && error !== null && 'data' in error && error.data !== null;
}

/**
 * Відповідає за отримання даних форм та їх відображення.
 * Рендерить стани: Завантаження, Помилка, Порожній список або сам список форм.
 */
export const FormList: React.FC = () => {
    // 1. Отримання даних
    const { data, isLoading, error } = useGetFormsQuery();
    const forms = data?.forms || [];

    // 2. Обробка помилок
    const getErrorMessage = () => {
        if (!error) return null;
        
        if (isFetchBaseQueryError(error)) {
            return `Помилка запиту: ${error.error}`;
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

    // 3. Рендеринг станів
    if (isLoading) {
        return <p className="message-loading">Завантаження...</p>;
    }

    if (errorMessage) {
        return <p className="message-error">Помилка: {errorMessage}</p>;
    }

    if (forms.length === 0) {
        return <p className="message-empty">Наразі немає жодної форми. Створіть першу!</p>;
    }

    // 4. Рендеринг списку
    return (
        <div className="form-list-container">
            {forms.map(form => (
                <FormListItem key={form.id} form={form} />
            ))}
        </div>
    );
};