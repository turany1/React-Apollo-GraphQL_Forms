import React from 'react';
import { Link } from 'react-router-dom';
import { useGetFormsQuery } from '../store/api/apiSlice.ts'; 
// import { useAppSelector } from '../hooks.ts'; 

function isFetchBaseQueryError(error: any): error is { error: string } {
    return typeof error === 'object' && error !== null && 'error' in error && typeof error.error === 'string';
}

function isErrorWithData(error: any): error is { data: { message?: string, errors?: any[] } } {
    return typeof error === 'object' && error !== null && 'data' in error && error.data !== null;
}

export const HomePage: React.FC = () => {
  const { data, isLoading, error } = useGetFormsQuery();
  const forms = data?.forms || [];

  const buttonStyle = { 
    padding: '10px 15px', 
    backgroundColor: '#007bff', 
    color: 'white', 
    textDecoration: 'none', 
    borderRadius: '8px', 
    fontWeight: 'bold',
    display: 'inline-block',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.2s'
  };

  const cardStyle = { 
    border: '1px solid #e0e0e0', 
    padding: '1.5rem', 
    marginBottom: '1rem', 
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    backgroundColor: '#fff'
  };

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

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Dashboard</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <Link 
          to="/forms/new" 
          style={buttonStyle}
        >
          + Create new From
        </Link>
      </div>
      
      <div>
        <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>All Forms</h2>
        
        {isLoading && <p>Loading...</p>}
        
        {errorMessage && <p style={{color: 'red', fontWeight: 'bold'}}>Error: {errorMessage}</p>}
        
        {!isLoading && forms.length === 0 && !error && (
            <p style={{fontStyle: 'italic', color: '#666'}}>There is no Forms. Create one!</p>
        )}

        {forms.map(form => (
          <div 
            key={form.id} 
            style={cardStyle}
          >
            <h3 style={{ marginTop: 0, color: '#007bff' }}>{form.title}</h3>
            <p style={{ color: '#555' }}>{form.description || 'Без опису'}</p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '15px' }}>
              <Link to={`/forms/${form.id}/fill`} style={{ color: '#28a745', textDecoration: 'none', fontWeight: 'bold' }}>Fill</Link>
              <span>|</span>
              <Link to={`/forms/${form.id}/responses`} style={{ color: '#ffc107', textDecoration: 'none', fontWeight: 'bold' }}>Answers</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};