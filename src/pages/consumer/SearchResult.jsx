import { useState, useEffect } from 'react';
import GroupBuyCard from '../../components/common/GroupBuyCard';
import './SearchResult.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { searchProducts } from '../../services/searchApi';
import { transformProposal, transformGbProduct } from '../../utils/searchDataTransform';

export default function SearchResult() {
  /* 필터 상태: 어떤 타입/카테고리/가격대를 선택했는지 보관 */
  const [selectedType, setSelectedType] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState([]);

  /* 정렬 상태 */
  const [sortBy, setSortBy] = useState('인기순');
  
  /* 네비게이션 */
  const navigate = useNavigate();

  /* 검색 파라미터 */
  const [searchParams] = useSearchParams();
  const searchKeyword = searchParams.get('keyword') || '';

  // 데이터 상태
  const [proposalResults, setProposalResults] = useState([]);
  const [ongoingResults, setOngoingResults] = useState([]);

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  // 드롭다운 열림/닫힘 상태
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  

  // 검색 조건이 바뀔 때마다 백엔드 검색 API 호출
  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true);
      try {
        // 검색 파라미터 구성: 선택하지 않은 것은 null로 보내 필터 미적용
        const searchParams = {
          keyword: searchKeyword || null,
          categories: selectedCategory.length > 0 ? selectedCategory : null,
          priceRanges: selectedPriceRange.length > 0 ? selectedPriceRange : null,
          sortBy: sortBy || '인기순'
        };

        console.log('검색 파라미터:', searchParams);

        // API 호출
        const response = await searchProducts(searchParams);
        
        console.log('API 응답:', response);
        
        // 백엔드 데이터를 프론트엔드 형식으로 변환
        const transformedProposals = (response.proposals || []).map(transformProposal);
        const transformedOngoing = (response.ongoing || []).map(transformGbProduct);

        console.log('변환된 제안:', transformedProposals.length, '개');
        console.log('변환된 공구:', transformedOngoing.length, '개');

        setProposalResults(transformedProposals);
        setOngoingResults(transformedOngoing);
      } catch (error) {
        console.error('검색 결과 로딩 실패:', error);
        if (error.response) {
          console.error('에러 응답:', error.response.status, error.response.data);
        } else if (error.request) {
          console.error('요청 실패 - 백엔드 서버가 실행 중인지 확인하세요');
        } else {
          console.error('에러 메시지:', error.message);
        }
        setProposalResults([]);
        setOngoingResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSearchResults();
  }, [searchKeyword, selectedCategory, selectedPriceRange, sortBy]);

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
            <div className="sr-dropdown-menu">
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
            <div className="sr-dropdown-menu">
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