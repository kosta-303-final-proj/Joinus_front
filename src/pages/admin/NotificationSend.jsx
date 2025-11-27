import { useState } from 'react';
import './NotificationSend.css';

const initialForm = {
  title: '',
  content: '',
}

export default function NotificationSend() {
  const [formData, setFormData] = useState(initialForm);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('알림 발송:', formData);
    alert('알림이 발송되었습니다.');
    // 폼 초기화
    setFormData({
      title: '',
      content: '',
      targetType: '전체',
      targetCategory: '',
      sendType: '즉시',
      scheduledDate: '',
      scheduledTime: ''
    });
  };

  const handleCancel = () => {
    if (window.confirm('작성을 취소하시겠습니까?')) {
      setFormData({
        title: '',
        content: '',
        targetType: '전체',
        targetCategory: '',
        sendType: '즉시',
        scheduledDate: '',
        scheduledTime: ''
      });
    }
  };


  return (
    <div className="notification-send-page">
      {/* 헤더 */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">알림발송</h1>
          <p className="page-description">
            회원들에게 알림을 발송하고 발송 이력을 관리합니다.
          </p>
        </div>
        <div className="header-date">
          기준일: 2025-11-13
        </div>
      </div>

      {/* 알림 발송 폼 */}
      <div className="form-section">
        <form onSubmit={handleSubmit} className="notification-form">
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="title">
                제목 <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="알림 제목을 입력하세요"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="content">
                내용 <span className="required">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="알림 내용을 입력하세요"
                rows="6"
                required
              />
            </div>
          </div>

            {/* <div className="form-group">
              <label htmlFor="sendType">
                발송 방식 <span className="required">*</span>
              </label>
              <select
                id="sendType"
                name="sendType"
                value={formData.sendType}
                onChange={handleChange}
                required
              >
                <option value="즉시">즉시 발송</option>
                <option value="예약">예약 발송</option>
              </select>
            </div>
          </div>

          {formData.sendType === '예약' && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="scheduledDate">예약 일자</label>
                <input
                  type="date"
                  id="scheduledDate"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="scheduledTime">예약 시간</label>
                <input
                  type="time"
                  id="scheduledTime"
                  name="scheduledTime"
                  value={formData.scheduledTime}
                  onChange={handleChange}
                />
              </div>
            </div>
          )} */}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              취소
            </button>
            <button type="submit" className="btn-submit">
              발송하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

