import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './NoticeWrite.css';

export default function NoticeWrite() {
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
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('공지사항 작성:', formData);
    // 실제 작성 로직 (API 호출 등)
    alert('공지사항이 작성되었습니다.');
    navigate('/admin/noticeList');
  };

  const handleCancel = () => {
    if (window.confirm('작성을 취소하시겠습니까?')) {
      navigate('/admin/noticeList');
    }
  };

  return (
    <div className="notice-write-page">
      <div className="notice-write-container">
        <h1 className="page-title">공지사항 작성</h1>

        <form onSubmit={handleSubmit} className="notice-write-form">
          {/* <div className="form-group">
            <label htmlFor="category">
              카테고리 <span className="required">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">선택하세요</option>
              <option value="공지">공지</option>
              <option value="계획">계획</option>
              <option value="이벤트">이벤트</option>
            </select>
          </div> */}

          <div className="form-group">
            <label htmlFor="title">
              제목 <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="공지사항 제목을 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">
              본문 <span className="required">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="공지사항 내용을 입력하세요"
              rows={15}
              required
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

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              취소
            </button>
            <button type="submit" className="btn-submit">
              등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

