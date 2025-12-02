import { Label, Button, Input, FormGroup} from "reactstrap";
import { Link } from "react-router-dom";

export default function ProposalDetailConsumar() {

    const total = 15;
    const joined = 10;
    const percentage = (joined/total) * 100;

    return(
        <>
            <div style={styles.pageWrapper}>
              <div style={styles.container}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" ,gap:'10px'}}>
                  <Link to="/proposalsList" style={{ textDecoration: 'none', color: 'black', display: "flex", alignItems: "center",gap:'10px' }}>
                    <img src="/left.png" style={{width:'30px'}}/><h3 className="mb-0 fw-bold text-start">목록으로</h3>
                  </Link>
                </div>

                <div>
                  
                </div>
              </div>
            </div>

            <div style={styles.pageWrapper}>
              <div style={styles.container}>
                <div style={{ display: "flex",alignContent:'space-between' , marginBottom: "20px" ,gap:'20px'}}>
                    <div>
                        <img src="/computer.png" style={{width:'500px', height:"500px", marginBottom:'30px', borderRadius:'10px'}}/>
                    </div>
                    <div style={{width:"500px", height:'580px', border:'1px solid black', padding:'20px', borderRadius:'10px'}}>
                        <div style={{ display:'flex', justifyContent: 'space-between', marginBottom:'10px'}}>
                            <div style={{border:'1px solid black', borderRadius:'5px', fontSize:'12px', textAlign:'center', alignContent:'center'}}>카테고리</div>
                            <div style={{backgroundColor:'#79F273', color:'black', width:'100px', height:'30px', alignContent:'center', textAlign:'center'}}>공구 등록</div>
                        </div>
                        <div>
                            <Label style={{fontSize:"20px"}}>ASUS 비보북 S 16 M3607KA-SH035W (SSD 512GB)</Label>
                        </div>
                        <div style={{display:'flex'}}>
                            <Label style={{fontSize:"12px", marginRight:'10px'}}>작성자 : 홍길동</Label>
                            <Label style={{fontSize:"12px"}}>2025-11-30</Label>
                        </div>
                        <div>
                            <Label style={{fontSize:"24px"}}>1,057,314원</Label>
                        </div>
                        <hr style={{width:"460px", alignItems:'center', margin:'10px 0 10px 0'}}/>
                        <div className="fw-bold" style={{fontSize:'14px', padding:'0 10px 0 10px'}}>상품 상세 설명</div>
                        <div style={{fontSize:'14px', padding:'0 10px 0 10px'}}>* 저장장치: SSD</div>
                        <div style={{fontSize:'14px', padding:'0 10px 0 10px '}}>* 화면크기: 40.64cm</div>
                        <div style={{fontSize:'14px', padding:'0 10px 0 10px'}}>* CPU브랜드: AMD</div>
                        <div style={{fontSize:'14px', padding:'0 10px 0 10px'}}>* 출시년월: 2025.08</div>
                        <div style={{fontSize:'14px', padding:'0 10px 0 10px'}}>* 제조사 품질보증: 1년</div>
                        <div style={{fontSize:'14px', padding:'0 10px 0 10px'}}>* 쿠팡상품번호: 8941702848 - 26149371639</div>
                        <hr style={{width:"460px", alignItems:'center', margin:'10px 0 10px 0'}}/>
                        <div>
                            <Label className="fw-bold" style={{fontSize:'12px', marginTop:'0'}}>원사이트
                                 <div style={{fontSize:'10px', color:'#ACA5A5'}}>https://www.coupang.com/vp/products/8941702848?itemId=26149371639&vendorI333a0</div>
                            </Label>
                            <hr style={{width:"460px", alignItems:'center', margin:'10px 0 10px 0'}}/>
                            <div>
                                <div style={{fontSize:'12px', marginTop:'0'}}>원래 가격 1,054,314원</div>
                                <div style={{fontSize:'12px', marginTop:'0'}}>해외 배송비 50,000원</div>
                            </div>
                            <hr style={{width:"460px", alignItems:'center', margin:'10px 0 10px 0'}}/>
                            <div style={{display:'flex', gap:'10px',alignItems: "center"}}>
                                <div className="fw-bold" style={{fontSize:'14px'}}>공구 상세 URL</div>
                                <Button style={{backgroundColor:'#739FF2', width:"70px", height:"25px", fontSize:"12px", padding:"0", border:'none'}}>바로가기</Button>
                            </div>
                            <hr style={{width:"460px", alignItems:'center', margin:'10px 0 10px 0'}}/>
                            
                            <div style={{display:"flex",alignItems: "center"}}>
                                <img src="/ddabong.png" style={{width:"25px", height:'25px', marginRight:'10px'}}/>
                                <div style={{fontSize:'24px', marginRight:'20px'}}>0</div>
                                <Button style={{backgroundColor:'#739FF2', width:"120px", height:"35px", fontSize:"16px", padding:"0", border:'none', marginRight:'10px'}}>투표하기</Button>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <div>
                        <img src="/computer.png" style={{width:"220px", marginRight:'47px'}}/>
                        <img src="/computer.png" style={{width:"220px", marginRight:'46px'}}/>
                        <img src="/computer.png" style={{width:"220px", marginRight:'47px'}}/>
                        <img src="/computer.png" style={{width:"220px"}}/>
                    </div>
                </div>
            </div>
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <hr style={{alignItems:'center', margin:'10px 0 10px 0'}}/>
                          <div style={{padding:'0 10px',display:'flex', alignContent:'center', marginBottom:'10px'}}>
                            <div style={{}}>닉네임</div>
                            <img src="/grade/Silver.png" style={{width:'25px'}}/>
                          </div>
                          <div style={{padding:'0 10px'}}>20025-11-30</div>
                          <div style={{padding:'0 10px'}}>대충 공구 하자는 내용</div>
                    <hr style={{alignItems:'center', margin:'10px 0 10px 0'}}/>
                </div>
            </div>
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                  <div style={{height:'100px', backgroundColor:'#d9d9d9'}}>
                  
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