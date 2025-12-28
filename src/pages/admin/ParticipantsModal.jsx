import React, { useState, useEffect } from 'react';
import { myAxios } from '../../config';
import NotificationSendModal from './NotificationSendModal';
import './ParticipantsModal.css';

const ParticipantsModal = ({ productId, productName, onClose }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const response = await myAxios().get(`/admin/gbProduct/${productId}/participants`);
        console.log('참여인원 데이터:', response.data);  // ✅ 디버깅
        setParticipants(response.data);
      } catch (error) {
        console.error('참여인원 조회 실패:', error);
        alert('참여인원 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [productId]);

  const handleOpenNotificationModal = () => {
    if (participants.length === 0) {
      alert('참여인원이 없어 알림을 발송할 수 없습니다.');
      return;
    }
    setShowNotificationModal(true);
  };

  const handleSendNotification = async ({ title, content }) => {
    try {
      await myAxios().post(`/admin/gbProduct/${productId}/notify`, {
        title,
        content
      });
      alert(`알림이 ${participants.length}명에게 발송되었습니다!`);
      setShowNotificationModal(false);
    } catch (error) {
      console.error('알림 발송 실패:', error);
      alert('알림 발송에 실패했습니다.');
    }
  };

  const handleCancelGbProduct = async () => {
    if (!cancelReason.trim()) {
      alert('취소 사유를 입력해주세요.');
      return;
    }

    if (!window.confirm(
      '공구를 취소하시겠습니까?\n' +
      '- 참여자들에게 간단한 알림이 자동 발송됩니다.\n' +
      '- 자세한 사항은 "알림 발송" 기능을 이용해주세요.\n' +
      '- 환불 처리가 진행됩니다.'
    )) {
      return;
    }

    try {
      await myAxios().post(`/admin/gbProduct/${productId}/cancel`, {
        reason: cancelReason
      });
      alert(
        '공구가 취소되었습니다.\n' +
        '- 간단한 알림이 발송되었습니다.\n' +
        '- 자세한 안내는 "알림 발송"을 이용해주세요.\n' +
        '- 환불 처리가 완료되었습니다.'
      );
      setShowCancelModal(false);
      setCancelReason('');
      onClose();
    } catch (error) {
      console.error('공구 취소 실패:', error);
      alert('공구 취소에 실패했습니다.');
    }
  };

  // ========================================
  // ✅ 옵션 표시 헬퍼 함수
  // ========================================
  const formatOptions = (options) => {
    if (!options || options.length === 0) return '-';
    return options.map(opt => opt.optionName).join(', ');
  };

  // ========================================
  // ✅ 총 수량 계산
  // ========================================
  const getTotalQuantity = (options) => {
    if (!options || options.length === 0) return 0;
    return options.reduce((sum, opt) => sum + (opt.quantity || 0), 0);
  };

  return (
    <>
      <div className="participants-modal-overlay" onClick={onClose}>
        <div className="participants-modal-content" onClick={(e) => e.stopPropagation()}>
          
          <div className="participants-modal-header">
            <h2>참여인원 목록</h2>
            <button className="participants-modal-close-btn" onClick={onClose}>×</button>
          </div>

          <div className="participants-modal-body">
            {loading ? (
              <div className="participants-modal-loading">로딩 중...</div>
            ) : participants.length === 0 ? (
              <div className="participants-modal-empty">
                <p>참여한 인원이 없습니다.</p>
              </div>
            ) : (
              <>
                <div className="participants-modal-summary">
                  <span>총 참여인원: <strong>{participants.length}명</strong></span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="participants-modal-notify-btn"
                      onClick={handleOpenNotificationModal}
                    >
                      📢 알림 발송
                    </button>
                    <button 
                      className="participants-modal-cancel-btn"
                      onClick={() => setShowCancelModal(true)}
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      ❌ 공구 취소
                    </button>
                  </div>
                </div>

                {/* ✅ 테이블 수정 */}
                <div className="participants-modal-table-wrapper">
                  <table className="participants-modal-table">
                    <thead>
                      <tr>
                        <th>주문번호</th>
                        <th>주문일</th>
                        <th>주문자명</th>
                        {/* <th>옵션명</th> */}
                        <th>수량</th>
                        <th>결제금액</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((p, index) => (
                        <tr key={`${p.orderId}-${index}`}>
                          <td>{p.orderId}</td>
                          <td>
                            {p.orderDate 
                              ? new Date(p.orderDate).toLocaleDateString('ko-KR')
                              : '-'}
                          </td>
                          <td>{p.customerName}</td>
                          
                          {/* 옵션명 */}
                          {/* <td>{formatOptions(p.options)}</td> */}
                          
                          {/* ✅ 총 수량 표시 */}
                          <td>{getTotalQuantity(p.options)}</td>
                          
                          <td>{p.paymentAmount?.toLocaleString()}원</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          <div className="participants-modal-footer">
            <button className="participants-modal-close-footer-btn" onClick={onClose}>
              닫기
            </button>
          </div>
        </div>
      </div>

      {showNotificationModal && (
        <NotificationSendModal
          productId={productId}
          productName={productName}
          onClose={() => setShowNotificationModal(false)}
          onSend={handleSendNotification}
        />
      )}

      {showCancelModal && (
        <div className="notification-modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="notification-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="notification-modal-header">
              <h2>공구 취소</h2>
              <button className="notification-modal-close-btn" onClick={() => setShowCancelModal(false)}>×</button>
            </div>

            <div className="notification-modal-body">
              <div className="notification-modal-field">
                <label>공구 상품</label>
                <div className="notification-modal-product-info">
                  <strong>{productName}</strong> (ID: {productId})
                </div>
              </div>

              <div className="notification-modal-field">
                <label>취소 사유 (간단히) *</label>
                <textarea 
                  placeholder="예: 재고 부족으로 인한 취소"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="notification-modal-textarea"
                  rows={4}
                  maxLength={200}
                />
                <small className="notification-modal-hint">
                  {cancelReason.length}/200자 (자세한 안내는 "알림 발송" 이용)
                </small>
              </div>

              <div style={{
                padding: '12px',
                backgroundColor: '#fff3cd',
                border: '1px solid #ffc107',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#856404'
              }}>
                <strong>안내:</strong>
                <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                  <li>간단한 취소 알림이 자동 발송됩니다</li>
                  <li>자세한 사과문은 "알림 발송" 기능을 이용하세요</li>
                  <li>환불은 자동으로 처리됩니다</li>
                </ul>
              </div>
            </div>

            <div className="notification-modal-footer">
              <button 
                className="notification-modal-btn secondary" 
                onClick={() => setShowCancelModal(false)}
              >
                취소
              </button>
              <button 
                className="notification-modal-btn primary" 
                onClick={handleCancelGbProduct}
                style={{ backgroundColor: '#ef4444' }}
              >
                공구 취소 확정
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ParticipantsModal;