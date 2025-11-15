import React from 'react';
import { Link } from 'react-router-dom';
import { FormList } from '../components/HomeRelated/FormList';
import './UI/HomePage.css';

export const HomePage: React.FC = () => {
    return (
        <div className="homepage-container">
            <h1 className="homepage-title">Dashboard</h1>
            <Link 
                to="/forms/new" 
                className="create-button-link"
            >
                + Create a Form
            </Link>
            
            <div>
                <h2 className="section-title">All Forms</h2>
                <FormList />
            </div>
        </div>
    );
};