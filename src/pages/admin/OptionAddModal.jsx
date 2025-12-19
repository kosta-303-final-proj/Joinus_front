import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import './OptionAddModal.css';

const OptionAddModal = ({ onClose, onAdd }) => {
  const [groupName, setGroupName] = useState('');
  const [options, setOptions] = useState([
    { id: 1, name: '', price: '' }
  ]);

  // 옵션 추가
  const handleAddOption = () => {
    setOptions([
      ...options,
      { id: Date.now(), name: '', price: '' }
    ]);
  };

  // 옵션 삭제
  const handleRemoveOption = (id) => {
    if (options.length === 1) {
      alert('최소 1개의 옵션이 필요합니다.');
      return;
    }
    setOptions(options.filter(opt => opt.id !== id));
  };

  // 옵션 값 변경
  const handleOptionChange = (id, field, value) => {
    setOptions(options.map(opt => 
      opt.id === id ? { ...opt, [field]: value } : opt
    ));
  };

  // 확인 버튼
  const handleConfirm = () => {
    // 유효성 검사
    if (!groupName.trim()) {
      alert('옵션 그룹명을 입력해주세요.');
      return;
    }

    // 모든 옵션이 입력되었는지 확인
    for (let opt of options) {
      if (!opt.name.trim()) {
        alert('모든 옵션명을 입력해주세요.');
        return;
      }
      if (!opt.price || opt.price === '') {
        alert('모든 가격을 입력해주세요.');
        return;
      }
    }

    // 그룹 데이터 생성
    const optionGroup = {
      id: Date.now(),
      groupName: groupName,
      options: options.map(opt => ({
        name: opt.name,
        price: parseInt(opt.price) || 0
      }))
    };

    onAdd(optionGroup);
    onClose();
  };

  return (
    <div className="option-add-modal-overlay" onClick={onClose}>
      <div className="option-add-modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* 헤더 */}
        <div className="option-add-modal-header">
          <h3>옵션 추가</h3>
          <button className="option-add-modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* 바디 */}
        <div className="option-add-modal-body">
          
          {/* 옵션 그룹명 */}
          <div className="option-add-modal-form-field">
            <label>옵션 그룹명 *</label>
            <input 
              type="text" 
              placeholder="예) 사이즈, 용량, 색상 등"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          {/* 옵션 목록 */}
          <div className="option-add-modal-options-list">
            <label>옵션 목록 *</label>
            
            {options.map((option, index) => (
              <div key={option.id} className="option-add-modal-option-row">
                <div className="option-add-modal-option-inputs">
                  <input 
                    type="text"
                    placeholder="옵션명 (예: S)"
                    value={option.name}
                    onChange={(e) => handleOptionChange(option.id, 'name', e.target.value)}
                    className="option-add-modal-option-name-input"
                  />
                  <input 
                    type="number"
                    placeholder="추가 가격 (예: 0)"
                    value={option.price}
                    onChange={(e) => handleOptionChange(option.id, 'price', e.target.value)}
                    className="option-add-modal-option-price-input"
                  />
                  <button 
                    className="option-add-modal-delete-btn"
                    onClick={() => handleRemoveOption(option.id)}
                    disabled={options.length === 1}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            {/* 옵션 추가 버튼 */}
            <button 
              className="option-add-modal-add-option-btn"
              onClick={handleAddOption}
            >
              <Plus size={16} /> 옵션 추가
            </button>
          </div>

        </div>

        {/* 푸터 */}
        <div className="option-add-modal-footer">
          <button className="option-add-modal-btn-secondary" onClick={onClose}>
            취소
          </button>
          <button className="option-add-modal-btn-primary" onClick={handleConfirm}>
            확인
          </button>
        </div>

      </div>
    </div>
  );
};

export default OptionAddModal;