import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Import your main web app component
import './styles/general_style.css';
import { UserProvider } from './components/user_context.jsx';

// Render the React app into the root element
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <UserProvider>
            <App />
        </UserProvider>
    </React.StrictMode>
);
