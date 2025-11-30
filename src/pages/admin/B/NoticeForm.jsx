import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './admin-common.css';
import './NoticeForm.css';

const NoticeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSubmit = () => {
    console.log('공지사항 등록:', formData);
    // API 호출 후 목록으로 돌아가기
    navigate('/admin/noticeList');
  };

  const handleSave = () => {
    console.log('임시 저장:', formData);
    // 임시 저장 API 호출
  };

  const handleCancel = () => {
    navigate('/admin/noticeList');
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      
      <div className="main-content">
        <Header title="공지사항 등록" />
        
        <div className="content-area">
          <div className="form-container">
            {/* 제목 */}
            <div className="form-group">
              <label className="form-label">제목</label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="제목을 입력하세요"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            {/* 본문 */}
            <div className="form-group">
              <label className="form-label">본문</label>
              <textarea
                name="content"
                className="form-textarea"
                placeholder="내용을 입력하세요"
                value={formData.content}
                onChange={handleChange}
                rows={12}
              />
            </div>

            {/* 이미지 첨부 */}
            <div className="form-group">
              <label className="form-label">이미지 첨부(옵션)</label>
              <div className="image-upload-container">
                <input
                  type="file"
                  id="image-upload"
                  className="image-input"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload" className="image-upload-label">
                  {formData.image ? formData.image.name : '파일 선택'}
                </label>
              </div>
            </div>

            {/* 버튼 */}
            <div className="form-actions">
              <button className="btn-secondary" onClick={handleCancel}>
                취소
              </button>
              <button className="btn-primary" onClick={handleSubmit}>
                등록
              </button>
              <button className="btn-secondary" onClick={handleSave}>
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeForm;