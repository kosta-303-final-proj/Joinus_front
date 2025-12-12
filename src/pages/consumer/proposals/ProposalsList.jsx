import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { baseUrl, myAxios } from "../../../config";
import GroupBuyCard from '../../../components/common/GroupBuyCard';
import { transformProposal } from '../../../utils/searchDataTransform';
import '../MainPage.css';

export default function ProposalsList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleSortClick = (sort) => {
    setSelectedSort(sort);
    // TODO: 정렬 로직 구현
  };

  // 필터링 적용
  const filteredProposals = proposals.filter((p) => {
    if (selectCategory.includes("전체")) return true;
    return selectCategory.includes(p.category);
  });

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        const response = await myAxios().get('/proposalList', {
          params: { type },
        });

        // transformProposal을 사용하여 데이터 변환
        const transformed = response.data.map(transformProposal);
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
          <div style={styles.container}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>로딩 중...</div>
            ) : filteredProposals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>데이터가 없습니다.</div>
            ) : (
              <div className="card-grid" style={{ gap: "20px" }}>
                {filteredProposals.map((p) => (
                  <GroupBuyCard
                    key={p.id}
                    image={p.image}
                    title={p.title}
                    category={p.category}
                    status={p.status}
                    price={p.price}
                    rating={p.rating}
                    currentParticipants={p.currentParticipants}
                    maxParticipants={p.maxParticipants}
                    productId={p.id}
                    isProposal={true}
                    voteCount={p.voteCount}
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