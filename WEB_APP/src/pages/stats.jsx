import React, { useState, useEffect } from 'react';
import { 
    LineChart, Line, BarChart, Bar, XAxis, YAxis, 
    CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCalendarAlt, 
    faClock, 
    faCheckCircle,
    faTimesCircle,
    faChartLine,
    faBook
} from '@fortawesome/free-solid-svg-icons';
import '../styles/stats.css';

const StatsTab = () => {
    // Example data - replace with real data from your API
    const [timeRange, setTimeRange] = useState('week');
    const [stats, setStats] = useState({
        totalStudied: 1250,
        correctAnswers: 875,
        studyStreak: 7,
        averageTime: 25,
        accuracy: 78
    });

    const studyData = [
        { date: 'Mon', cards: 45, time: 20 },
        { date: 'Tue', cards: 52, time: 25 },
        { date: 'Wed', cards: 38, time: 18 },
        { date: 'Thu', cards: 65, time: 30 },
        { date: 'Fri', cards: 48, time: 22 },
        { date: 'Sat', cards: 55, time: 28 },
        { date: 'Sun', cards: 42, time: 20 }
    ];

    const subjectData = [
        { name: 'Math', value: 30 },
        { name: 'Science', value: 25 },
        { name: 'History', value: 20 },
        { name: 'Language', value: 25 }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="stats-container">
            <div className="stats-header">
                <h1>Study Statistics</h1>
                <div className="stats-time-filter">
                    <button 
                        className={timeRange === 'week' ? 'active' : ''} 
                        onClick={() => setTimeRange('week')}
                    >
                        Week
                    </button>
                    <button 
                        className={timeRange === 'month' ? 'active' : ''} 
                        onClick={() => setTimeRange('month')}
                    >
                        Month
                    </button>
                    <button 
                        className={timeRange === 'year' ? 'active' : ''} 
                        onClick={() => setTimeRange('year')}
                    >
                        Year
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                {/* Quick Stats Cards */}
                <div className="stats-card">
                    <div className="stats-card-icon">
                        <FontAwesomeIcon icon={faBook} />
                    </div>
                    <div className="stats-card-content">
                        <h3>Total Cards Studied</h3>
                        <p>{stats.totalStudied}</p>
                    </div>
                </div>

                <div className="stats-card">
                    <div className="stats-card-icon">
                        <FontAwesomeIcon icon={faCheckCircle} />
                    </div>
                    <div className="stats-card-content">
                        <h3>Accuracy Rate</h3>
                        <p>{stats.accuracy}%</p>
                    </div>
                </div>

                <div className="stats-card">
                    <div className="stats-card-icon">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                    </div>
                    <div className="stats-card-content">
                        <h3>Study Streak</h3>
                        <p>{stats.studyStreak} days</p>
                    </div>
                </div>

                <div className="stats-card">
                    <div className="stats-card-icon">
                        <FontAwesomeIcon icon={faClock} />
                    </div>
                    <div className="stats-card-content">
                        <h3>Average Study Time</h3>
                        <p>{stats.averageTime} min</p>
                    </div>
                </div>

                {/* Charts */}
                <div className="stats-chart-card span-2">
                    <h3>Study Progress</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={studyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line 
                                type="monotone" 
                                dataKey="cards" 
                                stroke="#8884d8" 
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="stats-chart-card">
                    <h3>Subject Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={subjectData}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {subjectData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="stats-chart-card">
                    <h3>Study Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={studyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="time" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default StatsTab;