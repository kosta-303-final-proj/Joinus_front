import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import './GBProductCreate.css';

const GBProductCreatePage = () => {
  const [formData, setFormData] = useState({
    status: '미게시',
    startDate: '',
    endDate: '',
    category: '전자기기',
    productName: '',
    country: '',
    siteUrl: '',
    description: '',
    originalPrice: '',
    shippingCost: '',
    exchangeRate: 0,
    participants: 0,
    feeRate: 10,
    domesticShipping: '3000',
    groupBuyPrice: '',
    supplierName: '',
    proposalNumber: '',
    minParticipants: '',
    productMemo: '',
    deliveryInfo: '',
    productWeight: ''
  });

  const [options, setOptions] = useState([]);
  const [expandedOption, setExpandedOption] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [isLoadingRate, setIsLoadingRate] = useState(true);

  // 옵션 추가 메시지 리스너
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'OPTION_ADDED') {
        setOptions(prev => [...prev, { ...event.data.data, id: Date.now() }]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // 가격 자동 계산
  useEffect(() => {
    const price = parseFloat(formData.originalPrice) || 0;
    const shipping = parseFloat(formData.shippingCost) || 0;
    const rate = parseFloat(formData.exchangeRate) || 0;
    const people = parseInt(formData.participants) || 1;
    const fee = parseFloat(formData.feeRate) || 0;
    const domestic = parseFloat(formData.domesticShipping) || 0;

    const totalDollar = price + shipping;
    const totalWon = totalDollar * rate;
    const perPerson = totalWon / people;
    const final = perPerson * (1 + fee / 100) + domestic;
    
    updateField('groupBuyPrice', Math.round(final));
  }, [
    formData.originalPrice, 
    formData.shippingCost, 
    formData.exchangeRate, 
    formData.participants, 
    formData.domesticShipping
  ]);

  // 환율 자동 불러오기
  useEffect(() => {
    fetchExchangeRate();
  }, []);

  // 환율 불러오기
  const fetchExchangeRate = async () => {
    try {
      setIsLoadingRate(true);
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      const usdToKrw = data.rates.KRW;
      updateField('exchangeRate', Math.round(usdToKrw));
    } catch (error) {
      console.error('환율 불러오기 실패:', error);
      updateField('exchangeRate', 1350);
    } finally {
      setIsLoadingRate(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 참여 인원 조정
  const adjustParticipants = (delta) => {
    updateField('participants', Math.max(1, formData.participants + delta));
  };

  // 옵션 토글
  const toggleOption = (id) => {
    setExpandedOption(prev => prev === id ? null : id);
  };

  // 옵션 삭제
  const deleteOption = (id) => {
    setOptions(prev => prev.filter(opt => opt.id !== id));
  };

  // 옵션 추가 창 열기
  const handleOpenOptionWindow = () => {
    window.open(
      '/admin/optionAdd',
      'optionAdd',
      'width=600,height=550,scrollbars=yes,resizable=yes'
    );
  };

  // 창 닫기 전 경고 뜨게 하기
   useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ''; // Chrome에서 필요
      return ''; // 다른 브라우저에서 필요
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // 제출
  const handleSubmit = () => {
    const submitData = {
      ...formData,
      options,
      mainImage,
      additionalImages
    };
    
    // 부모 창에 데이터 전달
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({ 
        type: 'GB_PRODUCT_CREATED', 
        data: submitData 
      }, '*');
    }
    
    console.log('저장:', submitData);
    alert('공구가 등록되었습니다!');
    window.close();
  };

  return (
    <div className="gb-product-create-page">
      <div className="create-container">
        
        {/* 헤더 */}
        <div className="modal-header-large">
          <h2>공구 등록</h2>
        </div>

        {/* 내용 */}
        <div className="modal-body-large">
          
          {/* 표시 설정 */}
          <section className="form-section">
            <h3 className="section-title">표시 설정</h3>
            <div className="form-field">
              <label>상태</label>
              <select value={formData.status} onChange={(e) => updateField('status', e.target.value)}>
                <option>미게시</option>
                <option>진행중</option>
                <option>발주대기</option>
                <option>완료</option>
              </select>
            </div>
          </section>

          {/* 진행기간 */}
          <section className="form-section">
            <h3 className="section-title">진행기간</h3>
            <div className="form-row">
              <div className="form-field">
                <label>시작일</label>
                <input 
                  type="date" 
                  value={formData.startDate} 
                  onChange={(e) => updateField('startDate', e.target.value)} 
                />
              </div>
              <div className="form-field">
                <label>마감일</label>
                <input 
                  type="date" 
                  value={formData.endDate} 
                  onChange={(e) => updateField('endDate', e.target.value)} 
                />
              </div>
            </div>
          </section>

          {/* 카테고리 선택 */}
          <section className="form-section">
            <h3 className="section-title">카테고리 선택</h3>
            <div className="form-field">
              <select value={formData.category} onChange={(e) => updateField('category', e.target.value)}>
                <option>전자기기</option>
                <option>건강식품</option>
                <option>화장품</option>
                <option>생활용품</option>
                <option>패션/잡화</option>
              </select>
            </div>
          </section>

          {/* 기본 정보 */}
          <section className="form-section">
            <h3 className="section-title">기본 정보</h3>
            
            <div className="form-field">
              <label>공구 상품명</label>
              <input 
                type="text" 
                placeholder="공동 구매로 등록할 상품명을 입력하세요"
                value={formData.productName}
                onChange={(e) => updateField('productName', e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>원 판매 국가</label>
              <input 
                type="text" 
                placeholder="원 판매 국가를 입력하세요"
                value={formData.country}
                onChange={(e) => updateField('country', e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>원 사이트 주소</label>
              <input 
                type="url" 
                placeholder=""
                value={formData.siteUrl}
                onChange={(e) => updateField('siteUrl', e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>대표이미지</label>
              <div className="upload-box">
                <input 
                  type="file" 
                  id="main-image" 
                  style={{ display: 'none' }}
                  onChange={(e) => setMainImage(e.target.files[0])}
                />
                <label htmlFor="main-image" className="upload-label">
                  <div className="upload-content">
                    ↑<br />
                    <span className="upload-text">Click to upload</span><br />
                    <small>Accepts any file type</small>
                  </div>
                </label>
              </div>
            </div>

            <div className="form-field">
              <label>추가 이미지</label>
              <div className="image-grid">
                <div className="image-slot">+</div>
              </div>
            </div>
          </section>

          {/* 상품 설명 */}
          <section className="form-section">
            <h3 className="section-title">상품 설명</h3>
            <div className="form-field">
              <textarea 
                rows={6}
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
              />
            </div>
          </section>

          {/* 옵션 정보 */}
          <section className="form-section">
            <h3 className="section-title">옵션 정보</h3>
            
            {options.length > 0 && (
              <div className="options-table">
                {options.map((option) => (
                  <div key={option.id} className="option-row-container">
                    <div className="option-row" onClick={() => toggleOption(option.id)}>
                      <div className="option-summary">
                        <strong>{option.groupName}</strong>
                        <span className="option-name">{option.optionName}</span>
                        <span className="option-price">+{option.price.toLocaleString()}원</span>
                      </div>
                      <div className="option-actions">
                        {expandedOption === option.id ? 
                          <ChevronUp size={20} /> : 
                          <ChevronDown size={20} />
                        }
                      </div>
                    </div>

                    {expandedOption === option.id && (
                      <div className="option-details">
                        <div className="detail-row">
                          <span className="detail-label">옵션 그룹명:</span>
                          <span>{option.groupName}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">옵션명:</span>
                          <span>{option.optionName}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">가격:</span>
                          <span>+{option.price.toLocaleString()}원</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">옵션설명:</span>
                          <span>{option.description || '-'}</span>
                        </div>
                        <button 
                          className="delete-option-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteOption(option.id);
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button 
              className="add-btn"
              onClick={handleOpenOptionWindow}
            >
              <Plus size={16} /> 옵션 추가
            </button>
          </section>

          {/* 판매 정보 */}
          <section className="form-section">
            <h3 className="section-title">판매 정보 및 가격 계산</h3>
            
            <div className="price-calc-grid">
              
              <div className="form-field">
                <label>원가 ($) *</label>
                <input 
                  type="number"
                  step="0.01"
                  placeholder="12.50"
                  value={formData.originalPrice}
                  onChange={(e) => updateField('originalPrice', e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>해외 배송비 ($) *</label>
                <input 
                  type="number"
                  step="0.01"
                  placeholder="40.00"
                  value={formData.shippingCost}
                  onChange={(e) => updateField('shippingCost', e.target.value)}
                />
              </div>

              <div className="form-field full-width">
                <label>환율 (₩/$)</label>
                <div className="exchange-rate-box">
                  {isLoadingRate ? (
                    <span className="loading-text">환율 불러오는 중...</span>
                  ) : (
                    <>
                      <input 
                        type="number"
                        value={formData.exchangeRate}
                        onChange={(e) => updateField('exchangeRate', e.target.value)}
                      />
                      <button 
                        className="refresh-rate-btn"
                        onClick={fetchExchangeRate}
                        type="button"
                        title="환율 새로고침"
                      >
                        🔄
                      </button>
                    </>
                  )}
                </div>
                <small className="field-hint">현재 환율 자동 적용 (실시간)</small>
              </div>

              <div className="form-field">
                <label>예상 참여 인원 *</label>
                <div className="calc-counter">
                  <button 
                    className="calc-counter-btn"
                    onClick={() => adjustParticipants(-1)}
                    type="button"
                  >
                    <Minus size={16} />
                  </button>
                  <input 
                    type="number"
                    className="calc-counter-value"
                    value={formData.participants}
                    onChange={(e) => updateField('participants', parseInt(e.target.value) || 1)}
                  />
                  <button 
                    className="calc-counter-btn"
                    onClick={() => adjustParticipants(1)}
                    type="button"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="form-field">
                <label>수수료</label>
                <input 
                  type="text"
                  value="10%"
                  disabled
                  style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-field full-width">
                <label>국내 배송비 (₩)</label>
                <input 
                  type="number"
                  placeholder="3000"
                  value={formData.domesticShipping}
                  onChange={(e) => updateField('domesticShipping', e.target.value)}
                />
              </div>
            </div>

            {/* 계산 결과 */}
            <div className="calc-result-inline">
              <div className="calc-result-row">
                <span>달러 총액:</span>
                <strong>${((parseFloat(formData.originalPrice) || 0) + (parseFloat(formData.shippingCost) || 0)).toFixed(2)}</strong>
              </div>
              <div className="calc-result-row">
                <span>원화 총액:</span>
                <strong>
                  {Math.round(
                    ((parseFloat(formData.originalPrice) || 0) + (parseFloat(formData.shippingCost) || 0)) * 
                    (parseFloat(formData.exchangeRate) || 0)
                  ).toLocaleString()}원
                </strong>
              </div>
              <div className="calc-result-row">
                <span>1인당 가격:</span>
                <strong>
                  {Math.round(
                    ((parseFloat(formData.originalPrice) || 0) + (parseFloat(formData.shippingCost) || 0)) * 
                    (parseFloat(formData.exchangeRate) || 0) / 
                    (parseInt(formData.participants) || 1)
                  ).toLocaleString()}원
                </strong>
              </div>
              <div className="calc-result-row highlight">
                <span>최종 판매가:</span>
                <strong className="final-price">
                  {formData.groupBuyPrice.toLocaleString()}원
                </strong>
              </div>
              <small className="calc-formula">
                = (원가 + 해외배송비) × 환율 ÷ 인원 × (1 + 수수료) + 국내배송비
              </small>
            </div>

            <div className="form-field" style={{ marginTop: '24px' }}>
              <label>납품 업체명</label>
              <input 
                type="text"
                value={formData.supplierName}
                onChange={(e) => updateField('supplierName', e.target.value)}
              />
            </div>
          </section>

          {/* 공구 정보 */}
          <section className="form-section">
            <h3 className="section-title">공구 정보</h3>
            
            <div className="form-field">
              <label>제안 번호 및 제안 url</label>
              <input 
                type="text"
                value={formData.proposalNumber}
                onChange={(e) => updateField('proposalNumber', e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>최소 인원</label>
              <input 
                type="number"
                value={formData.minParticipants}
                onChange={(e) => updateField('minParticipants', e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>상품 메모 및 주의사항</label>
              <textarea 
                rows={4}
                value={formData.productMemo}
                onChange={(e) => updateField('productMemo', e.target.value)}
              />
            </div>
          </section>

          {/* 배송 정보 */}
          <section className="form-section">
            <h3 className="section-title">배송 정보</h3>
            
            <div className="form-field">
              <label>배송 정보</label>
              <input 
                type="text"
                value={formData.deliveryInfo}
                onChange={(e) => updateField('deliveryInfo', e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>상품 중량</label>
              <input 
                type="text"
                value={formData.productWeight}
                onChange={(e) => updateField('productWeight', e.target.value)}
              />
            </div>
          </section>

        </div>

        {/* 푸터 */}
        <div className="modal-footer-large">
          <button className="btn-secondary" onClick={() => window.close()}>취소</button>
          <button className="btn-outline">임시저장</button>
          <button className="btn-outline">미리보기</button>
          <button className="btn-primary" onClick={handleSubmit}>게시</button>
        </div>
      </div>
    </div>
  );
};

export default GBProductCreatePage;