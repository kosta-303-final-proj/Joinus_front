import { useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../config';
import './Partnership.css';

export default function Partnership() {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    proposalLink: '',
    additionalNotes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
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
      proposalLink: '',
      additionalNotes: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${baseUrl}/api/consumer/supply/inquiry`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data === true) {
        alert('납품 제안이 접수되었습니다. 검토 후 개별 연락드리겠습니다.');
        handleReset();
      } else {
        alert('납품 제안 제출에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('납품 제안 제출 실패:', error);
      if (error.response) {
        alert('납품 제안 제출에 실패했습니다. 입력한 정보를 확인해주세요.');
      } else if (error.request) {
        alert('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
      } else {
        alert('납품 제안 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="partnership-page">
      {/* 헤더 배너 */}
      <div style={{
        width: "100%",
        backgroundColor: "#ecf3fcff",
        padding: "20px 0",
        marginBottom: "40px",
      }}>
        <div style={{
          width: "1020px",
          margin: "0 auto",
        }}>
          <h3 style={{
            margin: "0 0 8px 0",
            fontSize: "32px",
            fontWeight: "700",
            color: "#222",
          }}>
            납품문의
          </h3>
          <p style={{
            margin: "0",
            fontSize: "16px",
            color: "#555",
          }}>
            수요를 확인한 뒤, 상품을 보유한 판매자가 공동구매 플랫폼에 선(先) 납품 제안을 남기는 공간입니다.
          </p>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div style={{
        width: "1020px",
        margin: "0 auto",
        padding: "0 20px"
      }}>
        {/* 안내 섹션 */}
        <div className="info-section" style={{
          backgroundColor: '#f8f9fa',
          padding: '24px',
          borderRadius: '8px',
          marginBottom: '30px',
          border: '1px solid #e0e0e0'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#222',
            marginBottom: '16px'
          }}>
            이런 경우에 납품문의를 남겨주세요
          </h2>
          <ul style={{
            fontSize: '14px',
            color: '#555',
            lineHeight: '1.8',
            paddingLeft: '20px',
            margin: 0
          }}>
            <li>이미 보유하고 있는 재고 상품을 공동구매 형태로 판매하고 싶은 경우</li>
            <li>오프라인/자체몰에서 판매 중인 인기 상품을 이 플랫폼에 추가로 공급하고 싶은 경우</li>
            <li>대량 공급이 가능하지만, 수요를 확인한 뒤 공구 형태로 진행하고 싶은 경우</li>
          </ul>
        </div>

        {/* 폼 섹션 */}
        <div className="form-section" style={{
          backgroundColor: '#fff',
          padding: '32px',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          marginBottom: '40px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#222',
            marginBottom: '8px'
          }}>
            납품 제안 등록
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '24px'
          }}>
            아래 정보를 가능한 정확하게 기입해 주시면, 관리자 검토 후 개별적으로 연락드립니다.
          </p>

          <form onSubmit={handleSubmit} className="partnership-form">
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
                  onChange={handleChange}
                  placeholder="예) ㅇㅇ상사/공방"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="businessNumber">사업자 등록번호</label>
                <input
                  type="text"
                  id="businessNumber"
                  name="businessNumber"
                  value={formData.businessNumber}
                  onChange={handleChange}
                  placeholder="예) 000-00-00000"
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
                  onChange={handleChange}
                  placeholder="담당자 성명"
                  required
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
                  onChange={handleChange}
                  placeholder="예) 010-0000-0000"
                  required
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
                  onChange={handleChange}
                  placeholder="email@example.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">주요 카테고리</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="select-input"
                >
                  <option value="">선택하세요</option>
                  <option value="생활">생활</option>
                  <option value="생활용품">생활용품</option>
                  <option value="주방/식기">주방/식기</option>
                  <option value="식품">식품</option>
                  <option value="기타">기타</option>
                </select>
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
                onChange={handleChange}
                placeholder="예) 친환경 텀블러 500ml 세트"
                required
              />
            </div>

            {/* 상품 설명/강점 */}
            <div className="form-group full-width">
              <label htmlFor="productDescription">상품 설명/강점</label>
              <textarea
                id="productDescription"
                name="productDescription"
                value={formData.productDescription}
                onChange={handleChange}
                placeholder="상품 특징, 타겟 고객층, 기준 판매 채널/실적 등을 간략히 작성해 주세요."
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
                  onChange={handleChange}
                  placeholder="예) 8,000원"
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
                  onChange={handleChange}
                  placeholder="예) 100개"
                />
              </div>
            </div>

            {/* 제안 상세 페이지 링크 */}
            <div className="form-group full-width">
              <label htmlFor="proposalLink">제안 상세 페이지 링크</label>
              <input
                type="url"
                id="proposalLink"
                name="proposalLink"
                value={formData.proposalLink}
                onChange={handleChange}
                placeholder="예) https://example.com/proposal-detail"
              />
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
                value={formData.additionalNotes}
                onChange={handleChange}
                placeholder="희망 판매 방식, 가격 조건, 공동구매 진행 희망 일정 등 추가로 전달할 내용을 적어 주세요."
                rows={5}
              />
            </div>

            {/* 버튼 영역 */}
            <div className="form-actions">
              <button 
                type="button" 
                className="btn-reset" 
                onClick={handleReset}
                disabled={isSubmitting}
              >
                초기화
              </button>
              <button 
                type="submit" 
                className="btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? '제출 중...' : '납품 제안 보내기'}
              </button>
            </div>

            {/* 안내 문구 */}
            <p className="form-footer-note">
              ※ 제출하신 내용은 내부 검토 용도로만 사용되며, 제안 결과는 담당자가 개별 연락을 통해 안내드립니다.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}