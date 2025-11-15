import React from 'react';
import { useParams, Link } from 'react-router-dom';
// Виправлений імпорт
import { useGetFormQuery, useGetFormResponsesQuery } from '../store/api/apiSlice.ts';
// Припускаємо, що ці типи є у types.ts
import { Question, Response } from '../store/api/types.ts';

// ----------------------------------------------------------------------
// ЛОКАЛЬНИЙ ТИП: Розширюємо тип Response, щоб включити відсутнє поле 'createdAt'
// ----------------------------------------------------------------------
interface ResponseWithTimestamp extends Response {
    createdAt: string; 
}


// ----------------------------------------------------------------------
// 1. УТИЛІТАРНІ ФУНКЦІЇ ДЛЯ КОМПОНЕНТА
// ----------------------------------------------------------------------

/**
 * Знаходить відповідь для конкретного питання та форматує її для відображення.
 */
const formatAnswer = (questionId: string, responseAnswers: Response['answers']): string => {
    const answer = responseAnswers.find(a => a.questionId === questionId);
    
    if (!answer) {
        return '—';
    }

    if (answer.value) {
        // Обрізаємо довгий текст для відображення в таблиці
        return answer.value.length > 50 ? answer.value.substring(0, 47) + '...' : answer.value;
    }

    if (answer.values && answer.values.length > 0) {
        return answer.values.join(', ');
    }

    return '—';
};

// ----------------------------------------------------------------------
// 2. ДОПОМІЖНИЙ КОМПОНЕНТ ДЛЯ ПОВІДОМЛЕНЬ (LOADING/ERROR/INFO)
// Використовуємо лише стилі, без зовнішніх іконок
// ----------------------------------------------------------------------

interface MessageBlockProps {
    type: 'error' | 'loading' | 'info'; 
    message: string; 
    details?: string;
}

