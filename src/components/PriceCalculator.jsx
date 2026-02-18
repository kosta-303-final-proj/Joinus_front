import React, { useState, useMemo } from 'react';
import { Minus, Plus } from 'lucide-react';
import { calculateRecommendedPrice } from '../utils/calculateRecommendedPrice';
import '../pages/admin/GBProductCreate.css';

const PriceCalculator = ({
    formData,
    updateField,
    isLoadingRate,
    fetchExchangeRate
}) => {

    const adjustParticipants = (delta) => {
        updateField('participants', Math.max(1, formData.participants + delta));
    };

    const recommendedPrice = useMemo(() => {
        return calculateRecommendedPrice({
            originalPrice: Number(formData.originalPrice),
            shippingCost: Number(formData.shippingCost),
            exchangeRate: Number(formData.exchangeRate),
            participants: Number(formData.participants),
            feeRate: Number(formData.feeRate),
            domesticShipping: Number(formData.domesticShipping)
        });
    }, [
        formData.originalPrice,
        formData.shippingCost,
        formData.exchangeRate,
        formData.participants,
        formData.feeRate,
        formData.domesticShipping
    ]);

    const currencySymbols = {
        USD: '$',
        JPY: '¥',
        EUR: '€',
        CNY: '¥'
    };

    return (
        <>
            <h3 className="section-title">판매 정보 및 가격 계산</h3>

            <div className="form-field">
                <label>통화</label>
                <select
                    value={formData.currency}
                    onChange={(e) => updateField('currency', e.target.value)}
                >
                    <option value="USD">USD (미국)</option>
                    <option value="JPY">JPY (일본)</option>
                    <option value="EUR">EUR (유럽)</option>
                    <option value="CNY">CNY (중국)</option>
                </select>
            </div>


            <div className="price-calc-grid">
                <div className="form-field">
                    <label>원가 ({currencySymbols[formData.currency]}) *</label>
                    <input
                        type="number"
                        step="0.01"
                        placeholder="12.50"
                        value={formData.originalPrice}
                        onChange={(e) => updateField('originalPrice', e.target.value)}
                    />
                </div>
                <div className="form-field">
                    <label>해외 배송비 ({currencySymbols[formData.currency]}) *</label>
                    <input
                        type="number"
                        step="0.01"
                        placeholder="40.00"
                        value={formData.shippingCost}
                        onChange={(e) => updateField('shippingCost', e.target.value)}
                    />
                </div>
                <div className="form-field full-width">
                    <label>환율 (₩ / {currencySymbols[formData.currency]})</label>
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
                {/* <div className="form-field full-width">
                    <label>국내 배송비 (₩)</label>
                    <input
                        type="number"
                        placeholder="3000"
                        value={formData.domesticShipping}
                        onChange={(e) => updateField('domesticShipping', e.target.value)}
                    />
                </div> */}
            </div>

            {/* ⭐ 계산 결과 박스 */}
            <div style={{ marginTop: '24px' }}>
                <div style={{
                    backgroundColor: '#f0f9ff',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #bfdbfe'
                }}>
                    <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1e40af',
                        marginBottom: '16px'
                    }}>
                        💡 가격 계산 참고
                    </div>

                    <div className="calc-result-row">
                        <span>원가 (원화):</span>
                        <strong>
                            {Math.round(
                                (parseFloat(formData.originalPrice) || 0) *
                                (parseFloat(formData.exchangeRate) || 0)
                            ).toLocaleString()}원
                        </strong>
                    </div>

                    <div className="calc-result-row">
                        <span>해외 배송비 (원화):</span>
                        <strong>
                            {Math.round(
                                (parseFloat(formData.shippingCost) || 0) *
                                (parseFloat(formData.exchangeRate) || 0)
                            ).toLocaleString()}원
                        </strong>
                    </div>

                    <div className="calc-result-row">
                        <span>1인당 해외배송비:</span>
                        <strong>
                            {Math.round(
                                ((parseFloat(formData.shippingCost) || 0) *
                                    (parseFloat(formData.exchangeRate) || 0)) /
                                (parseInt(formData.participants) || 1)
                            ).toLocaleString()}원
                        </strong>
                    </div>

                    {/* <div className="calc-result-row">
                        <span>국내 배송비:</span>
                        <strong>
                            {(parseInt(formData.domesticShipping) || 0).toLocaleString()}원
                        </strong>
                    </div> */}

                    <div className="calc-result-row" style={{
                        marginTop: '16px',
                        paddingTop: '16px',
                        borderTop: '2px solid #3b82f6'
                    }}>
                        <span style={{ fontSize: '15px', fontWeight: '700' }}>
                            권장 판매가:
                        </span>
                        <strong style={{ fontSize: '20px', color: '#3b82f6' }}>
                            {recommendedPrice.toLocaleString()}원
                        </strong>
                    </div>

                    <small className="calc-formula" style={{ marginTop: '12px', display: 'block' }}>
                        = (원가 × 환율) + (해외배송비 × 환율 ÷ 인원) × (1 + 수수료)
                    </small>

                    <button
                        type="button"
                        onClick={() => updateField('groupBuyPrice', recommendedPrice)}
                        style={{
                            marginTop: '16px',
                            padding: '10px 16px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            width: '100%',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                    >
                        ↓ 권장가를 판매가에 적용
                    </button>
                </div>
            </div>

            {/* ⭐ 최종 판매가 입력 */}
            <div className="form-field" style={{ marginTop: '24px' }}>
                <label style={{
                    fontWeight: '600',
                    fontSize: '16px',
                    color: '#000',
                    marginBottom: '8px',
                    display: 'block'
                }}>
                    최종 판매가
                </label>
                <input
                    type="number"
                    placeholder="판매가를 입력하세요"
                    value={formData.groupBuyPrice}
                    onChange={(e) => updateField('groupBuyPrice', e.target.value)}
                    style={{
                        fontSize: '16px',
                        fontWeight: '500',
                        backgroundColor: 'white',
                        border: '1px solid #b9babdff',
                        padding: '14px',
                        borderRadius: '8px',
                        width: '100%'
                    }}
                />
                <small style={{
                    color: '#6b7280',
                    fontSize: '13px',
                    display: 'block',
                    marginTop: '8px'
                }}>
                    위 권장가를 참고하거나, 원하는 판매가를 직접 입력하세요
                </small>
            </div>
        </>
    );
};

export default PriceCalculator;
