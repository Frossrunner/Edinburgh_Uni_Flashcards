import React, { useState } from 'react';
import '../styles/auth.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Password strength checking
    const checkPasswordStrength = (pass) => {
        let strength = 0;
        if (pass.length >= 8) strength++;
        if (/[A-Z]/.test(pass)) strength++;
        if (/[0-9]/.test(pass)) strength++;
        if (/[^A-Za-z0-9]/.test(pass)) strength++;
        return strength;
    };

    const getPasswordStrengthClass = () => {
        const strength = checkPasswordStrength(password);
        if (strength <= 1) return 'strength-weak';
        if (strength <= 3) return 'strength-medium';
        return 'strength-strong';
    };

    const validatePassword = () => {
        if (password.length < 8) {
            return "Password must be at least 8 characters long";
        }
        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter";
        }
        if (!/[0-9]/.test(password)) {
            return "Password must contain at least one number";
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
            return "Password must contain at least one special character";
        }
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validate passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Validate password strength
        const passwordError = validatePassword();
        if (passwordError) {
            setError(passwordError);
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/signup", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    password
                }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            // Successful signup
            navigate('/');
        } catch (err) {
            setError(err.message || 'An error occurred during signup');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h1>Create Account</h1>

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
                        autoComplete="new-password"
                    />
                    {password && (
                        <>
                            <div className="password-strength">
                                <div className={`password-strength-bar ${getPasswordStrengthClass()}`} />
                            </div>
                            <div className="password-requirements">
                                <div className={password.length >= 8 ? 'valid' : 'invalid'}>
                                    <FontAwesomeIcon icon={password.length >= 8 ? faCheck : faTimes} />
                                    <span>At least 8 characters</span>
                                </div>
                                <div className={/[A-Z]/.test(password) ? 'valid' : 'invalid'}>
                                    <FontAwesomeIcon icon={/[A-Z]/.test(password) ? faCheck : faTimes} />
                                    <span>One uppercase letter</span>
                                </div>
                                <div className={/[0-9]/.test(password) ? 'valid' : 'invalid'}>
                                    <FontAwesomeIcon icon={/[0-9]/.test(password) ? faCheck : faTimes} />
                                    <span>One number</span>
                                </div>
                                <div className={/[^A-Za-z0-9]/.test(password) ? 'valid' : 'invalid'}>
                                    <FontAwesomeIcon icon={/[^A-Za-z0-9]/.test(password) ? faCheck : faTimes} />
                                    <span>One special character</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="auth-field">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                </div>

                <div className="auth-actions">
                    <button 
                        type="submit" 
                        className="auth-primary-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                    <span className="auth-divider">or</span>
                    <button 
                        type="button"
                        className="auth-secondary-btn"
                        onClick={() => navigate('/')}
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SignUp;