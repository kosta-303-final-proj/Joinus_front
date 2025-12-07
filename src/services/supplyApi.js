import { apiFetch } from '../config';

/**
 * 납품 신청 목록 조회
 * @param {string} status - 상태 필터 (전체/신청/승인/반려)
 * @returns {Promise<Array>} 신청 목록
 */
export const getApplicationList = async (status = '전체') => {
  try {
    const params = new URLSearchParams({ status });
    const response = await apiFetch(`/api/admin/supply/applications?${params}`);
    if (!response.ok) {
      throw new Error('신청 목록 조회 실패');
    }
    return await response.json();
  } catch (error) {
    console.error('신청 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 납품 신청 상세 조회
 * @param {number} id - 신청 ID
 * @returns {Promise<Object>} 신청 상세 정보
 */
export const getApplicationDetail = async (id) => {
  try {
    const response = await apiFetch(`/api/admin/supply/applications/${id}`);
    if (!response.ok) {
      throw new Error('신청 상세 조회 실패');
    }
    return await response.json();
  } catch (error) {
    console.error('신청 상세 조회 실패:', error);
    throw error;
  }
};

/**
 * 납품 신청 승인
 * @param {number} id - 신청 ID
 * @returns {Promise<boolean>} 성공 여부
 */
export const approveApplication = async (id) => {
  try {
    const response = await apiFetch(`/api/admin/supply/applications/${id}/approve`, {
      method: 'PUT',
    });
    if (!response.ok) {
      throw new Error('승인 처리 실패');
    }
    return await response.json();
  } catch (error) {
    console.error('승인 처리 실패:', error);
    throw error;
  }
};

/**
 * 납품 신청 반려
 * @param {number} id - 신청 ID
 * @param {string} rejectionReason - 반려 사유
 * @returns {Promise<boolean>} 성공 여부
 */
export const rejectApplication = async (id, rejectionReason) => {
  try {
    const response = await apiFetch(`/api/admin/supply/applications/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ rejectionReason }),
    });
    if (!response.ok) {
      throw new Error('반려 처리 실패');
    }
    return await response.json();
  } catch (error) {
    console.error('반려 처리 실패:', error);
    throw error;
  }
};

/**
 * 승인된 납품 업체 목록 조회
 * @param {string} keyword - 검색어 (업체명/담당자/사업자번호)
 * @param {string} category - 카테고리 필터
 * @param {string} sortBy - 정렬 기준 (recent/name)
 * @returns {Promise<Array>} 승인된 업체 목록
 */
export const getApprovedSupplierList = async (keyword = '', category = '전체', sortBy = 'recent') => {
  try {
    const params = new URLSearchParams({
      keyword,
      category,
      sortBy,
    });
    const response = await apiFetch(`/api/admin/supply/approved?${params}`);
    if (!response.ok) {
      throw new Error('승인된 업체 목록 조회 실패');
    }
    return await response.json();
  } catch (error) {
    console.error('승인된 업체 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 납품 상품 등록
 * @param {Object} productData - 상품 데이터
 * @param {string} productData.productName - 상품명
 * @param {number} productData.supplierId - 업체 ID
 * @param {number} productData.quantity - 수량
 * @param {number} productData.unitPrice - 단가
 * @param {string} productData.deliveryDate - 납품 예정일 (YYYY-MM-DD)
 * @param {string} productData.memo - 비고
 * @returns {Promise<boolean>} 성공 여부
 */
export const createSupplyProduct = async (productData) => {
  try {
    const response = await apiFetch('/api/admin/supply/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error('상품 등록 실패');
    }
    return await response.json();
  } catch (error) {
    console.error('상품 등록 실패:', error);
    throw error;
  }
};

/**
 * 납품 상품 목록 조회
 * @param {number|null} vendorId - 업체 ID 필터 (null이면 전체)
 * @param {string} status - 상태 필터 (전체/납품 완료/검수 중/입고 예정)
 * @param {string} keyword - 검색어 (상품명/업체명)
 * @returns {Promise<Array>} 납품 상품 목록
 */
export const getSupplyProductList = async (vendorId = null, status = '전체', keyword = '') => {
  try {
    const params = new URLSearchParams({ status, keyword });
    if (vendorId) {
      params.append('vendorId', vendorId);
    }
    const response = await apiFetch(`/api/admin/supply/products?${params}`);
    if (!response.ok) {
      throw new Error('납품 상품 목록 조회 실패');
    }
    return await response.json();
  } catch (error) {
    console.error('납품 상품 목록 조회 실패:', error);
    throw error;
  }
};

