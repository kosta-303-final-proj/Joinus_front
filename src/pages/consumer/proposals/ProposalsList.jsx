import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Label, Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import axios from "axios";
import { baseUrl,myAxios } from "../../../config";

export default function ProposalsList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);

  const type = searchParams.get("type") || "popular";

  // 카테고리 및 정렬 클릭 적용
  const [selectCategory, setSelectCategory] = useState(["전체"]);//초기값
  const [selectedSort, setSelectedSort] = useState("최신순");
  const allCategories = ["전체", "뷰티", "패션", "전자기기", "홈&리빙", "식품", "스포츠"];
  const sortOptions = ["최신순", "투표순"];

  const handleCartegopryClick = (category) => {
    if (category === "전체") {
      setSelectCategory(["전체"]);
    } else {
      let newCategories = [...selectCategory];
      if (newCategories.includes("전체")) newCategories = [];
      if (newCategories.includes(category)) {
        newCategories = newCategories.filter((c) => c !== category);
      } else {
        newCategories.push(category);
      }
      if (newCategories.length === 0) newCategories = ["전체"];
      setSelectCategory(newCategories);
    }
  };

// 필터링 적용
const filteredProposals = proposals.filter((p) => {
  if (selectCategory.includes("전체")) return true;
  return selectCategory.includes(p.category);
  });

  const fetchProposals = () => {
    if (!hasMore) return;
    setLoading(true);

    myAxios()
      .get(`/proposalList`, {
        params: { page, type },
      })
      .then((res) => {
        const transformed = res.data.map((p) => ({
          id: p.id,
          productName: p.productName,
          category: p.category,
          description: p.description,
          originalPrice: p.originalPrice
            ? `${p.originalPrice.toLocaleString()}원`
            : "0원",
          memberUsername: p.memberName || p.memberUsername,
          date: p.createdAt ? p.createdAt.substring(0, 10) : "",
          votes: p.voteCount || 0,
          image: p.imageUrl
            ? `${baseUrl}/imageView?filename=${p.imageUrl}`
            : "https://picsum.photos/300/200",
        }));

        // 페이지 누적
        setProposals((prev) => [...prev, ...transformed]);

        if (transformed.length === 0) {
          setHasMore(false);
        }
      })
      .catch((e) => {
        console.error("제안 목록 조회 실패:", e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

 
  useEffect(() => {
    setProposals([]);
    setPage(0);
    setHasMore(true);
  }, [type]);

  useEffect(() => {
    fetchProposals();
  }, [page]);

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [loading, hasMore]);

  

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
            <h3 className="mb-0 fw-bold text-start">제안 목록</h3>

            <Link className="fw-bold d-flex align-items-center"style={{textDecoration: "none", color: "black",cursor: "pointer",}}to="proposalWrite">
              제안하기
              <img  src="/right.png"alt="뒤로가기"className="back"style={{ width: "20px", height: "20px",marginLeft: "5px",}}/>
            </Link>
          </div>
        </div>
      </div>

      {/* 필터 영역 (UI만 유지) */}
      <div style={styles.pageWrapper}>
        <div style={styles.container2}>
          {/* 카테고리 줄 */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
            <div style={{ width: "120px", fontWeight: "bold" }}>카테고리</div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {allCategories.slice(1).map((category) => (
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
                <span key={s} style={selectedSort === s ? styles.tagWhite : styles.tag} onClick={() => handleSortClick(s)} > {s} </span> ))}
            </div>
          </div>
          <hr style={{ color: "#B5B1B1" }} />
        </div>
      </div>

        <div style={styles.pageWrapper}>
                <div style={styles.container} >
                    <div style={{display:'grid', gap:"20px", gridTemplateColumns: "repeat(4, 1fr)"}}>
                        {filteredProposals.map((p) => (
                        <Card key={p.id} style={{width: "240px", boxShadow: "0 5px 20px rgba(88 88 88 / 20%)",border: "none",display: "flex",flexDirection: "column",
                            justifyContent: "space-between",height: "415px",}}
                          onClick={() => navigate(`/proposalsList/proposalDetail/${p.id}`)}
                        >
                          {/* 이미지 영역 */}
                          <div style={{ height: "180px",  display: "flex",justifyContent: "center",alignItems: "center", backgroundColor: "#f5f5f5", }}>
                            <img src={p.image}style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", }} />
                          </div>

                          {/* 카드 본문 영역 */}
                          <CardBody style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                            {/* 제목 & 카테고리 */}
                            <CardTitle tag="h5" style={{ display: "flex",justifyContent: "space-between", marginBottom: "5px", }}>
                              <div style={{ border: "1px solid black", fontSize: "10px", padding: "5px" }}>
                                {p.category}
                              </div>
                            </CardTitle>

                            {/* 제품명 */}
                            <CardSubtitle className="mb-1 text-muted" tag="h6" style={{ fontSize: "14px", minHeight: "20px", height:'40px' }}>
                              {p.productName}
                            </CardSubtitle>

                            {/* 설명 */}
                            <CardSubtitle style={{  }}>
                              <div style={{ fontSize: "12px",display: "-webkit-box",WebkitLineClamp: 2,WebkitBoxOrient: "vertical",overflow: "hidden",
                                  textOverflow: "ellipsis",lineHeight: "1.4em",maxHeight: "4.2em",marginTop: "4px"}}>
                                {p.description}
                              </div>
                            </CardSubtitle>

                            {/* 가격 */}
                            <div className="fw-bold" style={{ fontSize: "24px", marginBottom: "10px", minHeight: "30px" }}>
                              {p.originalPrice}
                            </div>

                            {/* 제안자 & 날짜 */}
                            <CardSubtitle style={{ marginBottom: "5px" }}>
                              <div style={{ justifyContent: "space-between", display: "flex" }}>
                                <Label style={{ fontSize: "12px" }}>제안자 : {p.memberUsername}</Label>
                                <Label style={{ color: "black", fontSize: "10px" }}>{p.date}</Label>
                              </div>
                            </CardSubtitle>

                            {/* 투표 */}
                            <CardSubtitle>
                              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                <img 
                                    src={p.isDdabong ? "/colorddabong.png" : "/ddabong.png"} 
                                    style={{ width: "20px" }} 
                                  />
                                <div>{p.votes}</div>
                              </div>
                            </CardSubtitle>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
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