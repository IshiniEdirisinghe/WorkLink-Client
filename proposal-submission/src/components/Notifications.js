import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications from the backend
    axios.get('http://localhost:5000/api/notifications')
      .then((response) => setNotifications(response.data))
      .catch((error) => console.error('Error fetching notifications:', error));
  }, []);

  const handleViewProposal = (proposalId) => {
    // Redirect to the proposal page
    window.location.href = `/proposal/${proposalId}`;
  };

  const handleAction = (notificationId, action) => {
    // Accept or reject the proposal
    axios.post(`http://localhost:5000/api/notifications/${notificationId}`, { action })
      .then(() => {
        // Update the notifications list
        setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      })
      .catch((error) => console.error('Error updating notification:', error));
  };

  return (
    <div className="notifications-panel">
      <h1>Notifications</h1>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification._id}>
              <p>{notification.message}</p>
              <button onClick={() => handleViewProposal(notification.proposalId)}>View Proposal</button>
              <button onClick={() => handleAction(notification._id, 'accept')}>Accept</button>
              <button onClick={() => handleAction(notification._id, 'reject')}>Reject</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
