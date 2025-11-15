import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QuestionType } from '@react-apollo-graphql-forms/common';
import { useCreateFormMutation } from '../store/api/apiSlice.ts';
import { Question } from '../store/api/types.ts'; 

// Визначаємо локальний тип для стану запитання, включаючи тимчасовий ID для React key
interface FormQuestion extends Omit<Question, 'id'> {
    tempId: number;
}

// ----------------------------------------------------------------------
// 1. ВИЗНАЧЕННЯ QuestionCard (ВИВЕДЕНО З ГЛАВНОГО КОМПОНЕНТА)
// ----------------------------------------------------------------------

interface QuestionCardProps {
    question: FormQuestion;
    onUpdate: (tempId: number, field: keyof FormQuestion, value: any) => void;
    onUpdateOptions: (tempId: number, optionsString: string) => void;
    onDelete: (tempId: number) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onUpdate, onUpdateOptions, onDelete }) => {
    
    // Перевіряємо, чи існує options, і якщо ні, повертаємо порожній рядок для TextArea
    const optionsValue = question.options ? question.options.join('\n') : '';

    return (
        <div style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.9em', color: '#666' }}>Type: {question.type}</span>
                <button 
                    onClick={() => onDelete(question.tempId)}
                    style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Delete
                </button>
            </div>

            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Question:</label>
            <input
                type="text"
                value={question.text}
                // Використовуємо onUpdate, переданий з батьківського компонента
                onChange={(e) => onUpdate(question.tempId, 'text', e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px' }}
            />

            {/* Поля для варіантів відповідей */}
            {(question.type === QuestionType.MULTIPLE_CHOICE || question.type === QuestionType.CHECKBOX) && (
                <>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Optiont(one per row):</label>
                    <textarea
                        value={optionsValue}
                        // Використовуємо onUpdateOptions, переданий з батьківського компонента
                        onChange={(e) => onUpdateOptions(question.tempId, e.target.value)}
                        rows={4}
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                </>
            )}
        </div>
    );
};


// ----------------------------------------------------------------------
// 2. FormBuilderPage
// ----------------------------------------------------------------------

export const FormBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const [createForm, { isLoading }] = useCreateFormMutation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  const [nextTempId, setNextTempId] = useState(1);
  const [error, setError] = useState('');

  // 1. Додавання нового запитання
  const handleAddQuestion = (type: QuestionType) => {
    const newQuestion: FormQuestion = {
      tempId: nextTempId,
      text: `New question ${nextTempId}`,
      type: type,
      options: type === QuestionType.MULTIPLE_CHOICE || type === QuestionType.CHECKBOX ? ['Option'] : undefined,
    };
    setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
    setNextTempId(prev => prev + 1);
  };

  // 2. Оновлення полів запитання (Гарантована незмінність)
  const handleUpdateQuestion = (tempId: number, field: keyof FormQuestion, value: any) => {
    setQuestions(prevQuestions => prevQuestions.map(q => 
      q.tempId === tempId ? { ...q, [field]: value } : q
    ));
  };

  // 3. Оновлення варіантів відповідей
  const handleUpdateOptions = (tempId: number, optionsString: string) => {
    // Вхід: рядок, розділений переносами. Ми не фільтруємо порожні рядки, щоб бачити їх під час набору.
    const newOptions = optionsString.split('\n'); 
    
    setQuestions(prevQuestions => prevQuestions.map(q => 
        q.tempId === tempId ? { ...q, options: newOptions } : q
    ));
  };
    
  // 4. Видалення запитання
  const handleDeleteQuestion = (tempId: number) => {
    setQuestions(prevQuestions => prevQuestions.filter(q => q.tempId !== tempId));
  };

  // 5. Надсилання форми на сервер
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || questions.length === 0) {
      setError('Please add a title and at least one question.');
      return;
    }

    try {
        // Структуруємо дані для мутації (видаляємо tempId)
        const payloadQuestions = questions.map(({ tempId, ...rest }) => ({
            ...rest,
            // Фільтруємо/очищаємо варіанти (видаляємо пробіли та порожні рядки) лише перед надсиланням
            options: rest.options?.map(opt => opt.trim()).filter(opt => opt.length > 0) || [], 
        }));

        await createForm({ title, description, questions: payloadQuestions }).unwrap();
        navigate('/'); // Перенаправляємо на головну сторінку після успішного створення

    } catch (err) {
      console.error('Error:', err);
      setError('Could not create form. Please try again.');
    }
  };


  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>&larr; Back to Dashboard</Link>
      <h1 style={{ marginTop: '1rem', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Formbuilder</h1>

      {error && <p style={{ color: 'red', fontWeight: 'bold', marginBottom: '1rem' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* 1. Назва та опис форми (працюють коректно, оскільки використовують локальний стан) */}
        <div style={{ marginBottom: '1.5rem', border: '1px solid #007bff', padding: '15px', borderRadius: '8px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#000000ff' }}>Title:</label>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', padding: '10px', fontSize: '1.2em', border: '1px solid #007bff', borderRadius: '4px', marginBottom: '10px' }}
                placeholder="Form Title"
            />
            
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Опис:</label>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                placeholder="Description (optional)"
            />
        </div>

        {/* 2. Список запитань */}
        <h2 style={{ marginBottom: '1rem', color: '#333' }}>Questions ({questions.length})</h2>
        {questions.length === 0 && <p style={{ fontStyle: 'italic', color: '#666' }}>Add your first question</p>}
        
        {questions.map(q => (
          <QuestionCard 
            key={q.tempId} 
            question={q} 
            onUpdate={handleUpdateQuestion}
            onUpdateOptions={handleUpdateOptions}
            onDelete={handleDeleteQuestion}
          />
        ))}

        {/* 3. Кнопки додавання запитань */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', borderTop: '2px solid #eee', paddingTop: '15px', flexWrap: 'wrap' }}>
            <button 
                type="button" 
                onClick={() => handleAddQuestion(QuestionType.TEXT)}
                style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
                + TextField
            </button>
            <button 
                type="button" 
                onClick={() => handleAddQuestion(QuestionType.MULTIPLE_CHOICE)}
                style={{ padding: '10px 15px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
                + Multiple Choice
            </button>
            <button 
                type="button" 
                onClick={() => handleAddQuestion(QuestionType.CHECKBOX)}
                style={{ padding: '10px 15px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
                + Checkbox
            </button>
            <button 
                type="button" 
                onClick={() => handleAddQuestion(QuestionType.DATE)}
                style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
                + Date
            </button>
        </div>

        {/* 4. Кнопка надсилання */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1em',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)'
          }}
        >
          {isLoading ? 'Creating...' : 'Save'}
        </button>
      </form>
    </div>
  );
};