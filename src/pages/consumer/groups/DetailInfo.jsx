import { useEffect, useState } from "react";
import { Link, useParams, Outlet } from "react-router-dom";
import { Button, Label, } from "reactstrap";
import { myAxios } from "../../../config";
export default function DetailInfo(){
    const { id } = useParams();
    const [detail, setDetail] = useState({ product: {}, category: {}, thumbnailFile: {}, images: [], options: []});

    const [expanded, setExpanded] = useState(false);

    const getProduct =()=>{
          myAxios().get(`/gbProductDetail/${id}`)
          .then(res=>{
            console.log(res)
            setDetail(res.data)
          })
          .catch(err=>{
            console.log(err)
          })
        }
    
        useEffect(()=>{
          getProduct();
        },[])

    const getProposalUrl = () => {
      myAxios().get(`getProductUrl/${id}`)
    }

    const description = detail.product.description || "";
    const limit = 200; // 200글자 이상이면 접기/펼치기 적용
    const isLong = description.length > limit;
    const displayedText = expanded || !isLong ? description : description.substring(0, limit) + "...";

    return(
        <>
        <div>
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <div style={{display: 'flex',justifyContent: 'space-between',alignItems: 'center',width: '860px',}}>
                        <div style={{background: '#E5EEFF',  padding: '5px 0' }}>
                        <Label style={{ fontWeight: 'bold', margin: '0', width:'255px', textAlign:'center'}}>상품 설명</Label>
                        </div>
                        <div style={{ padding: '5px 0' }}><Link to={`/gbProductDetail/${id}/reviews`} style={{color:'black'}}>
                        <Label style={{ fontWeight: 'bold', margin: '0',width:'255px', textAlign:'center' }}>리뷰</Label></Link>
                        </div>
                        <div style={{ padding: '5px 0' }}><Link to={`/gbProductDetail/${id}/qAndA`} style={{color:'black'}}>
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
                    <div style={{padding:'0 20px'}}>
                        <Label style={{fontSize:'24px'}}>상품 설명</Label>
                      <div style={{
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            fontSize: "16px",
                            lineHeight: "1.5",
                        }}>
                            {displayedText}
                            {isLong && (
                                <span
                                    onClick={() => setExpanded(!expanded)}
                                    style={{ color: "#739FF2", cursor: "pointer", marginLeft: "5px" }}
                                >
                                    {expanded ? "접기" : "더보기"}
                                </span>
                            )}
                        </div> <br/>
                      <div style={{display:'flex', justifyItems:'center', alignItems:'center'}}>
                        <div className="fw-bold" style={{fontSize:'16px', margin:'10px'}}>제안 링크</div>
                        <Button onClick={()=> window.open(detail.product.originalSiteUrl, "_black")} style={{backgroundColor:'#739FF2', width:"70px", height:"25px", fontSize:"12px", padding:"0", border:'none'}}>바로가기</Button>
                      </div>
                    </div>
                  <hr/>
                    <div style={{padding:'0 20px'}}>
                        <Label style={{fontSize:'24px'}}>가격 계산 방식</Label>
                        <div style={{border:'1px solid #2833D1', backgroundColor:'#F2F9FC', padding:"10px", height:'100px', alignContent:'center'}}>
                          <div>상품가격 + 해외배송비 + 국내배송비</div>
                          <div>※ 환율 변동 및 참여 인원에 따라 최종 가격이 소폭 변동될 수 있습니다.</div> 
                        </div> <br/>
                    </div>
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