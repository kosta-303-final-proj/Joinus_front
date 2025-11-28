import { useState, useEffect } from 'react';
import GroupBuyCard from '../../components/common/GroupBuyCard';
import './SearchResult.css';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function SearchResult() {
  const [selectedType, setSelectedType] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState([]);
  const [sortBy, setSortBy] = useState('인기순');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchKeyword = searchParams.get('keyword') || '';

  // 데이터 상태
  const [proposalResults, setProposalResults] = useState([]);
  const [ongoingResults, setOngoingResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 드롭다운 열림/닫힘 상태
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  // 데이터 로딩 (백엔드 연동 시 이 부분만 수정)
  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true);
      try {
        // 임시: 하드코딩된 데이터 (백엔드 연동 전까지)
        const tempProposals = [
          { 
            id: 1, 
            title: '향초', 
            category: '생활용품',
            status: '진행중',
            description: '향긋한 향초로 공간을 채워보세요.',
            currentParticipants: 120,
            maxParticipants: 80,
            deadlineTime: '12시간',
            price: '13,900원',
            rating: 4.6,
            badge: 'HOT', 
            image: '/searchResult/candle.jpg' 
          },
          { 
            id: 2, 
            title: '차량용 향수 디퓨저', 
            category: '자동차용품',
            status: '진행중',
            description: '차량 내부를 상쾌하게 만들어주는 디퓨저입니다.',
            currentParticipants: 80,
            maxParticipants: 60,
            deadlineTime: '25일',
            price: '9,900원',
            rating: 4.5,
            image: '/searchResult/carFragranceDiffuser.png' 
          },
          { 
            id: 3, 
            title: '전기포트', 
            category: '가전',
            status: '진행중',
            description: '빠르고 안전한 전기포트입니다.',
            currentParticipants: 45,
            maxParticipants: 80,
            deadlineTime: '3일',
            price: '16,900원',
            rating: 4.7,
            image: '/searchResult/electricPot.png' 
          },
          { 
            id: 4, 
            title: 'LED 마스크', 
            category: '뷰티',
            status: '진행중',
            description: '피부 관리에 좋은 LED 마스크입니다.',
            currentParticipants: 35,
            maxParticipants: 50,
            deadlineTime: '5일',
            price: '18,900원',
            rating: 4.4,
            image: '/searchResult/ledMask.png' 
          },
        ];
        const tempOngoing = [
          { 
            id: 5, 
            title: '로봇 청소기', 
            category: '가전',
            status: '진행중',
            description: '스마트 로봇 청소기로 집안을 깨끗하게 유지하세요.',
            currentParticipants: 120,
            maxParticipants: 200,
            deadlineTime: '2일',
            price: '11,900원',
            rating: 4.8,
            image: '/searchResult/robotVacuumCleaner.png' 
          },
          { 
            id: 6, 
            title: '가정용 cctv', 
            category: '가전',
            status: '진행중',
            description: '집안 보안을 위한 가정용 CCTV입니다.',
            currentParticipants: 85,
            maxParticipants: 100,
            deadlineTime: '8시간',
            price: '14,500원',
            rating: 4.6,
            badge: 'HOT', 
            image: '/searchResult/homeCctv.png' 
          },
          { 
            id: 7, 
            title: '차량용 청소기', 
            category: '자동차용품',
            status: '진행중',
            description: '차량 내부 청소에 최적화된 청소기입니다.',
            currentParticipants: 60,
            maxParticipants: 80,
            deadlineTime: '1일',
            price: '22,000원',
            rating: 4.5,
            image: '/searchResult/carVacuumCleaner.png' 
          },
          { 
            id: 8, 
            title: 'kpokahtChocolate', 
            category: '식품',
            status: '진행중',
            description: '프리미엄 초콜릿 세트입니다.',
            currentParticipants: 95,
            maxParticipants: 120,
            deadlineTime: '15시간',
            price: '8,900원',
            rating: 4.7,
            image: '/searchResult/kpokahtChocolate.png' 
          },
        ];

        // 정렬 로직 수정
        const sortData = (data, sortType) => {
          const sorted = [...data];
          switch (sortType) {
            case '인기순':
              return sorted.sort((a, b) => b.currentParticipants - a.currentParticipants);
            case '최신순':
              return sorted.sort((a, b) => b.id - a.id);
            case '마감임박순':
              return sorted.sort((a, b) => {
                // deadlineTime에서 숫자 추출 (시간/일)
                const aTime = parseInt(a.deadlineTime.match(/\d+/)?.[0] || 999);
                const bTime = parseInt(b.deadlineTime.match(/\d+/)?.[0] || 999);
                // '시간'이면 더 임박하므로 우선순위 높음
                const aIsHour = a.deadlineTime.includes('시간');
                const bIsHour = b.deadlineTime.includes('시간');
                if (aIsHour && !bIsHour) return -1;
                if (!aIsHour && bIsHour) return 1;
                return aTime - bTime;
              });
            default:
              return sorted;
          }
        };

        const sortedProposals = sortData(tempProposals, sortBy);
        const sortedOngoing = sortData(tempOngoing, sortBy);
        setProposalResults(sortedProposals);
        setOngoingResults(sortedOngoing);
      } catch (error) {
        console.error('검색 결과 로딩 실패:', error);
        setProposalResults([]);
        setOngoingResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSearchResults();
  }, [searchKeyword, selectedType, selectedCategory, selectedPriceRange, sortBy]);

  // 동적으로 개수 계산
  const totalCount = proposalResults.length + ongoingResults.length;
  const proposalCount = proposalResults.length;
  const ongoingCount = ongoingResults.length;

  const handleTypeChange = (type) => {
    setSelectedType(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handlePriceRangeChange = (range) => {
    setSelectedPriceRange(prev =>
      prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
    );
  };

  const handleProposalClick = () => {
    navigate('/proposalsList?type=popular');
  };

  const handleOngoingClick = () => {
    navigate('/gbProductList?type=ongoing');
  };

  return (
    <div className="search-result-container">
      {/* 검색 결과 헤더 */}
      <div className="search-result-header">
        <h1 className="search-title">검색 결과</h1>
        <p className="search-info">
          "{searchKeyword || '전체'}"에 대한 검색 결과 <span className="result-count">{totalCount}개</span>
        </p>
      </div>

      {/* 필터 영역 */}
      <div className="filter-section">
        {/* 카테고리 드롭다운 */}
        <div className="filter-dropdown">
          <button 
            className="dropdown-button"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          >
            <span>카테고리</span>
            <span className="dropdown-arrow">{isCategoryOpen ? '▲' : '▼'}</span>
          </button>
          {isCategoryOpen && (
            <div className="dropdown-menu">
              <label className="dropdown-checkbox">
                <input
                  type="checkbox"
                  checked={selectedCategory.includes('생활')}
                  onChange={() => handleCategoryChange('생활')}
                />
                <span>생활</span>
              </label>
              <label className="dropdown-checkbox">
                <input
                  type="checkbox"
                  checked={selectedCategory.includes('생활용품')}
                  onChange={() => handleCategoryChange('생활용품')}
                />
                <span>생활용품</span>
              </label>
              <label className="dropdown-checkbox">
                <input
                  type="checkbox"
                  checked={selectedCategory.includes('주방/식기')}
                  onChange={() => handleCategoryChange('주방/식기')}
                />
                <span>주방/식기</span>
              </label>
              <label className="dropdown-checkbox">
                <input
                  type="checkbox"
                  checked={selectedCategory.includes('식품')}
                  onChange={() => handleCategoryChange('식품')}
                />
                <span>식품</span>
              </label>
              <label className="dropdown-checkbox">
                <input
                  type="checkbox"
                  checked={selectedCategory.includes('기타')}
                  onChange={() => handleCategoryChange('기타')}
                />
                <span>기타</span>
              </label>
            </div>
          )}
        </div>

        {/* 가격대 드롭다운 */}
        <div className="filter-dropdown">
          <button 
            className="dropdown-button"
            onClick={() => setIsPriceOpen(!isPriceOpen)}
          >
            <span>가격대</span>
            <span className="dropdown-arrow">{isPriceOpen ? '▲' : '▼'}</span>
          </button>
          {isPriceOpen && (
            <div className="dropdown-menu">
              <label className="dropdown-checkbox">
                <input
                  type="checkbox"
                  checked={selectedPriceRange.includes('전체')}
                  onChange={() => handlePriceRangeChange('전체')}
                />
                <span>전체</span>
              </label>
              <label className="dropdown-checkbox">
                <input
                  type="checkbox"
                  checked={selectedPriceRange.includes('1만원 미만')}
                  onChange={() => handlePriceRangeChange('1만원 미만')}
                />
                <span>1만원 미만</span>
              </label>
              <label className="dropdown-checkbox">
                <input
                  type="checkbox"
                  checked={selectedPriceRange.includes('1만원 ~ 5만원 미만')}
                  onChange={() => handlePriceRangeChange('1만원 ~ 5만원 미만')}
                />
                <span>1만원 ~ 5만원 미만</span>
              </label>
              <label className="dropdown-checkbox">
                <input
                  type="checkbox"
                  checked={selectedPriceRange.includes('5만원 ~ 10만원 미만')}
                  onChange={() => handlePriceRangeChange('5만원 ~ 10만원 미만')}
                />
                <span>5만원 ~ 10만원 미만</span>
              </label>
              <label className="dropdown-checkbox">
                <input
                  type="checkbox"
                  checked={selectedPriceRange.includes('10만원 이상')}
                  onChange={() => handlePriceRangeChange('10만원 이상')}
                />
                <span>10만원 이상</span>
              </label>
            </div>
          )}
        </div>

        {/* 정렬 드롭다운 */}
        <div className="filter-group sort-group">
          <select
            id="sort-select"
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="인기순">인기순</option>
            <option value="최신순">최신순</option>
            <option value="마감임박순">마감임박순</option>
          </select>
        </div>
      </div>

      {/* 검색 결과 리스트 */}
      {isLoading ? (
        <div className="loading-message">로딩 중...</div>
      ) : (
        <div className="search-results">
          {/* 제안 섹션 */}
          {proposalResults.length > 0 && (
            <div className="results-section">
              <div className="results-header">
                <h2 className="results-section-title">
                  제안 <span className="results-count">(제안 {proposalCount}건)</span>
                </h2>
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
              <div className="results-grid">
                {proposalResults.map(item => (
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
                    badge={item.badge}
                    productId={item.id}
                    isProposal={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 진행 공구 중 섹션 */}
          {ongoingResults.length > 0 && (
            <div className="results-section">
              <div className="results-header">
                <h2 className="results-section-title">
                  진행 공구 중 <span className="results-count">(공구 {ongoingCount}건)</span>
                </h2>
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
              <div className="results-grid">
                {ongoingResults.map(item => (
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
                    badge={item.badge}
                    productId={item.id}
                    isProposal={false}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 결과가 없을 때 */}
          {!isLoading && proposalResults.length === 0 && ongoingResults.length === 0 && (
            <div className="no-results">
              <p>검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}