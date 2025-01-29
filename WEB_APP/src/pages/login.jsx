import React, { useState } from 'react';
import '../styles/auth.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/user_context.jsx';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/login", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    password
                }),
                credentials: 'include' // Important for security
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            if (data.token) {
                // Store token securely
                localStorage.setItem("authToken", data.token);
                setUser({ id: data.id, email: data.email });
                navigate('/profile');
            }
        } catch (err) {
            setError(err.message || 'An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h1>Welcome Back</h1>
                
                {error && <div className="auth-error">{error}</div>}
                
                <div className="auth-field">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                </div>

                <div className="auth-field">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                </div>

                <div className="auth-actions">
                    <button 
                        type="submit" 
                        className="auth-primary-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                    <span className="auth-divider">or</span>
                    <button 
                        type="button"
                        className="auth-secondary-btn"
                        onClick={() => navigate('/sign_up')}
                    >
                        Sign up
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;