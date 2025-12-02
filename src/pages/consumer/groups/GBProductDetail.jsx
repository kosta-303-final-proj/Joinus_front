import { Label, Button, Input, FormGroup} from "reactstrap";
import { Link, Outlet } from "react-router-dom";

export default function GBProductDetail() {

    const total = 15;
    const joined = 10;
    const percentage = (joined/total) * 100;

    return(
        <>
            <div style={styles.pageWrapper}>
              <div style={styles.container}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" ,gap:'10px'}}>
                  <Link to="/gbProductList" style={{ textDecoration: 'none', color: 'black', display: "flex", alignItems: "center",gap:'10px' }}>
                    <img src="/left.png" style={{width:'30px'}}/><h3 className="mb-0 fw-bold text-start">목록으로</h3>
                  </Link>
                </div>
              </div>
            </div>

            <div style={styles.pageWrapper}>
              <div style={styles.container}>
                <div style={{ display: "flex",alignContent:'space-between' , marginBottom: "20px" ,gap:'20px'}}>
                    <div>
                        <img src="/computer.png" style={{width:'500px', height:"500px", marginBottom:'30px', borderRadius:'10px'}}/>
                        <div style={{width:'500px', height:'100px', border:'1px solid black', padding:'5px 10px 10px 10px', borderRadius:'10px'}}>
                            <Label style={{fontSize:'12px'}}>참여 전 요청사항</Label>
                            <hr style={{alignItems:"center", width:'480px', margin:'0 0 5px 0'}}/>
                            <Input type="textarea" style={{border:'1px solid black', padding:"5px", width:'480px', height:'50px', fontSize:'12px', resize: "none"}}></Input>
                        </div>
                    </div>
                    <div style={{width:"500px", height:'700px', border:'1px solid black', padding:'20px', borderRadius:'10px'}}>
                        <div style={{ display:'flex', justifyContent: 'space-between', marginBottom:'10px'}}>
                            <div style={{border:'1px solid black', borderRadius:'5px', fontSize:'12px'}}>카테고리</div>
                            <div>2025-11-28</div>
                        </div>
                        <div>
                            <Label style={{fontSize:"20px"}}>ASUS 비보북 S 16 M3607KA-SH035W (SSD 512GB)</Label>
                        </div>
                        <div>
                            <Label style={{fontSize:"24px"}}>1,057,314원</Label>
                        </div>
                        <hr style={{width:"460px", alignItems:'center', margin:'10px 0 10px 0'}}/>
                        <div>
                            <img src="clock.png" style={{width:'25px', marginRight:'10px'}}/>
                            <Label style={{color:'red', fontSize:'14px'}}>2일 23: 46: 23</Label>
                        </div>
                        <div>
                            <img src="/person.png" style={{width:'25px', marginRight:'5px'}}/>
                            <Label style={{fontSize:'12px'}}>참여 인원 : {joined}/{total}</Label>
                        </div>
                        <div style={{flexGrow:1}}>
                            <div style={{width:"450px", height:'10px', backgroundColor:'#AFACEE', borderRadius:'5px',
                                overflow:'hidden', margin:'5px'}}>
                                <div style={{width: `${(joined / total) * 100}%`, height:'100%',backgroundColor: '#007BFF',}}></div>
                            </div>
                        </div>
                        <hr style={{width:"460px", alignItems:'center', margin:'10px 0 10px 0'}}/>
                        <div>
                            <Label className="fw-bold" style={{fontSize:'12px', marginTop:'0'}}>옵션선택
                                 <div style={{fontSize:'10px', color:'#ACA5A5'}}>옵션에 따라 가격이 변동될 수 있음</div>
                            </Label>
                           {/* 나중에 옵션 map으로 돌려 */}
                            <FormGroup>
                                <Input type="select" style={{height:'30px', fontSize:'12px'}}>
                                    <option value="">모델명</option>
                                    <option value="modal0">0세대</option>
                                    <option value="modal1">1세대</option>
                                    <option value="modal2">2세대</option>
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Input type="select" style={{height:'30px', fontSize:'12px'}}>
                                    <option value="">저장 용량</option>
                                    <option value="modal0">64GB</option>
                                    <option value="modal1">128GB</option>
                                    <option value="modal2">256GB</option>
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Input type="select" style={{height:'30px', fontSize:'12px'}}>
                                    <option value="">색상</option>
                                    <option value="modal0">검정색</option>
                                    <option value="modal1">회색</option>
                                    <option value="modal2">하얀색</option>
                                </Input>
                            </FormGroup>
                            <hr style={{width:"460px", alignItems:'center', margin:'10px 0 10px 0'}}/>
                            <div style={{}}>
                                <div style={{fontSize:'12px', marginTop:'0'}}>상품 가격 1,054,314원</div>
                                <div style={{fontSize:'12px', marginTop:'0'}}>국내 배송비 3000원</div>
                                <div className="fw-bold" style={{fontSize:'12px', marginTop:'0'}}>최종 상품 가격 1,057,314 원</div>
                                <div style={{fontSize:'12px', marginTop:'0'}}>※ 해외 배송 2주~3주 소용, 국내 배송 2-3일 소요</div>
                            </div>
                            <hr style={{width:"460px", alignItems:'center', margin:'10px 0 10px 0'}}/>
                            <div style={{display:'flex', gap:'10px',alignItems: "center"}}>
                                <div className="fw-bold" style={{fontSize:'14px'}}>원사이트</div>
                                <Button style={{backgroundColor:'#739FF2', width:"70px", height:"25px", fontSize:"12px", padding:"0", border:'none'}}>바로가기</Button>
                            </div>
                            <hr style={{width:"460px", alignItems:'center', margin:'10px 0 10px 0'}}/>
                            <div style={{display:"flex",alignItems: "center"}}>
                                <img src="/heart.png" style={{width:"25px", height:'25px', marginRight:'20px'}}/>
                                <img src="/share.png" style={{width:"25px", height:'25px', marginRight:'40px'}}/>
                                <Button style={{backgroundColor:'#739FF2', width:"120px", height:"35px", fontSize:"16px", padding:"0", border:'none', marginRight:'10px'}}>장바구니</Button>
                                <Link to='/pay'>
                                  <Button style={{backgroundColor:'#F7F7F7', width:"120px", height:"35px", fontSize:"16px", padding:"0", color:'black', border:'1px solid black'}}>참여하기</Button>
                                </Link>
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
                  <div style={{ flex: 1, paddingTop:'10px', width:'1020px'}}>
                      <Outlet />
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