// utils/dateHelpers.js
export const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

export const getWeekDates = () => {
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

export const insert = (list, element, index) => {
    // Create a copy of the list
    const newList = [...list];

    // If index is out of range (greater than length), append to end
    if (index >= newList.length) {
        newList.push(element);
    }
    // If index is negative or within range, use splice
    else {
        // Handle negative indices by setting to 0
        const insertIndex = Math.max(0, index);
        newList.splice(insertIndex, 0, element);
    }

    return newList;
};