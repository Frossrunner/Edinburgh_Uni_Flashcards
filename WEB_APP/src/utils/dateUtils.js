// utils/dateHelpers.js
const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

const getWeekDates = () => {
    const today = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        result.push({
            date: days[date.getDay()],
            fullDate: formatDate(date)
        });
    }
    
    return result;
};

module.exports = {
    formatDate,
    getWeekDates
};