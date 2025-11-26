import { useState } from 'react';
import GroupBuyCard from '../../components/common/GroupBuyCard';
import './MainPage.css';
import TopBannerCarousel from './TopBannerCarousel';
import { useNavigate } from 'react-router-dom';

export default function MainPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // 마감 임박 공구
  const deadlineSoonItems = [
    { id: 1, title: '프리미엄 수건 세트', participants: '참여 98명 / 목표 100명', deadline: '남은 시간: 6시간', image: '/mainPage/towelSet.png' },
    { id: 2, title: '이벤트 한정 텀블러', participants: '참여 220명 / 목표 250명', deadline: '남은 시간: 12시간', image: '/mainPage/tumblr.jpg'},
    { id: 3, title: '한정판 텀블러 세트', participants: '참여 98명 / 목표 100명', deadline: '남은 시간: 6시간', image: '/mainPage/tumblrSet.png'},
    { id: 4, title: '스페셜 기획 키트', participants: '참여 45명 / 목표 60명', deadline: '남은 시간: 10시간', image: '/mainPage/specialKit.png'}
  ];

  // 인기공구
  const popularItems = [
    { id: 1, title: '미니 가습기', participants: '참여 120명 / 목표 80명', price: '예상 공동 구매가: 38,900원', image: '/mainPage/miniHumidifier.png'},
    { id: 2, title: 'LED 조명', participants: '참여 90명 / 목표 60명', price: '예상 공동 구매가: 29,900원', image: '/mainPage/ledLight.png'},
    { id: 3, title: '캐릭터 머그컵', participants: '참여 60명 / 목표 25명', price: '예상 공동 구매가: 13,900원', image: '/mainPage/characterMug.png'},
    { id: 4, title: '주방용 소형 블렌더', participants: '참여 45명 / 목표 20명', price: '예상 공동 구매가: 29,900원', image: '/mainPage/smallBlender.png'}
  ];

  // 진행중 공구  
  const ongoingItems = [
    { id: 1, title: 'UGG 부츠', participants: '참여자 75명 / 목표 100명', price: '마감까지 3일', progress: 75, image: '/mainPage/uggBoots.png'},
    { id: 2, title: '전자동 커피머신', participants: '참여자 40명 / 목표 40명', price: '마감 임박', progress: 100, image: '/mainPage/automaticCoffeeMachine.png'},
    { id: 3, title: '휴대용 SSD', participants: '참여자 19명 / 목표 80명', price: '마감까지 7일', progress: 22, image: '/mainPage/portableSSD.png'},
    { id: 4, title: '비타민D', participants: '참여자 32명 / 목표 60명', price: '마감까지 4일', progress: 53, image: '/mainPage/vitaminD.png'}
  ];

  // 임기 제안
  const proposalItems = [
    { id: 1, title: '마스크팩 세트', participants: '참여 120명 / 목표 80명', price: '예상 공동 구매가: 8,900원', image: '/mainPage/maskSet.png'},
    { id: 2, title: '무선 충전기', participants: '참여 90명 / 목표 60명', price: '예상 공동 구매가: 19,900원', image: '/mainPage/wirelessCharger.png'},
    { id: 3, title: '스테인리스 키친툴', participants: '참여 45명 / 목표 20명', price: '예상 공동 구매가: 29,900원', image: '/mainPage/stainlessKitchenTool.png'},
    { id: 4, title: '단백질 보충제', participants: '참여 30명 / 목표 10명', price: '예상 공동 구매가: 88,000원', image: '/mainPage/proteinSupplement.png'}
  ];

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

  // 카드 클릭 핸들러 (상세 페이지용)
  const handleCardClick = (id, isProposal = false) => {
    if (isProposal) {
      navigate(`/proposalDetail/${id}`);
    } else {
      navigate(`/gbProductDetail/${id}`);
    }
  };

  return (
    <div className="mainpage-container">
      {/* Header는 App.jsx에서 공통으로 렌더링 */}

      {/* 상단 배너 - 화면 전체 너비 */}
      {/* <div className="main-top-banner">
        <img src="/main-top-banner.png" alt="메인 상단 배너" />
      </div> */}
      <div className="banner-wrapper">
        <TopBannerCarousel />
      </div>
      {/* Main Content (1220px 컨테이너) */}
      <main className="main-content">

        {/* 마감 임박 */}
        <section className="section">
          <div className="section-header">
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
            {deadlineSoonItems.map(item => (
              <GroupBuyCard
                key={item.id}
                image={item.image}
                title={item.title}
                participants={item.participants}
                deadline={item.deadline}
                onClick={() => handleCardClick(item.id)}
              />
            ))}
          </div>
        </section>

        {/* 인기공구 */}
        <section className="section">
          <div className="section-header">
            <h2>인기공구</h2>
            <a 
            href="#" 
            className="more-link"
            onClick={(e) => {
              e.preventDefault();
              handlePopularClick();
            }}
            >더보기 &gt;
            </a>
          </div>
          <div className="card-grid">
            {popularItems.map(item => (
              <GroupBuyCard
                key={item.id}
                image={item.image}
                title={item.title}
                participants={item.participants}
                price={item.price}
                onClick={() => handleCardClick(item.id)}
              />
            ))}
          </div>
        </section>

        {/* 진행중 공구 */}
        <section className="section">
          <div className="section-header">
            <h2>진행중 공구</h2>
            <a 
            href="#" 
            className="more-link"
            onClick={(e) => {
              e.preventDefault();
              handleOngoingClick();
            }}
            >더보기 &gt;
            </a>
          </div>
          <div className="card-grid">
            {ongoingItems.map(item => (
              <GroupBuyCard
                key={item.id}
                image={item.image}
                title={item.title}
                participants={item.participants}
                price={item.price}
                progress={item.progress}
                onClick={() => handleCardClick(item.id)}
              />
            ))}
          </div>
        </section>

        {/* 인기 제안 */}
        <section className="section">
          <div className="section-header">
            <h2>인기 제안</h2>
            <a 
            href="#" 
            className="more-link"           
            onClick={(e) => {
              e.preventDefault();
              handleProposalClick();
            }}
            >더보기 &gt;
            </a>
          </div>
          <div className="card-grid">
            {proposalItems.map(item => (
              <GroupBuyCard
                key={item.id}
                image={item.image}
                title={item.title}
                participants={item.participants}
                price={item.price}
                onClick={() => handleCardClick(item.id, true)}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Footer는 App.jsx에서 공통으로 렌더링 */}
    </div>
  );
}
