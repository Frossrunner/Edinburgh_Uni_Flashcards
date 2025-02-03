const express = require("express");
const authenticateToken = require("../middleware/authenticatetoken.js");
const db = require("../db.js");
const router = express.Router();

//collect all classes
router.get("/stats/classes", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const [classes] = await db.execute(`
            SELECT 
                c.*,
                COUNT(DISTINCT ss.id) as total_sessions,
                SUM(ss.duration_minutes) as total_minutes
            FROM classes c
            LEFT JOIN study_sessions ss ON c.id = ss.class_id AND ss.user_id = ?
            WHERE c.user_id = ?
            GROUP BY c.id
        `, [userId, userId]);
        res.status(200).json(classes);
    } catch (error) {
        console.error("Error fetching classes:", error);
        res.status(500).json({ error: "An error occurred while fetching classes" });
    }
});

// Get study sessions
router.get("/stats/studied", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const [studySessions] = await db.execute(
            "SELECT * FROM study_sessions WHERE user_id = ? ORDER BY start_time DESC",
            [userId]
        );
        res.status(200).json(studySessions);
    } catch (error) {
        console.error("Error fetching study sessions:", error);
        res.status(500).json({ error: "An error occurred while fetching study sessions" });
    }
});

// Get study statistics summary
router.get("/stats/summary", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const [results] = await db.execute(`
            SELECT 
                SUM(duration_minutes) as totalStudied,
                COUNT(CASE WHEN correct = 1 THEN 1 END) as correctAnswers,
                (
                    SELECT COUNT(DISTINCT DATE(start_time)) 
                    FROM study_sessions 
                    WHERE user_id = ? 
                    AND start_time >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
                ) as studyStreak,
                ROUND(AVG(duration_minutes)) as averageTime,
                ROUND((COUNT(CASE WHEN correct = 1 THEN 1 END) / NULLIF(COUNT(*), 0)) * 100) as accuracy
            FROM study_sessions
            WHERE user_id = ?
        `, [userId, userId]);

        const stats = results[0] || {
            totalStudied: 0,
            correctAnswers: 0,
            studyStreak: 0,
            averageTime: 0,
            accuracy: 0
        };

        res.status(200).json(stats);
    } catch (error) {
        console.error("Error fetching study statistics:", error);
        res.status(500).json({ error: "An error occurred while fetching study statistics" });
    }
});

// Get daily study data
router.get("/stats/daily", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const timeRange = req.query.range || 'week';

        const [results] = await db.execute(`
            SELECT 
                DATE(start_time) as full_date,
                DATE_FORMAT(DATE(start_time), '%a') as date,
                COUNT(*) as cards,
                SUM(duration_minutes) as time
            FROM study_sessions
            WHERE user_id = ? 
            AND start_time >= CASE 
                WHEN ? = 'week' THEN DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)
                WHEN ? = 'month' THEN DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
                ELSE DATE_SUB(CURRENT_DATE, INTERVAL 365 DAY)
            END
            GROUP BY DATE(start_time), DATE_FORMAT(DATE(start_time), '%a')
            ORDER BY full_date
        `, [userId, timeRange, timeRange]);

        if (timeRange === 'week') {
            const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const filledData = daysOfWeek.map(day => {
                const dayData = results.find(r => r.date === day);
                return dayData || { date: day, cards: 0, time: 0 };
            });
            res.status(200).json(filledData);
        } else {
            res.status(200).json(results);
        }
    } catch (error) {
        console.error("Error fetching daily study data:", error);
        res.status(500).json({ error: "An error occurred while fetching daily study data" });
    }
});

module.exports = router;