const MessageBlock: React.FC<MessageBlockProps> = ({ type, message, details }) => {
    let style: React.CSSProperties = { 
        padding: '20px', 
        borderRadius: '8px', 
        margin: '20px auto', 
        maxWidth: '800px',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    };
    let title = '';

    if (type === 'loading') {
        style = { 
            ...style, 
            fontSize: '1.2em', 
            color: '#007bff', 
            backgroundColor: '#f0f4ff', 
            border: '1px solid #cceeff',
            padding: '30px'
        };
        title = 'Loading...';
    } else if (type === 'error') {
        style = { 
            ...style, 
            color: '#cc0000', 
            textAlign: 'left', 
            backgroundColor: '#ffeeee', 
            border: '1px solid #ffcccc', 
            alignItems: 'flex-start' 
        };
        title = 'Error';
    } else if (type === 'info') {
        style = { 
            ...style, 
            color: '#444', 
            backgroundColor: '#ffffe0', 
            border: '1px solid #ffeeaa',
            padding: '30px' 
        };
        title = 'No answers yet.';
    }

    return (
        <div style={style}>
            <h2 style={{ margin: 0, fontSize: '1.1em', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                {type === 'error' }
                {type === 'loading'}
                {type === 'info' }
                {title}
            </h2>
            {type !== 'loading' && <p style={{ margin: 0, marginTop: '10px' }}>{message}</p>}
            {details && type === 'error' && (
                <pre style={{ 
                    whiteSpace: 'pre-wrap', 
                    wordWrap: 'break-word', 
                    fontFamily: 'monospace', 
                    fontSize: '0.9em', 
                    marginTop: '10px', 
                    backgroundColor: '#fdd', 
                    padding: '10px', 
                    borderRadius: '4px', 
                    border: '1px dashed #f99',
                    width: '100%',
                    boxSizing: 'border-box'
                }}>
                    {details}
                </pre>
            )}
        </div>
    );
};

// ----------------------------------------------------------------------
// 3. FormResponsesPage
// ----------------------------------------------------------------------

export const FormResponsesPage: React.FC = () => {
    const { id: formId } = useParams<{ id: string }>();
    // Ініціалізація useNavigate для програмної навігації

    if (!formId) {
        return <MessageBlock type="error" message="ID not found in URL." details="Check if your root is correct." />;
    }

    // 1. Завантаження структури форми
    const { 
        data: formData, 
        isLoading: isFormLoading, 
        error: formError 
    } = useGetFormQuery(formId, { skip: !formId });

    const form = formData?.form;

    // 2. Завантаження відповідей
    const {
        data: responsesData,
        isLoading: isResponsesLoading,
        error: responsesError,
    } = useGetFormResponsesQuery(formId, { skip: !formId });

    const responses: ResponseWithTimestamp[] = (responsesData?.responses as ResponseWithTimestamp[]) || []; 

    // Об'єднання станів завантаження
    if (isFormLoading || isResponsesLoading) {
        return <MessageBlock type="loading" message="Waiting for Form and Answers..." />;
    }
    
    // Обробка помилок
    if (formError) {
        return <MessageBlock type="error" message="Form structure Error" details={JSON.stringify(formError, null, 2)} />;
    }
    if (responsesError) {
        return <MessageBlock type="error" message="Answers loading Error" details={JSON.stringify(responsesError, null, 2)} />;
    }
    if (!form) {
        return <MessageBlock type="error" message="Form not found." details={`ID: ${formId}`} />;
    }

    const questions: Question[] = form.questions || [];
    
    // Відображення
    return (
        <div style={{ padding: '16px', maxWidth: '1280px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            
            {/* Go Back Button */}
            <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>&larr; Back to Dashboard</Link>

            {/* Header Block */}
            <div style={{ marginBottom: '24px', paddingBottom: '8px', borderBottom: '2px solid #333' }}>
                <h1 style={{ fontSize: '2em', fontWeight: 'bold', color: '#333', margin: 0 }}>
                    Answers to: {form.title}
                </h1>
                <p style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>
                    There is <strong style={{color: '#007bff'}}>{responses.length}</strong> answers recieved.
                </p>
                <p style={{ fontSize: '0.75em', color: '#999', marginTop: '5px' }}>
                    ID: <code style={{ backgroundColor: '#f0f0f0', padding: '2px 4px', borderRadius: '3px', color: '#007bff' }}>{formId}</code>
                </p>
            </div>

            {responses.length === 0 ? (
                <MessageBlock type="info" message="After at least one answer submited the data will be shown as a table." />
            ) : (
                <>
                    {/* Стилі для таблиці з липкими елементами */}
                    <style>
                        {`
                            /* Контейнер для таблиці */
                            .table-wrapper {
                                overflow-x: auto;
                                border: 1px solid #ccc;
                                border-radius: 4px;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                                max-height: 70vh;
                                background-color: white;
                            }
                            
                            /* Таблиця */
                            .responses-table {
                                width: 100%;
                                border-collapse: collapse;
                                table-layout: auto;
                                min-width: 1000px; /* Забезпечення прокрутки на малих екранах */
                            }
                            
                            .responses-table th, .responses-table td {
                                padding: 12px 15px;
                                border-bottom: 1px solid #ddd;
                                text-align: left;
                                max-width: 300px; 
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                font-size: 0.9em;
                            }
                            
                            .responses-table thead th {
                                background-color: #f0f0f0;
                                color: #333;
                                font-weight: bold;
                                text-transform: uppercase;
                                font-size: 0.8em;
                                position: sticky;
                                top: 0;
                                z-index: 10;
                            }
                            
                            .responses-table tbody tr:nth-child(even) {
                                background-color: #f9f9f9;
                            }
                            .responses-table tbody tr:hover {
                                background-color: #eef;
                                transition: background-color 0.15s;
                            }

                            /* Стилі липкої колонки (ID Відповіді) */
                            .sticky-col-id {
                                position: sticky;
                                left: 0;
                                background-color: white; /* Фон для липкого стовпця */
                                z-index: 15; 
                                border-right: 1px solid #eee;
                                font-family: monospace;
                                font-weight: bold;
                                color: #007bff;
                            }
                            /* Стиль липкої колонки у заголовку */
                            .responses-table thead .sticky-col-id {
                                background-color: #e0e0e0; /* Світліший фон заголовка */
                                color: #333;
                                z-index: 20; 
                            }
                        `}
                    </style>

                    {/* Table Container with scroll and simple shadow/border */}
                    <div className="table-wrapper">
                        <table className="responses-table">
                            <thead>
                                <tr>
                                    <th className="sticky-col-id">
                                        Answer ID 
                                    </th>
                                    {questions.map((q) => (
                                        <th key={q.id} style={{ minWidth: '200px' }}>{q.text}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {responses.map((response) => (
                                    <tr key={response.id}>
                                        <td className="sticky-col-id">
                                            {response.id.substring(0, 8)}...
                                        </td>
                                        {questions.map((q) => (
                                            <td key={q.id} style={{maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                                {formatAnswer(q.id, response.answers)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};