
import { Label } from "reactstrap";
import { Link, useParams,Outlet} from "react-router-dom";

export default function Reviews(){
    const { id } = useParams();
    return(
        <>
        <div>
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <div style={{display: 'flex',justifyContent: 'space-between',alignItems: 'center',width: '860px',}}>
                        <div style={{  padding: '5px 0' }}><Link to={`/gbProductDetail/${id}/detailInfo`} style={{color:'black'}}>
                        <Label style={{ fontWeight: 'bold', margin: '0', width:'255px', textAlign:'center'}}>상품 설명</Label></Link>
                        </div>
                        <div style={{background: '#E5EEFF', padding: '5px 0' }}><Link to={`/gbProductDetail/${id}/reviews`} style={{color:'black'}}>
                        <Label style={{ fontWeight: 'bold', margin: '0',width:'255px', textAlign:'center' }}>리뷰</Label></Link>
                        </div>
                        <div style={{  padding: '5px 0' }}><Link to={`/gbProductDetail/${id}/qAndA`} style={{color:'black'}}>
                        <Label style={{ fontWeight: 'bold', margin: '0', width:'255px', textAlign:'center'}}>Q & A</Label></Link>
                        </div>
                        <div style={{ padding: '5px 0' }}><Link to={`/gbProductDetail/${id}/policy`} style={{color:'black'}}>
                        <Label style={{ fontWeight: 'bold', margin: '0',width:'255px', textAlign:'center' }}>배송/환뷸 규칙</Label></Link>
                        </div>
                    </div>
                    <hr style={{marginTop:'0'}}/>
                </div>
            </div>
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <div style={{padding:"0 20px", display:'flex', gap:'10px'}}>
                        <div>최신순</div>
                        <div>평점 높은 순</div>
                        <div>평점 낮음 순</div>
                    </div>
                    <hr />                    
                    <div style={{padding:" 0 20px"}}>
                        <div className="fw-bold" style={{fontSize:'16px'}}>닉네임</div>
                        <div style={{display:'flex'}}>
                            <img src="/star.png" style={{width:"20px"}}/>
                            <img src="/star.png" style={{width:"20px"}}/>
                            <img src="/banStar.png" style={{width:"20px"}}/>
                            <img src="/whStar.png" style={{width:"20px"}}/>
                            <img src="/whStar.png" style={{width:"20px", marginRight:'10px'}}/>
                            <div>2025-12-20</div>
                        </div>
                    </div>
                    <div style={{padding:" 0 20px"}}>1+1가성비가 좋은 상품입니다. 끈적임이 없어서 애용해요</div>
                    <hr/>
                    <div style={{padding:" 0 20px"}}>
                        <div className="fw-bold" style={{fontSize:'16px'}}>닉네임</div>
                        <div style={{display:'flex'}}>
                            <img src="/star.png" style={{width:"20px"}}/>
                            <img src="/star.png" style={{width:"20px"}}/>
                            <img src="/banStar.png" style={{width:"20px"}}/>
                            <img src="/whStar.png" style={{width:"20px"}}/>
                            <img src="/whStar.png" style={{width:"20px", marginRight:'10px'}}/>
                            <div>2025-12-20</div>
                        </div>
                    </div>
                    <div style={{padding:" 0 20px"}}>1+1가성비가 좋은 상품입니다. 끈적임이 없어서 애용해요</div>
                    <hr/>
                </div>
            </div>
            <Outlet context={{ id }} />
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
    padding: "0 20px",
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