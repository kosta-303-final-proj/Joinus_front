import { myAxios } from '../config';

/**
 * 메인 페이지 데이터 조회 API
 */
export const getMainPageData = async () => {
  try {
    const [deadlineSoon, popular, ongoing, popularProposals] = await Promise.all([
      myAxios().get('/api/main-page/deadline-soon'),  // 백앤드 API 호출
      myAxios().get('/api/main-page/popular'),
      myAxios().get('/api/main-page/ongoing'),
      myAxios().get('/api/main-page/popular-proposals')
    ]);

    return {
      deadlineSoon: deadlineSoon.data || [], 
      popular: popular.data || [],
      ongoing: ongoing.data || [],
      popularProposals: popularProposals.data || []
    };
  } catch (error) {
    console.error('메인 페이지 데이터 로딩 실패:', error);
    throw error;
  }
};

