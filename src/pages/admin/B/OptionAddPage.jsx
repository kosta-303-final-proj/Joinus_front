
import React, { useState } from 'react';
import { X } from 'lucide-react';
import './OptionAddModal.css';

const OptionAddPage = () => {
  const [groupName, setGroupName] = useState('');
  const [optionName, setOptionName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const handleClose = () => {
    window.close();
  };

  const handleAdd = () => {
    if (!groupName || !optionName || !price) {
      alert('필수 항목을 입력해주세요.');
      return;
    }

    const optionData = {
      groupName,
      optionName,
      price: parseInt(price),
      description
    };

    // 부모 창(공구 등록 창)으로 데이터 전달
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({ 
        type: 'OPTION_ADDED', 
        data: optionData 
      }, '*');
    }

    window.close();
  };

  return (
    <div className="option-add-page">
      <div className="option-container">
        <div className="option-header">
          <h3>옵션 추가</h3>
          <button className="close-btn-small" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="option-body">
          <div className="option-field">
            <label>옵션 그룹명</label>
            <input 
              type="text" 
              placeholder="예) 사이즈, 용량 등"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          <div className="option-field">
            <label>옵션명</label>
            <input 
              type="text" 
              placeholder="예) S"
              value={optionName}
              onChange={(e) => setOptionName(e.target.value)}
            />
          </div>

          <div className="option-field">
            <label>가격</label>
            <input 
              type="number" 
              placeholder="예) 0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="option-field">
            <label>옵션설명</label>
            <textarea 
              rows={3}
              placeholder="(추가 버튼 누르면 옵션이 가격 input 2개가 함께 뜨면서 추가)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="option-footer">
          <button 
            className="btn-add-option"
            onClick={handleAdd}
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptionAddPage;