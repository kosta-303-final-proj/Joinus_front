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
  const sortParam = searchParams.get("sort");

  
  const categoryParam = searchParams.get("category");

  const allCategories = ["뷰티", "패션", "전자기기", "홈&리빙", "식품", "스포츠"];
  const sortOptions = ["최신순", "찜순", "마감순"];
  const allStatus = ["진행중","취소"];

  // 카테고리 및 정렬 클릭 적용
  const [selectCategory, setSelectCategory] = useState([]);
  const [selectedSort, setSelectedSort] = useState("최신순");
  const [selectStatus, setSelectStatus] = useState(["진행중"]);

  const sortParamMap = {
    deadline: "마감순",
    wish: "찜순",
  };
  
  const handleCartegopryClick = (category) => {
    let newCategories = [...selectCategory];

    if (newCategories.includes(category)) {
      newCategories = newCategories.filter((c) => c !== category);
    } else {
      newCategories.push(category);
    }

    setSelectCategory(newCategories);
  };

  // 진행상태 (중복 선택 가능)
  const handleStatusClick = (status) => {
    let newStatus = [...selectStatus];

    if (newStatus.includes(status)) {
      newStatus = newStatus.filter(s => s !== status);
    } else {
      newStatus.push(status);
    }

    if (newStatus.length === 0) return;
    setSelectStatus(newStatus);
  };

  const handleSortClick = (sort) => {
    setSelectedSort(sort);
  };

  // 필터링 적용
  const filteredProducts = products.filter((p) => {
    const categoryCheck =
      selectCategory.length === 0 || selectCategory.includes(p.category);

    const statusCheck = selectStatus.includes(p.status);

    return categoryCheck && statusCheck;
  });

  // ✅ 정렬 적용 (마감순: 숫자 작은 것부터)
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (selectedSort === "최신순") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    if (selectedSort === "찜순") {
      return b.currentParticipants - a.currentParticipants;
    }

    if (selectedSort === "마감순") {
      return new Date(a.deadlineAt) - new Date(b.deadlineAt);
    }

    return 0;
  });


  // URL에서 type 파라미터 추출
  // type 파라미터가 없으면 ongoing로 설정
  const type = searchParams.get("type") || "ongoing";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await myAxios().get('/api/gb-products', {
          params: { type },
        });

        const transformed = response.data.map(transformGbProduct);
        setProducts(transformed);
      } catch (e) {
        console.error("공구 목록 조회 실패:", e);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [type]);

  const getTitleByType = () => {
    if (type === "deadline-soon") return "마감 임박 공구";
    if (type === "popular") return "인기 공구";
    return "진행중 공구";
  };

  useEffect(() => {
    if (categoryParam) {
      setSelectCategory([categoryParam]);
    } else {
      setSelectCategory([]);
    }
  }, [categoryParam]);

  useEffect(() => {
    if (sortParam && sortParamMap[sortParam]) {
      setSelectedSort(sortParamMap[sortParam]);
    }
  }, [sortParam]);

  return (
    <>
      {/* 제목 영역 (1020px 고정) */}
      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h3 className="mb-0 fw-bold text-start">{getTitleByType()}</h3>
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
                  style={selectCategory.includes(category) ? styles.tagWhite : styles.tag}
                  onClick={() => handleCartegopryClick(category)}
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
                  style={selectStatus.includes(status) ? styles.tagWhite : styles.tag}
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
            ) : filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>공구가 없습니다.</div>
            ) : (
              <div className="card-grid" style={{ gap: "20px" }}>
              {sortedProducts.map((item) => (
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
                />
              ))}
            </div>
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
}
};