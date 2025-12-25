import { Label, Button, Input, FormGroup } from "reactstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { baseUrl, myAxios } from "../../../config";

export default function ProposalDetailConsumar() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  const username = userInfo?.username;
  const { id } = useParams();
  const [proposal, setPropsal] = useState({ id: id, category: '', description: '', productName: '', memberName: '', originalPrice: '', createdAt: '', originalSiteUrl: '', abroadShippingCost: '', imageUrl: '', gbProductId: '', rejectReason: '', status: '', memberUsername: '' });

  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const canVote = !proposal.gbProductId && !proposal.rejectReason;
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const PRIMARY_BLUE = "#7693FC";
  const PRIMARY_BLUE_DISABLED = "#C7D2FE";

  // 댓글 등록 함수
  const submit = () => {
    if (!username) return alert("로그인이 필요합니다.");

    const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
    const memberUsername = userInfo.username;

    myAxios().post("/writeComment", {
      proposalId: id,
      memberUsername: memberUsername,
      content: comment
    })
      .then(res => {
        console.log(res);
        setComment('');
        getComment();
      })
      .catch(err => console.log(err));
  };

  const getComment = () => {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
    const memberUsername = userInfo.username;

    myAxios().get(`getComment/${id}`)
      .then(res => {
        console.log(res)
        setComments(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    getComment();
  }, [id]);

  const getProposal = () => {
    myAxios()
      .get(`/proposalDetail?id=${id}`)
      .then(res => {
        const data = res.data;
        console.log(data)
        setPropsal(data);
        setVoteCount(data.voteCount || 0);
        setIsDdabong(data.isDdabong || false);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getProposal();
  }, [id]);

  const [voteCount, setVoteCount] = useState(0);
  const [isDdabong, setIsDdabong] = useState(false);

  // 카테고리별 색상 함수
  const getCategoryStyle = (categoryName) => {
    const styles = {
      '전자기기': {
        backgroundColor: '#F0F0F0',
        color: '#666666',
      },
      '뷰티': {
        backgroundColor: '#FFE5F0',
        color: '#D91E7A',
      },
      '홈&리빙': {
        backgroundColor: '#E8F5E9',
        color: '#2E7D32',
      },
      '패션': {
        backgroundColor: '#F3E5F5',
        color: '#7B1FA2',
      },
      '식품': {
        backgroundColor: '#FFF9C4',
        color: '#F57F17',
      },
      '스포츠': {
        backgroundColor: '#E3F2FD',
        color: '#1976D2',
      }
    };

    return styles[categoryName] || {
      backgroundColor: '#F5F5F5',
      color: '#757575',
      border: '1px solid #E0E0E0'
    };
  };

  // 상태별 스타일 함수
  const getStatusStyle = () => {
    if (proposal.gbProductId) {
      return {
        backgroundColor: '#E8F5E9',
        color: '#2E7D32',
      };
    }
    if (proposal.rejectReason) {
      return {
        backgroundColor: '#FFEBEE',
        color: '#C62828',
      };
    }
    return {
      backgroundColor: '#E3F2FD',
      color: '#1565C0',
    };
  };

  const getStatusText = () => {
    if (proposal.gbProductId) return '승인';
    if (proposal.rejectReason) return '반려';
    return '검토대기';
  };

  const handleVote = () => {
    if (!username) return alert("로그인이 필요합니다.");
    if (!canVote) return alert("검토 대기 상태에서만 투표할 수 있습니다.");

    myAxios().get("/proposalDdabong", {
      params: { proposalId: id, username }
    })
      .then(res => {
        const voted = res.data;
        setIsDdabong(voted);
        setVoteCount(prev => voted ? prev + 1 : prev - 1);
      })
      .catch(err => console.log(err));
  };



  useEffect(() => {
    if (!username) return;
    myAxios()
      .get("/proposalDdabong/status", {
        params: { proposalId: id, username }
      })
      .then(res => {
        setIsDdabong(res.data.isVote);
        setVoteCount(res.data.voteCount);
      })
      .catch(err => console.log(err));
  }, [id, username]);

  useEffect(() => {
    if (!username || !proposal.id) return;

    myAxios()
      .get("/proposalDdabong/status", {
        params: { proposalId: proposal.id, username }
      })
      .then(res => {
        setIsDdabong(res.data.isVote);
        setVoteCount(res.data.voteCount);
      })
      .catch(err => console.log(err));
  }, [username, proposal.id]);

  return (
    <>
      {/* Breadcrumb */}
      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", padding: "12px 0" }}>
            <Link
              to="/"
              style={{ textDecoration: 'none', color: '#666', display: "flex", alignItems: "center", transition: 'color 0.2s', fontSize: '14px', gap: '6px' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#4A90E2'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              홈
            </Link>
            <span style={{ margin: '0 10px', color: '#ccc' }}>›</span>
            <Link
              to="/proposalsList"
              style={{ textDecoration: 'none', color: '#666', display: "flex", alignItems: "center", gap: '8px', transition: 'color 0.2s', fontSize: '14px' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#4A90E2'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#739FF2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              제안 목록으로
            </Link>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          <div style={{ display: "flex", justifyContent: 'space-between', marginBottom: "20px", gap: '40px' }}>
            {/* 왼쪽: 이미지 */}
            <div>
              <div>
                <img
                  src={`${baseUrl}/imageView?filename=${proposal.imageUrl}`}
                  style={{ width: '500px', height: "500px", objectFit: 'cover', borderRadius: '12px', border: '1px solid #eaeaea' }}
                  alt={proposal.productName}
                />
              </div>
              {/* 투표 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
                {/* 첫 번째 줄: 따봉 + 숫자 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={isDdabong ? "/colorddabong.png" : "/ddabong.png"} style={{ width: "28px", height: '28px' }} />
                  <div style={{ fontSize: '24px', fontWeight: '700' }}>{voteCount}</div>
                </div>

                {/* 두 번째 줄: 버튼 */}
                <Button
                  style={{
                    backgroundColor: canVote ? (isDdabong ? PRIMARY_BLUE : '#fff') : PRIMARY_BLUE_DISABLED,
                    color: canVote ? (isDdabong ? '#fff' : '#739FF2') : '#fff',
                    border: canVote && !isDdabong ? '1px solid #739FF2' : 'none',
                    width: "140px",
                    height: "40px",
                    fontSize: "15px",
                    fontWeight: '600',
                    padding: "0",
                    cursor: canVote ? 'pointer' : 'not-allowed',
                    borderRadius: '8px'
                  }}
                  disabled={!canVote}
                  onClick={handleVote}
                >
                  {canVote ? (isDdabong ? "투표 취소" : "투표하기") : "투표 불가"}
                </Button>
              </div>
            </div>


            {/* 오른쪽: 정보 */}
            <div style={{ width: "500px", background: '#fafafa', padding: '28px', borderRadius: '12px', border: '1px solid #eaeaea' }}>
              {/* 카테고리 & 상태 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'inline-block', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', ...getCategoryStyle(proposal.category) }}>
                  {proposal.category}
                </div>

                <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', ...getStatusStyle() }}>
                  {getStatusText()}
                </div>
              </div>

              {/* 상품명 */}
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#222', marginBottom: '12px', lineHeight: '1.4' }}>
                {proposal.productName}
              </h2>

              {/* 작성자 & 날짜 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#666', marginBottom: '16px' }}>
                <span>작성자: {proposal.memberName}</span>
                <span style={{ color: '#ccc' }}>•</span>
                <span>{proposal.createdAt ? proposal.createdAt.substring(0, 10) : ""}</span>
              </div>

              {/* 가격 */}
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#222', marginBottom: '20px' }}>
                {(proposal.originalPrice + proposal.abroadShippingCost).toLocaleString()}원
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '20px 0' }} />

              {/* 상품 설명 */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#222', marginBottom: '8px' }}>상품 상세 설명</div>
                <div style={{ fontSize: "14px", color: '#555', whiteSpace: "pre-wrap", maxHeight: isDescriptionOpen ? "none" : "100px", overflow: "hidden", lineHeight: '1.6', transition: "max-height 0.3s ease" }}>
                  {proposal.description}
                </div>
                {proposal.description && proposal.description.length > 200 && (
                  <button
                    style={{ background: 'none', border: 'none', color: '#7693FC', fontSize: '13px', fontWeight: '600', cursor: 'pointer', padding: '4px 0', marginTop: '8px' }}
                    onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                  >
                    {isDescriptionOpen ? "접기" : "더보기"}
                  </button>
                )}
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '20px 0' }} />

              {/* 원사이트 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#222' }}>원사이트</span>
                <button
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#7693FC', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                  onClick={() => window.open(proposal.originalSiteUrl, "_blank")}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  바로가기
                </button>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '20px 0' }} />

              {/* 가격 정보 */}
              <div style={{ fontSize: '14px', color: '#555' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>원래 가격</span>
                  <span>{proposal.originalPrice.toLocaleString()}원</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>해외 배송비</span>
                  <span>{proposal.abroadShippingCost.toLocaleString()}원</span>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '20px 0' }} />

              {/* 승인/반려 정보 */}
              {proposal.status === 'APPROVED' && proposal.gbProductId && (
                <>
                  <p>본 상품은 공구로 등록되었습니다.</p>
                  {/* 공구 바로가기 버튼 추가 */}
                  <button
                    style={{
                      width: '100%',
                      backgroundColor: '#0057FA',
                      color: 'white',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      marginTop: '8px'
                    }}
                    onClick={() => {
                      navigate(`/gbProductDetail/${proposal.gbProductId}`);
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    공구 바로가기
                  </button>
                </>
              )}

              {proposal.status === 'REJECTED' && (
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#222', marginBottom: '8px' }}>반려 사유</div>
                  <div style={{ fontSize: '13px', color: '#C62828', margin: 0, padding: '12px', background: '#FFEBEE', borderRadius: '6px', borderLeft: '3px solid #C62828' }}>
                    {proposal.rejectReason}
                  </div>
                </div>
              )}

              {proposal.status !== 'APPROVED' && proposal.status !== 'REJECTED' && (
                <div style={{ height: '20px' }}></div>
              )}

              <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '20px 0' }} />

              {/* 수정 */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '8px' }}>
                <div>
                  {username === proposal.memberUsername ? (
                    <Link to={`/proposalsList/proposalModify/${proposal.id}`} style={{ textDecoration: 'none' }}>
                      <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: PRIMARY_BLUE, color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        수정하기
                      </button>
                    </Link>
                  ) : (
                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: PRIMARY_BLUE_DISABLED, color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'not-allowed' }} disabled>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      수정하기
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 서브 이미지들 */}
      {proposal.subImageUrls && Array.isArray(proposal.subImageUrls) &&
        proposal.subImageUrls.filter(img => img && img !== proposal.imageUrl).length > 0 && (
          <div style={styles.pageWrapper}>
            <div style={styles.container}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px', marginTop: '20px' }}>
                {proposal.subImageUrls
                  .filter(img => img && img !== proposal.imageUrl)
                  .map((img, idx) => (
                    <img
                      key={idx}
                      src={`${baseUrl}/imageView?filename=${img}`}
                      style={{ width: '100%', borderRadius: '8px', border: '1px solid #eaeaea' }}
                      alt={`상품 이미지 ${idx + 1}`}
                      onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                  ))
                }
              </div>
            </div>
          </div>
        )}

      {/* 댓글 목록 */}
      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          <div style={{ marginTop: '40px' }}>
            <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#222', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #77787aff' }}>
              댓글 {comments.length}개
            </h4>

            {comments.map((c) => (
              <div key={c.id} style={{ padding: '20px 0', borderBottom: '1px solid #eaeaea' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '600', fontSize: '14px', color: '#222' }}>{c.memberNickname}</span>
                    <img
                      src={`/grade/${c.grade.charAt(0) + c.grade.slice(1).toLowerCase()}.png`}
                      alt="등급"
                      style={{ width: '22px', height: '22px' }}
                    />
                  </div>
                  <span style={{ fontSize: '12px', color: '#999' }}>{c.createdAt}</span>
                </div>
                <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>{c.content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 댓글 작성 */}
      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          <div style={{ marginTop: '0', padding: '24px', background: '#fafafa', borderRadius: '12px', border: '1px solid #eaeaea' }}>
            <label style={{ fontSize: '15px', fontWeight: '700', color: '#222', marginBottom: '12px', display: 'block' }}>
              댓글 작성
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="여기에 댓글을 작성하세요..."
              style={{ width: '100%', minHeight: '100px', resize: 'vertical', border: '2px solid #e0e0e0', borderRadius: '8px', padding: '14px', fontSize: '14px', lineHeight: '1.6', outline: 'none', fontFamily: 'inherit' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
              <button
                style={{ background: '#f5f5f5', color: '#666', border: '1px solid #e0e0e0', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                onClick={() => setComment('')}
              >
                취소
              </button>
              <button
                style={{ background: PRIMARY_BLUE, color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                onClick={submit}
              >
                등록
              </button>
            </div>
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
    padding: "8px",
  },
};