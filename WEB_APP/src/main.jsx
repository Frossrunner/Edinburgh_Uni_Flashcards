import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Import your main web app component
import './styles/general_style.css';

// Render the React app into the root element
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
