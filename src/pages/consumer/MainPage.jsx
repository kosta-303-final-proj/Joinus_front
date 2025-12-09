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

  // // 데이터 상태
  // const [deadlineSoonItems, setDeadlineSoonItems] = useState([]);
  // const [popularItems, setPopularItems] = useState([]);
  // const [ongoingItems, setOngoingItems] = useState([]);
  // const [proposalItems, setProposalItems] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);

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

  // 마감 임박 공구 (더미 데이터 - 제거 예정)
  /* const deadlineSoonItems = [
    { 
      id: 1, 
      title: '프리미엄 수건 세트', 
      category: '생활용품',
      status: '마감임박',
      description: '프리미엄 소재로 제작된 고급 수건 세트입니다.',
      price: '29,900원',
      currentParticipants: 98,
      maxParticipants: 100,
      deadlineTime: '6시간',
      rating: 4.6,
      image: '/mainPage/towelSet.png' 
    },
    { 
      id: 2, 
      title: '이벤트 한정 텀블러', 
      category: '생활용품',
      status: '마감임박',
      description: '한정판 이벤트 텀블러입니다.',
      price: '19,900원',
      currentParticipants: 220,
      maxParticipants: 250,
      deadlineTime: '12시간',
      rating: 4.8,
      image: '/mainPage/tumblr.jpg'
    },
    { 
      id: 3, 
      title: '한정판 텀블러 세트', 
      category: '생활용품',
      status: '마감임박',
      description: '한정판 텀블러 세트입니다.',
      price: '24,900원',
      currentParticipants: 98,
      maxParticipants: 100,
      deadlineTime: '6시간',
      rating: 4.5,
      image: '/mainPage/tumblrSet.png'
    },
    { 
      id: 4, 
      title: '스페셜 기획 키트', 
      category: '기타',
      status: '마감임박',
      description: '스페셜 기획 키트입니다.',
      price: '39,900원',
      currentParticipants: 45,
      maxParticipants: 60,
      deadlineTime: '10시간',
      rating: 4.7,
      image: '/mainPage/specialKit.png'
    }
  ]; */

  // 인기공구 (더미 데이터 - 제거 예정)
  /* const popularItems = [
    { 
      id: 1, 
      title: '미니 가습기', 
      category: '가전',
      status: '진행중',
      description: '소형 가습기로 사무실이나 침실에 적합합니다.',
      price: '38,900원',
      currentParticipants: 120,
      maxParticipants: 80,
      rating: 4.6,
      image: '/mainPage/miniHumidifier.png'
    },
    { 
      id: 2, 
      title: 'LED 조명', 
      category: '가전',
      status: '진행중',
      description: '다양한 색상의 LED 조명입니다.',
      price: '29,900원',
      currentParticipants: 90,
      maxParticipants: 60,
      rating: 4.5,
      image: '/mainPage/ledLight.png'
    },
    { 
      id: 3, 
      title: '캐릭터 머그컵', 
      category: '생활용품',
      status: '진행중',
      description: '귀여운 캐릭터 머그컵입니다.',
      price: '13,900원',
      currentParticipants: 60,
      maxParticipants: 25,
      rating: 4.8,
      image: '/mainPage/characterMug.png'
    },
    { 
      id: 4, 
      title: '주방용 소형 블렌더', 
      category: '주방용품',
      status: '진행중',
      description: '소형 블렌더로 주방에서 편리하게 사용할 수 있습니다.',
      price: '29,900원',
      currentParticipants: 45,
      maxParticipants: 20,
      rating: 4.4,
      image: '/mainPage/smallBlender.png'
    }
  ]; */

  // 진행중 공구 (더미 데이터 - 제거 예정)
  /* const ongoingItems = [
    { 
      id: 1, 
      title: 'UGG 부츠', 
      category: '패션',
      status: '진행중',
      description: '따뜻한 UGG 부츠입니다.',
      price: '89,900원',
      currentParticipants: 75,
      maxParticipants: 100,
      progress: 75,
      deadlineTime: '3일',
      rating: 4.7,
      image: '/mainPage/uggBoots.png'
    },
    { 
      id: 2, 
      title: '전자동 커피머신', 
      category: '가전',
      status: '진행중',
      description: '전자동 커피머신입니다.',
      price: '299,000원',
      currentParticipants: 40,
      maxParticipants: 40,
      progress: 100,
      deadlineTime: '마감 임박',
      rating: 4.9,
      image: '/mainPage/automaticCoffeeMachine.png'
    },
    { 
      id: 3, 
      title: '휴대용 SSD', 
      category: '전자제품',
      status: '진행중',
      description: '고속 휴대용 SSD입니다.',
      price: '59,900원',
      currentParticipants: 19,
      maxParticipants: 80,
      progress: 22,
      deadlineTime: '7일',
      rating: 4.6,
      image: '/mainPage/portableSSD.png'
    },
    { 
      id: 4, 
      title: '비타민D', 
      category: '건강',
      status: '진행중',
      description: '건강에 좋은 비타민D 보충제입니다.',
      price: '24,900원',
      currentParticipants: 32,
      maxParticipants: 60,
      progress: 53,
      deadlineTime: '4일',
      rating: 4.5,
      image: '/mainPage/vitaminD.png'
    }
  ]; */

  // 인기 제안 (더미 데이터 - 제거 예정)
  /* const proposalItems = [
    { 
      id: 1, 
      title: '마스크팩 세트', 
      category: '뷰티',
      status: '진행중',
      description: '다양한 종류의 마스크팩 세트입니다.',
      price: '8,900원',
      currentParticipants: 120,
      maxParticipants: 80,
      rating: 4.6,
      image: '/mainPage/maskSet.png',
      isProposal: true
    },
    { 
      id: 2, 
      title: '무선 충전기', 
      category: '전자제품',
      status: '진행중',
      description: '빠른 무선 충전이 가능한 충전기입니다.',
      price: '19,900원',
      currentParticipants: 90,
      maxParticipants: 60,
      rating: 4.7,
      image: '/mainPage/wirelessCharger.png',
      isProposal: true
    },
    { 
      id: 3, 
      title: '스테인리스 키친툴', 
      category: '주방용품',
      status: '진행중',
      description: '고급 스테인리스 주방용품 세트입니다.',
      price: '29,900원',
      currentParticipants: 45,
      maxParticipants: 20,
      rating: 4.5,
      image: '/mainPage/stainlessKitchenTool.png',
      isProposal: true
    },
    { 
      id: 4, 
      title: '단백질 보충제', 
      category: '건강',
      status: '진행중',
      description: '운동 후 섭취하는 단백질 보충제입니다.',
      price: '88,000원',
      currentParticipants: 30,
      maxParticipants: 10,
      rating: 4.8,
      image: '/mainPage/proteinSupplement.png',
      isProposal: true
    }
  ]; */

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