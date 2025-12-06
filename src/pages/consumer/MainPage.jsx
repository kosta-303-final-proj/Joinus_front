import { useState, useEffect } from 'react';
import GroupBuyCard from '../../components/common/GroupBuyCard';
import './MainPage.css';
import TopBannerCarousel from './TopBannerCarousel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../../config';

export default function MainPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  // API에서 가져온 데이터 상태
  const [deadlineSoonItems, setDeadlineSoonItems] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [ongoingItems, setOngoingItems] = useState([]);
  const [proposalItems, setProposalItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 메인페이지 데이터 로드
  useEffect(() => {
    const fetchMainPageData = async () => {
      try {
        setLoading(true);
        const [deadlineSoon, popular, ongoing, proposals] = await Promise.all([
          axios.get(`${baseUrl}/api/main-page/deadline-soon`),
          axios.get(`${baseUrl}/api/main-page/popular`),
          axios.get(`${baseUrl}/api/main-page/ongoing`),
          axios.get(`${baseUrl}/api/main-page/popular-proposals`)
        ]);
        
        // GbProductDto -> 프론트 형식 변환
        const transformGbProduct = (product) => ({
          id: product.id,
          title: product.name,
          // TODO: categoryId -> 카테고리 이름으로 매핑 필요
          category: product.categoryId,
          status: product.status === 'ONGOING' ? '진행중' : '마감임박',
          description: product.description,
          price: product.price ? `${product.price.toLocaleString()}원` : '0원',
          currentParticipants: product.participants || 0,
          maxParticipants: product.minParticipants || 0,
          deadlineTime: calculateDeadline(product.endDate),
          rating: 0, // TODO: 리뷰 평균 별점 추가 필요
          // 백엔드에서 내려준 썸네일 파일명을 사용하여 프론트 public/mainPage 이미지와 연결
          image: product.thumbnailFileName
            ? `/mainPage/${product.thumbnailFileName}`
            : '/mainPage/towelSet.png',
          isProposal: false
        });

        // ProposalDto -> 프론트 형식 변환
        const transformProposal = (proposal) => ({
          id: proposal.id,
          title: proposal.productName,
          category: proposal.category,
          status: '제안',
          description: proposal.description,
          price: proposal.originalPrice ? `${proposal.originalPrice.toLocaleString()}원` : '0원',
          currentParticipants: proposal.voteCount || 0,
          maxParticipants: proposal.minPart || 0,
          rating: 0,
          image: proposal.imageUrl || '/mainPage/maskSet.png',
          isProposal: true
        });

        setDeadlineSoonItems(deadlineSoon.data.map(transformGbProduct));
        setPopularItems(popular.data.map(transformGbProduct));
        setOngoingItems(ongoing.data.map(transformGbProduct));
        setProposalItems(proposals.data.map(transformProposal));
      } catch (error) {
        console.error('메인페이지 데이터 로드 실패:', error);
        // 에러 발생시 빈 배열 유지
      } finally {
        setLoading(false);
      }
    };

    fetchMainPageData();
  }, []);

  // 마감 시간 계산 함수
  const calculateDeadline = (endDate) => {
    if (!endDate) return '';
    
    const end = new Date(endDate);
    const now = new Date();
    const diff = end - now;
    
    if (diff <= 0) return '마감';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours}시간`;
    
    const days = Math.floor(hours / 24);
    return `${days}일`;
  };

  // 더미 데이터 (API 에러 시 대체용 - 삭제 가능)
  // const dummyDeadlineSoonItems = [ ... ]

  // 각 섹션별 클릭 핸들러 (더보기용)
  const handleDeadlineSoonClick = () => {
    navigate('/gbProductList?type=deadline-soon');
  };

  const handlePopularClick = () => {
    navigate('/gbProductList?type=popular');
  };

  const handleOngoingClick = () => {
    navigate('/gbProductList?type=ongoing');
  };

  const handleProposalClick = () => {
    navigate('/proposalsList?type=popular');
  };

  return (
    <div className="mainpage-container">
      <div className="banner-wrapper">
        {/* <TopBannerCarousel /> */}
        <img src="/main-top-banner.png" alt="Top Banner" />
      </div>
      <main className="main-content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>로딩 중...</p>
          </div>
        ) : (
          <>
            {/* 마감 임박 */}
            <section className="section">
              <div className="mainpage-section-header">
                <h2>마감 임박</h2>
                <a 
                  href="#"
                  className="more-link"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeadlineSoonClick();
                  }}
                >
                  더보기 &gt;
                </a>
              </div>
              <div className="card-grid">
                {deadlineSoonItems.length > 0 ? (
                  deadlineSoonItems.map(item => (
                    <GroupBuyCard
                      key={item.id}
                      image={item.image}
                      title={item.title}
                      category={item.category}
                      status={item.status}
                      description={item.description}
                      price={item.price}
                      rating={item.rating}
                      currentParticipants={item.currentParticipants}
                      maxParticipants={item.maxParticipants}
                      deadlineTime={item.deadlineTime}
                      productId={item.id}
                      isProposal={false}
                    />
                  ))
                ) : (
                  <p>데이터가 없습니다.</p>
                )}
              </div>
            </section>

            {/* 인기공구 */}
            <section className="section">
              <div className="mainpage-section-header">
                <h2>인기공구</h2>
                <a 
                  href="#" 
                  className="more-link"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePopularClick();
                  }}
                >
                  더보기 &gt;
                </a>
              </div>
              <div className="card-grid">
                {popularItems.length > 0 ? (
                  popularItems.map(item => (
                    <GroupBuyCard
                      key={item.id}
                      image={item.image}
                      title={item.title}
                      category={item.category}
                      status={item.status}
                      description={item.description}
                      price={item.price}
                      rating={item.rating}
                      currentParticipants={item.currentParticipants}
                      maxParticipants={item.maxParticipants}
                      productId={item.id}
                      isProposal={false}
                    />
                  ))
                ) : (
                  <p>데이터가 없습니다.</p>
                )}
              </div>
            </section>

            {/* 진행중 공구 */}
            <section className="section">
              <div className="mainpage-section-header">
                <h2>진행중 공구</h2>
                <a 
                  href="#" 
                  className="more-link"
                  onClick={(e) => {
                    e.preventDefault();
                    handleOngoingClick();
                  }}
                >
                  더보기 &gt;
                </a>
              </div>
              <div className="card-grid">
                {ongoingItems.length > 0 ? (
                  ongoingItems.map(item => (
                    <GroupBuyCard
                      key={item.id}
                      image={item.image}
                      title={item.title}
                      category={item.category}
                      status={item.status}
                      description={item.description}
                      price={item.price}
                      rating={item.rating}
                      currentParticipants={item.currentParticipants}
                      maxParticipants={item.maxParticipants}
                      progress={item.progress}
                      deadlineTime={item.deadlineTime}
                      productId={item.id}
                      isProposal={false}
                    />
                  ))
                ) : (
                  <p>데이터가 없습니다.</p>
                )}
              </div>
            </section>

            {/* 인기 제안 */}
            <section className="section">
              <div className="mainpage-section-header">
                <h2>인기 제안</h2>
                <a 
                  href="#" 
                  className="more-link"           
                  onClick={(e) => {
                    e.preventDefault();
                    handleProposalClick();
                  }}
                >
                  더보기 &gt;
                </a>
              </div>
              <div className="card-grid">
                {proposalItems.length > 0 ? (
                  proposalItems.map(item => (
                    <GroupBuyCard
                      key={item.id}
                      image={item.image}
                      title={item.title}
                      category={item.category}
                      status={item.status}
                      description={item.description}
                      price={item.price}
                      rating={item.rating}
                      currentParticipants={item.currentParticipants}
                      maxParticipants={item.maxParticipants}
                      productId={item.id}
                      isProposal={item.isProposal}
                    />
                  ))
                ) : (
                  <p>데이터가 없습니다.</p>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}