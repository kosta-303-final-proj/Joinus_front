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

  // URL에서 type 파라미터 추출
  // type 파라미터가 없으면 ongoing로 설정
  const type = searchParams.get("type") || "ongoing";

  // useEffect가 컴포넌트 마운트될 때 실행
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await myAxios().get('/api/gb-products', {
          params: { type },  
        });

        // transformGbProduct를 사용하여 데이터 변환
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

      {/* 필터 영역 (현재는 UI만 유지) */}
      <div style={styles.pageWrapper}>
        <div style={styles.container2}>
          {/* 카테고리 줄 */}
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}
          >
            <div style={{ width: "120px", fontWeight: "bold" }}>카테고리</div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <span style={styles.tag}>뷰티</span>
              <span style={styles.tag}>패션</span>
              <span style={styles.tag}>전자기기</span>
              <span style={styles.tag}>홈&리빙</span>
              <span style={styles.tag}>식품</span>
              <span style={styles.tag}>스포츠</span>
            </div>
          </div>
          <hr style={{ color: "#B5B1B1" }} />
          {/* 정렬 줄 */}
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}
          >
            <div style={{ width: "120px", fontWeight: "bold" }}>정렬</div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <span style={styles.tag}>최신순</span>
              <span style={styles.tagWhite}>마감임박순</span>
            </div>
          </div>
          <hr style={{ color: "#B5B1B1" }} />
          {/* 진행상태 줄 */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: "120px", fontWeight: "bold" }}>진행상태</div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <span style={styles.tag}>진행중</span>
              <span style={styles.tag}>마감</span>
              <span style={styles.tag}>취소</span>
            </div>
          </div>
        </div>
      </div>

      {/* 목록 영역 */}
      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          {loading ? (
            <p>로딩 중...</p>
          ) : products.length === 0 ? (
            <p>공구가 없습니다.</p>
          ) : (
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
    backgroundColor: "#E7EBF3",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    cursor: "pointer",
    },

tagWhite: {
  backgroundColor: "#FFFFFF",
  border: "1px solid #CED4DA",
  padding: "5px 12px",
  borderRadius: "20px",
  fontSize: "14px",
  cursor: "pointer",
}
};