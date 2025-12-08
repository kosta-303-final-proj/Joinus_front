import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDeliveryDetail } from '../../services/supplyApi';
import './DeliveryDetail.css';

// 날짜 포맷팅 함수
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function DeliveryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliveryData, setDeliveryData] = useState({
    companyName: '',
    businessNumber: '',
    managerName: '',
    managerPhone: '',
    managerEmail: '',
    category: '',
    productName: '',
    productDescription: '',
    supplyPrice: '',
    minQuantity: '',
    deliveryPeriod: '',
    currentStock: '',
    proposalLink: '',
    additionalNotes: '',
    appliedDate: '',
    status: ''
  });

  useEffect(() => {
    const fetchDeliveryDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getDeliveryDetail(id);
        setDeliveryData({
          ...data,
          appliedDate: formatDate(data.appliedDate)
        });
      } catch (err) {
        console.error('납품 상세 조회 실패:', err);
        setError('데이터를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDeliveryDetail();
    }
  }, [id]);

  const handleBack = () => {
    navigate('/admin/deliveryManagement');
  };

  const handleApprove = () => {
    if (window.confirm('이 납품 제안을 승인하시겠습니까?')) {
      alert('승인 처리되었습니다.');
      // 실제 승인 로직
      navigate('/admin/deliveryManagement');
    }
  };

  const handleHold = () => {
    if (window.confirm('이 납품 제안을 보류하시겠습니까?')) {
      alert('보류 처리되었습니다.');
      // 실제 보류 로직
      navigate('/admin/deliveryManagement');
    }
  };

  if (isLoading) {
    return (
      <div className="delivery-detail-page">
        <div className="delivery-detail-container">
          <div className="loading">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="delivery-detail-page">
        <div className="delivery-detail-container">
          <div className="error">{error}</div>
          <button className="back-button" onClick={handleBack}>
            &lt; 목록으로
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="delivery-detail-page">
      <div className="delivery-detail-container">
        {/* 헤더 */}
        <div className="detail-header">
          <div className="header-content">
            <h1 className="page-title">납품신청 상세</h1>
            <p className="page-description">
              납품 제안 정보를 확인하고 승인/반려 처리를 진행합니다.
            </p>
          </div>
          <button className="back-button" onClick={handleBack}>
            &lt; 목록으로
          </button>
        </div>

        {/* 기본 정보 섹션 */}
        <div className="detail-section">
          <h2 className="section-title">기본 정보</h2>
          <div className="info-grid">
            <div className="info-item">
              <label className="info-label">업체명</label>
              <div className="info-value">{deliveryData.companyName}</div>
            </div>
            <div className="info-item">
              <label className="info-label">사업자 등록번호</label>
              <div className="info-value">{deliveryData.businessNumber}</div>
            </div>
            <div className="info-item">
              <label className="info-label">담당자 이름</label>
              <div className="info-value">{deliveryData.managerName}</div>
            </div>
            <div className="info-item">
              <label className="info-label">담당자 연락처</label>
              <div className="info-value">{deliveryData.managerPhone}</div>
            </div>
            <div className="info-item">
              <label className="info-label">담당자 이메일</label>
              <div className="info-value">{deliveryData.managerEmail}</div>
            </div>
            <div className="info-item">
              <label className="info-label">주요 카테고리</label>
              <div className="info-value">{deliveryData.category}</div>
            </div>
            <div className="info-item">
              <label className="info-label">접수일</label>
              <div className="info-value">{deliveryData.appliedDate || '-'}</div>
            </div>
            <div className="info-item">
              <label className="info-label">상태</label>
              <div className="info-value">
                <span className={`status-badge status-${deliveryData.status === '신청' ? 'pending' : deliveryData.status === '반려' ? 'hold' : 'approved'}`}>
                  {deliveryData.status || '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 상품 정보 섹션 */}
        <div className="detail-section">
          <h2 className="section-title">상품 정보</h2>
          <div className="info-grid">
            <div className="info-item full-width">
              <label className="info-label">보유 상품명</label>
              <div className="info-value">{deliveryData.productName}</div>
            </div>
            <div className="info-item full-width">
              <label className="info-label">상품 설명/강점</label>
              <div className="info-value text-area-value">{deliveryData.productDescription}</div>
            </div>
            <div className="info-item">
              <label className="info-label">예상 공급 단가 (VAT 포함)</label>
              <div className="info-value">{deliveryData.supplyPrice}</div>
            </div>
            <div className="info-item">
              <label className="info-label">최소 공급 가능 수량</label>
              <div className="info-value">{deliveryData.minQuantity}</div>
            </div>
            <div className="info-item">
              <label className="info-label">예상 납기</label>
              <div className="info-value">{deliveryData.deliveryPeriod || '-'}</div>
            </div>
            <div className="info-item">
              <label className="info-label">현재 보유 재고</label>
              <div className="info-value">{deliveryData.currentStock || '-'}</div>
            </div>
            <div className="info-item full-width">
              <label className="info-label">제안 상세 페이지 링크</label>
              <div className="info-value">
                {deliveryData.proposalLink ? (
                  <a href={deliveryData.proposalLink} target="_blank" rel="noopener noreferrer" className="link-value">
                    {deliveryData.proposalLink}
                  </a>
                ) : (
                  <span className="no-data">-</span>
                )}
              </div>
            </div>
            <div className="info-item full-width">
              <label className="info-label">기타 참고 사항</label>
              <div className="info-value text-area-value">{deliveryData.additionalNotes || '-'}</div>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="detail-actions">
          {deliveryData.status === '신청' && (
            <>
              <button className="btn-hold" onClick={handleHold}>
                보류
              </button>
              <button className="btn-approve" onClick={handleApprove}>
                승인
              </button>
            </>
          )}
          {deliveryData.status === '반려' && (
            <button className="btn-approve" onClick={handleApprove}>
              승인
            </button>
          )}
          {deliveryData.status === '승인' && (
            <div className="approved-message">이미 승인된 제안입니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}

