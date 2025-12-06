import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Label, Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import axios from "axios";
import { baseUrl } from "../../../config";

export default function ProposalsList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  const type = searchParams.get("type") || "popular";

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/api/proposals`, {
          params: { type },
        });

        const transformed = response.data.map((p) => ({
          id: p.id,
          title: p.productName,
          category: p.category,
          description: p.description,
          price: p.originalPrice
            ? `${p.originalPrice.toLocaleString()}원`
            : "0원",
          author: p.memberName || p.memberUsername,
          date: p.createdAt ? p.createdAt.substring(0, 10) : "",
          votes: p.voteCount || 0,
          image: p.imageUrl
            ? `${baseUrl}/imageView?filename=${p.imageUrl}`
            : "https://picsum.photos/300/200",
        }));

        setProposals(transformed);
      } catch (e) {
        console.error("제안 목록 조회 실패:", e);
        setProposals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [type]);

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

            <Link
              className="fw-bold d-flex align-items-center"
              style={{
                textDecoration: "none",
                color: "black",
                cursor: "pointer",
              }}
              to="proposalWrite"
            >
              제안하기
              <img
                src="/right.png"
                alt="뒤로가기"
                className="back"
                style={{
                  width: "20px",
                  height: "20px",
                  marginLeft: "5px",
                }}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* 필터 영역 (UI만 유지) */}
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
              <span style={styles.tag}>투표순</span>
            </div>
          </div>
          <hr style={{ color: "#B5B1B1" }} />
        </div>
      </div>

      {/* 목록 영역 */}
      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          {loading ? (
            <p>로딩 중...</p>
          ) : proposals.length === 0 ? (
            <p>제안이 없습니다.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "20px",
                gridTemplateColumns: "repeat(4, 1fr)",
              }}
            >
              {proposals.map((proposal) => (
                <Card
                  key={proposal.id}
                  style={{
                    width: "240px",
                    boxShadow: "0 5px 20px rgba(88 88 88 / 20%)",
                    border: "none",
                  }}
                  onClick={() =>
                    navigate(`/proposalsList/proposalDetail/${proposal.id}`)
                  }
                >
                  <img alt={proposal.title} src={proposal.image} />
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
                        {proposal.category}
                      </div>
                    </CardTitle>
                    <CardSubtitle className="mb-2 text-muted" tag="h6">
                      <div style={{ fontSize: "14px" }}>{proposal.title}</div>
                    </CardSubtitle>
                    <CardSubtitle>
                      <div style={{ fontSize: "12px" }}>
                        {proposal.description}
                      </div>
                    </CardSubtitle>
                    <div className="fw-bold" style={{ fontSize: "24px" }}>
                      {proposal.price}
                    </div>
                    <CardSubtitle>
                      <div
                        style={{
                          justifyContent: "space-between",
                          display: "flex",
                        }}
                      >
                        <div>
                          <Label style={{ fontSize: "12px" }}>
                            제안자 {proposal.author}
                          </Label>
                        </div>
                        <div>
                          <Label style={{ color: "black", fontSize: "10px" }}>
                            {proposal.date}
                          </Label>
                        </div>
                      </div>
                    </CardSubtitle>
                    <CardSubtitle>
                      <div
                        style={{
                          justifyContent: "space-between",
                          display: "flex",
                        }}
                      >
                        <div
                          style={{ display: "flex", alignContent: "center" }}
                        >
                          <img
                            src="/ddabong.png"
                            style={{
                              width: "20px",
                              marginRight: "5px",
                              fontSize: "16px",
                            }}
                          />
                          <div>{proposal.votes}</div>
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