import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBell, 
    faCheck, 
    faTrash, 
    faShare,
    faBook,
    faUserGroup,
    faCircle
} from '@fortawesome/free-solid-svg-icons';
import '../styles/notifications.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'share',
            message: 'John shared a new deck: "Advanced Physics"',
            time: '2 hours ago',
            read: false
        },
        {
            id: 2,
            type: 'reminder',
            message: 'Time to review "Chemistry Basics" deck',
            time: '5 hours ago',
            read: false
        },
        {
            id: 3,
            type: 'social',
            message: 'Sarah commented on your deck',
            time: '1 day ago',
            read: true
        }
    ]);

    const getIcon = (type) => {
        switch(type) {
            case 'share':
                return faShare;
            case 'reminder':
                return faBook;
            case 'social':
                return faUserGroup;
            default:
                return faBell;
        }
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map(notif => 
            notif.id === id ? {...notif, read: true} : notif
        ));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(notif => notif.id !== id));
    };

    const markAllRead = () => {
        setNotifications(notifications.map(notif => ({...notif, read: true})));
    };

    return (
        <div className="notifications-container">
            <div className="notifications-content">
                <div className="notifications-header">
                    <h1>Notifications</h1>
                    <div className="notifications-actions">
                        <button onClick={markAllRead} className="mark-all-read">
                            <FontAwesomeIcon icon={faCheck} /> Mark all as read
                        </button>
                    </div>
                </div>

                <div className="notifications-list">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div 
                                key={notification.id} 
                                className={`notification-item ${notification.read ? 'read' : ''}`}
                            >
                                <div className="notification-icon">
                                    <FontAwesomeIcon icon={getIcon(notification.type)} />
                                </div>
                                <div className="notification-content">
                                    <p>{notification.message}</p>
                                    <span className="notification-time">{notification.time}</span>
                                </div>
                                <div className="notification-actions">
                                    {!notification.read && (
                                        <button 
                                            onClick={() => markAsRead(notification.id)}
                                            className="action-button read-button"
                                        >
                                            <FontAwesomeIcon icon={faCheck} />
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => deleteNotification(notification.id)}
                                        className="action-button delete-button"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                                {!notification.read && (
                                    <div className="unread-indicator">
                                        <FontAwesomeIcon icon={faCircle} />
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="no-notifications">
                            <FontAwesomeIcon icon={faBell} />
                            <p>No new notifications</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;