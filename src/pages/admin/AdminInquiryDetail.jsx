import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { myAxios } from '../../config';
import AdminHeader from '../../components/layout/AdminHeader';
import '../../styles/components/button.css';
import './admin-common.css';
import './AdminInquiryDetail.css';

const AdminInquiryDetail = () => {
  const navigate = useNavigate();
  const { type, id } = useParams();

  const [inquiry, setInquiry] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        setLoading(true);
        const response = await myAxios().get(`/admin/inquiryDetail/${type}/${id}`);
        setInquiry(response.data);
        setAnswer(response.data.answer || '');
      } catch (error) {
        console.error('문의 조회 실패:', error);
        alert('문의를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchInquiry();
  }, [type, id]);

  const handleSubmit = async () => {
    if (!answer.trim()) {
      alert('답변을 입력해주세요.');
      return;
    }

    try {
      await myAxios().post(`/admin/inquiryDetail/${type}/${id}/answer`, {
        answer: answer
      });
      alert('답변이 등록되었습니다.');
      navigate('/admin/faqAndInquiryList');
    } catch (error) {
      console.error('답변 등록 실패:', error);
      alert('답변 등록에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    navigate('/admin/faqAndInquiryList');
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <div className="main-content">
          <div className="content-area">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="admin-layout">
        <div className="main-content">
          <div className="content-area">문의를 찾을 수 없습니다.</div>
        </div>
      </div>
    );
  }

  const isAnswered = inquiry.status === 'ANSWERED';

  return (
    <div className="admin-layout">
      <div className="main-content">
        <AdminHeader title={isAnswered ? "문의 상세" : "문의 답변하기"} />

        <div className="content-area">
          <div className="admin-inquiry-container">

            {/* 문의 정보 */}
            <div className="admin-inquiry-info-section">

              {/* 문의 유형 */}
              <div className="admin-inquiry-row">
                <div className="admin-inquiry-label">문의 유형</div>
                <div className="admin-inquiry-value">
                  {inquiry.type === 'QNA'
                    ? '상품문의'
                    : (inquiry.categoryDescription || '1:1문의')}
                </div>
              </div>

              {/* 공구 상품 */}
              {inquiry.gbProductId && (
                <div className="admin-inquiry-row">
                  <div className="admin-inquiry-label">공구 상품</div>
                  <div className="admin-inquiry-value">
                    <a
                      href={`/gbProduct/${inquiry.gbProductId}`}
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(`/gbProduct/${inquiry.gbProductId}`, '_blank');
                      }}
                      className="admin-inquiry-link"
                    >
                      {inquiry.gbProductName}
                    </a>
                  </div>
                </div>
              )}

              {/* 주문번호 */}
              {inquiry.type === 'INQUIRY' && inquiry.orderId && (
                <div className="admin-inquiry-row">
                  <div className="admin-inquiry-label">주문 번호</div>
                  <div className="admin-inquiry-value">{inquiry.orderId}</div>
                </div>
              )}

              {/* 작성자 */}
              <div className="admin-inquiry-row">
                <div className="admin-inquiry-label">작성자</div>
                <div className="admin-inquiry-value">{inquiry.memberUsername}</div>
              </div>

              {/* 작성 날짜 */}
              <div className="admin-inquiry-row">
                <div className="admin-inquiry-label">작성 날짜</div>
                <div className="admin-inquiry-value">
                  {new Date(inquiry.questionedAt).toLocaleString('ko-KR')}
                </div>
              </div>

              {/* 문의 내용 */}
              <div className="admin-inquiry-row column">
                <div className="admin-inquiry-label">문의 내용</div>
                <div className="admin-inquiry-value content">
                  {inquiry.question}
                </div>
              </div>

              {/* 첨부 이미지 */}
              {inquiry.type === 'INQUIRY' && inquiry.imageFileId && (
                <div className="admin-inquiry-row">
                  <div className="admin-inquiry-label">첨부 이미지</div>
                  <div className="admin-inquiry-value">
                    <img
                      src={`/api/file/${inquiry.imageFileId}`}
                      alt="문의 이미지"
                      className="admin-inquiry-image"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 답변 섹션 */}
            <div className="admin-inquiry-answer-section">
              <h3 className="admin-inquiry-answer-title">답변 내용</h3>
              <textarea
                className="admin-inquiry-textarea"
                placeholder={isAnswered ? '' : '답변을 입력하세요'}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={8}
                disabled={isAnswered}
              />
            </div>

            {/* 버튼 */}
            <div className="admin-inquiry-actions">
              {!isAnswered && (
                <>
                  <button className="admin-inquiry-button cancel" onClick={handleCancel}>
                    취소
                  </button>
                  <button className="admin-inquiry-button submit" onClick={handleSubmit}>
                    답변 등록
                  </button>
                </>
              )}
              {isAnswered && (
                <button className="admin-inquiry-button list" onClick={handleCancel}>
                  목록으로
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInquiryDetail;