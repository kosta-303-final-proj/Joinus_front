import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { myAxios } from '../../config';
import AdminHeader from '../../components/layout/AdminHeader';
import '../../styles/components/button.css';
import './admin-common.css';
import './NoticeForm.css';

const NoticeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    images: []
  });

  useEffect(() => {
    if (isEdit) {
      const fetchNotice = async () => {
        try {
          const response = await myAxios().get(`/admin/noticeDetail/${id}`);
          const data = response.data;
          setFormData({
            title: data.title,
            content: data.content,
            images: [] // 기존 이미지는 보통 미리보기로 처리하지만 일단 비워둡니다.
          });
        } catch (error) {
          console.error("데이터 불러오기 실패:", error);
          alert("공지사항을 불러올 수 없습니다.");
        }
      };
      fetchNotice();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: files.slice(0, 3) // 최대 3개만 저장
    }));
  };

  const handleCancel = () => {
    navigate('/admin/noticeList');
  };

  const handleSubmit = async () => {
    // 1. FormData 객체 생성
    const data = new FormData();

    // 2. 텍스트 필드 추가 (백엔드의 NoticeDto와 매칭시키기 위해)
    data.append('title', formData.title);
    data.append('content', formData.content);

    // 3. 파일 필드  (백엔드의 @RequestParam(value = "images")와 매칭)
    formData.images.forEach(file => {
      // 백엔드에서 List<MultipartFile> images로 받기 위해 모든 파일에 동일한 'images' 키 사용
      data.append('images', file);
    });

    try {
      if (isEdit) {
        await myAxios().post(`/admin/noticeUpdate/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("수정되었습니다.");
      } else {
      await myAxios().post('/admin/noticeForm', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("등록되었습니다.");
    }
      navigate('/admin/noticeList');
    } catch (error) {
      console.error("공지사항 등록 실패:", error);
      // 서버 응답이 400 Bad Request일 경우 메시지를 표시
      if (error.response && error.response.data) {
        alert(error.response.data);
      } else {
        alert("공지사항 등록 중 알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="admin-layout">

      <div className="main-content">
        <AdminHeader title={isEdit ? "공지사항 수정" : "공지사항 등록"} />

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
              <label className="form-label">이미지 첨부(옵션, 최대 3개)</label>
              <div className="image-upload-container">
                <input
                  type="file"
                  id="image-upload"
                  className="image-input"
                  accept="image/*"
                  onChange={handleImageChange}
                  multiple //  다중 파일 선택 활성화
                />
                <label htmlFor="image-upload" className="image-upload-label">
                  {formData.images.length > 0
                    ? `파일 ${formData.images.length}개 선택됨`
                    : '파일 선택'}
                </label>
              </div>
            </div>

            {/* 버튼 */}
            <div className="form-actions">
              <button className="notice-button secondary" onClick={handleCancel}>
                취소
              </button>
              <button className="notice-button primary" onClick={handleSubmit}>
                {isEdit ? "수정" : "등록"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeForm;