import { Label, Button, Input, FormGroup } from "reactstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { baseUrl, myAxios } from "../../config";

export default function ProposalDetailAdmin() {
  const navigate = useNavigate();

  const { id } = useParams();
  const [proposal, setPropsal] = useState({ id: id, category: '', description: '', productName: '', memberName: '', originalPrice: '', createdAt: '', originalSiteUrl: '', abroadShippingCost: '', imageUrl: '', gbProductId: '', rejectReason: '', status: '' });
  const [voteCount, setVoteCount] = useState(0);
  const [isDdabong, setIsDdabong] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [reason, setReason] = useState("");
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const PRIMARY_BLUE = "#7693FC";
  const PRIMARY_BLUE_DISABLED = "#C7D2FE";

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
  }, [])

  const handleVote = () => {
    myAxios().get("/proposalHeart", { params: { proposalId: id, username: "admin" } })
      .then(res => {
        const voted = res.data;
        setIsDdabong(voted);
        setVoteCount(prev => voted ? prev + 1 : prev - 1);
      })
      .catch(err => console.log(err));
  };

  const handleCreateGbProduct = () => {
    console.log('========== 공구 등록 버튼 클릭 ==========');
    console.log('제안 ID:', id);

    if (!id) {
      alert('제안 ID를 찾을 수 없습니다.');
      return;
    }

    const url = `/admin/gbProductCreate?proposalId=${id}`;
    console.log('열릴 URL:', url);

    window.open(
      url,
      '_blank',
      'width=1400,height=900'
    );
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      alert('반려 사유를 입력해주세요.');
      return;
    }

    if (!window.confirm('이 제안을 반려하시겠습니까?\n제안자와 투표자들에게 알림이 발송됩니다.')) {
      return;
    }

    try {
      console.log('========== 반려 처리 ==========');
      console.log('제안 ID:', id);
      console.log('반려 사유:', reason);

      await myAxios().post(`/admin/proposal/${id}/reject`, {
        reason: reason
      });

      alert('반려 처리가 완료되었습니다.\n제안자와 투표자들에게 알림이 발송되었습니다.');

      getProposal();
      setReason('');

    } catch (error) {
      console.error('반려 처리 실패:', error);
      alert('반려 처리에 실패했습니다.');
    }
  };

  const submit = () => {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
    const memberUsername = userInfo.username;

    if (!memberUsername) {
      alert("로그인이 필요합니다.");
      return;
    }

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
    myAxios().get(`getComment/${id}`)
      .then(res => {
        console.log(res);
        setComments(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    getComment();
  }, [id]);

  return (
    <>
      {/* Breadcrumb */}
      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", padding: "12px 0" }}>
            <Link
              to="/admin/proposalMngList"
              style={{ textDecoration: 'none', color: '#666', display: "flex", alignItems: "center", transition: 'color 0.2s', fontSize: '14px', gap: '6px' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#4A90E2'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
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
              {/* 투표 & 공구 등록 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
                {/* 첫 번째 줄: 따봉 + 숫자 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={isDdabong ? "/colorddabong.png" : "/ddabong.png"} style={{ width: "28px", height: '28px' }} />
                  <div style={{ fontSize: '24px', fontWeight: '700' }}>{voteCount}</div>
                </div>

                {/* 두 번째 줄: 투표 버튼 */}
                <Button
                  style={{
                    backgroundColor: PRIMARY_BLUE,
                    color: '#fff',
                    width: "140px",
                    height: "40px",
                    fontSize: "15px",
                    fontWeight: '600',
                    padding: "0",
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '8px'
                  }}
                  onClick={handleVote}
                >
                  {isDdabong ? "투표 취소" : "투표하기"}
                </Button>
              </div>
            </div>

            {/* 오른쪽: 정보 */}
            <div style={{ width: "500px", background: '#fafafa', padding: '12px 28px 0px 28px', borderRadius: '12px', border: '1px solid #eaeaea' }}>
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
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
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
              {proposal.gbProductId ? (
                <>
                  <p style={{ fontSize: '14px', color: '#555', marginBottom: '12px' }}>본 상품은 공구로 등록되었습니다.</p>
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
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    onClick={() => navigate(`/gbProductDetail/${proposal.gbProductId}`)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    공구 바로가기
                  </button>
                </>
              ) : proposal.rejectReason ? (
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#222', marginBottom: '8px' }}>반려 사유</div>
                  <div style={{ fontSize: '13px', color: '#C62828', margin: 0, padding: '12px', background: '#FFEBEE', borderRadius: '6px', borderLeft: '3px solid #C62828' }}>
                    {proposal.rejectReason}
                  </div>
                </div>
              ) : (
                <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px' }}>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="반려 사유를 입력하세요..."
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      resize: 'none',
                      border: '1px solid #d0d0d0',
                      borderRadius: '6px',
                      padding: '12px',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                    maxLength={500}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <small style={{ fontSize: '11px', color: '#666' }}>
                      {reason.length}/500자
                    </small>
                    <button
                      onClick={handleReject}
                      style={{
                        fontSize: '13px',
                        backgroundColor: '#F55F5F',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      반려 처리
                    </button>
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '20px 0' }}>
                <Button
                  style={{
                    backgroundColor: '#0057FA',
                    color: '#fff',
                    width: "140px",
                    height: "40px",
                    fontSize: "15px",
                    fontWeight: '600',
                    padding: "0",
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '8px'
                  }}
                  onClick={handleCreateGbProduct}
                >
                  공구 등록
                </Button>
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
            <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#222', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #222' }}>
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