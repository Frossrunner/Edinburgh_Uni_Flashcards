import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '/components/Navbar';
import Help_FAQ from '/pages/help_FAQ';

// Dummy components for each page
const Notifications = () => <h1>Notifications Page</h1>;
const Community = () => <h1>Community Page</h1>;
const Stats = () => <h1>Stats Page</h1>;
const Classes = () => <h1>Classes Page</h1>;
const Profile = () => <h1>Profile Page</h1>;

function App() {
    return (
        <Router>
            <Navbar /> {/*navbar is always visible*/}
            <Routes>
                <Route path="/help_FAQ" element={<Help_FAQ />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/community" element={<Community />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/classes" element={<Classes />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </Router>
    );
}

export default App;
