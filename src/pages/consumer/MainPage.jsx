import { useState, useEffect } from 'react';
import GroupBuyCard from '../../components/common/GroupBuyCard';
import './MainPage.css';
import TopBannerCarousel from './TopBannerCarousel';
import { useNavigate } from 'react-router-dom';
import { getMainPageData } from '../../services/mainPageApi';
import { transformGbProduct, transformProposal } from '../../utils/searchDataTransform';

export default function MainPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  // API에서 가져온 데이터 상태
  const [deadlineSoonItems, setDeadlineSoonItems] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [ongoingItems, setOngoingItems] = useState([]);
  const [proposalItems, setProposalItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // 데이터 로딩
  useEffect(() => {
    const fetchMainPageData = async () => {
      setIsLoading(true);
      try {
        const data = await getMainPageData();
        
        // 백엔드 데이터를 프론트엔드 형식으로 변환
        setDeadlineSoonItems((data.deadlineSoon || []).map(transformGbProduct));
        setPopularItems((data.popular || []).map(transformGbProduct));
        setOngoingItems((data.ongoing || []).map(transformGbProduct));
        setProposalItems((data.popularProposals || []).map(transformProposal));
      } catch (error) {
        console.error('메인 페이지 데이터 로딩 실패:', error);
        // 에러 시 빈 배열로 설정
        setDeadlineSoonItems([]);
        setPopularItems([]);
        setOngoingItems([]);
        setProposalItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMainPageData();
  }, []);
  // 각 섹션별 클릭 핸들러 (더보기용)
  const handleDeadlineSoonClick = () => {
    navigate('/gbProductList?type=deadline-soon&sort=deadline');
  };

  const handlePopularClick = () => {
    navigate('/gbProductList?type=popular&sort=wish');
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
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>로딩 중...</div>
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
                {deadlineSoonItems.length > 0 ? deadlineSoonItems.map(item => (
              <GroupBuyCard
                key={item.id}
                image={item.image}
                title={item.title}
                category={item.category}
                status={item.status}
                // description={item.description}
                price={item.price}
                rating={item.rating}
                currentParticipants={item.currentParticipants}
                maxParticipants={item.maxParticipants}
                deadlineTime={item.deadlineTime}
                productId={item.id}
                isProposal={false}
              />
                )) : <div style={{ textAlign: 'center', padding: '20px' }}>데이터가 없습니다.</div>}
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
                {popularItems.length > 0 ? popularItems.map(item => (
              <GroupBuyCard
                key={item.id}
                image={item.image}
                title={item.title}
                category={item.category}
                status={item.status}
                // description={item.description}
                price={item.price}
                rating={item.rating}
                currentParticipants={item.currentParticipants}
                maxParticipants={item.maxParticipants}
                productId={item.id}
                isProposal={false}
              />
                )) : <div style={{ textAlign: 'center', padding: '20px' }}>데이터가 없습니다.</div>}
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
                {ongoingItems.length > 0 ? ongoingItems.map(item => (
              <GroupBuyCard
                key={item.id}
                image={item.image}
                title={item.title}
                category={item.category}
                status={item.status}
                // description={item.description}
                price={item.price}
                rating={item.rating}
                currentParticipants={item.currentParticipants}
                maxParticipants={item.maxParticipants}
                progress={item.progress}
                deadlineTime={item.deadlineTime}
                productId={item.id}
                isProposal={false}
              />
                )) : <div style={{ textAlign: 'center', padding: '20px' }}>데이터가 없습니다.</div>}
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
                {proposalItems.length > 0 ? proposalItems.map(item => (
              <GroupBuyCard
                key={item.id}
                image={item.image}
                title={item.title}
                category={item.category}
                status={item.status}
                // description={item.description}
                price={item.price}
                rating={item.rating}
                currentParticipants={item.currentParticipants}
                maxParticipants={item.maxParticipants}
                productId={item.id}
                isProposal={item.isProposal}
              />
                )) : <div style={{ textAlign: 'center', padding: '20px' }}>데이터가 없습니다.</div>}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}