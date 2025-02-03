export const getClasses = async () => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`Api/stats/classes`, {
            method: 'GET',
            headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                    }
        });
        if (!response.ok) {
            throw new Error(`Error fetching classes: ${response.statusText}`);
        }
        const classData = await response.json();
        return classData;

    }catch(error){
        console.log("frontend error collecting decks");
        throw error;
    }
};

export const getStudySessions = async () => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`Api/stats/studied`, {
            method: 'GET',
            headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                    }
        });
        if (!response.ok) {
            throw new Error(`Error fetching study sessions: ${response.statusText}`);
        }
        const StudySessions = await response.json();
        return StudySessions;

    }catch(error){
        console.log("frontend error collecting study sessions");
        throw error;
    }
}

export const getStudyStats = async () => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`Api/stats/summary`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching study stats: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching study stats:", error);
        throw error;
    }
};

export const getDailyStudyData = async (timeRange) => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`Api/stats/daily?range=${timeRange}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching daily study data: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching daily study data:", error);
        throw error;
    }
};
