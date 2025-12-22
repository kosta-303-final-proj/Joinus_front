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
                    <img src="/left.png" style={{width:'30px'}}/><h3 className="mb-0 fw-bold text-start">목록으로</h3>
                  </Link>
                </div>
              </div>
            </div>

            <div style={styles.pageWrapper}>
              <div style={styles.container}>
                <div style={{ display: "flex",alignContent:'space-between' , marginBottom: "20px" ,gap:'20px'}}>
                    <div>
                        <img src={`${baseUrl}/imageView?filename=${proposal.imageUrl}`}  style={{width:'500px', height:"500px", marginBottom:'30px', borderRadius:'10px'}}/>
                    </div>
                    <div style={{width:"500px",  border:'1px solid black', padding:'20px', borderRadius:'10px'}}>
                        <div style={{ display:'flex', justifyContent: 'space-between', marginBottom:'10px'}}>
                            <div style={{border:'1px solid black', borderRadius:'5px', fontSize:'12px', textAlign:'center', alignContent:'center'}}>{proposal.category}</div>
                            <div style={{backgroundColor: (() => {
                                if (proposal.gbProductId) return '#79F273';          // 승인 → 초록
                                if (proposal.rejectReason) return '#F55F5F';         // 반려 → 빨강
                                return '#739FF2';  })(),
                              color: 'black',width: '100px',height: '30px',textAlign: 'center',display: 'flex',
                              justifyContent: 'center',alignItems: 'center',borderRadius: '5px'}}>
                              {proposal.gbProductId
                                ? '승인'
                                : proposal.rejectReason
                                  ? '반려'
                                  : '검토대기'}
                            </div>
                        </div>
                        <div>
                            <Label style={{fontSize:"20px"}}>{proposal.productName}</Label>
                        </div>
                        <div style={{display:'flex'}}>
                            <Label style={{fontSize:"12px", marginRight:'10px'}}>작성자 : {proposal.memberName}</Label>
                            <Label style={{fontSize:"12px"}}>{proposal.createdAt ? proposal.createdAt.substring(0, 10) : ""}</Label>
                        </div>
                        <div>
                            <Label style={{fontSize:"24px"}}>{(proposal.originalPrice + proposal.abroadShippingCost).toLocaleString()}원</Label>
                        </div>
                        <hr style={{width:"460px", alignItems:'center', margin:'15px 0 15px 0'}}/>
                        <div className="fw-bold" style={{fontSize:'14px', padding:'0 10px 0 10px'}}>상품 상세 설명</div>
                        <div style={{fontSize:'14px', padding:'0 10px 0 10px',whiteSpace: 'pre-wrap'}}>{proposal.description}</div>
                        <hr style={{width:"460px", alignItems:'center', margin:'10px 0 10px 0'}}/>
                        <div>
                            <Label className="fw-bold" style={{fontSize:'12px', marginTop:'0', display:"flex",gap:'10px',alignItems:'center' }}>원사이트
                                 <div style={{fontSize:'10px', color:'#ACA5A5'}}>
                                    <Button style={{ backgroundColor: '#739FF2', width: "70px", height: "25px",
                                      fontSize: "12px",padding: "0",border: 'none'}}
                                      onClick={() => window.open(proposal.originalSiteUrl, "_blank")}>바로가기</Button>
                                 </div>
                            </Label>
                            <hr style={{width:"460px", alignItems:'center', margin:'15px 0 15px 0'}}/>
                            <div>
                                <div style={{fontSize:'12px', marginTop:'0'}}>원래 가격 : {(proposal.originalPrice).toLocaleString()}</div>
                                <div style={{fontSize:'12px', marginTop:'0'}}>해외 배송비 : {(proposal.abroadShippingCost).toLocaleString()}</div>
                            </div>
                            <hr style={{width:"460px", alignItems:'center', margin:'15px 0 15px 0'}}/>
                            <div style={{display:'flex', gap:'10px',alignItems: "center"}}>
                              {proposal.gbProductId ? (
                                <>
                                <div className="fw-bold" style={{fontSize:'14px'}}>공구 상세 URL</div>
                                <Button style={{backgroundColor:'#739FF2', width:"70px", height:"25px", fontSize:"12px", padding:"0", border:'none'}}>바로가기</Button>
                                </>
                              ) : (
                                <div>
                                  <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize:'12px' }}>반려 사유</div>
                                  <div style={{ fontSize: '12px', color: '#F55F5F' }}>
                                    {proposal.rejectReason}
                                  </div>
                                </div>
                              )}
                            </div>
                            <hr style={{width:"460px", alignItems:'center', margin:'15px 0 15px 0'}}/>
                            
                            <div style={{display:"flex",alignItems: "center", justifyContent:'space-between'}}>
                                <div style={{display:'flex'}}>
                                  <img src={isDdabong ? "/colorddabong.png" : "/ddabong.png"} style={{width:"25px", height:'25px', marginRight:'10px', opacity: canVote ? 1 : 0.4}}/>
                                  <div style={{fontSize:'24px', marginRight:'20px'}}>{voteCount}</div>
                                  <Button style={{ backgroundColor: canVote ? '#739FF2' : '#d1d9e6', width: "120px",
                                          height: "35px",fontSize: "16px",padding: "0", border: 'none', cursor: canVote ? 'pointer' : 'not-allowed'}}
                                    disabled={!canVote} onClick={handleVote}>
                                    {canVote
                                      ? (isDdabong ? "취소하기" : "투표하기")
                                      : "투표 불가"}
                                  </Button>
                                </div>
                                <div>
                                  {username === proposal.memberUsername ? (
                                    <Link to={`/proposalsList/proposalModify/${proposal.id}`}>
                                      <Button 
                                        style={{ backgroundColor:'#739FF2',  width:"120px",  height:"35px",  fontSize:"16px", padding:"0",  border:'none', marginRight:'10px' }} >
                                        수정하기
                                      </Button>
                                    </Link>
                                  ) : (
                                    <Button 
                                      style={{ backgroundColor:'#d1d9e6', width:"120px", height:"35px", fontSize:"16px",padding:"0", border:'none',  marginRight:'10px', cursor: 'not-allowed'}}
                                      disabled title="작성자만 수정할 수 있습니다.">
                                      수정하기
                                    </Button>
                                  )}
                                </div>
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
                    <hr style={{alignItems:'center', margin:'10px 0 10px 0'}}/>
                    {comments.map((c) => (
                        <div key={c.id} style={{marginBottom:'15px'}}>
                          <div style={{padding:'0 10px',display:'flex', alignContent:'center', marginBottom:'10px'}}>
                            <div style={{marginRight:'10px'}}>{c.memberNickname}</div>
                            <img src={`/grade/${c.grade.charAt(0) + c.grade.slice(1).toLowerCase()}.png`} style={{width:'25px'}}/>
                          </div>
                          <div style={{padding:'0 10px'}}>{c.createdAt}</div>
                          <div style={{padding:'0 10px'}}>{c.content}</div>
                    <hr style={{alignItems:'center', margin:'10px 0 10px 0'}}/>
                    </div>
                    ))}
                </div>
            </div>
            <div style={styles.pageWrapper}>
              <div style={styles.container}>
                {/* 댓글 입력 영역 */}
                <div style={{ display: 'flex', flexDirection: 'column',  backgroundColor: 'white',padding: '0', gap: '12px'}}>
                  <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>댓글 작성</label>              
                  <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="여기에 댓글을 작성하세요..."
                    style={{ width: '100%', minHeight: '80px',resize: 'none', borderRadius: '10px', border: '1px solid #d1d9e6', padding: '12px',
                      fontSize: '14px', outline: 'none', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)', backgroundColor: '#fff',transition: '0.2s all',}}
                    onFocus={(e) => e.target.style.borderColor = '#739FF2'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d9e6'}
                  />

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button style={{ backgroundColor: '#d9d9d9', color: '#000000', border: 'none', borderRadius: '8px', padding: '8px 18px', fontWeight: 'bold',
                      fontSize: '14px',cursor: 'pointer', transition: '0.2s all'}}
                      onMouseEnter={e => e.target.style.backgroundColor = '#d9d9d9'}
                      // onMouseLeave={e => e.target.style.backgroundColor = '#d9d9d9'}
                      onClick={() => setComment('')} // 취소 버튼
                    >
                      취소
                    </button>

                    <button style={{ backgroundColor: '#739FF2', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 18px',fontWeight: 'bold',
                      fontSize: '14px', cursor: 'pointer', transition: '0.2s all', boxShadow: '0 4px 8px rgba(115, 159, 242, 0.4)'}}
                      onMouseEnter={e => e.target.style.backgroundColor = '#5a7cd6'}
                      onMouseLeave={e => e.target.style.backgroundColor = '#739FF2'}
                      onClick={submit}>
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