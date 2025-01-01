import react from 'react';
import '../styles/profile_page.css';
import { useNavigate } from 'react-router-dom';

const Profile = () =>{
    
    const navigate = useNavigate();
    const LogOut = (e) => {
        e.preventDefault(); // Prevent default form submission
        navigate('/'); // Redirect to the signup page
        localStorage.removeItem("authToken");
    };

    return (
        <div className='container'>
            <div className='profile-tab'>
                <h1> Your Profile</h1>
                <button onClick={LogOut}>LogOut</button>
            </div>
        </div>
    );
};
//04-00-03
//11511883

export default Profile;