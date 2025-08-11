import React from 'react';
import { useNavigate } from 'react-router-dom';
import './notifications.css';
import NotificationList from './NotificationList';

export default function NotificationsPage() {
  const navigate = useNavigate();

  return (
    <div className="notifications-container">
      {/* 헤더 */}
      <div className="notifications-hero">
        <div className="hero-left">
          <h1>Notifications</h1>
          <p className="hero-sub">
            최신 공지와 업데이트를 한 곳에서 확인하세요.
          </p>
        </div>
        <div className="hero-right">
          <button
            className="btn-new"
            onClick={() => navigate('/notifications/new')}
          >
            + 새 공지 작성
          </button>
        </div>
      </div>

      {/* 리스트 영역 */}
      <div className="notification-page-content">
        <div className="content-card">
          <NotificationList />
        </div>
      </div>
    </div>
  );
}