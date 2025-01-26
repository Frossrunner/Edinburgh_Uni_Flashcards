import react, { useState, createContext, useContext } from 'react';
import '../styles/login.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/user_context.jsx';

const Login = () =>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // React Router hook
    const [requireValidation, setRequireValidation] = useState(false);
    const { setUser } = useUser();

    const HandleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("/api/login",{
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({email, password}),
        });
        const data = await response.json();
        if (data.token){
            localStorage.setItem("authToken", data.token);
            setUser({ id: data.id, email: data.email });
            navigate('/profile');
        } else {
            alert('username or password incorrect');
        }
    };

    const handleSignUpClick = (e) => {
        e.preventDefault(); // Prevent default form submission
        navigate('/sign_up'); // Redirect to the signup page
    };
    
    return(
        <div className='container'>
            <form onSubmit={HandleSubmit} className='login-form'>
                <h1>Login</h1>
                <div className='field'>
                    <label>
                        Email:
                        <input
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required={requireValidation} // Add required only if validation is enabled
                        />
                    </label>
                </div>
                <div className='field'>
                    <label>
                        Password:
                        <input
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required={requireValidation} />
                    </label>
                </div>
                <div className='field'>
                    <button type="submit">
                        Login
                    </button>
                    <label>or</label>
                    <button onClick={handleSignUpClick}>
                        Sign up
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;