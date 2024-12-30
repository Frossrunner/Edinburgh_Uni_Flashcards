import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HelpFAQ from './pages/help_FAQ';
import NotificationsTab from './pages/notifications.jsx';
import StatsTab from './pages/stats.jsx';
import CommunityTab from './pages/community.jsx';
import Profile from './pages/profile.jsx';

// Dummy components for each page
const Classes = () => <h1></h1>;

function App() {
    return (
        <Router>
            <Navbar /> {/*navbar is always visible*/}
            <Routes>
                <Route path="/help_faq" element={<HelpFAQ />} />
                <Route path="/notifications" element={<NotificationsTab />} />
                <Route path="/community" element={<CommunityTab />} />
                <Route path="/stats" element={<StatsTab />} />
                <Route path="/classes" element={<Classes />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </Router>
    );
}

export default App;
