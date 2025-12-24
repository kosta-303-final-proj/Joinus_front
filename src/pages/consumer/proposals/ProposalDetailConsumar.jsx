import { Label, Button, Input, FormGroup} from "reactstrap";
import { Link ,useParams} from "react-router-dom";
import { useEffect, useState } from "react";
import { baseUrl, myAxios } from "../../../config";

export default function ProposalDetailConsumar() {
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
const username = userInfo?.username;
    const {id} = useParams();
    const [proposal, setPropsal] = useState({id:id,category:'',description:'',productName:'',memberName:'',originalPrice:'',createdAt:'',originalSiteUrl:'',abroadShippingCost:'',imageUrl:'', gbProductId:'', rejectReason:'', status:'', memberUsername:'' });
    const total = 15;
    const joined = 10;
    const percentage = (joined/total) * 100;
    

    const [comment, setComment] = useState(''); // ← 여기 추가
    const [comments, setComments] = useState([]); // 댓글 리스트 (있으면)
    const canVote = !proposal.gbProductId && !proposal.rejectReason;

    // 상태 추가
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
        content: comment // 여기서 textarea 내용 전달
      })
      .then(res => {
        console.log(res);
        setComment(''); // 입력 후 초기화
        getComment();   // 새 댓글 바로 반영
      })
      .catch(err => console.log(err));
    };

    //댓글 get 함수
    const getComment = () => {
      const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
      const memberUsername = userInfo.username;

      myAxios().get(`getComment/${id}`)
      .then(res=>{
        console.log(res)
        setComments(res.data)
      })
      .catch(err=>{
        console.log(err)
      })
    }

    useEffect(() => {
        getComment();   // 페이지 진입 시 QnA 로딩
    }, [id]);



    const getProposal = () => {
      myAxios()
        .get(`/proposalDetail?id=${id}`) // Proposal 불러오기
        .then(res => {
          const data = res.data;
          console.log(data)
          setPropsal(data);

          // voteCount와 isDdabong 초기화
          setVoteCount(data.voteCount || 0);  // DB에 있는 투표 수
          setIsDdabong(data.isDdabong || false); // DB에서 해당 유저 투표 여부
        })
        .catch(err => console.log(err));
    };

    useEffect(() => {
      getProposal(); // getProposal에서 voteCount와 isDdabong 세팅
   }, [id]);


    const [voteCount, setVoteCount] = useState(0);
    const [isDdabong, setIsDdabong] = useState(false);

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
      // 페이지 진입 시 DB에서 vote 상태 가져오기
      myAxios()
        .get("/proposalDdabong/status", { 
          params: { proposalId:id,username}
        })
        .then(res => {
          setIsDdabong(res.data.isVote);// true / false
          setVoteCount(res.data.voteCount); // DB에 저장된 실제 투표 수
        })
        .catch(err => console.log(err));
    }, [id,username]);

    useEffect(() => {
      if (!username || !proposal.id) return;

      myAxios()
        .get("/proposalDdabong/status", { 
          params: { proposalId: proposal.id, username }
        })
        .then(res => {
          setIsDdabong(res.data.isVote); // true/false
          setVoteCount(res.data.voteCount); // DB에 저장된 실제 투표 수
        })
        .catch(err => console.log(err));
    }, [username, proposal.id]);

    useEffect(() => {
      console.log("로그인한 username:", username);
      console.log("proposal.memberUsername:", proposal.memberUsername);
    }, [proposal]);

    return(
        <>
            <div style={styles.pageWrapper}>
          <div style={styles.container}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" ,gap:'10px'}}>
              <Link to="/proposalsList" style={{ textDecoration: 'none', color: 'black', display: "flex", alignItems: "center",gap:'10px' }}>
                <img src="/left.png" style={{width:'28px'}}/>
                <h3 className="mb-0 fw-bold text-start">목록으로</h3>
              </Link>
            </div>
          </div>
        </div>

        <div style={styles.pageWrapper}>
          <div style={styles.container}>
            <div style={{ display: "flex", justifyContent:'space-between', marginBottom: "20px" ,gap:'30px'}}>
                <div>
                    <img
                      src={`${baseUrl}/imageView?filename=${proposal.imageUrl}`}
                      style={{width:'500px', height:"500px", border:'1px solid #000'}}
                    />
                </div>

                <div style={{width:"500px", border:'2px solid #000', padding:'20px'}}>
                    <div style={{ display:'flex', justifyContent: 'space-between', marginBottom:'10px'}}>
                        <div style={{border:'1px solid #000', padding:'4px 8px', fontSize:'12px', fontWeight:'bold'}}>
                          {proposal.category}
                        </div>

                        <div style={{
                          backgroundColor: (() => {
                            if (proposal.gbProductId) return '#6FD96F';
                            if (proposal.rejectReason) return '#E14C4C';
                            return '#6C8EE6';
                          })(),
                          color:'#000',
                          width:'100px',
                          height:'28px',
                          display:'flex',
                          justifyContent:'center',
                          alignItems:'center',
                          fontWeight:'bold',
                          fontSize:'13px'
                        }}>
                          {proposal.gbProductId
                            ? '승인'
                            : proposal.rejectReason
                              ? '반려'
                              : '검토대기'}
                        </div>
                    </div>

                    <Label style={{fontSize:"20px", fontWeight:'bold'}}>
                      {proposal.productName}
                    </Label>

                    <div style={{display:'flex', marginTop:'5px'}}>
                        <Label style={{fontSize:"12px", marginRight:'10px'}}>
                          작성자 : {proposal.memberName}
                        </Label>
                        <Label style={{fontSize:"12px"}}>
                          {proposal.createdAt ? proposal.createdAt.substring(0, 10) : ""}
                        </Label>
                    </div>

                    <div style={{marginTop:'10px'}}>
                        <Label style={{fontSize:"22px", fontWeight:'bold'}}>
                          {(proposal.originalPrice + proposal.abroadShippingCost).toLocaleString()}원
                        </Label>
                    </div>

                    <hr style={{border:'1px solid #000', margin:'15px 0'}}/>

                    <div className="fw-bold" style={{fontSize:'14px'}}>상품 상세 설명</div>
                    <div
                      style={{
                        fontSize: "14px",
                        whiteSpace: "pre-wrap",
                        maxHeight: isDescriptionOpen ? "none" : "100px", // 기본 최대 높이
                        overflow: "hidden",
                        position: "relative",
                        transition: "max-height 0.3s ease"
                      }}
                    >
                      {proposal.description}
                    </div>
                    {/* 더보기/접기 버튼 */}
                    {proposal.description && proposal.description.length > 200 && ( // 글자가 많을 경우만 표시
                      <Button
                        color="link"
                        style={{ padding: 0, fontSize: "12px" }}
                        onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                      >
                        {isDescriptionOpen ? "접기" : "더보기"}
                      </Button>
                    )}

                    <hr style={{border:'1px solid #000', margin:'15px 0'}}/>

                    <Label className="fw-bold" style={{fontSize:'12px', display:"flex", gap:'10px', alignItems:'center'}}>
                      원사이트
                      <Button
                        style={{
                          backgroundColor:PRIMARY_BLUE,
                          color:'#fff',
                          width:"70px",
                          height:"25px",
                          fontSize:"12px",
                          padding:"0",
                          border:'none'
                        }}
                        onClick={() => window.open(proposal.originalSiteUrl, "_blank")}
                      >
                        바로가기
                      </Button>
                    </Label>

                    <hr style={{border:'1px solid #000', margin:'15px 0'}}/>

                    <div style={{fontSize:'12px'}}>
                        <div>원래 가격 : {proposal.originalPrice.toLocaleString()}</div>
                        <div>해외 배송비 : {proposal.abroadShippingCost.toLocaleString()}</div>
                    </div>

                    <hr style={{border:'1px solid #000', margin:'15px 0'}}/>

                    <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                      {proposal.status === 'APPROVED' && (
                        <>
                          <div className="fw-bold" style={{fontSize:'14px'}}>공구 상세 URL</div>
                          <Button
                            style={{backgroundColor:PRIMARY_BLUE, color:'#fff', width:"70px", height:"25px", fontSize:"12px", padding:"0", border:'none'}}
                            onClick={() => window.open(proposal.gbProductUrl, "_blank")}
                          >
                            바로가기
                          </Button>
                        </>
                      )}

                      {proposal.status === 'REJECTED' && (
                        <div>
                          <div style={{fontWeight:'bold', fontSize:'12px'}}>반려 사유</div>
                          <div style={{fontSize:'12px', color:'#E14C4C'}}>
                            {proposal.rejectReason}
                          </div>
                        </div>
                      )}
                    </div>

                    <hr style={{border:'1px solid #000', margin:'15px 0'}}/>

                    <div style={{display:"flex", justifyContent:'space-between', alignItems:'center'}}>
                        <div style={{display:'flex', alignItems:'center'}}>
                          <img src={isDdabong ? "/colorddabong.png" : "/ddabong.png"} style={{width:"22px", height:'22px', marginRight:'10px'}}/>
                          <div style={{fontSize:'22px', marginRight:'20px'}}>{voteCount}</div>

                          <Button
                            style={{
                              backgroundColor: canVote ? PRIMARY_BLUE : PRIMARY_BLUE_DISABLED,
                              color:'#fff',
                              width:"120px",
                              height:"35px",
                              fontSize:"15px",
                              padding:"0",
                              border:'none',
                              cursor: canVote ? 'pointer' : 'not-allowed'
                            }}
                            disabled={!canVote}
                            onClick={handleVote}
                          >
                            {canVote ? (isDdabong ? "취소하기" : "투표하기") : "투표 불가"}
                          </Button>
                        </div>

                        <div>
                          {username === proposal.memberUsername ? (
                            <Link to={`/proposalsList/proposalModify/${proposal.id}`}>
                              <Button
                                style={{
                                  backgroundColor:PRIMARY_BLUE,
                                  color:'#fff',
                                  width:"120px",
                                  height:"35px",
                                  fontSize:"15px",
                                  padding:"0",
                                  border:'none'
                                }}
                              >
                                수정하기
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              style={{
                                backgroundColor:PRIMARY_BLUE_DISABLED,
                                color:'#fff',
                                width:"120px",
                                height:"35px",
                                fontSize:"15px",
                                padding:"0",
                                border:'none'
                              }}
                              disabled
                            >
                              수정하기
                            </Button>
                          )}
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
            <div style={styles.pageWrapper}>
              <div style={styles.container}>
                <div style={{ display: "flex", gap: "45px", flexWrap: "wrap" }}>
                  {proposal.subImageUrls &&
                    Array.isArray(proposal.subImageUrls) &&
                    proposal.subImageUrls
                      .filter(img => img && img !== proposal.imageUrl) // 대표 이미지 제외
                      .map((img, idx) => (
                        <img
                          key={idx}
                          src={`${baseUrl}/imageView?filename=${img}`}
                          style={{ width: "220px" }}
                          onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                      ))
                  }
                </div>
              </div>
            </div>
            <div style={styles.pageWrapper}>
              <div style={styles.container}>
                  <hr style={{border:'1px solid #000', margin:'10px 0'}}/>

                  {comments.map((c) => (
                      <div key={c.id} style={{marginBottom:'15px'}}>
                          <div style={{
                              padding:'6px 10px',
                              display:'flex',
                              alignItems:'center',
                              marginBottom:'6px'
                          }}>
                              <div style={{marginRight:'10px', fontWeight:'bold', fontSize:'13px'}}>
                                  {c.memberNickname}
                              </div>
                              <img
                                  src={`/grade/${c.grade.charAt(0) + c.grade.slice(1).toLowerCase()}.png`}
                                  style={{width:'22px'}}
                              />
                          </div>

                          <div style={{padding:'0 10px', fontSize:'12px', color:'#555'}}>
                              {c.createdAt}
                          </div>

                          <div style={{
                              padding:'8px 10px',
                              fontSize:'14px',
                              border:'none',
                              marginTop:'6px'
                          }}>
                              {c.content}
                          </div>

                          <hr style={{border:'1px solid #000', margin:'12px 0'}}/>
                      </div>
                  ))}
              </div>
          </div>

          <div style={styles.pageWrapper}>
            <div style={styles.container}>
              {/* 댓글 입력 영역 */}
              <div style={{
                  display:'flex',
                  flexDirection:'column',
                  gap:'10px'
              }}>
                <label style={{
                    fontWeight:'bold',
                    fontSize:'14px'
                }}>
                  댓글 작성
                </label>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="여기에 댓글을 작성하세요..."
                  style={{
                    width:'100%',
                    minHeight:'90px',
                    resize:'none',
                    border:'2px solid #000',
                    padding:'10px',
                    fontSize:'14px',
                    outline:'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#000'}
                  onBlur={(e) => e.target.style.borderColor = '#000'}
                />

                <div style={{
                    display:'flex',
                    justifyContent:'flex-end',
                    gap:'10px'
                }}>
                  <button
                    style={{
                      backgroundColor: "#BFDBFE",
                      color:'white',
                      border:'none',
                      padding:'8px 18px',
                      fontWeight:'bold',
                      fontSize:'14px',
                      cursor:'pointer'
                    }}
                    onClick={() => setComment('')}
                  >
                    취소
                  </button>

                  <button
                    style={{
                      backgroundColor:PRIMARY_BLUE,
                      color:'#fff',
                      border:'none',
                      padding:'8px 18px',
                      fontWeight:'bold',
                      fontSize:'14px',
                      cursor:'pointer'
                    }}
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
    padding: "20px 0",
  },
  container2: {
    width: "1020px",
    padding: "20px 0",
    marginTop:'10px'
  },

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
    border: "2px dashed #000",
    height: "140px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    cursor: "pointer",
    overflow: "hidden",
    backgroundColor: "#fff",
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
    backgroundColor: "#e5e5e5",
    padding: "5px 12px",
    fontSize: "14px",
    cursor: "pointer",
  },

  tagWhite: {
    backgroundColor: "#fff",
    border: "2px solid #000",
    padding: "5px 12px",
    fontSize: "14px",
    cursor: "pointer",
  }
};
