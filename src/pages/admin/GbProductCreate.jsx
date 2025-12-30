import React, { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { myAxios } from '../../config';
import { X, Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import OptionAddModal from './OptionAddModal';
import '../../styles/components/button.css';
import './GBProductCreate.css';

const GBProductCreatePage = () => {
  const [searchParams] = useSearchParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [productId, setProductId] = useState(null);

  const [formData, setFormData] = useState({
    status: 'DRAFT',
    startDate: '',
    endDate: '',
    category: '',
    productName: '',
    proposalId: '',
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
    minParticipants: '',
    productMemo: '',
    shippingMethod: 'DEFAULT'
  });

  const [categories, setCategories] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [detailImages, setDetailImages] = useState([]);
  const [isLoadingRate, setIsLoadingRate] = useState(true);
  const [optionGroups, setOptionGroups] = useState([]);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [showOptionModal, setShowOptionModal] = useState(false);

  // 제안 숫자 추출 함수
  const extractProposalId = (input) => {
    if (!input) return '';
    if (/^\d+$/.test(input)) return input;

    const parts = input.split('/');
    for (let i = parts.length - 1; i >= 0; i--) {
      if (/^\d+$/.test(parts[i])) return parts[i];
    }
    return '';
  };

  // Form 업데이트
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 참여 인원 조정
  const adjustParticipants = (delta) => {
    updateField('participants', Math.max(1, formData.participants + delta));
  };

  // ⭐ 권장 가격 계산 함수
  const calculateRecommendedPrice = () => {
    const price = parseFloat(formData.originalPrice) || 0;
    const shipping = parseFloat(formData.shippingCost) || 0;
    const rate = parseFloat(formData.exchangeRate) || 0;
    const people = parseInt(formData.participants) || 1;
    const fee = parseFloat(formData.feeRate) || 0;
    const domestic = parseFloat(formData.domesticShipping) || 0;

    const priceInWon = price * rate;
    const shippingPerPerson = (shipping * rate) / people;
    const subtotal = priceInWon + shippingPerPerson;
    const withFee = subtotal * (1 + fee / 100);
    const final = withFee + domestic;

    return Math.round(final);
  };


  // ========================================
  // Option Group Handlers
  // ========================================

  const handleAddOptionGroup = (optionGroup) => {
    setOptionGroups(prev => [...prev, optionGroup]);
    setShowOptionModal(false);
  };

  const handleDeleteOptionGroup = (id) => {
    setOptionGroups(prev => prev.filter(group => group.id !== id));
  };

  const toggleOptionGroup = (id) => {
    setExpandedGroup(prev => prev === id ? null : id);
  };


  // ========================================
  // Image Loading (Edit Mode)
  // ========================================

  const loadImageFile = async (fileId, setterFunction) => {
    try {
      const response = await myAxios().get(`/admin/file/${fileId}`, {
        responseType: 'blob'
      });
      const file = new File([response.data], `image-${fileId}.jpg`, {
        type: response.data.type || 'image/jpeg'
      });
      setterFunction(file);
    } catch (error) {
      console.error('이미지 로드 실패:', error);
    }
  };

  const loadMultipleImages = async (fileIds, setterFunction) => {
    try {
      const promises = fileIds.map(id =>
        myAxios().get(`/admin/file/${id}`, { responseType: 'blob' })
      );
      const responses = await Promise.all(promises);
      const files = responses.map((response, index) =>
        new File([response.data], `image-${fileIds[index]}.jpg`, {
          type: response.data.type || 'image/jpeg'
        })
      );
      setterFunction(files);
    } catch (error) {
      console.error('이미지 로드 실패:', error);
    }
  };


  // ========================================
  // Load Product Data (Edit Mode)
  // ========================================

  const loadProductData = async (id) => {
    try {
      const response = await myAxios().get(`/admin/gbProduct/${id}`);
      const data = response.data;

      console.log('📦 불러온 데이터:', data);
      console.log('💵 저장된 판매가:', data.price);

      setFormData({
        status: data.status || 'DRAFT',
        startDate: data.startDate || '',
        endDate: data.endDate || '',
        category: data.categoryId?.toString() || '',
        productName: data.name || '',
        proposalId: data.proposalId?.toString() || '',
        siteUrl: data.originalSiteUrl || '',
        description: data.description || '',
        originalPrice: data.originalPrice || '',
        shippingCost: data.abroadShippingCost || '',
        exchangeRate: data.exchangeRate || 0,
        participants: data.participants || 0,
        feeRate: 10,
        domesticShipping: data.shippingAmount || '3000',
        groupBuyPrice: data.price || '',
        supplierName: data.supplierName || '',
        minParticipants: data.minParticipants || '',
        productMemo: data.note || '',
        shippingMethod: data.shippingMethod || 'DEFAULT'
      });

      // 이미지 로드
      if (data.thumbnailFileId) {
        await loadImageFile(data.thumbnailFileId, setMainImage);
      }

      const imageIds = [
        data.image1FileId, data.image2FileId,
        data.image3FileId, data.image4FileId
      ].filter(id => id);
      if (imageIds.length > 0) {
        await loadMultipleImages(imageIds, setAdditionalImages);
      }

      const detailIds = [
        data.detail1FileId, data.detail2FileId,
        data.detail3FileId, data.detail4FileId
      ].filter(id => id);
      if (detailIds.length > 0) {
        await loadMultipleImages(detailIds, setDetailImages);
      }

      // 옵션 로드
      if (data.options && data.options.length > 0) {
        const groupMap = new Map();
        data.options.forEach(option => {
          if (!groupMap.has(option.groupName)) {
            groupMap.set(option.groupName, {
              id: Date.now() + Math.random(),
              groupName: option.groupName,
              options: []
            });
          }
          groupMap.get(option.groupName).options.push({
            name: option.name,
            price: option.price
          });
        });
        setOptionGroups(Array.from(groupMap.values()));
      }

    } catch (error) {
      console.error('데이터 로드 실패:', error);
      alert('데이터를 불러오는데 실패했습니다.');
    }
  };


  // ========================================
  // Fetch Exchange Rate
  // ========================================

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


  // ========================================
  // Fetch Categories
  // ========================================

  const fetchCategories = async () => {
    try {
      const response = await myAxios().get('/admin/categories');
      console.log('📥 카테고리 목록:', response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('카테고리 조회 실패:', error);
    }
  };


  // ========================================
  // Save (Draft)
  // ========================================

  const handleSave = async () => {
    try {
      const productFormData = new FormData();

      productFormData.append('name', formData.productName);
      productFormData.append('categoryId', formData.category);
      productFormData.append('startDate', formData.startDate);
      productFormData.append('endDate', formData.endDate);
      productFormData.append('originalSiteUrl', formData.siteUrl);
      productFormData.append('description', formData.description);
      productFormData.append('originalPrice', formData.originalPrice);
      productFormData.append('abroadShippingCost', formData.shippingCost);
      productFormData.append('exchangeRate', formData.exchangeRate);
      productFormData.append('minParticipants', formData.minParticipants);
      productFormData.append('price', formData.groupBuyPrice);
      productFormData.append('supplierName', formData.supplierName);
      productFormData.append('shippingMethod', formData.shippingMethod);
      productFormData.append('note', formData.productMemo);
      productFormData.append('status', isEditMode ? formData.status : 'DRAFT');

      if (formData.proposalId) {
        productFormData.append('proposalId', extractProposalId(formData.proposalId));
      }

      if (mainImage) productFormData.append('thumbnail', mainImage);
      if (additionalImages.length > 0) {
        additionalImages.forEach(img => productFormData.append('images', img));
      }
      if (detailImages.length > 0) {
        detailImages.forEach(img => productFormData.append('details', img));
      }

      let resultProductId;

      if (isEditMode) {
        await myAxios().put(`/admin/gbProduct/${productId}`, productFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        resultProductId = productId;
        alert('수정되었습니다!');
      } else {
        const response = await myAxios().post('/admin/gbProductCreate', productFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        resultProductId = response.data;
        alert('미게시 상태로 저장되었습니다!');
      }

      if (optionGroups.length > 0) {
        for (const group of optionGroups) {
          for (const option of group.options) {
            await myAxios().post(`/admin/gbProducts/${resultProductId}/options`, [{
              groupName: group.groupName,
              name: option.name,
              price: option.price
            }]);
          }
        }
      }

      if (window.opener && !window.opener.closed) {
        window.opener.location.reload();
      }
      window.close();

    } catch (error) {
      console.error('저장 오류:', error);
      alert(`저장 실패: ${error.response?.data?.message || error.message}`);
    }
  };


  // ========================================
  // Submit (Publish)
  // ========================================

  const handleSubmit = async () => {
    if (!mainImage && !isEditMode) {
      alert('대표 이미지를 업로드해주세요.');
      return;
    }
    if (!formData.productName?.trim()) {
      alert('상품명을 입력해주세요.');
      return;
    }
    if (!formData.category) {
      alert('카테고리를 선택해주세요.');
      return;
    }

    try {
      const productFormData = new FormData();

      productFormData.append('name', formData.productName);
      productFormData.append('categoryId', formData.category);
      productFormData.append('startDate', formData.startDate);
      productFormData.append('endDate', formData.endDate);
      productFormData.append('originalSiteUrl', formData.siteUrl || '');
      productFormData.append('description', formData.description || '');
      productFormData.append('originalPrice', formData.originalPrice || 0);
      productFormData.append('abroadShippingCost', formData.shippingCost || 0);
      productFormData.append('exchangeRate', formData.exchangeRate || 0);
      productFormData.append('minParticipants', formData.minParticipants || 1);
      productFormData.append('price', formData.groupBuyPrice || 0);
      productFormData.append('supplierName', formData.supplierName || '');
      productFormData.append('shippingMethod', formData.shippingMethod || 'DEFAULT');
      productFormData.append('shippingAmount', formData.domesticShipping || 0);
      productFormData.append('note', formData.productMemo || '');
      productFormData.append('status', formData.status);

      if (formData.proposalId) {
        productFormData.append('proposalId', extractProposalId(formData.proposalId));
      }

      if (mainImage) productFormData.append('thumbnail', mainImage);
      if (additionalImages.length > 0) {
        additionalImages.forEach(img => productFormData.append('images', img));
      }
      if (detailImages.length > 0) {
        detailImages.forEach(img => productFormData.append('details', img));
      }

      let resultProductId;

      if (isEditMode) {
        await myAxios().put(`/admin/gbProduct/${productId}`, productFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        resultProductId = productId;
      } else {
        const response = await myAxios().post('/admin/gbProductCreate', productFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        resultProductId = response.data;
      }

      if (optionGroups.length > 0) {
        for (const group of optionGroups) {
          for (const option of group.options) {
            await myAxios().post(`/admin/gbProducts/${resultProductId}/options`, [{
              groupName: group.groupName,
              name: option.name,
              price: option.price
            }]);
          }
        }
      }

      alert(`공구가 ${isEditMode ? '수정' : '등록'}되었습니다!`);

      if (formData.proposalId) {
        alert('제안자와 투표자들에게 알림이 발송되었습니다.');
      }

      if (formData.status === 'CANCELLED') {
        alert(
          '공구가 취소되었습니다.\n' +
          '참여자들에게 알림 발송 및 환불 처리를 진행해주세요.\n' +
          '(참여인원 모달에서 "공구 취소" 버튼 이용)'
        );
      }

      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({
          type: isEditMode ? 'GB_PRODUCT_UPDATED' : 'GB_PRODUCT_CREATED',
          productId: resultProductId
        }, '*');
        window.opener.location.reload();
      }
      window.close();

    } catch (error) {
      console.error('처리 오류:', error);
      alert(`처리 실패: ${error.response?.data?.message || error.message}`);
    }
  };


  // ========================================
  // useEffect - Initialize
  // ========================================

  useEffect(() => {
    const id = searchParams.get('id');
    const proposalId = searchParams.get('proposalId');

    if (id) {
      setIsEditMode(true);
      setProductId(id);
      loadProductData(id);
    } else {
      setIsEditMode(false);

      if (proposalId) {
        setFormData(prev => ({
          ...prev,
          proposalId: proposalId
        }));
      }
    }
  }, [searchParams]);


  // ========================================
  // useEffect - Fetch Categories
  // ========================================

  useEffect(() => {
    fetchCategories();
  }, []);


  // ========================================
  // useEffect - Fetch Exchange Rate
  // ========================================

  useEffect(() => {
    fetchExchangeRate();
  }, []);


  // ========================================
  // useEffect - Before Unload Warning
  // ========================================

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);


  // ========================================
  // Render
  // ========================================

  return (
    <div className="gb-product-create-page">
      <div className="create-container">

        {isEditMode && productId && (
          <div className="edit-banner">
            <div className="edit-banner-icon">📝</div>
            <div className="edit-banner-info">
              <h3>공구 수정</h3>
              <div className="edit-banner-details">
                <span>공구 ID: {productId}</span>
                <span>공구명: {formData.productName}</span>
              </div>
            </div>
          </div>
        )}

        {formData.proposalId && (
          <div style={{
            padding: '16px',
            marginBottom: '24px',
            backgroundColor: '#dbeafe',
            border: '2px solid #3b82f6',
            borderRadius: '8px'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#1e40af' }}>
              📋 제안 기반 공구 등록
            </h4>
            <p style={{ margin: 0, color: '#1e3a8a' }}>
              제안 ID: {extractProposalId(formData.proposalId)}
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#3730a3' }}>
              등록 완료 시 제안자와 투표자들에게 알림이 발송됩니다.
            </p>
          </div>
        )}

        <div className="modal-header-large">
          <h2>{isEditMode ? '공구 수정' : '공구 등록'}</h2>
        </div>

        <div className="modal-body-large">

          <section className="form-section">
            <h3 className="section-title">표시 설정</h3>
            <div className="form-field">
              <label>상태</label>
              <select value={formData.status} onChange={(e) => updateField('status', e.target.value)}>
                <option value="DRAFT">미게시</option>
                <option value="ONGOING">진행중</option>
                <option value="PENDING_ORDER">구매대기</option>
                <option value="COMPLETED">완료</option>
                <option value="CANCELLED">취소</option>
              </select>
            </div>
          </section>

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

          <section className="form-section">
            <h3 className="section-title">카테고리 선택</h3>
            <div className="form-field">
              <select
                value={formData.category}
                onChange={(e) => updateField('category', e.target.value)}
              >
                <option value="">카테고리 선택</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </section>

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
              <label>원 사이트 주소</label>
              <input
                type="url"
                placeholder=""
                value={formData.siteUrl}
                onChange={(e) => updateField('siteUrl', e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>대표이미지 (필수)</label>
              {mainImage && (
                <div className="image-preview">
                  <img src={URL.createObjectURL(mainImage)} alt="대표이미지" />
                  <button
                    className="remove-image-btn"
                    onClick={() => setMainImage(null)}
                  >
                    ×
                  </button>
                </div>
              )}
              {!mainImage && (
                <div className="upload-box">
                  <input
                    type="file"
                    id="main-image"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => setMainImage(e.target.files[0])}
                  />
                  <label htmlFor="main-image" className="upload-label">
                    <div className="upload-content">
                      ↑<br />
                      <span className="upload-text">Click to upload</span><br />
                      <small>이미지 파일만 가능</small>
                    </div>
                  </label>
                </div>
              )}
            </div>

            <div className="form-field">
              <label>추가 이미지 (최대 4개)</label>
              <div className="image-grid">
                {additionalImages.map((img, index) => (
                  <div key={index} className="image-slot preview">
                    <img src={URL.createObjectURL(img)} alt={`preview-${index}`} />
                    <button
                      className="remove-image-btn"
                      onClick={() => {
                        setAdditionalImages(prev => prev.filter((_, i) => i !== index));
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {additionalImages.length < 4 && (
                  <div className="image-slot">
                    <input
                      type="file"
                      id="additional-images"
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        const remaining = 4 - additionalImages.length;
                        const newFiles = files.slice(0, remaining);
                        setAdditionalImages(prev => [...prev, ...newFiles]);
                        e.target.value = '';
                      }}
                    />
                    <label htmlFor="additional-images" className="upload-label">
                      <div className="upload-content">
                        <Plus size={32} />
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="form-section">
            <h3 className="section-title">상품 설명</h3>
            <div className="form-field description-view"
              style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              <textarea
                rows={6}
                placeholder="상품에 대한 상세 설명을 입력하세요"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
              />
            </div>
          </section>

          <section className="form-section">
            <h3 className="section-title">상품 상세설명 이미지</h3>
            <div className="form-field">
              <label>상세설명 이미지 (최대 4개)</label>
              <div className="image-grid">
                {detailImages.map((img, index) => (
                  <div key={index} className="image-slot preview">
                    <img src={URL.createObjectURL(img)} alt={`detail-${index}`} />
                    <button
                      className="remove-image-btn"
                      onClick={() => {
                        setDetailImages(prev => prev.filter((_, i) => i !== index));
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {detailImages.length < 4 && (
                  <div className="image-slot">
                    <input
                      type="file"
                      id="detail-images"
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        const remaining = 4 - detailImages.length;
                        const newFiles = files.slice(0, remaining);
                        setDetailImages(prev => [...prev, ...newFiles]);
                        e.target.value = '';
                      }}
                    />
                    <label htmlFor="detail-images" className="upload-label">
                      <div className="upload-content">
                        <Plus size={32} />
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="form-section">
            <h3 className="section-title">옵션 정보</h3>
            {optionGroups.length > 0 && (
              <div className="options-table">
                {optionGroups.map((group) => (
                  <div key={group.id} className="option-group-container">
                    <div
                      className="option-group-header"
                      onClick={() => toggleOptionGroup(group.id)}
                    >
                      <div className="option-group-summary">
                        <strong>{group.groupName}</strong>
                        <span className="option-count">
                          {group.options.length}개 옵션
                        </span>
                      </div>
                      <div className="option-actions">
                        {expandedGroup === group.id ?
                          <ChevronUp size={20} /> :
                          <ChevronDown size={20} />
                        }
                      </div>
                    </div>
                    {expandedGroup === group.id && (
                      <div className="option-group-details">
                        {group.options.map((opt, index) => (
                          <div key={index} className="option-detail-row">
                            <span className="option-detail-name">{opt.name}</span>
                            <span className="option-detail-price">
                              +{opt.price.toLocaleString()}원
                            </span>
                          </div>
                        ))}
                        <button
                          className="delete-group-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteOptionGroup(group.id);
                          }}
                        >
                          그룹 삭제
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <button
              className="add-btn"
              onClick={() => setShowOptionModal(true)}
            >
              <Plus size={16} /> 옵션 추가
            </button>
          </section>

          {/* ⭐ 판매 정보 섹션 - 완전 수정 */}
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

                <div className="calc-result-row">
                  <span>국내 배송비:</span>
                  <strong>
                    {(parseInt(formData.domesticShipping) || 0).toLocaleString()}원
                  </strong>
                </div>

                <div className="calc-result-row" style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '2px solid #3b82f6'
                }}>
                  <span style={{ fontSize: '15px', fontWeight: '700' }}>
                    권장 판매가:
                  </span>
                  <strong style={{ fontSize: '20px', color: '#3b82f6' }}>
                    {calculateRecommendedPrice().toLocaleString()}원
                  </strong>
                </div>

                <small className="calc-formula" style={{ marginTop: '12px', display: 'block' }}>
                  = (원가 × 환율) + (해외배송비 × 환율 ÷ 인원) × (1 + 수수료) + 국내배송비
                </small>

                <button
                  type="button"
                  onClick={() => updateField('groupBuyPrice', calculateRecommendedPrice())}
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

            <div className="form-field" style={{ marginTop: '24px' }}>
              <label>납품 업체명</label>
              <input
                type="text"
                placeholder="납품 업체명을 입력하세요"
                value={formData.supplierName}
                onChange={(e) => updateField('supplierName', e.target.value)}
              />
            </div>
          </section>

          <section className="form-section">
            <h3 className="section-title">공구 정보</h3>

            <div className="form-field">
              <label>제안 번호 / URL</label>
              <input
                type="text"
                placeholder="제안 번호 또는 URL을 입력하세요 (예: 123 또는 /proposal/123)"
                value={formData.proposalId}
                onChange={(e) => updateField('proposalId', e.target.value)}
                disabled={!!searchParams.get('proposalId')}
                style={{
                  backgroundColor: searchParams.get('proposalId') ? '#f3f4f6' : 'white'
                }}
              />
              <small className="field-hint">
                제안 번호만 입력하거나, 제안 페이지 URL을 복붙하세요.
              </small>
            </div>

            <div className="form-field">
              <label>최소 인원</label>
              <input
                type="number"
                placeholder="최소 참여 인원을 입력하세요"
                value={formData.minParticipants}
                onChange={(e) => updateField('minParticipants', e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>상품 메모 및 주의사항</label>
              <textarea
                rows={4}
                placeholder="상품 관련 메모나 주의사항을 입력하세요"
                value={formData.productMemo}
                onChange={(e) => updateField('productMemo', e.target.value)}
              />
            </div>
          </section>

          <section className="form-section">
            <h3 className="section-title">배송 정보</h3>
            <div className="form-field">
              <label>배송 방법</label>
              <select
                value={formData.shippingMethod}
                onChange={(e) => updateField('shippingMethod', e.target.value)}
              >
                <option value="DEFAULT">유료</option>
                <option value="FREE">무료</option>
              </select>
            </div>
          </section>

        </div>

        <div className="gb-product-footer">
          <button className="gb-product-btn gb-product-btn-cancel" onClick={() => window.close()}>
            취소
          </button>
          <button className="gb-product-btn gb-product-btn-save" onClick={handleSave}>
            {isEditMode ? '수정 저장' : '저장'}
          </button>
          <button className="gb-product-btn gb-product-btn-submit" onClick={handleSubmit}>
            {isEditMode ? '수정 완료' : '게시'}
          </button>
        </div>
      </div>

      {showOptionModal && (
        <OptionAddModal
          onClose={() => setShowOptionModal(false)}
          onAdd={handleAddOptionGroup}
        />
      )}
    </div>
  );
};

export default GBProductCreatePage;