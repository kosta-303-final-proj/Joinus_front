import { Label, Button, Input, FormGroup} from "reactstrap";
import { Link, Outlet, useParams ,useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { baseUrl, myAxios } from "../../../config";

export default function GBProductDetail() {
    const { id } = useParams();
    const [detail, setDetail] = useState({ product: {}, category: {}, thumbnailFile: {}, images: [], options: []});
    
    const [timeLeft, setTimeLeft] = useState("");
    const [selectedOptions, setSelectedOptions] = useState({});
    
    const navigate = useNavigate();
    
    const handleParticipate = () => {
      // 옵션 선택 체크
      const selectedIds = Object.values(selectedOptions);

      if (selectedIds.includes("") || selectedIds.length !== Object.keys(optionGroups).length) {
        alert("모든 옵션을 선택해주세요");
        return;
      }

      // 옵션 선택 완료 → 결제 페이지로 이동
      navigate(`/pay/${detail.product.id}`, {
        state: {
          productId: detail.product.id,
          thumbnail: detail.thumbnailFile?.fileName,
          finalPrice: finalPrice,
          productName: detail.product.name,
          quantity: 1,
          selectedOptions: Object.entries(selectedOptions).map(([groupName, optionId]) => {
            const option = detail.options.find(opt => opt.id === Number(optionId));
            return {
              groupName,
              optionId: Number(optionId),
              optionName: option?.name || "",
              optionPrice: option?.price || 0,
            };
          }),
        },
      });
    };

    /* ========================= 타이머 ========================= */
    useEffect(()=>{
      if (!detail.product.endDate) return;

      const end = new Date(detail.product.endDate).getTime();

      const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = end - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft("종료");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}일 ${hours}시간 ${minutes}분 ${seconds}초`);
    }, 1000);

    return () => clearInterval(interval);
    }, [detail.product.endDate]);


    /* ========================= 상품 조회 ========================= */
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

    /* ========================= 옵션 그룹 ========================= */
    const optionGroups = detail.options.reduce((acc, opt) => {
      if (!acc[opt.groupName]) acc[opt.groupName] = [];
      acc[opt.groupName].push(opt);
      return acc;
  }, {});

  /* ========================= 옵션 가격 계산 ========================= */
  const getOptionTotalPrice = () => {
    const selectedIds = Object.values(selectedOptions);

    return detail.options
      .filter(opt => selectedIds.includes(String(opt.id)))
      .reduce((sum, opt) => sum + (opt.price || 0), 0);
  };

  /* ========================= 가격 계산 ========================= */
  const basePrice =
    (detail.product.price || 0) +
    (detail.product.abroadShippingCost || 0) +
    (detail.product.shippingAmount || 0);

  const finalPrice = basePrice + getOptionTotalPrice();



  

  const submit = (quantity = 1) => {
    

    const selectedIds = Object.values(selectedOptions); // 선택된 모든 옵션
    if (selectedIds.includes("") || selectedIds.length !== Object.keys(optionGroups).length) {
        alert("모든 옵션을 선택해주세요");
        return;
    }
    const userInfo =
      JSON.parse(sessionStorage.getItem("userInfo")) ||
      JSON.parse(localStorage.getItem("userInfo"));
    const memberUsername = userInfo.username;

    myAxios().post(`/addCart`, {
        username: memberUsername,
        gbProductId: detail.product.id,
        gbProductOptionIds: selectedIds.map(id => Number(id)), // 여러 옵션 전달
        quantity: quantity
    })
    .then(res => alert("장바구니에 추가되었습니다."))
    .catch(err => {
        console.error(err);
        alert("장바구니 추가 중 오류 발생");
    });
}

    const [isHeart, setIsHeart] = useState(false);
    const [wishCount, setWishCount] = useState(0);

    /* ========================= 찜하기 ========================= */
    const handleWishList = () => {
      const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
      const memberUsername = userInfo.username;

      if (!memberUsername) {
        alert("로그인 정보가 없습니다.");
        return;
      }
      myAxios().get("/product/productHeart", {
        params: { username: memberUsername, gbProductId: id}
      })
      .then(res => {
        setIsHeart(res.data.isHeart);
        setWishCount(res.data.wishCount);
      })
      .catch(err => console.log(err));
    }

    useEffect(() => {
      const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
      const memberUsername = userInfo.username;

      if (!memberUsername) {
        console.error("로그인 정보 없음");
        return;
      }
      // 페이지 진입 시 하트 상태 + wishCount 가져오기
      myAxios()
        .get("/product/productHeart/status", {
          params: { productId: id,username: memberUsername }
        })
        .then(res => {
          setIsHeart(res.data.isHeart);  // true/false
          setWishCount(res.data.wishCount); // 서버에서 받은 최신 숫자
        })
        .catch(err => console.log(err));
    }, [id]);

const progress =
  detail.product.minParticipants
    ? Math.min(
        (detail.product.participants / detail.product.minParticipants) * 100,
        100
      )
    : 0;

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
                        <img 
                          src={`${baseUrl}/files/${detail.thumbnailFile?.fileName}`} 
                          style={{width:'500px', height:"500px", marginBottom:'30px', borderRadius:'10px'}}
                        />
                    </div>
                    <div style={{width:"500px", border:'1px solid black', padding:'20px', borderRadius:'10px'}}>
                        <div style={{ display:'flex', justifyContent: 'space-between', marginBottom:'10px'}}>
                            <div style={{border:'1px solid black', borderRadius:'5px', fontSize:'12px'}}>{detail.category.name}</div>
                            <div>{detail.product.createdAt?.substring(0, 10)}</div>
                        </div>
                        <div>
                            <Label style={{fontSize:"20px"}}>{detail.product.name}</Label>
                        </div>
                        <div>
                            <Label style={{fontSize:"24px"}}>{((detail.product.price || 0) + (detail.product.abroadShippingCost || 0)).toLocaleString()}원</Label>
                        </div>
                        <hr style={{width:"460px", alignItems:'center', margin:'20px 0 20px 0'}}/>
                        <div style={{display:'flex'}}>
                            <img src="/clock.png" style={{width:'25px', marginRight:'10px'}}/>
                            <Label style={{color:'red', fontSize:'14px'}}> {timeLeft || (detail.product && detail.product.endDate ? detail.product.endDate.substring(0, 10) : "")}
                            </Label>
                        </div>
                        <div style={{display:'flex'}}>
                            <img src="/person.png" style={{width:'25px', marginRight:'5px'}}/>
                            <Label style={{fontSize:'12px'}}>참여 인원 : {(detail.product.participants || 0).toLocaleString()}/{(detail.product.minParticipants || 0).toLocaleString()}</Label>
                        </div>
                        <div style={{flexGrow:1}}>
                            <div style={{width:"450px", height:'10px', backgroundColor:'#AFACEE', borderRadius:'5px',
                                overflow:'hidden', margin:'5px'}}>
                                <div style={{width: `${progress}%`, height:'100%',backgroundColor: '#007BFF',}}></div>
                            </div>
                        </div>
                        <hr style={{width:"460px", alignItems:'center', margin:'20px 0 20px 0'}}/>
                        <div>
                            <Label className="fw-bold" style={{fontSize:'12px', marginTop:'0'}}>옵션선택
                                 <div style={{fontSize:'10px', color:'#ACA5A5',margin:'10px 0 10px 0'}}>옵션에 따라 가격이 변동될 수 있음</div>
                            </Label>
                           {/* 나중에 옵션 map으로 돌려 */}
                            {Object.entries(optionGroups).map(([groupName, options], idx) => (
                                <FormGroup key={groupName}>
                                  <Input
                                    type="select"
                                    value={selectedOptions[groupName] || ""}
                                    onChange={e =>
                                      setSelectedOptions(prev => ({
                                        ...prev,
                                        [groupName]: e.target.value
                                      }))
                                    }
                                  >
                                    <option value="" disabled>{groupName}</option>
                                    {options.map(opt => (
                                      <option key={opt.id} value={opt.id}>
                                        {opt.name} (+{opt.price.toLocaleString()}원)
                                      </option>
                                    ))}
                                  </Input>
                                </FormGroup>
                            ))}
                            <hr style={{width:"460px", alignItems:'center', margin:'20px 0 20px 0'}}/>
                            <div style={{}}>
                                <div style={{fontSize:'14px', marginTop:'0'}}>상품 가격 {((detail.product.price || 0) + (detail.product.abroadShippingCost || 0)).toLocaleString()}원</div>
                                <div style={{fontSize:'14px', marginTop:'0'}}>국내 배송비 {(detail.product.shippingAmount || 0).toLocaleString()}원</div>
                                <div style={{ fontSize: "14px" }}>옵션 추가 금액: {getOptionTotalPrice().toLocaleString()}원</div>
                                <div className="fw-bold" style={{fontSize:'18px', marginTop:'0'}}>최종 상품 가격 {finalPrice.toLocaleString()} 원</div>
                                <br/>
                                <div style={{fontSize:'14px', marginTop:'0'}}>※ 해외 배송 2주~3주 소용, 국내 배송 2-3일 소요</div>
                            </div>
                            <hr style={{width:"460px", alignItems:'center', margin:'20px 0 20px 0'}}/>
                            <div style={{display:'flex', gap:'10px',alignItems: "center"}}>
                                <div className="fw-bold" style={{fontSize:'14px'}}>원사이트</div>
                                <Button style={{backgroundColor:'#739FF2', width:"70px", height:"25px", fontSize:"12px", padding:"0", border:'none'}}
                                  onClick={() => window.open(detail.product.originalSiteUrl, "_blank")}
                                >바로가기</Button>
                            </div>
                            <hr style={{width:"460px", alignItems:'center', margin:'20px 0 20px 0'}}/>
                            <div style={{display:"flex",alignItems: "center", marginTop:'20px'}}>
                                <img src={isHeart ? "/heart.png" : "/wHeart.png"} style={{width:"25px", height:'25px', marginRight:'10px'}}/>
                                  <div style={{fontSize:'24px', marginRight:'20px'}}>{wishCount}</div>
                                  <Button style={{backgroundColor:'#739FF2', width:"120px", height:"35px", fontSize:"16px", padding:"0", border:'none', marginRight:'10px'}}
                                    onClick={handleWishList}
                                  >
                                    {isHeart ? "취소하기" : "찜하기"}
                                  </Button>

                                <img src="/share.png" style={{width:"25px", height:'25px', marginRight:'40px'}}/>
                                <Button style={{backgroundColor:'#739FF2', width:"120px", height:"35px", fontSize:"16px", padding:"0", border:'none', marginRight:'10px'}}
                                  onClick={() => submit()}
                                >장바구니</Button>
                                  <Button  onClick={handleParticipate} style={{backgroundColor:'#F7F7F7', width:"120px", height:"35px", fontSize:"16px", padding:"0", color:'black', border:'1px solid black'}}>참여하기</Button>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <div style={{ display: "flex", gap: "45px", flexWrap: "wrap" }}>
                        {detail.images.map((img, idx) => (
                          <img key={idx} src={`${baseUrl}/files/${img.fileName}`} style={{width:"220px"}} />
                        ))}
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