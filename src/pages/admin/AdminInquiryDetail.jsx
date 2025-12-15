import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { myAxios } from '../../config';
import AdminHeader from '../../components/layout/AdminHeader';
import '../../styles/components/button.css';
import './admin-common.css';
import './AdminInquiryDetail.css';

const AdminInquiryDetail = () => {
  const navigate = useNavigate();
  const { type, id } = useParams();  // ✅ type, id 받기
  
  const [inquiry, setInquiry] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);

  // ========================================
  // 상세 조회
  // ========================================
  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        setLoading(true);
        // ✅ 수정된 URL
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

  // ========================================
  // 답변 등록
  // ========================================
  const handleSubmit = async () => {
    if (!answer.trim()) {
      alert('답변을 입력해주세요.');
      return;
    }

    try {
      // ✅ 수정된 URL
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
          <div className="inquiry-detail-container">
            
            {/* 문의 정보 */}
            <div className="inquiry-info-section">
              
              {/* 문의 유형 */}
              <div className="info-row">
                <div className="info-label">문의 유형</div>
                <div className="info-value">
                  {inquiry.type === 'QNA' 
                    ? '상품문의' 
                    : (inquiry.categoryDescription || '1:1문의')}
                </div>
              </div>

              {/* 공구 상품 (있을 때만) */}
              {inquiry.gbProductId && (
                <div className="info-row">
                  <div className="info-label">공구 상품</div>
                  <div className="info-value">
                    <a 
                      href={`/gbProduct/${inquiry.gbProductId}`}
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(`/gbProduct/${inquiry.gbProductId}`, '_blank');
                      }}
                      style={{ 
                        color: '#3b82f6', 
                        textDecoration: 'underline',
                        cursor: 'pointer'
                      }}
                    >
                      {inquiry.gbProductName}
                    </a>
                  </div>
                </div>
              )}

              {/* 주문번호 (INQUIRY + 주문 있을 때) */}
              {inquiry.type === 'INQUIRY' && inquiry.orderId && (
                <div className="info-row">
                  <div className="info-label">주문 번호</div>
                  <div className="info-value">{inquiry.orderId}</div>
                </div>
              )}

              {/* 작성자 */}
              <div className="info-row">
                <div className="info-label">작성자</div>
                <div className="info-value">{inquiry.memberUsername}</div>
              </div>

              {/* 작성 날짜 */}
              <div className="info-row">
                <div className="info-label">작성 날짜</div>
                <div className="info-value">
                  {new Date(inquiry.questionedAt).toLocaleString('ko-KR')}
                </div>
              </div>

              {/* 문의 내용 */}
              <div className="info-row column">
                <div className="info-label">문의 내용</div>
                <div className="info-value content">
                  {inquiry.question}
                </div>
              </div>

              {/* 이미지 (INQUIRY + 이미지 있을 때) */}
              {inquiry.type === 'INQUIRY' && inquiry.imageFileId && (
                <div className="info-row">
                  <div className="info-label">첨부 이미지</div>
                  <div className="info-value">
                    <img 
                      src={`/api/file/${inquiry.imageFileId}`}
                      alt="문의 이미지" 
                      style={{ 
                        maxWidth: '400px', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 답변 섹션 */}
            <div className="answer-section">
              <h3 className="answer-title">답변 내용</h3>
              <textarea
                className="answer-textarea"
                placeholder={isAnswered ? '' : '답변을 입력하세요'}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={8}
                disabled={isAnswered}
              />
            </div>

            {/* 버튼 */}
            <div className="form-actions">
              {!isAnswered && (
                <>
                  <button className="btn-secondary" onClick={handleCancel}>
                    취소
                  </button>
                  <button className="btn-primary" onClick={handleSubmit}>
                    답변 등록
                  </button>
                </>
              )}
              {isAnswered && (
                <button className="btn-secondary" onClick={handleCancel}>
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