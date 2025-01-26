import react, { useState }from 'react';
import '../styles/sign_up.css';
import { useNavigate } from 'react-router-dom';

const SignUp = () =>{

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // React Router hook

    const HandleLogin = async (e) => {
        e.preventDefault();
        console.log(email);
        console.log(password);
        const response = await fetch("/api/login",{
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({email, password}),
        });
        const data = await response.json();
        if (data.token){
            localStorage.setItem("authToken", data.token);
            navigate('/profile');
        } else {
            alert('username or password incorrect');
        }
    };

    const HandleSubmit = async (e) => {
        e.preventDefault();
        console.log('submit');
        const response = await fetch("/api/signup",{
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password}),
        });
        const data = await response.json();
        navigate('/');
    };

    const ToLogin = (e) => {
        e.preventDefault(); // Prevent default form submission
        navigate('/'); // Redirect to the signup page
    };

    return(
        <div className='container'>
            <form onSubmit={HandleSubmit} className='login-form'>
                <h1>SignUp</h1>
                <div className='field'>
                    <label>
                        Email:
                        <input
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
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
                            required/>
                    </label>
                </div>
                <div className='field'>
                    <button type="submit">
                        Sign Up
                    </button>
                    <label> or </label>
                    <button onClick={ToLogin}>
                        Go to Login
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SignUp;