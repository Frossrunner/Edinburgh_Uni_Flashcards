import React from 'react';
import '../styles/classes.css';

const ClassWindow = ({classData}) => {

    return(
        <div className='classes-window'>
            <div className='classes-edit-info'>
                <button className='edit-button'>...</button>
            </div>
            <button className='class-window-button'>
                <h1>
                    {classData.name || 'Name'};
                </h1>
            </button>
            <p>
                {classData.description || 'Description'}
            </p>
        </div>
    );
};

export default ClassWindow;