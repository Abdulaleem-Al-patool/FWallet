import { useNavigate } from "react-router-dom";
import { NotificationData } from "./NotificationData";

import "./NotificationBell.style.css";

export function NotificationBell({ children }) {

    const navigate = useNavigate();

    const unreadCount = NotificationData.filter(
        notification => !notification.IsRead
    ).length;

    const latestNotifications = NotificationData.slice(0, 3);


    const handleNotificationClick = (notification) => {

        navigate(
            `/transactions/${notification.userId}`,
            {
                state: {
                    transactionData: notification
                }
            }
        );

    };


    return (
        <div className="notification-bell-container">

            {/* الجرس الموجود في Header */}

            {children}


            {/* Dropdown */}

            <div className="notification-dropdown">

                {/* Header */}

                <div className="notification-dropdown-header">

                    <h3>
                        الإشعارات والتنبيهات
                    </h3>

                    <span>
                        {unreadCount} غير مقروءة
                    </span>

                </div>


                {/* Notifications */}

                <div className="notification-dropdown-list">

                    {latestNotifications.map((notification) => (

                        <div
                            key={notification.userId}
                            className="notification-preview"
                            onClick={() =>
                                handleNotificationClick(notification)
                            }
                        >

                            <div
                                className={`notification-preview-icon ${notification.type}`}
                            >
                                {notification.icon}
                            </div>


                            <div className="notification-preview-content">

                                <div className="notification-preview-title">

                                    {!notification.IsRead && (
                                        <span className="preview-unread-dot"></span>
                                    )}

                                    {notification.title}

                                </div>


                                <div className="notification-preview-message">
                                    {notification.message}
                                </div>


                                <div className="notification-preview-date">
                                    {notification.date}
                                </div>

                            </div>

                        </div>

                    ))}

                </div>


                {/* Footer */}

                <div className="notification-dropdown-footer">

                    <button
                        type="button"
                        onClick={() => navigate("/notifications")}
                    >
                        عرض جميع الإشعارات
                    </button>

                </div>

            </div>

        </div>
    );
}