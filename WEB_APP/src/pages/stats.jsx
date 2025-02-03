import React, { useState, useEffect } from 'react';
import { 
    LineChart, Line, BarChart, Bar, XAxis, YAxis, 
    CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import {getClasses, getStudySessions, getStudyStats, getDailyStudyData} from '../api/statsApi.js';
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
    const [timeRange, setTimeRange] = useState('week');
    const [classData, setClassDataState] = useState([]); // renamed from setClassData
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalStudied: 0,
        correctAnswers: 0,
        studyStreak: 0,
        averageTime: 0,
        accuracy: 0
    });
    const [studyData, setStudyData] = useState([]);

    const fetchAllData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Fetch stats and study data in parallel
            const [statsData, dailyData, classesData] = await Promise.all([
                getStudyStats(),
                getDailyStudyData(timeRange),
                processClassData()
            ]);

            // Update states with fetched data
            setStats(statsData);
            setStudyData(dailyData);
            setClassDataState(classesData);

        } catch (err) {
            setError(err.message);
            console.error('Error fetching data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data when component mounts or timeRange changes
    useEffect(() => {
        fetchAllData();
    }, [timeRange]);

    const processClassData = async () => {
        try {
            const classes = await getClasses();
            const study_sessions = await getStudySessions();
    
            const now = new Date();
            const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
            const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    
            const processedClasses = classes.map(classItem => {
                const classStudySessions = study_sessions.filter(
                    session => session.class_id === classItem.id
                );
    
                const stats = {
                    weekly: classStudySessions
                        .filter(session => new Date(session.start_time) >= weekAgo)
                        .reduce((total, session) => total + session.duration_minutes, 0),
                    
                    monthly: classStudySessions
                        .filter(session => new Date(session.start_time) >= monthAgo)
                        .reduce((total, session) => total + session.duration_minutes, 0),
                    
                    allTime: classStudySessions
                        .reduce((total, session) => total + session.duration_minutes, 0)
                };
    
                // Format the data to match the structure needed for the pie chart
                return {
                    name: classItem.name,
                    value: timeRange === 'week' ? stats.weekly : 
                           timeRange === 'month' ? stats.monthly : 
                           stats.allTime,
                    statistics: stats,
                    totalSessions: classStudySessions.length,
                    lastStudied: classStudySessions.length > 0 
                        ? new Date(Math.max(...classStudySessions.map(s => new Date(s.start_time))))
                        : null
                };
            });
    
            // Filter out classes with 0 value and sort by study time
            const filteredClasses = processedClasses
                .filter(cls => cls.value > 0)
                .sort((a, b) => b.value - a.value);
    
            return filteredClasses;
    
        } catch (error) {
            console.error("Error processing class data:", error);
            throw error;
        }
    };

    // Update data when timeRange changes
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await processClassData();
                setClassDataState(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [timeRange]); // Add timeRange as dependency

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
                        <h3>Total Duration Studied</h3>
                        <p>{stats.totalStudied} mins</p>
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
                                data={classData}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {classData.map((entry, index) => (
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