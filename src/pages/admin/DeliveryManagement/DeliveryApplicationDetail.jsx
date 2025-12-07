import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApplicationDetail, approveApplication, rejectApplication } from '../../../services/supplyApi';
import '../../../pages/consumer/Partnership.css';
import './DeliveryApplicationDetail.css';

// 날짜 포맷팅 함수
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function DeliveryApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // 더미 데이터 (실제로는 API에서 ID로 가져옴)
  // Partnership 폼 구조와 동일하게 맞춤
  const [formData, setFormData] = useState({
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
    const fetchApplicationDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getApplicationDetail(id);
        setFormData({
          ...data,
          appliedDate: formatDate(data.appliedDate)
        });
      } catch (err) {
        console.error('신청 상세 조회 실패:', err);
        setError('데이터를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicationDetail();
  }, [id]);

  const handleBack = () => {
    navigate('/admin/suppliy/applications');
  };

  const handleApprove = async () => {
    if (!window.confirm('이 납품 신청을 승인하시겠습니까?')) {
      return;
    }

    setIsProcessing(true);
    try {
      await approveApplication(id);
      alert('승인 처리되었습니다.');
      navigate('/admin/suppliy/applications');
    } catch (err) {
      console.error('승인 처리 실패:', err);
      alert('승인 처리에 실패했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    const reason = window.prompt('반려 사유를 입력하세요.');
    if (!reason || !reason.trim()) {
      return;
    }

    setIsProcessing(true);
    try {
      await rejectApplication(id, reason.trim());
      alert('반려 처리되었습니다.');
      navigate('/admin/suppliy/applications');
    } catch (err) {
      console.error('반려 처리 실패:', err);
      alert('반려 처리에 실패했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="partnership-page">
        <div className="partnership-container">
          <div className="loading">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="partnership-page">
        <div className="partnership-container">
          <div className="error">{error}</div>
          <button className="back-button" onClick={handleBack}>
            &lt; 목록으로
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="partnership-page">
      <div className="partnership-container">
        {/* 헤더 */}
        <div className="partnership-header">
          <div className="detail-header-top">
            <h1 className="page-title">납품 신청 상세</h1>
            <button className="back-button" onClick={handleBack}>
              &lt; 목록으로
            </button>
          </div>
          <p className="page-description">
            납품 제안 정보를 확인하고 승인/반려 처리를 진행합니다.
          </p>
        </div>

        {/* 폼 섹션 - 읽기 전용 */}
        <div className="form-section">
          <div className="form-header-info">
            <div className="form-info-item">
              <span className="info-label">신청일:</span>
              <span className="info-value">{formData.appliedDate}</span>
            </div>
            <div className="form-info-item">
              <span className="info-label">상태:</span>
              <span className={`status-badge status-${formData.status === '승인' ? 'approved' : formData.status === '반려' ? 'rejected' : 'pending'}`}>
                {formData.status}
              </span>
            </div>
          </div>

          <form className="partnership-form">
            {/* 첫 번째 행 */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="companyName">
                  업체명 <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  readOnly
                  className="read-only-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="businessNumber">사업자 등록번호</label>
                <input
                  type="text"
                  id="businessNumber"
                  name="businessNumber"
                  value={formData.businessNumber}
                  readOnly
                  className="read-only-input"
                />
              </div>
            </div>

            {/* 두 번째 행 */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="managerName">
                  담당자 이름 <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="managerName"
                  name="managerName"
                  value={formData.managerName}
                  readOnly
                  className="read-only-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="managerPhone">
                  담당자 연락처 <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="managerPhone"
                  name="managerPhone"
                  value={formData.managerPhone}
                  readOnly
                  className="read-only-input"
                />
              </div>
            </div>

            {/* 세 번째 행 */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="managerEmail">담당자 이메일</label>
                <input
                  type="email"
                  id="managerEmail"
                  name="managerEmail"
                  value={formData.managerEmail}
                  readOnly
                  className="read-only-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">주요 카테고리</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  readOnly
                  className="read-only-input"
                />
              </div>
            </div>

            {/* 보유 상품명 */}
            <div className="form-group full-width">
              <label htmlFor="productName">
                보유 상품명 <span className="required">*</span>
              </label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={formData.productName}
                readOnly
                className="read-only-input"
              />
            </div>

            {/* 상품 설명/강점 */}
            <div className="form-group full-width">
              <label htmlFor="productDescription">상품 설명/강점</label>
              <textarea
                id="productDescription"
                name="productDescription"
                value={formData.productDescription}
                readOnly
                className="read-only-input"
                rows={5}
              />
            </div>

            {/* 네 번째 행 */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="supplyPrice">예상 공급 단가 (VAT 포함)</label>
                <input
                  type="text"
                  id="supplyPrice"
                  name="supplyPrice"
                  value={formData.supplyPrice}
                  readOnly
                  className="read-only-input"
                />
                <p className="form-note">
                  ※ 공동구매 판매가 산정 시 참고용으로 활용됩니다.
                </p>
              </div>
              <div className="form-group">
                <label htmlFor="minQuantity">최소 공급 가능 수량</label>
                <input
                  type="text"
                  id="minQuantity"
                  name="minQuantity"
                  value={formData.minQuantity}
                  readOnly
                  className="read-only-input"
                />
              </div>
            </div>

            {/* 다섯 번째 행 */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="deliveryPeriod">예상 납기</label>
                <input
                  type="text"
                  id="deliveryPeriod"
                  name="deliveryPeriod"
                  value={formData.deliveryPeriod}
                  readOnly
                  className="read-only-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="currentStock">현재 보유 재고</label>
                <input
                  type="text"
                  id="currentStock"
                  name="currentStock"
                  value={formData.currentStock}
                  readOnly
                  className="read-only-input"
                />
              </div>
            </div>

            {/* 제안 상세 페이지 링크 */}
            <div className="form-group full-width">
              <label htmlFor="proposalLink">제안 상세 페이지 링크</label>
              {formData.proposalLink ? (
                <div className="link-container">
                  <input
                    type="url"
                    id="proposalLink"
                    name="proposalLink"
                    value={formData.proposalLink}
                    readOnly
                    className="read-only-input"
                  />
                  <a 
                    href={formData.proposalLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="link-button"
                  >
                    링크 열기
                  </a>
                </div>
              ) : (
                <input
                  type="text"
                  id="proposalLink"
                  name="proposalLink"
                  value=""
                  readOnly
                  className="read-only-input"
                  placeholder="등록된 링크가 없습니다."
                />
              )}
              <p className="form-note">
                ※ 상세 제안서를 확인할 수 있는 웹 페이지가 있다면 입력해 주세요.
              </p>
            </div>

            {/* 기타 참고 사항 */}
            <div className="form-group full-width">
              <label htmlFor="additionalNotes">기타 참고 사항</label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                value={formData.additionalNotes || ''}
                readOnly
                className="read-only-input"
                rows={5}
                placeholder="등록된 내용이 없습니다."
              />
            </div>

            {/* 버튼 영역 - 승인/반려 버튼 */}
            {formData.status === '신청' && (
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-reject" 
                  onClick={handleReject}
                  disabled={isProcessing}
                >
                  {isProcessing ? '처리 중...' : '반려'}
                </button>
                <button 
                  type="button" 
                  className="btn-approve" 
                  onClick={handleApprove}
                  disabled={isProcessing}
                >
                  {isProcessing ? '처리 중...' : '승인'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

