import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './InquiryDetail.css';
import { getInquiryDetail, getInquiryImageUrl } from '../../services/csApi';

export default function InquiryDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [inquiry, setInquiry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 날짜 포맷팅 함수
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // 카테고리 한글 변환
  const getCategoryName = (category) => {
    const categoryMap = {
      'GBPRODCUT': '공구상품',
      'ORDER': '주문',
      'CANCEL_REFUND_EXCHANGE': '취소/교환/반품',
      'LOST_DAMAGED_DEFECTIVE': '분실/파손/불량',
      'DELIVERY': '배송 관련',
      'OTHER': '기타'
    };
    return categoryMap[category] || category;
  };

  useEffect(() => {
    const fetchInquiry = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getInquiryDetail(id);
        setInquiry(data);
      } catch (error) {
        console.error('문의 상세 조회 실패:', error);
        setError('문의를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInquiry();
  }, [id]);

  if (isLoading) {
    return (
      <div className="inquiry-detail-page">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  if (error || !inquiry) {
    return (
      <div className="inquiry-detail-page">
        <div className="error">{error || '문의를 찾을 수 없습니다.'}</div>
      </div>
    );
  }

  const status = inquiry.answer ? '답변 완료' : '답변 대기';

  return (
    <div className="inquiry-detail-page">
      <div className="inquiry-detail-container">
        {/* 헤더 */}
        <div className="detail-header">
          <h1 className="page-title">1:1 문의</h1>
          <button className="back-button" onClick={() => navigate('/cs/notice?tab=inquiry')}>
            ← 뒤로가기
          </button>
        </div>

        {/* 문의 카드 */}
        <div className="inquiry-card">
          {/* 제목 및 상태 */}
          <div className="inquiry-title-section">
            <div className="inquiry-header">
              <h2 className="inquiry-title">{inquiry.question || '제목 없음'}</h2>
              <span className={`status-badge ${status === '답변 완료' ? 'completed' : 'pending'}`}>
                {status}
              </span>
            </div>
            <div className="inquiry-meta">
              <span className="inquiry-date">작성일: {formatDate(inquiry.questionedAt)}</span>
              {inquiry.orderId && (
                <span className="inquiry-order">주문번호: {inquiry.orderId}</span>
              )}
              {inquiry.category && (
                <span className="inquiry-category">카테고리: {getCategoryName(inquiry.category)}</span>
              )}
            </div>
          </div>

          {/* 문의 내용 */}
          <div className="inquiry-question-section">
            <h3 className="section-label">문의 내용</h3>
            <div className="inquiry-content">{inquiry.question}</div>
            
            {/* 첨부 이미지 */}
            {inquiry.imageFileId && (
              <div className="inquiry-attachments">
                <h4 className="attachments-title">첨부 파일</h4>
                <div className="attachment-list">
                  <div className="attachment-item">
                    <img 
                      src={getInquiryImageUrl(inquiry.imageFileId)} 
                      alt="문의 이미지" 
                      className="attachment-image" 
                    />
                    <span className="attachment-name">문의 이미지</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 관리자 답변 */}
          {status === '답변 완료' && inquiry.answer && (
            <div className="inquiry-answer-section">
              <h3 className="section-label">관리자 답변</h3>
              <div className="answer-content">
                <p>{inquiry.answer}</p>
                <div className="answer-footer">
                  <span>답변일: {formatDate(inquiry.answeredAt)}</span>
                </div>
              </div>
            </div>
          )}

          {/* 답변 대기 상태 */}
          {status === '답변 대기' && (
            <div className="inquiry-waiting">
              <p>답변 대기 중입니다. 빠른 시일 내에 답변드리겠습니다.</p>
            </div>
          )}
        </div>

        {/* 목록 버튼 */}
        <div className="detail-footer">
          <button className="list-button" onClick={() => navigate('/cs/notice?tab=inquiry')}>
            문의 목록
          </button>
        </div>
      </div>
    </div>
  );
}