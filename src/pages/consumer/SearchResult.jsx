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
  const [isLoading, setIsLoading] = useState(true);  // 백엔트 연동 시 필요

  // 드롭다운 열림/닫힘 상태
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  // 데이터 로딩 (백엔드 연동 시 이 부분만 수정)
  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true);
      try {
        // TODO: 백엔드 연동 시 아래 주석 해제하고 실제 API 호출
        // const queryParams = new URLSearchParams({
        //   keyword: searchKeyword,
        //   type: selectedType.join(','),
        //   category: selectedCategory.join(','),
        //   priceRange: selectedPriceRange.join(','),
        //   sort: sortBy,
        // });
        // const response = await fetch(`/api/search?${queryParams}`);
        // const data = await response.json();
        // setProposalResults(data.proposals || []);
        // setOngoingResults(data.ongoing || []);

        // 임시: 하드코딩된 데이터 (백엔드 연동 전까지)
        // 실제로는 API에서 받아온 데이터로 교체됨
        const tempProposals = [
          { id: 1, title: '향초', participants: '참여 120명 / 목표 80명', deadline: '남은 시간: 12시간', price: '13,900원', badge: 'HOT', image: '/searchResult/candle.jpg' },
          { id: 2, title: '차량용 향수 디퓨저', participants: '참여 80명 / 목표 60명', deadline: '남은 시간: 25일', price: '9,900원', image: '/searchResult/carFragranceDiffuser.png' },
          { id: 3, title: '전기포트', participants: '참여 45명 / 목표 80명', deadline: '남은 시간: 3일', price: '16,900원', image: '/searchResult/electricPot.png' },
          { id: 4, title: 'LED 마스크', participants: '참여 35명 / 목표 50명', deadline: '남은 시간: 5일', price: '18,900원', image: '/searchResult/ledMask.png' },
        ];
        const tempOngoing = [
          { id: 5, title: '로봇 청소기', participants: '참여 120명 / 목표 200명', deadline: '남은 시간: 2일', price: '11,900원', image: '/searchResult/robotVacuumCleaner.png' },
          { id: 6, title: '가정용 cctv', participants: '참여 85명 / 목표 100명', deadline: '남은 시간: 8시간', price: '14,500원', badge: 'HOT', image: '/searchResult/homeCctv.png' },
          { id: 7, title: '차량용 청소기', participants: '참여 60명 / 목표 80명', deadline: '남은 시간: 1일', price: '22,000원', image: '/searchResult/carVacuumCleaner.png' },
          { id: 8, title: 'kpokahtChocolate', participants: '참여 95명 / 목표 120명', deadline: '남은 시간: 15시간', price: '8,900원', image: '/searchResult/kpokahtChocolate.png' },
        ];

         // 정렬 로직 추가
         const sortData = (data, sortType) => {
          const sorted = [...data];
          switch (sortType) {
            case '인기순':
              // 참여자 수 기준으로 정렬 (예: "참여 120명"에서 120 추출)
              return sorted.sort((a, b) => {
                const aCount = parseInt(a.participants.match(/\d+/)?.[0] || 0);
                const bCount = parseInt(b.participants.match(/\d+/)?.[0] || 0);
                return bCount - aCount; // 내림차순
              });
            case '최신순':
              // ID 기준으로 정렬 (최신 = ID 큰 순서)
              return sorted.sort((a, b) => b.id - a.id);
            case '마감임박순':
              // deadline에서 시간 추출하여 정렬
              return sorted.sort((a, b) => {
                const aTime = parseInt(a.deadline.match(/\d+/)?.[0] || 999);
                const bTime = parseInt(b.deadline.match(/\d+/)?.[0] || 999);
                return aTime - bTime; // 오름차순 (시간이 적을수록 임박)
              });
            default:
              return sorted;
          }
        };

        const sortedProposals = sortData(tempProposals, sortBy);
        const sortedOngoing = sortData(tempOngoing, sortBy);
        setProposalResults(sortedProposals);
        setOngoingResults(sortedOngoing);
        // 검색어에 따라 필터링 (임시 로직, 백엔드는 자체 필터링)
        // 실제로는 백엔드에서 필터링된 결과를 받음
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

  const handleCardClick = (id, isProposal = false) => {
    if (isProposal) {
      navigate(`/proposalDetail/${id}`);
    } else {
      navigate(`/gbProductDetail/${id}`);
    }
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

      {/* 필터 영역 (위로 이동) */}
      <div className="filter-section">
        {/* 타입 드롭다운 */}
        {/* <div className="filter-dropdown">
          <button
            type="button"
            className="dropdown-button"
            onClick={() => setIsTypeOpen(!isTypeOpen)}
          >
            <span>타입</span>
            <span className="dropdown-arrow">{isTypeOpen ? '▲' : '▼'}</span>
          </button>
          {isTypeOpen && (
            <div className="dropdown-menu">
              <label className="dropdown-checkbox">
                <input
                  type="checkbox"
                  checked={selectedType.includes('제안')}
                  onChange={() => handleTypeChange('제안')}
                />
                <span>제안</span>
              </label>
              <label className="dropdown-checkbox">
                <input
                  type="checkbox"
                  checked={selectedType.includes('진행 공구 중')}
                  onChange={() => handleTypeChange('진행 공구 중')}
                />
                <span>진행 공구 중</span>
              </label>
            </div>
          )}
        </div> */}

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
          {/* <label htmlFor="sort-select" className="filter-title">정렬:</label> */}
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
      <div className="search-results">
        {/* 제안 섹션 */}
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
            >더보기 &gt;
            </a>
          </div>
          <div className="results-grid">
            {proposalResults.map(item => (
              <GroupBuyCard
                key={item.id}
                image={item.image}
                title={item.title}
                participants={item.participants}
                deadline={item.deadline}
                price={`예상 공동 구매가: ${item.price}`}
                badge={item.badge}
                onClick={() => handleCardClick(item.id, true)}
              />
            ))}
          </div>
        </div>

        {/* 진행 공구 중 섹션 */}
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
            >더보기 &gt;
            </a>
          </div>
          <div className="results-grid">
            {ongoingResults.map(item => (
              <GroupBuyCard
                key={item.id}
                image={item.image}
                title={item.title}
                participants={item.participants}
                deadline={item.deadline}
                price={`현재 공구가: ${item.price}`}
                badge={item.badge}
                onClick={() => handleCardClick(item.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

