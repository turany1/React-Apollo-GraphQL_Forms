import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// Із спільного пакета імпортуємо лише QuestionType
import { QuestionType } from '@react-apollo-graphql-forms/common';
// Решту типів імпортуємо з нашого нового api/types.ts
import { useGetFormQuery, useSubmitResponseMutation } from '../store/api/apiSlice.ts';
import { AnswerInput, Question } from '../store/api/types.ts';


// ----------------------------------------------------------------------
// 1. ЛОКАЛЬНИЙ ТИП СТАНУ ВІДПОВІДЕЙ
// ----------------------------------------------------------------------
// Це внутрішній тип для стану компонента, який зберігає відповіді.
interface LocalAnswerState {
    questionId: string;
    // Оскільки відповідь може мати або value (TEXT/DATE), або values (CHECKBOX), 
    // ми використовуємо необов'язкові поля.
    value?: string;
    values?: string[]; 
}

// ----------------------------------------------------------------------
// 2. FormFillerPage
// ----------------------------------------------------------------------

export const FormFillerPage: React.FC = () => {
    // ЗМІНЕНО: Отримуємо ':id' з маршруту
    const { id } = useParams<{ id: string }>(); 
    const navigate = useNavigate();

    // ------------------------------------------------------------------
    // ВИПРАВЛЕННЯ: Використовуємо 'id' для запиту
    // ------------------------------------------------------------------
    const { 
        data: response, 
        isLoading: isFormLoading, 
        error: formError 
    } = useGetFormQuery(
        id as string, // ВИКОРИСТОВУЄМО 'id'
        { 
            // Якщо id не існує, пропускаємо запит.
            skip: !id 
        }
    );
    // ------------------------------------------------------------------
    
    const [submitResponse, { isLoading: isSubmissionLoading, isSuccess: isSubmissionSuccess }] = useSubmitResponseMutation();

    // Витягуємо об'єкт форми (form) з об'єкта відповіді (response)
    const form = response?.form;

    // Стан для зберігання відповідей. Ініціалізуємо порожнім масивом.
    const [currentAnswers, setCurrentAnswers] = useState<LocalAnswerState[]>([]);
    const [localError, setLocalError] = useState<string | null>(null);
    
    // Якщо ID форми не передано (помилка маршрутизації), негайно показуємо помилку
    if (!id) {
        return (
            <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
                Error: Form ID is missing in the URL.
            </div>
        );
    }

    // Ініціалізація стану відповідей після завантаження форми
    useEffect(() => {
        // Змінено: використовуємо об'єкт form (response.form)
        if (form && form.questions.length > 0) {
            const initialAnswers: LocalAnswerState[] = form.questions.map((q: Question) => ({
                questionId: q.id,
                // Ініціалізація за типом
                value: (q.type === QuestionType.TEXT || q.type === QuestionType.DATE) ? '' : undefined,
                values: q.type === QuestionType.CHECKBOX ? [] : undefined,
            }));
            setCurrentAnswers(initialAnswers);
        }
    }, [form]);

    // Ефект для відображення повідомлення про успішне надсилання
    useEffect(() => {
        if (isSubmissionSuccess) {
            setLocalError('Successful submition! Redirecting...');
            const timer = setTimeout(() => {
                navigate('/');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isSubmissionSuccess, navigate]);


    // Input Bug Fix: Коректне оновлення стану з незмінністю
    const handleAnswerChange = (questionIndex: number, newValue: string | string[], type: QuestionType) => {
        setLocalError(null);
        
        setCurrentAnswers(prevAnswers => {
            // Крок 1: Створити копію масиву стану
            const newAnswers = [...prevAnswers];

            // Змінено: використовуємо об'єкт form (response.form)
            const questions = form?.questions;
            if (!questions) return prevAnswers; 

            // Крок 2: Отримати id запитання (ми знаємо, що воно існує, якщо форма завантажена)
            const questionId = questions[questionIndex]?.id;
            if (!questionId) return prevAnswers;
            
            // Крок 3: Створити новий об'єкт відповіді для цього індексу
            let updatedAnswer: LocalAnswerState;

            if (type === QuestionType.TEXT || type === QuestionType.DATE) {
                updatedAnswer = { questionId, value: newValue as string };
            } else if (type === QuestionType.CHECKBOX) {
                updatedAnswer = { 
                    questionId, 
                    values: Array.isArray(newValue) ? newValue : [newValue as string] 
                };
            } else { // MULTIPLE_CHOICE (радіокнопки)
                updatedAnswer = { questionId, value: newValue as string };
            }

            // Крок 4: Замінити старий об'єкт на новий в копії масиву
            // Ми перевіряємо, чи існує відповідь за цим індексом, щоб уникнути помилок
            // хоча в цьому контексті вона має існувати завдяки ініціалізації у useEffect.
            if (questionIndex >= newAnswers.length) return prevAnswers;

            newAnswers[questionIndex] = updatedAnswer;
            
            // Крок 5: Повернути нову посилання на масив, щоб React перерендерив компонент
            return newAnswers;
        });
    };

    // Обробка зміни для CHECKBOX (множинний вибір)
    const handleCheckboxChange = (questionIndex: number, optionValue: string, isChecked: boolean) => {
        const questions = form?.questions;
        if (!questions) return; // Додаткова перевірка

        // Забезпечуємо, що ми маємо об'єкт стану або створюємо мінімальний для цього питання
        const currentAnswer = currentAnswers[questionIndex] || { 
            questionId: questions[questionIndex].id, 
            values: [] 
        };
        let newValues = currentAnswer.values || [];

        if (isChecked) {
            // Додаємо, якщо його немає
            if (!newValues.includes(optionValue)) {
                newValues = [...newValues, optionValue];
            }
        } else {
            // Фільтруємо (видаляємо)
            newValues = newValues.filter(v => v !== optionValue);
        }
        
        // Використовуємо handleAnswerChange для фінального оновлення стану
        handleAnswerChange(questionIndex, newValues, QuestionType.CHECKBOX);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);
        // ВИКОРИСТОВУЄМО 'id'
        if (!id) return setLocalError('Error: Form ID not found.'); 

        // 1. Фільтруємо лише ті відповіді, які мають хоча б одне значення.
        const answeredInputs = currentAnswers.filter(a => 
            // Перевіряємо, чи є непустий рядок (з урахуванням пробілів) 
            // або чи є масив зі значеннями
            !!(
                (typeof a.value === 'string' && a.value.trim() !== '') || 
                (a.values && a.values.length > 0)
            )
        );

        if (answeredInputs.length === 0) {
            return setLocalError('Answer at least one question.');
        }

        // 2. Явно приводимо відфільтрований масив до AnswerInput[]. 
        const answersPayload: AnswerInput[] = answeredInputs as AnswerInput[];


        try {
            // ВИКОРИСТОВУЄМО 'id' як formId
            await submitResponse({ formId: id, answers: answersPayload }).unwrap(); 
            // isSubmissionSuccess useEffect обробить перенаправлення
        } catch (err) {
            console.error('Submitting Error:', err);
            setLocalError('Error submitting the form. Please try again.');
        }
    };


    // Перевірка, чи завантаження завершилося і чи є дані форми
    if (isFormLoading) return <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>;
    
    // ------------------------------------------------------------------
    // ВІДОБРАЖЕННЯ ПОМИЛКИ
    // ------------------------------------------------------------------
    if (formError || !form) {
        let errorMessage = 'Not found.';
        if (formError) {
            try {
                if (typeof formError === 'object' && formError !== null) {
                    if ('message' in formError && typeof formError.message === 'string') {
                        errorMessage = formError.message;
                    } 
                    else if ('data' in formError && formError.data && typeof formError.data === 'object') {
                        errorMessage = JSON.stringify(formError.data, null, 2);
                    }
                    else {
                        errorMessage = JSON.stringify(formError, null, 2);
                    }
                } else {
                    errorMessage = String(formError);
                }
            } catch (e) {
                errorMessage = 'Unknown Error.';
            }
        }
        
        return (
            <div style={{ color: 'red', textAlign: 'left', padding: '20px', backgroundColor: '#fee', border: '1px solid #fbb', margin: '20px', borderRadius: '8px' }}>
                <h2 style={{marginTop: 0}}>Error while loading</h2>
                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontFamily: 'monospace', fontSize: '0.9em' }}>{errorMessage}</pre>
                <p>Check if your request is correct and the server is responding</p>
            </div>
        );
    }
    // ------------------------------------------------------------------


    // Перевірка наявності запитань
    if (!form.questions || form.questions.length === 0) return <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>This From have no questions</div>;
    
    // Якщо form.questions є, ми можемо відображати форму

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
          <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>&larr; Back to Dashboard</Link>
            <h1 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>{form.title}</h1>
            <p style={{ color: '#666', marginBottom: '1.5rem', borderLeft: '3px solid #ccc', paddingLeft: '10px' }}>{form.description}</p>

            {localError && <p style={{ color: localError.startsWith('Форма успішно') ? 'green' : 'red', fontWeight: 'bold', marginBottom: '1rem' }}>{localError}</p>}

            <form onSubmit={handleSubmit}>
                {form.questions.map((question: Question, index: number) => {
                    const answer = currentAnswers[index];
                    const answerValue = answer?.value || '';
                    const answerValues = answer?.values || [];

                    return (
                        <div key={question.id} style={{ marginBottom: '25px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
                                {index + 1}. {question.text}
                            </label>

                            {/* Текстове поле / Дата */}
                            {(question.type === QuestionType.TEXT || question.type === QuestionType.DATE) && (
                                <input
                                    type={question.type === QuestionType.TEXT ? 'text' : 'date'}
                                    value={answerValue}
                                    onChange={(e) => handleAnswerChange(index, e.target.value, question.type)}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                                />
                            )}

                            {/* Множинний вибір (Чекбокси) */}
                            {question.type === QuestionType.CHECKBOX && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {question.options?.map((option, optIndex) => (
                                        <label key={optIndex} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                value={option}
                                                checked={answerValues.includes(option)}
                                                onChange={(e) => handleCheckboxChange(index, option, e.target.checked)}
                                                style={{ marginRight: '10px' }}
                                            />
                                            {option}
                                        </label>
                                    ))}
                                </div>
                            )}

                            {/* Один вибір (Радіокнопки) */}
                            {question.type === QuestionType.MULTIPLE_CHOICE && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {question.options?.map((option, optIndex) => (
                                        <label key={optIndex} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name={`question-${question.id}`} // Важливо для групування радіокнопок
                                                value={option}
                                                checked={answerValue === option}
                                                onChange={(e) => handleAnswerChange(index, e.target.value, question.type)}
                                                style={{ marginRight: '10px' }}
                                            />
                                            {option}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                <button
                    type="submit"
                    disabled={isSubmissionLoading}
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1.1em',
                        cursor: isSubmissionLoading ? 'not-allowed' : 'pointer',
                        opacity: isSubmissionLoading ? 0.6 : 1,
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)'
                    }}
                >
                    {isSubmissionLoading ? 'Loading...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};