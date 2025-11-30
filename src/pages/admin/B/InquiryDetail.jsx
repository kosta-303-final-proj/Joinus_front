import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './admin-common.css';
import './InquiryDetail.css';

const InquiryDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const inquiry = location.state?.inquiry;

  const [answer, setAnswer] = useState(inquiry?.answer || '');

  const isAnswered = inquiry?.status === '답변완료';

  const handleSubmit = () => {
    console.log('답변 등록:', { inquiryId: id, answer });
    // API 호출 후 목록으로 돌아가기
    navigate('/admin/faqAndInquiryList');
  };

  const handleSave = () => {
    console.log('임시 저장:', { inquiryId: id, answer });
  };

  const handleCancel = () => {
    navigate('/admin/faqAndInquiryList');
  };

  if (!inquiry) {
    return <div>문의를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      
      <div className="main-content">
        <Header title="문의 답변하기" />
        
        <div className="content-area">
          <div className="inquiry-detail-container">
            {/* 문의 정보 */}
            <div className="inquiry-info-section">
              <div className="info-row">
                <div className="info-label">제목</div>
                <div className="info-value">{inquiry.title}</div>
              </div>

              <div className="info-row">
                <div className="info-label">문의 유형</div>
                <div className="info-value">{inquiry.type}</div>
              </div>

              {/* 공구 상품 문의일 때 */}
              {inquiry.inquiryType === '공구상품' && inquiry.productUrl && (
                <div className="info-row">
                  <div className="info-label">공구 상품 url</div>
                  <div className="info-value">
                    <a 
                      href={inquiry.productUrl} 
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(inquiry.productUrl);
                      }}
                      style={{ 
                        color: '#3b82f6', 
                        textDecoration: 'underline',
                        cursor: 'pointer'
                      }}
                    >
                      상품 보기
                    </a>
                  </div>
                </div>
              )}

              {/* 1:1 문의이고 주문번호 있을 때 */}
              {inquiry.inquiryType === '1:1문의' && inquiry.orderNumber && (
                <div className="info-row">
                  <div className="info-label">주문 번호</div>
                  <div className="info-value">{inquiry.orderNumber}</div>
                </div>
              )}

              <div className="info-row">
                <div className="info-label">작성자</div>
                <div className="info-value">{inquiry.author}</div>
              </div>

              <div className="info-row">
                <div className="info-label">작성 날짜</div>
                <div className="info-value">{inquiry.date}</div>
              </div>

              <div className="info-row column">
                <div className="info-label">문의 내용</div>
                <div className="info-value content">
                  {inquiry.content}
                </div>
              </div>

              {/* 이미지 첨부 (옵션) */}
              {inquiry.image && (
                <div className="info-row">
                  <div className="info-label">이미지<br/>(민원 사진 첨부하기)</div>
                  <div className="info-value">
                    <img 
                      src={inquiry.image} 
                      alt="문의 이미지" 
                      style={{ maxWidth: '300px', border: '1px solid #e5e7eb' }}
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
                    등록
                  </button>
                  <button className="btn-secondary" onClick={handleSave}>
                    저장
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

export default InquiryDetail;