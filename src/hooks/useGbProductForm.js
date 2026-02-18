import { useState, useEffect } from "react";
import {
    createProduct, updateProduct, createOptions, getProduct, getCategories, getFileBlob
} from '../api/gbProductApi';
import { calculateRecommendedPrice } from '../utils/calculateRecommendedPrice';

export const useGbProductForm = (productId = null, proposalId = null) => {
    // ⭐ isEditMode는 derived state - 계산으로 처리
    const isEditMode = !!productId;

    const [formData, setFormData] = useState({
        status: 'DRAFT', startDate: '', endDate: '', category: '', productName: '', proposalId: proposalId || '', siteUrl: '',
        description: '', originalPrice: '', shippingCost: '', currency: 'USD', exchangeRate: 0, participants: 1, feeRate: 10,
        domesticShipping: '', groupBuyPrice: '', supplierName: '', minParticipants: '', productMemo: '', shippingMethod: 'DEFAULT'
    });
    const [categories, setCategories] = useState([]);
    const [mainImage, setMainImage] = useState(null);
    const [additionalImages, setAdditionalImages] = useState([]);
    const [detailImages, setDetailImages] = useState([]);
    const [optionGroups, setOptionGroups] = useState([]);

    const [expandedGroup, setExpandedGroup] = useState(null);
    const [showOptionModal, setShowOptionModal] = useState(false);

    const [isLoadingRate, setIsLoadingRate] = useState(false);

    // ========================================
    // 유틸리티 함수
    // ========================================

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

    const recommendedPrice = calculateRecommendedPrice({
        originalPrice: Number(formData.originalPrice),
        shippingCost: Number(formData.shippingCost),
        exchangeRate: Number(formData.exchangeRate),
        participants: Number(formData.participants),
        feeRate: Number(formData.feeRate),
        domesticShipping: Number(formData.domesticShipping)
    });

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
            const blob = await getFileBlob(fileId);

            const file = new File(
                [blob],
                `image-${fileId}.jpg`,
                { type: blob.type || 'image/jpeg' }
            );
            setterFunction(file);
        } catch (error) {
            console.error('이미지 로드 실패:', error);
        }
    };

    const loadMultipleImages = async (fileIds, setterFunction) => {
        try {
            const promises = fileIds.map(id =>
                getFileBlob(id)
            );
            const blobs = await Promise.all(promises);
            const files = blobs.map((blob, index) =>
                new File(
                    [blob],
                    `image-${fileIds[index]}.jpg`,
                    { type: blob.type || 'image/jpeg' }
                )
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
            const data = await getProduct(id);

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
                currency: data.currency || 'USD',
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

    const fetchExchangeRate = async () => {
        try {
            setIsLoadingRate(true);

            const response = await fetch(
                `https://api.exchangerate-api.com/v4/latest/${formData.currency}`
            );

            const data = await response.json();
            const rate = data.rates.KRW;

            setFormData(prev => ({
                ...prev,
                exchangeRate: Math.round(rate)
            }));

        } catch (error) {
            console.error('환율 조회 실패', error);
        } finally {
            setIsLoadingRate(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            console.log('📥 카테고리 목록:', data);
            setCategories(data);
        } catch (error) {
            console.error('카테고리 조회 실패:', error);
        }
    };

    // ========================================
    // 유효성 검사
    const validateForm = () => {
        if (!mainImage && !isEditMode) {
            alert('대표 이미지를 업로드해주세요.');
            return false;
        }

        if (!formData.productName?.trim()) {
            alert('상품명을 입력해주세요.');
            return false;
        }

        if (!formData.category) {
            alert('카테고리를 선택해주세요.');
            return false;
        }

        return true;
    };

    // 상품 저장
    const saveProduct = async () => {
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

        additionalImages.forEach(img => {
            productFormData.append('images', img);
        });

        detailImages.forEach(img => {
            productFormData.append('details', img);
        });

        if (isEditMode) {
            await updateProduct(productId, productFormData);
            return productId;
        } else {
            return await createProduct(productFormData);
        }
    };

    //옵션 저장
    const saveOptions = async (productId) => {
        const flatOptions = [];

        optionGroups.forEach(group => {
            group.options.forEach(option => {
                flatOptions.push({
                    groupName: group.groupName,
                    name: option.name,
                    price: option.price
                });
            });
        });

        if (flatOptions.length > 0) {
            await createOptions(productId, flatOptions);
        }
    };

    //상태 메세지 
    const getStatusMessage = (status, isEditMode) => {
        if (status === 'DRAFT') {
            return '미게시 상태로 저장되었습니다.';
        }

        if (status === 'ONGOING') {
            return isEditMode
                ? '공구가 수정되었습니다.'
                : '공구가 등록되었습니다.';
        }

        if (status === 'CANCELLED') {
            return (
                '공구가 취소되었습니다.\n' +
                '참여자들에게 알림 발송 및 환불 처리를 진행해주세요.\n' +
                '(참여인원 모달에서 "공구 취소" 버튼 이용)'
            );
        }

        return '';
    };

    // 부모창 알림
    const notifyParent = (productId) => {
        if (window.opener && !window.opener.closed) {
            window.opener.postMessage({
                type: isEditMode ? 'GB_PRODUCT_UPDATED' : 'GB_PRODUCT_CREATED',
                productId: productId
            }, '*');

            window.opener.location.reload();
        }
    };

    // ========================================
    // save (save / Publish)
    // ========================================

    const handleSave = async () => {
        try {
            // 1. 유효성 검사
            if (!validateForm()) return;

            // 2. 상품 저장
            const savedProductId = await saveProduct();

            // 3. 옵션 저장
            if (optionGroups.length > 0) {
                await saveOptions(savedProductId);
            }

            // 4. 상태 메시지
            const message = getStatusMessage(formData.status, isEditMode);
            if (message) alert(message);

            // 5. 부모창 알림
            notifyParent(savedProductId);

            // 6. 창 닫기
            window.close();

        } catch (error) {
            console.error('처리 오류:', error);
            alert(`처리 실패: ${error.response?.data?.message || error.message}`);
        }
    };

    // ========================================
    // useEffect 
    // ========================================

    useEffect(() => {
        if (!productId) return;
        loadProductData(productId);
    }, [productId]);


    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (formData.currency) {
            fetchExchangeRate();
        }
    }, [formData.currency]);


    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
            return '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);


    return {
        // State
        isEditMode,
        productId,
        formData,
        categories,
        mainImage,
        setMainImage,
        additionalImages,
        setAdditionalImages,
        detailImages,
        setDetailImages,
        isLoadingRate,
        optionGroups,
        expandedGroup,
        showOptionModal,
        setShowOptionModal,

        // Functions
        extractProposalId,
        updateField,
        adjustParticipants,
        handleAddOptionGroup,
        handleDeleteOptionGroup,
        toggleOptionGroup,
        fetchExchangeRate,
        handleSave
    };
};