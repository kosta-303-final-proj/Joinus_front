import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { myAxios } from '../../config';
import Header from './Header';
import '../../styles/components/button.css';
import './admin-common.css';
import './FaqForm.css';

const FaqForm = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });

  const [loading, setLoading] = useState(true);

  //  수정 모드일 때 기존 데이터 불러오기 (Read)
  useEffect(() => {
    if (isEditMode) {
      const fetchFaqDetail = async () => {
        try {
          // FAQ 상세 조회 API 호출 (id 사용)
          const response = await myAxios().get(`/admin/faqDetail/${id}`);

          // DTO 구조에 맞게 상태 업데이트
          setFormData({
            category: response.data.category || '', // category가 있다면 설정
            question: response.data.question,
            answer: response.data.answer
          });
          setLoading(false);
        } catch (error) {
          console.error("FAQ 상세 조회 실패:", error);
          alert("FAQ 정보를 불러오는 데 실패했습니다.");
          navigate('/admin/faqAndInquiryList');
        }
      };
      fetchFaqDetail();
    } else {
      setLoading(false);
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  //  등록 및 수정 API 연동 (Create & Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.question || !formData.answer) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      if (isEditMode) {
        // 수정 (PUT 또는 PATCH 사용)
        // 백엔드 API 설계에 따라 ID를 URL에 넣거나, DTO에 포함시켜야.
        // 여기서는 DTO에 ID를 추가하여 전송.
        const dataToSubmit = { ...formData, id: id };
        await myAxios().put(`/admin/faq/${id}`, dataToSubmit);
        alert("FAQ가 성공적으로 수정되었습니다.");
      } else {
        // 등록 (POST 사용)
        await myAxios().post('/admin/faqForm', formData);
        alert("FAQ가 성공적으로 등록되었습니다.");
      }

      navigate('/admin/faqAndInquiryList', { state: { activeTab: 'FAQ' } }); // 작업 완료 후 목록으로 이동

    } catch (error) {
      console.error("FAQ 처리 중 오류 발생:", error);
      alert(isEditMode ? "수정에 실패했습니다." : "등록에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    navigate('/admin/faqAndInquiryList', { state: { activeTab: 'FAQ' } });
  };

  // 로딩 중일 때 표시
  if (loading) {
    return (
      <div className="admin-layout">
        <Header title={isEditMode ? "FAQ 수정" : "FAQ 등록"} />
        <div className="main-content">로딩 중...</div>
      </div>
    );
  }

  // 등록/수정 버튼 텍스트 결정
  const buttonText = isEditMode ? '수정 완료' : '등록';


  return (
    <div className="admin-layout">
      <div className="main-content">
        <Header title={isEditMode ? "FAQ 수정" : "FAQ 등록"} />

        <div className="content-area">
          <form onSubmit={handleSubmit} className="form-container">

            <div className="form-group">
              <label className="form-label">질문 (제목)</label>
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
              <label className="form-label">답변 (본문)</label>
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
              <button type="button" className="btn-secondary" onClick={handleCancel}>
                취소
              </button>
              <button type="submit" className="btn-primary">
                등록
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FaqForm;