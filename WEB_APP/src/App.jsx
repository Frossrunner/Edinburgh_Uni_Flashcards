import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HelpFAQ from './pages/help_FAQ';
import NotificationsTab from './pages/notifications.jsx';
import StatsTab from './pages/stats.jsx';
import CommunityTab from './pages/community.jsx';
import Profile from './pages/profile.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/sign_up.jsx';
import Classes from './pages/classes.jsx';

const ProtectedRoute = ({ element }) => {
    const token = localStorage.getItem("authToken");
    return token ? element : <Login />;
  };

function App() {
    return (
        <Router>
            <Navbar /> {/*navbar is always visible*/}
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/sign_up" element={<SignUp />}/>
                <Route path="/help_faq" element={<ProtectedRoute element={<HelpFAQ />} />} />
                <Route path="/notifications" element={<ProtectedRoute element={<NotificationsTab />} />} />
                <Route path="/community" element={<ProtectedRoute element={<CommunityTab />} />} />
                <Route path="/stats" element={<ProtectedRoute element={<StatsTab />} />} />
                <Route path="/classes" element={<ProtectedRoute element={<Classes />} />} />
                <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
            </Routes>

        </Router>
    );
}

export default App;
