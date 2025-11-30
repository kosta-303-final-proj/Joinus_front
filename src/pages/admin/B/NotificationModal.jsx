import React, { useState } from 'react';
import './NotificationModal.css';

const NotificationModal = ({ selectedProducts, onClose, onSend }) => {
  const [notificationType, setNotificationType] = useState('배송 지연');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSend = () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    
    onSend({
      products: selectedProducts,
      type: notificationType,
      title,
      content
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">알림 발송하기</h2>
        
        {/* 선택된 공구 */}
        <div className="modal-field">
          <label>선택된 공구 (공구코드)</label>
          <div className="selected-products">
            {selectedProducts.map(p => `${p.name}... (${p.code})`).join(', ')}
          </div>
        </div>

        {/* 알림 유형...없어도 될듯 */}
        {/* <div className="modal-field">
          <label>알림 유형</label>
          <select 
            value={notificationType}
            onChange={(e) => setNotificationType(e.target.value)}
            className="modal-select"
          >
            <option>배송 지연</option>
            <option>결제 요청</option>
            <option>공구 취소</option>
            <option>공구 완료</option>
          </select>
        </div> */}

        {/* 제목 */}
        <div className="modal-field">
          <label>제목</label>
          <input 
            type="text"
            placeholder="제목 입력"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="modal-input"
          />
        </div>

        {/* 내용 */}
        <div className="modal-field">
          <label>내용</label>
          <textarea 
            placeholder="발송할 알림의 상세 내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="modal-textarea"
            rows={6}
          />
        </div>

        {/* 버튼 */}
        <div className="modal-actions">
          <button className="modal-btn primary" onClick={handleSend}>
            발송
          </button>
          <button className="modal-btn secondary" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;