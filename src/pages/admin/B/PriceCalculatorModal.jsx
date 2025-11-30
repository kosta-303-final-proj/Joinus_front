import React, { useState, useEffect } from 'react';
import { X, DollarSign, Plus, Minus } from 'lucide-react';
import './PriceCalculatorModal.css';

const PriceCalculatorModal = ({ onClose, onCalculate }) => {
  // 입력값
  const [originalPrice, setOriginalPrice] = useState('');        // 원가 ($)
  const [shippingCost, setShippingCost] = useState('');          // 해외 배송비 ($)
  const [exchangeRate, setExchangeRate] = useState(0);            // 환율
  const [participants, setParticipants] = useState(10);           // 참여 인원
  const [feeRate] = useState(10);                                 // 수수료 (10% 고정)
  const [domesticShipping, setDomesticShipping] = useState('3000'); // 국내 배송비

  // 계산 결과
  const [dollarTotal, setDollarTotal] = useState(0);      // 달러 총액
  const [wonTotal, setWonTotal] = useState(0);            // 원화 총액
  const [pricePerPerson, setPricePerPerson] = useState(0); // 1인당 가격
  const [finalPrice, setFinalPrice] = useState(0);         // 최종 판매가

  const [isLoadingRate, setIsLoadingRate] = useState(true);

  // ========== 환율 자동 불러오기 ========== 
  useEffect(() => {
    fetchExchangeRate();
  }, []);

  const fetchExchangeRate = async () => {
    try {
      setIsLoadingRate(true);
      
      // exchangerate-api.com
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      
      const usdToKrw = data.rates.KRW;
      setExchangeRate(Math.round(usdToKrw)); // 반올림해서 저장
      
    } catch (error) {
      console.error('환율 불러오기 실패:', error);
      setExchangeRate(1350); // 실패 시 기본값
      alert('환율 정보를 불러오는데 실패했습니다. 기본값(1,350원)으로 설정됩니다.');
    } finally {
      setIsLoadingRate(false);
    }
  };

  // ========== 가격 계산 ========== 
  useEffect(() => {
    const price = parseFloat(originalPrice) || 0;
    const shipping = parseFloat(shippingCost) || 0;
    const rate = parseFloat(exchangeRate) || 0;
    const people = parseInt(participants) || 1;
    const fee = parseFloat(feeRate) || 0;
    const domestic = parseFloat(domesticShipping) || 0;

    // 1. 달러 총액
    const totalDollar = price + shipping;
    setDollarTotal(totalDollar);

    // 2. 원화 총액
    const totalWon = totalDollar * rate;
    setWonTotal(totalWon);

    // 3. 1인당 가격
    const perPerson = totalWon / people;
    setPricePerPerson(perPerson);

    // 4. 최종 판매가 = 1인당 × (1 + 수수료) + 국내배송비
    const final = perPerson * (1 + fee / 100) + domestic;
    setFinalPrice(Math.round(final));

  }, [originalPrice, shippingCost, exchangeRate, participants, feeRate, domesticShipping]);

  // 참여 인원 증감
  const increaseParticipants = () => setParticipants(prev => prev + 1);
  const decreaseParticipants = () => setParticipants(prev => Math.max(1, prev - 1));

  const handleCalculate = () => {
    if (!originalPrice || !shippingCost) {
      alert('원가와 해외 배송비를 입력해주세요.');
      return;
    }
    onCalculate(finalPrice);
  };

  return (
    <div className="modal-overlay-small" onClick={onClose}>
      <div className="calculator-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* 헤더 */}
        <div className="calculator-header">
          <h3>💰 가격 계산</h3>
          <button className="close-btn-small" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* 내용 */}
        <div className="calculator-body">
          
          {/* 원가 ($) */}
          <div className="calc-field">
            <label>원가 ($) *</label>
            <div className="calc-input-with-icon">
              <DollarSign size={18} className="calc-input-icon" />
              <input 
                type="number"
                step="0.01"
                placeholder="12.50"
                className="calc-input"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
              />
            </div>
          </div>

          {/* 해외 배송비 ($) */}
          <div className="calc-field">
            <label>해외 배송비 ($) *</label>
            <div className="calc-input-with-icon">
              <DollarSign size={18} className="calc-input-icon" />
              <input 
                type="number"
                step="0.01"
                placeholder="40.00"
                className="calc-input"
                value={shippingCost}
                onChange={(e) => setShippingCost(e.target.value)}
              />
            </div>
          </div>

          {/* 환율 */}
          <div className="calc-field">
            <label>환율 (₩/$)</label>
            <div className="exchange-rate-box">
              {isLoadingRate ? (
                <span className="loading-text">환율 불러오는 중...</span>
              ) : (
                <>
                  <input 
                    type="number"
                    className="calc-input"
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(e.target.value)}
                  />
                  <button 
                    className="refresh-rate-btn"
                    onClick={fetchExchangeRate}
                    title="환율 새로고침"
                  >
                    🔄
                  </button>
                </>
              )}
            </div>
            <small className="field-hint">현재 환율 자동 적용</small>
          </div>

          {/* 예상 참여 인원 */}
          <div className="calc-field">
            <label>예상 참여 인원 *</label>
            <div className="calc-counter">
              <button 
                className="calc-counter-btn"
                onClick={decreaseParticipants}
              >
                <Minus size={16} />
              </button>
              <input 
                type="number"
                className="calc-counter-value"
                value={participants}
                onChange={(e) => setParticipants(parseInt(e.target.value) || 1)}
              />
              <button 
                className="calc-counter-btn"
                onClick={increaseParticipants}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* 수수료 (10% 고정) */}
          <div className="calc-field">
            <label>수수료</label>
            <input 
              type="text"
              className="calc-input"
              value="10%"
              disabled
              style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
            />
          </div>

          {/* 국내 배송비 */}
          <div className="calc-field">
            <label>국내 배송비 (₩)</label>
            <input 
              type="number"
              placeholder="3000"
              className="calc-input"
              value={domesticShipping}
              onChange={(e) => setDomesticShipping(e.target.value)}
            />
          </div>

          {/* 계산 결과 */}
          <div className="calc-result">
            <div className="calc-result-row">
              <span>달러 총액:</span>
              <strong>${dollarTotal.toFixed(2)}</strong>
            </div>
            <div className="calc-result-row">
              <span>원화 총액:</span>
              <strong>{Math.round(wonTotal).toLocaleString()}원</strong>
            </div>
            <div className="calc-result-row">
              <span>1인당 가격:</span>
              <strong>{Math.round(pricePerPerson).toLocaleString()}원</strong>
            </div>
            <div className="calc-result-row highlight">
              <span>최종 판매가:</span>
              <strong className="calc-final-price">
                {finalPrice.toLocaleString()}원
              </strong>
            </div>
            <small className="calc-formula">
              = (원가 + 해외배송비) × 환율 ÷ 인원 × (1 + 수수료) + 국내배송비
            </small>
          </div>

        </div>

        {/* 푸터 */}
        <div className="calculator-footer">
          <button className="btn-close" onClick={onClose}>
            닫기
          </button>
          <button className="btn-calculate" onClick={handleCalculate}>
            적용하기
          </button>
        </div>

      </div>
    </div>
  );
};

export default PriceCalculatorModal;