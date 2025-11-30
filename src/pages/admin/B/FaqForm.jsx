import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './admin-common.css';
import './FaqForm.css';

const FaqForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: '',
    question: '',
    answer: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('FAQ 등록:', formData);
    // API 호출 후 목록으로 돌아가기
    navigate('/admin/faqAndInquiryList');
  };

  const handleCancel = () => {
    navigate('/admin/faqAndInquiryList');
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      
      <div className="main-content">
        <Header title="FAQ" />
        
        <div className="content-area">
          <div className="form-container">
            <div className="form-group">
              <label className="form-label">제목</label>
              <input
                type="text"
                name="question"
                className="form-input"
                placeholder="질문을 입력하세요"
                value={formData.question}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">본문</label>
              <textarea
                name="answer"
                className="form-textarea"
                placeholder="답변을 입력하세요"
                value={formData.answer}
                onChange={handleChange}
                rows={10}
              />
            </div>

            <div className="form-actions">
              <button className="btn-secondary" onClick={handleCancel}>
                취소
              </button>
              <button className="btn-primary" onClick={handleSubmit}>
                등록
              </button>
              <button className="btn-secondary">
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqForm;