import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Label, Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import axios from "axios";
import { baseUrl } from "../../../config";

export default function GBProductList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const type = searchParams.get("type") || "ongoing";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/api/gb-products`, {
          params: { type },
        });

        // GbProductDto -> 화면 카드용 데이터로 변환
        const transformed = response.data.map((p) => ({
          id: p.id,
          title: p.name,
          category: p.categoryId, // TODO: 카테고리 이름 매핑
          status: p.status === "ONGOING" ? "진행중" : "마감",
          description: p.description,
          price: p.price ? `${p.price.toLocaleString()}원` : "0원",
          rating: 0, // TODO: 리뷰 평균 별점
          currentParticipants: p.participants || 0,
          maxParticipants: p.minParticipants || 0,
          deadlineTime: p.endDate,
          image: p.thumbnailFileName
            ? `/mainPage/${p.thumbnailFileName}`
            : "https://picsum.photos/300/200",
        }));

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
            <div
              style={{
                display: "grid",
                gap: "20px",
                gridTemplateColumns: "repeat(4, 1fr)",
              }}
            >
              {products.map((item) => (
                <Card
                  key={item.id}
                  style={{
                    width: "240px",
                    boxShadow: "0 5px 20px rgba(88 88 88 / 20%)",
                    border: "none",
                  }}
                  onClick={() => navigate(`/gbProductDetail/${item.id}`)}
                >
                  <img alt={item.title} src={item.image} />
                  <CardBody>
                    <CardTitle
                      tag="h5"
                      style={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <div
                        style={{
                          border: "1px solid black",
                          fontSize: "10px",
                          padding: "5px",
                        }}
                      >
                        {item.category || "카테고리"}
                      </div>
                      <div
                        style={{
                          backgroundColor: "#BBFFAC",
                          color: "#0A8F30",
                          fontSize: "10px",
                          padding: "5px",
                        }}
                      >
                        {item.status}
                      </div>
                    </CardTitle>
                    <CardSubtitle
                      className="mb-2 text-muted"
                      tag="h6"
                      style={{ fontSize: "14px" }}
                    >
                      {item.title}
                    </CardSubtitle>
                    <CardSubtitle>
                      <div style={{ fontSize: "12px" }}>{item.description}</div>
                    </CardSubtitle>
                    <div className="fw-bold" style={{ fontSize: "24px" }}>
                      {item.price}
                    </div>
                    <CardSubtitle>
                      <div>
                        <img
                          src="/CountingStars.png"
                          style={{ width: "12px", marginRight: "5px" }}
                        />
                        <Label style={{ fontSize: "12px" }}>4.6</Label>
                      </div>
                    </CardSubtitle>
                    <CardSubtitle>
                      <div
                        style={{
                          justifyContent: "space-between",
                          display: "flex",
                        }}
                      >
                        <div>
                          <img
                            src="/person.png"
                            style={{ width: "15px", marginRight: "5px" }}
                          />
                          <Label style={{ fontSize: "12px" }}>
                            참여 인원 : {item.currentParticipants}/{item.maxParticipants}
                          </Label>
                        </div>
                        <div>
                          <Label style={{ color: "red", fontSize: "10px" }}>
                            {/* TODO: GBProductList에서도 남은 시간 계산 적용 가능 */}
                            {item.deadlineTime}
                          </Label>
                        </div>
                      </div>
                    </CardSubtitle>
                  </CardBody>
                </Card>
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