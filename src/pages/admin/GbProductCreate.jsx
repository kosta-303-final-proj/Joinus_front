import React, { useState, useEffect } from 'react';
import { myAxios } from '../../config';
import { X, Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import OptionAddModal from './OptionAddModal';
import '../../styles/components/button.css';
import './GBProductCreate.css';

const GBProductCreatePage = () => {
  //수정모드 체크
  const [isEditMode, setIsEditMode] = useState(false);
  const [productId, setProductId] = useState(null);

  const [formData, setFormData] = useState({
    status: 'DRAFT',
    startDate: '',
    endDate: '',
    category: '',
    productName: '',
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
    shippingMethod: 'DEFAULT'
  });

  const [categories, setCategories] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [detailImages, setDetailImages] = useState([]);
  const [isLoadingRate, setIsLoadingRate] = useState(true);

  // 옵션 그룹 상태
  const [optionGroups, setOptionGroups] = useState([]);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [showOptionModal, setShowOptionModal] = useState(false);

  // 날짜 변환 함수 (timestamp형식으로 변환해줌)
  const formatDateToTimestamp = (dateString) => {
    if (!dateString) return null;
    return `${dateString} 00:00:00`;
  };

  const formatDateFromTimestamp = (timestamp) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  //제안 숫자 추출 함수
  const extractNumberOnly = (input) => {
    if (!input) return '';

    // 숫자만 있으면 그대로
    if (/^\d+$/.test(input)) {
      return input;
    }

    // URL에서 숫자 추출
    const parts = input.split('/');
    for (let i = parts.length - 1; i >= 0; i--) {
      if (/^\d+$/.test(parts[i])) {
        return parts[i];
      }
    }

    return '';
  };


  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 참여 인원 조정
  const adjustParticipants = (delta) => {
    updateField('participants', Math.max(1, formData.participants + delta));
  };

  // 옵션 그룹 추가
  const handleAddOptionGroup = (optionGroup) => {
    setOptionGroups(prev => [...prev, optionGroup]);
    setShowOptionModal(false);
  };

  // 옵션 그룹 삭제
  const handleDeleteOptionGroup = (id) => {
    setOptionGroups(prev => prev.filter(group => group.id !== id));
  };

  //  옵션 그룹 토글
  const toggleOptionGroup = (id) => {
    setExpandedGroup(prev => prev === id ? null : id);
  };

  // 이미지 로드
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

  // 이미지 파일 로드 (여러 개)
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


  //  데이터 로드 (수정 모드)
  const loadProductData = async (id) => {
    try {
      const response = await myAxios().get(`/admin/gbProduct/${id}`);
      const data = response.data;

      console.log('========== 날짜 디버깅 ==========');
      console.log('1. Backend 원본 startDate:', data.startDate);
      console.log('2. Backend 원본 endDate:', data.endDate);

      const formattedStartDate = formatDateFromTimestamp(data.startDate);
      const formattedEndDate = formatDateFromTimestamp(data.endDate);

      console.log('3. 변환 후 startDate:', formattedStartDate);
      console.log('4. 변환 후 endDate:', formattedEndDate);
      console.log('================================');

      setFormData({
        status: data.status || 'DRAFT',
        startDate: formatDateFromTimestamp(data.startDate),
        endDate: formatDateFromTimestamp(data.endDate),
        category: data.categoryId?.toString() || '',
        productName: data.name || '',
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
        proposalNumber: data.proposalId || '',
        minParticipants: data.minParticipants || '',
        productMemo: data.note || '',
        shippingMethod: data.shippingMethod || 'DEFAULT'
      });

      // 썸네일 로드
      if (data.thumbnailFileId) {
        await loadImageFile(data.thumbnailFileId, setMainImage);
      }

      // 추가 이미지 로드
      const imageIds = [
        data.image1FileId,
        data.image2FileId,
        data.image3FileId,
        data.image4FileId
      ].filter(id => id);

      if (imageIds.length > 0) {
        await loadMultipleImages(imageIds, setAdditionalImages);
      }

      // 상세 이미지 로드
      const detailIds = [
        data.detail1FileId,
        data.detail2FileId,
        data.detail3FileId,
        data.detail4FileId
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


  // ===== 저장 (미게시) =====
  const handleSave = async () => {
    try {
      const productFormData = new FormData();

      productFormData.append('name', formData.productName);
      productFormData.append('categoryId', formData.category);
      productFormData.append('startDate', formatDateToTimestamp(formData.startDate));
      productFormData.append('endDate', formatDateToTimestamp(formData.endDate));
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

      if (formData.proposalNumber) {
        const proposalId = extractNumberOnly(formData.proposalNumber);
        if (proposalId) {
          productFormData.append('proposalId', proposalId);
        }
      }

      productFormData.append('status', isEditMode ? formData.status : 'DRAFT');

      if (mainImage) {
        productFormData.append('thumbnail', mainImage);
      }

      if (additionalImages && additionalImages.length > 0) {
        additionalImages.forEach(img => {
          productFormData.append('images', img);
        });
      }

      if (detailImages && detailImages.length > 0) {
        detailImages.forEach(img => {
          productFormData.append('details', img);
        });
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

      // 옵션 처리
      if (optionGroups && optionGroups.length > 0) {
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

  // ===== 게시 =====
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

      // 날짜 형식 수정 (시간 제거)
      const startDateOnly = formData.startDate?.split(' ')[0] || formData.startDate || '';
      const endDateOnly = formData.endDate?.split(' ')[0] || formData.endDate || '';

      console.log('========== 전송 데이터 ==========');
      console.log('원본 startDate:', formData.startDate);
      console.log('원본 endDate:', formData.endDate);
      console.log('변환 startDate:', startDateOnly);
      console.log('변환 endDate:', endDateOnly);
      console.log('================================');

      productFormData.append('name', formData.productName);
      productFormData.append('categoryId', formData.category);
      productFormData.append('startDate', startDateOnly);
      productFormData.append('endDate', endDateOnly);
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

      if (formData.proposalNumber) {
        const proposalId = extractNumberOnly(formData.proposalNumber);
        if (proposalId) {  // 숫자가 있을 때만
          productFormData.append('proposalId', proposalId);
        }
      }

      productFormData.append('status', formData.status);

      if (mainImage) {
        productFormData.append('thumbnail', mainImage);
      }

      if (additionalImages && additionalImages.length > 0) {
        additionalImages.forEach(img => {
          productFormData.append('images', img);
        });
      }

      if (detailImages && detailImages.length > 0) {
        detailImages.forEach(img => {
          productFormData.append('details', img);
        });
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

      // 옵션 처리
      if (optionGroups && optionGroups.length > 0) {
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
      console.error('응답 데이터:', error.response?.data);
      alert(`처리 실패: ${error.response?.data?.message || error.message}`);
    }
  };

  // ========================================
  //  useEffect들
  // ========================================

  //초기화
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id) {
      // 수정 모드
      setIsEditMode(true);
      setProductId(id);
      loadProductData(id);
    } else {
      // 생성 모드
      setIsEditMode(false);
    }
  }, []);

  //카테고리 목록 조회
  useEffect(() => {
        fetchCategories();
    }, []);
    
    const fetchCategories = async () => {
        try {
            const response = await myAxios().get('/admin/categories');
            console.log('📥 카테고리 목록:', response.data);
            setCategories(response.data);
        } catch (error) {
            console.error('카테고리 조회 실패:', error);
        }
    };

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

  // 창 닫기 전 경고
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);


  //URL 파라미터로 proposalId 받을 때 대비
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const proposalId = urlParams.get('proposalId');

    if (proposalId) {
      updateField('proposalNumber', proposalId);  // 폼에 자동 입력
    }
  }, []);


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

        {/* 헤더 */}
        <div className="modal-header-large">
          <h2>{isEditMode ? '공구 수정' : '공구 등록'}</h2>
        </div>

        {/* 내용 */}
        <div className="modal-body-large">

          {/* 표시 설정 */}
          <section className="form-section">
            <h3 className="section-title">표시 설정</h3>
            <div className="form-field">
              <label>상태</label>
              <select value={formData.status} onChange={(e) => updateField('status', e.target.value)}>
                <option value="DRAFT">미게시</option>
                <option value="ONGOING">진행중</option>
                <option value="PENDING_ORDER">발주대기</option>
                <option value="COMPLETED">완료</option>
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
              <label>원 사이트 주소</label>
              <input
                type="url"
                placeholder=""
                value={formData.siteUrl}
                onChange={(e) => updateField('siteUrl', e.target.value)}
              />
            </div>

            {/* 대표이미지 */}
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

            {/* 추가 이미지 */}
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

          {/* 상품 설명 */}
          <section className="form-section">
            <h3 className="section-title">상품 설명</h3>
            <div className="form-field">
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
                {/* 미리보기 */}
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

                {/* 추가 버튼 (4개 미만일 때만) */}
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


          {/* 옵션 정보 */}
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
                placeholder="납품 업체명을 입력하세요"
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
                placeholder="제안 번호 또는 URL을 입력하세요 (예: 123 또는 /proposal/123)"
                value={formData.proposalNumber}
                onChange={(e) => updateField('proposalNumber', e.target.value)}
              />
              <small className="field-hint">
                제안 번호만 입력하거나, 제안 페이지 URL을 복붙하세요.
              </small>
            </div>

            {/* ✅ 제안 페이지 바로가기 버튼 (있을 때만) */}
            {formData.proposalNumber && (
              <a
                href={`/proposal/${extractNumberOnly(formData.proposalNumber)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="proposal-link-btn"
              >
                📋 제안 페이지 보기
              </a>
            )}

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

          {/* 배송 정보 */}
          <section className="form-section">
            <h3 className="section-title">배송 정보</h3>

            {/* 배송 방법 (Enum) */}
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

        {/* 푸터 */}
        <div className="modal-footer-large">
          <button className="btn-secondary" onClick={() => window.close()}>취소</button>
          <button className="btn-outline" onClick={handleSave}>
            {isEditMode ? '수정 저장' : '저장'}
          </button>
          <button className="btn-outline">미리보기</button>
          <button className="btn-primary" onClick={handleSubmit}>
            {isEditMode ? '수정 완료' : '게시'}
          </button>
        </div>
      </div>

      {/* 옵션 모달 */}
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