import React from 'react';
import '../pages/classes.jsx'
import { application } from 'express';

const classes = () => {
    
    
    const collect_classes = async () => {
        try {
            const response = await fetch('/api/classes', {
                method: 'GET',
                headers: { "Content-Type": "application/json" }
            });
    
            if (!response.ok) { // Check if response status is not 2xx
                alert('Problem collecting classes');
                return null;
            }
    
            const data = await response.json();
            return data; // Return the fetched data
        } catch (error) {
            console.error('Error fetching classes:', error);
            alert('An error occurred while collecting classes');
            return null;
        }
    };
    return (
        
    );
};