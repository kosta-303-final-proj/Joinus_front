import { myAxios, baseUrl } from '../config';

/**
 * 공지사항 목록 조회 (페이지네이션)
 * @param {number} page - 페이지 번호 (기본값: 1)
 * @returns {Promise<Object>} { pageInfo, noticeList }
 */
export const getNoticeList = async (page = 1) => {
  try {
    const response = await myAxios().get(`/api/notices?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('공지사항 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 공지사항 상세 조회
 * @param {number} id - 공지사항 ID
 * @returns {Promise<Object>} NoticeDto
 */
export const getNoticeDetail = async (id) => {
  try {
    const response = await myAxios().get(`/api/notices/${id}`);
    return response.data;
  } catch (error) {
    console.error('공지사항 상세 조회 실패:', error);
    throw error;
  }
};

/**
 * FAQ 전체 목록 조회
 * @returns {Promise<Array>} FAQ 목록
 */
export const getFaqList = async () => {
  try {
    const response = await myAxios().get('/api/faqs');
    return response.data;
  } catch (error) {
    console.error('FAQ 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 1:1 문의 목록 조회 (본인 것만, 페이지네이션)
 * @param {number} page - 페이지 번호 (기본값: 1)
 * @returns {Promise<Object>} { pageInfo, inquiryList }
 */
export const getInquiryList = async (page = 1) => {
  try {
    const response = await myAxios().get(`/user/api/inquiries?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('1:1 문의 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 1:1 문의 상세 조회
 * @param {number} id - 문의 ID
 * @returns {Promise<Object>} InquiryDto
 */
export const getInquiryDetail = async (id) => {
  try {
    const response = await myAxios().get(`/user/api/inquiries/${id}`);
    return response.data;
  } catch (error) {
    console.error('1:1 문의 상세 조회 실패:', error);
    throw error;
  }
};

/**
 * 1:1 문의 작성
 * @param {FormData} formData - 문의 작성 폼 데이터 (category, question, imageFile)
 * @returns {Promise<number>} 생성된 문의 ID
 */
export const writeInquiry = async (formData) => {
  try {
    const response = await myAxios().post('/user/api/inquiries', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('1:1 문의 작성 실패:', error);
    throw error;
  }
};

/**
 * 공지사항 이미지 URL 생성
 * @param {number} fileId - 파일 ID
 * @returns {string} 이미지 URL
 */
export const getNoticeImageUrl = (fileId) => {
  if (!fileId) return null;
  return `${baseUrl}/noticeImageView?fileId=${fileId}`;
};

/**
 * 1:1 문의 이미지 URL 생성
 * @param {number} fileId - 파일 ID
 * @returns {string} 이미지 URL
 */
export const getInquiryImageUrl = (fileId) => {
  if (!fileId) return null;
  return `${baseUrl}/inquiryImageView?fileId=${fileId}`;
};

