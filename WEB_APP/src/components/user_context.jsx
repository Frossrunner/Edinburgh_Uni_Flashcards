import React, { createContext, useState, useContext } from 'react';

// Create UserContext
const UserContext = createContext();

// Create a Provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Store user data globally

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Create a custom hook for easy access to the context
export const useUser = () => useContext(UserContext);
