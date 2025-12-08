import { useState, useEffect } from 'react';
import { apiFetch } from '../../config';
import './NotificationSend.css';

const initialForm = {
  title: '',
  content: '',
  gbProductId: '', // 선택사항
}

// 날짜 포맷팅 함수
const formatDateTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function NotificationSend() {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  
  // 발송 이력 관련 상태
  const [notificationList, setNotificationList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listError, setListError] = useState(null);
  
  // 상세 정보 관련 상태
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // 발송 이력 목록 조회
  const fetchNotificationList = async () => {
    setIsLoading(true);
    setListError(null);
    try {
      const response = await apiFetch('/api/admin/notifications');
      if (!response.ok) {
        throw new Error('발송 이력 조회 실패');
      }
      const data = await response.json();
      setNotificationList(data || []);
    } catch (error) {
      console.error('발송 이력 조회 실패:', error);
      if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
        setListError('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      } else {
        setListError('발송 이력을 불러올 수 없습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로드 시 발송 이력 조회
  useEffect(() => {
    fetchNotificationList();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // 입력 시 에러 메시지 초기화
    if (submitError) setSubmitError(null);
    if (submitSuccess) setSubmitSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!formData.title.trim()) {
      setSubmitError('제목을 입력해주세요.');
      return;
    }
    if (!formData.content.trim()) {
      setSubmitError('내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const requestData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
      };
      
      // gbProductId가 있으면 추가
      if (formData.gbProductId && formData.gbProductId.trim()) {
        requestData.gbProductId = formData.gbProductId.trim();
      }

      const response = await apiFetch('/api/admin/notifications', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('알림 발송에 실패했습니다.');
      }

      const result = await response.json();
      
      if (result) {
        setSubmitSuccess('알림이 성공적으로 발송되었습니다.');
        // 폼 초기화
        setFormData(initialForm);
        // 발송 이력 목록 갱신
        fetchNotificationList();
        
        // 3초 후 성공 메시지 제거
        setTimeout(() => {
          setSubmitSuccess(null);
        }, 3000);
      } else {
        throw new Error('알림 발송에 실패했습니다.');
      }
    } catch (error) {
      console.error('알림 발송 실패:', error);
      if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
        setSubmitError('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      } else {
        setSubmitError(error.message || '알림 발송에 실패했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('작성을 취소하시겠습니까?')) {
      setFormData(initialForm);
      setSubmitError(null);
      setSubmitSuccess(null);
    }
  };

  // 발송 이력 상세 조회
  const handleDetailClick = async (id) => {
    setIsDetailLoading(true);
    setShowDetailModal(true);
    setSelectedNotification(null);
    
    try {
      const response = await apiFetch(`/api/admin/notifications/${id}`);
      if (!response.ok) {
        throw new Error('상세 정보 조회 실패');
      }
      const data = await response.json();
      setSelectedNotification(data);
    } catch (error) {
      console.error('상세 정보 조회 실패:', error);
      alert('상세 정보를 불러올 수 없습니다.');
    } finally {
      setIsDetailLoading(false);
    }
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedNotification(null);
  };

  // 현재 날짜 표시
  const currentDate = formatDate(new Date());

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
          기준일: {currentDate}
        </div>
      </div>

      {/* 알림 발송 폼 */}
      <div className="form-section">
        <form onSubmit={handleSubmit} className="notification-form">
          {/* 에러 메시지 */}
          {submitError && (
            <div className="error-message" style={{ 
              padding: '12px', 
              backgroundColor: '#fee', 
              border: '1px solid #fcc', 
              borderRadius: '4px', 
              color: '#c33',
              marginBottom: '16px'
            }}>
              {submitError}
            </div>
          )}

          {/* 성공 메시지 */}
          {submitSuccess && (
            <div className="success-message" style={{ 
              padding: '12px', 
              backgroundColor: '#efe', 
              border: '1px solid #cfc', 
              borderRadius: '4px', 
              color: '#3c3',
              marginBottom: '16px'
            }}>
              {submitSuccess}
            </div>
          )}

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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="gbProductId">
                공구 상품 ID (선택사항)
              </label>
              <input
                type="text"
                id="gbProductId"
                name="gbProductId"
                value={formData.gbProductId}
                onChange={handleChange}
                placeholder="공구 상품 ID를 입력하세요 (선택사항)"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              취소
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? '발송 중...' : '발송하기'}
            </button>
          </div>
        </form>
      </div>

      {/* 발송 이력 섹션 */}
      <div className="history-section">
        <div className="notification-section-header">
          <h2 className="section-title">발송 이력</h2>
          <span className="history-count">
            총 {notificationList.length}건
          </span>
        </div>

        {isLoading ? (
          <div className="loading" style={{ padding: '20px', textAlign: 'center' }}>
            로딩 중...
          </div>
        ) : listError ? (
          <div className="error-message" style={{ 
            padding: '20px', 
            textAlign: 'center', 
            color: '#c33' 
          }}>
            {listError}
          </div>
        ) : (
          <div className="table-container">
            <table className="notification-table">
              <thead>
                <tr>
                  <th>제목</th>
                  <th>내용</th>
                  <th>수신자 수</th>
                  <th>발송 일시</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {notificationList.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                      발송된 알림이 없습니다.
                    </td>
                  </tr>
                ) : (
                  notificationList.map((notification) => (
                    <tr key={notification.id}>
                      <td className="title-cell">{notification.title}</td>
                      <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {notification.content}
                      </td>
                      <td>{notification.receiverCount}명</td>
                      <td>{formatDateTime(notification.createdAt)}</td>
                      <td>
                        <button
                          className="detail-button"
                          onClick={() => handleDetailClick(notification.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#f0f0f0',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          상세보기
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 상세 정보 모달 */}
      {showDetailModal && (
        <div 
          className="modal-overlay" 
          onClick={handleCloseModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
        >
          <div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '24px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>알림 상세 정보</h2>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#999'
                }}
              >
                ×
              </button>
            </div>

            {isDetailLoading ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>로딩 중...</div>
            ) : selectedNotification ? (
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: '#666' }}>
                    제목
                  </label>
                  <div style={{ padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                    {selectedNotification.title}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: '#666' }}>
                    내용
                  </label>
                  <div style={{ padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>
                    {selectedNotification.content}
                  </div>
                </div>

                {selectedNotification.gbProductId && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: '#666' }}>
                      공구 상품 ID
                    </label>
                    <div style={{ padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                      {selectedNotification.gbProductId}
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: '#666' }}>
                    발송 일시
                  </label>
                  <div style={{ padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                    {formatDateTime(selectedNotification.createdAt)}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: '#666' }}>
                    수신자 목록 ({selectedNotification.receivers?.length || 0}명)
                  </label>
                  <div style={{ 
                    padding: '12px', 
                    backgroundColor: '#f9f9f9', 
                    borderRadius: '4px',
                    maxHeight: '200px',
                    overflow: 'auto'
                  }}>
                    {selectedNotification.receivers && selectedNotification.receivers.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {selectedNotification.receivers.map((username, index) => (
                          <span 
                            key={index}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: 'white',
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              fontSize: '12px'
                            }}
                          >
                            {username}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: '#999' }}>수신자가 없습니다.</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                상세 정보를 불러올 수 없습니다.
              </div>
            )}

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button
                onClick={handleCloseModal}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

