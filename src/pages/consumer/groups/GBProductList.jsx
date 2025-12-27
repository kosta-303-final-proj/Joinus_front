import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { baseUrl, myAxios } from "../../../config";
import GroupBuyCard from '../../../components/common/GroupBuyCard';
import { transformGbProduct } from '../../../utils/searchDataTransform';
import '../MainPage.css';

export default function GBProductList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 페이징 state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  const sortParam = searchParams.get("sort");
  const categoryParam = searchParams.get("category");

  const allCategories = ["뷰티", "패션", "전자기기", "홈&리빙", "식품", "스포츠"];
  const sortOptions = ["최신순", "찜순", "마감순"];
  const allStatus = ["진행중", "취소"];

  // 필터 state (단일 선택)
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSort, setSelectedSort] = useState("최신순");
  const [selectedStatus, setSelectedStatus] = useState("진행중");

  const sortParamMap = {
    deadline: "마감순",
    wish: "찜순",
  };
  
  // 정렬 옵션을 서버 파라미터로 변환
  const getSortType = () => {
    if (selectedSort === "찜순") return "popular";
    if (selectedSort === "마감순") return "deadline-soon";
    return "ongoing"; // 최신순
  };
  
  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null); // 토글: 같은 카테고리 클릭 시 해제
    } else {
      setSelectedCategory(category);
    }
    setCurrentPage(0); // 필터 변경 시 첫 페이지로
  };

  const handleStatusClick = (status) => {
    setSelectedStatus(status);
    setCurrentPage(0); // 필터 변경 시 첫 페이지로
  };

  const handleSortClick = (sort) => {
    setSelectedSort(sort);
    setCurrentPage(0); // 정렬 변경 시 첫 페이지로
  };
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // URL에서 type 파라미터 추출
  const type = searchParams.get("type") || "ongoing";
  
  // URL type 파라미터에 따라 selectedSort 동기화
  useEffect(() => {
    if (type === "deadline-soon") {
      setSelectedSort("마감순");
    } else if (type === "popular") {
      setSelectedSort("찜순");
    } else {
      setSelectedSort("최신순");
    }
  }, [type]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // selectedSort를 서버 파라미터로 변환
        const sortType = getSortType();
        
        const params = {
          type: sortType,
          page: currentPage,
          size: 12,
        };
        
        // 필터 파라미터 추가
        if (selectedCategory) {
          params.category = selectedCategory;
        }
        if (selectedStatus) {
          // 상태는 서버에서 ENUM으로 변환 필요 (한글 -> 영어)
          const statusMap = {
            "진행중": "ONGOING",
            "취소": "CANCELLED"
          };
          params.status = statusMap[selectedStatus] || "ONGOING";
        }
        
        console.log('API 요청 파라미터:', params);
        const response = await myAxios().get('/api/gb-products', { params });
        
        console.log('API 응답 전체:', response);
        console.log('API 응답 data:', response.data);
        console.log('API 응답 data 타입:', typeof response.data);
        console.log('API 응답 data가 배열인가?', Array.isArray(response.data));
        
        // Page 객체 처리 (서버 사이드 페이징)
        if (!response.data) {
          console.error('응답 데이터가 없습니다');
          setProducts([]);
          setTotalPages(0);
          setTotalElements(0);
          return;
        }
        
        // Spring Boot Page 객체는 {content: [...], totalPages: ..., totalElements: ...} 형태
        let dataArray = [];
        let totalPagesValue = 0;
        let totalElementsValue = 0;
        
        if (response.data.content && Array.isArray(response.data.content)) {
          // Page 객체로 반환된 경우 (정상)
          dataArray = response.data.content;
          totalPagesValue = response.data.totalPages || 0;
          totalElementsValue = response.data.totalElements || 0;
          console.log('Page 객체로 받음 - content 개수:', dataArray.length, 'totalPages:', totalPagesValue);
        } else if (Array.isArray(response.data)) {
          // 배열로 직접 반환된 경우 (비정상 - 페이징 미적용)
          console.warn('⚠️ 배열로 반환됨 - 서버 사이드 페이징이 적용되지 않았습니다');
          // 클라이언트 사이드 페이징 처리
          const startIndex = currentPage * 12;
          const endIndex = startIndex + 12;
          dataArray = response.data.slice(startIndex, endIndex);
          totalPagesValue = Math.ceil(response.data.length / 12);
          totalElementsValue = response.data.length;
          console.log('클라이언트 사이드 페이징 적용 - 현재 페이지:', currentPage, '표시 개수:', dataArray.length);
        } else {
          console.error('응답 데이터 형식이 올바르지 않습니다:', response.data);
          setProducts([]);
          setTotalPages(0);
          setTotalElements(0);
          return;
        }
        
        const transformed = dataArray.map(transformGbProduct);
        setProducts(transformed);
        setTotalPages(totalPagesValue);
        setTotalElements(totalElementsValue);
      } catch (e) {
        console.error("공구 목록 조회 실패:", e);
        setProducts([]);
        setTotalPages(0);
        setTotalElements(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [type, currentPage, selectedCategory, selectedStatus, selectedSort]);

  const getTitleByType = () => {
    if (type === "deadline-soon") return "마감 임박 공구";
    if (type === "popular") return "인기 공구";
    return "진행중 공구";
  };

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory(null);
    }
  }, [categoryParam]);

  useEffect(() => {
    if (sortParam && sortParamMap[sortParam]) {
      setSelectedSort(sortParamMap[sortParam]);
    }
  }, [sortParam]);

  return (
    <>
       {/* 제목 영역 - 배너 스타일 */}
      <div style={{
        width: "100%",
        backgroundColor: "#f3f8ffff",
        padding: "20px 0",
      }}>
        <div style={{
          width: "1020px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <h3 style={{
              margin: "0 0 8px 0",
              fontSize: "32px",
              fontWeight: "700",
              color: "#222",
            }}>
              {getTitleByType()}
            </h3>
            <p style={{
              margin: "0",
              fontSize: "16px",
              color: "#555",
            }}>
              같이 사면 이득, 해외 공동 구매 상품
            </p>
          </div>
        </div>
      </div>

      {/* 필터 영역 (카테고리, 정렬, 진행상태) */}
      <div style={styles.pageWrapper}>
        <div style={styles.container2}>
          {/* 카테고리 줄 */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
            <div style={{ width: "120px", fontWeight: "bold" }}>카테고리</div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {allCategories.map((category) => (
                <span
                  key={category}
                  style={selectedCategory === category ? styles.tagWhite : styles.tag}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
          <hr style={{ color: "#B5B1B1" }} />

          {/* 정렬 줄 */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
            <div style={{ width: "120px", fontWeight: "bold" }}>정렬</div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {sortOptions.map((s) => (
                <span
                  key={s}
                  style={selectedSort === s ? styles.tagWhite : styles.tag}
                  onClick={() => handleSortClick(s)}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <hr style={{ color: "#B5B1B1" }} />

          {/* 진행상태 줄 */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: "120px", fontWeight: "bold" }}>진행상태</div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {allStatus.map((status) => (
                <span
                  key={status}
                  style={selectedStatus === status ? styles.tagWhite : styles.tag}
                  onClick={() => handleStatusClick(status)}
                >
                  {status}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 목록 영역 */}
      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>로딩 중...</div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>공구가 없습니다.</div>
            ) : (
              <>
                <div className="card-grid" style={{ gap: "20px" }}>
                  {products.map((item) => (
                    <GroupBuyCard
                      key={item.id}
                      image={item.image}
                      title={item.title}
                      category={item.category}
                      status={item.status}
                      price={item.price}
                      rating={item.rating}
                      currentParticipants={item.currentParticipants}
                      maxParticipants={item.maxParticipants}
                      deadlineTime={item.deadlineTime}
                      productId={item.id}
                      isProposal={false}
                      showParticipants={true}
                    />
                  ))}
                </div>
                
                {/* 페이지네이션 */}
                {totalPages > 1 && (
                  <div style={styles.pagination}>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        style={{
                          ...styles.pageBtn,
                          ...(currentPage === i ? styles.pageBtnActive : {})
                        }}
                        onClick={() => handlePageChange(i)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
        </div>
      </div>
    </>
  );
}

const styles = {
  pageWrapper: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#fff",
  },
  container: {
    width: "1020px",
    padding: "20px 0",
  },
  container2: {
    width: "1020px",
    padding: "20px 0",
    marginTop:'10px'
  },

  // 전체 폭 hr
  fullWidthHr: {
  width: "100%",
  margin: "0",
},

  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "10px",
    marginTop: "10px",
  },
  imageBox: {
    border: "1px dashed #bbb",
    height: "140px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "4px",
    position: "relative",
    cursor: "pointer",
    overflow: "hidden",
    backgroundColor: "#fafafa",
  },
  fileInput: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0,
    cursor: "pointer",
  },
  preview: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  tag: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #CED4DA",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    cursor: "pointer",
    },

tagWhite: {
  backgroundColor: "#739FF2",
  border: "1px solid #739FF2",
  padding: "5px 12px",
  borderRadius: "20px",
  fontSize: "14px",
  cursor: "pointer",
  color:"white"
},
pagination: {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  marginTop: "40px",
  padding: "20px 0"
},
pageBtn: {
  minWidth: "36px",
  height: "36px",
  padding: "0 12px",
  backgroundColor: "#FFFFFF",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "14px",
  color: "#374151",
  cursor: "pointer",
  transition: "all 0.2s"
},
pageBtnActive: {
  backgroundColor: "#739FF2",
  borderColor: "#739FF2",
  color: "#FFFFFF",
  fontWeight: "600"
}
};