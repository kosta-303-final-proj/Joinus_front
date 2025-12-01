import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import { Label, Button, Card, CardBody, CardTitle, CardSubtitle, CardText } from "reactstrap";

export default function GBProductList(){

    const navigate = useNavigate();

    return(
        <>
            {/* 제목 영역 (1020px 고정) */}
            <div style={styles.pageWrapper}>
              <div style={styles.container}>

                {/* 제목 + 뒤로가기 영역 */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px"}}>
                  <h3 className="mb-0 fw-bold text-start">공구 목록</h3>

                  {/* <Link className="fw-bold d-flex align-items-center" style={{ cursor: "pointer" }} to='/proposalWrite'>
                    제안하기<img src="/right.png" alt="뒤로가기" className="back" style={{ width: "20px", height: "20px", marginLeft: "5px" }}/></Link> */}
                </div>

              </div>
            </div>
             {/* 전체 폭 가로선 */}
            {/* <hr style={styles.fullWidthHr} /> */}
            
            {/* 카테고리, 정렬, 진행상태 위치 */}
            <div style={styles.pageWrapper}>
                <div style={styles.container2}>

                    {/* 카테고리 줄 */}
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
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
                    <hr style={{color:"#B5B1B1"}}/>
                    {/* 정렬 줄 */}
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
                        <div style={{ width: "120px", fontWeight: "bold" }}>정렬</div>

                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            <span style={styles.tag}>최신순</span>
                            <span style={styles.tagWhite}>마감임박순</span>
                        </div>
                    </div>
                    <hr style={{color:"#B5B1B1"}}/>
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

            {/* 카테고리, 정렬, 진행상태 위치 */}
            <div style={styles.pageWrapper}>
                <div style={styles.container} >
                    <div style={{display:'grid', gap:"20px", gridTemplateColumns: "repeat(4, 1fr)"}}>
                        {Array.from({ length: 8 }).map((_, idx) => (
                        <Card key={idx} style={{width: '240px', boxShadow: "0 5px 20px rgba(88 88 88 / 20%)", border:'none' }} onClick={() => navigate("/gbProductDetail")}>
                            <img alt="Sample" src="https://picsum.photos/300/200"/>
                            <CardBody >
                                <CardTitle tag="h5" style={{display:'flex', justifyContent:'space-between'}}>
                                    <div style={{border:'1px solid black', fontSize:'10px', padding:"5px"}}>카테고리</div>
                                    <div style={{backgroundColor:'#BBFFAC', color:'#0A8F30', fontSize:'10px' , padding:"5px"}}>진행중</div>
                                </CardTitle>
                                <CardSubtitle className="mb-2 text-muted" tag="h6">
                                    <div style={{fontSize:'14px'}}>자캣 이름</div>
                                </CardSubtitle>
                                <CardSubtitle>
                                    <div style={{fontSize:'12px'}}>더블 브레스티드 블레이저, 울, 프린스 오브 
                                        웨일스, 장식 부착 없음, 라펠, 롱 슬리브, 안감
                                        있음, 버튼...
                                    </div>
                                </CardSubtitle>
                                    <div className="fw-bold" style={{fontSize:'24px'}}>10000원</div>
                                <CardSubtitle>
                                    <div>
                                    <img src="/CountingStars.png" style={{width:'12px', marginRight:'5px'}}/>
                                    <Label style={{fontSize:'12px'}}>4.6</Label>
                                    </div>
                                </CardSubtitle>
                                <CardSubtitle>
                                    <div style={{justifyContent:'space-between', display:'flex'}}>
                                        <div>
                                            <img src="/person.png" style={{width:'15px', marginRight:'5px'}}/>
                                            <Label style={{fontSize:'12px'}}>참여 인원 : 13/15</Label>
                                        </div>
                                        <div>
                                            <Label style={{color:'red', fontSize:'10px'}}>2일 23: 46: 23</Label>
                                        </div>
                                    </div>
                                </CardSubtitle>
                            </CardBody>
                        </Card>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
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