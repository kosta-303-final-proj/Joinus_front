import { Label, Button, Input, FormGroup} from "reactstrap";
import { Link, Outlet, useParams ,useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { baseUrl, myAxios } from "../../../config";

export default function GBProductDetail() {
    const { id } = useParams();
    const [detail, setDetail] = useState({ product: {}, category: {}, thumbnailFile: {}, images: [], options: []});
    
    const [timeLeft, setTimeLeft] = useState("");
    const [selectedOptions, setSelectedOptions] = useState({});

    // 기존 코드 안에 넣기
    const [showAllDetails, setShowAllDetails] = useState(false);
    
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
  /*=============== 인원이 맞춰지면 버튼 클릭 x ===============*/ 
  const isClosed =
    (detail.product.participants || 0) >=
    (detail.product.minParticipants || Infinity);

  

  const submit = (quantity = 1) => {
    

    const selectedIds = Object.values(selectedOptions); // 선택된 모든 옵션
    if (selectedIds.includes("") || selectedIds.length !== Object.keys(optionGroups).length) {
        alert("모든 옵션을 선택해주세요");
        return;
    }
    const userInfo =
      JSON.parse(sessionStorage.getItem("userInfo"))
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
        alert("해당 옵션과 상품은 장바구니에 있습니다");
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

    // 서브 이미지 클릭 시
    const handleSubImageClick = (index) => {
        setDetail(prev => {
            // 대표 이미지와 서브 이미지 위치 교체
            const newImages = [...prev.images];
            const temp = prev.thumbnailFile;
            newImages[index] = temp;          // 클릭한 서브 이미지 자리에 대표 이미지 넣기
            return {
                ...prev,
                thumbnailFile: prev.images[index], // 대표 이미지 변경
                images: newImages,
            };
        });
    };

    return(
        <>
            <div style={styles.pageWrapper}>
          <div style={styles.container}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" ,gap:'10px'}}>
              <Link to="/gbProductList" style={{ textDecoration: 'none', color: 'black', display: "flex", alignItems: "center",gap:'10px' }}>
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
                      src={`${baseUrl}/files/${detail.thumbnailFile?.fileName}`} 
                      style={{width:'500px', height:"500px", border:'2px solid #000'}}
                    />
                </div>

                <div style={{width:"500px", border:'2px solid #000', padding:'20px'}}>
                    <div style={{ display:'flex', justifyContent: 'space-between', marginBottom:'10px'}}>
                        <div style={{border:'1px solid #000', padding:'4px 8px', fontSize:'12px', fontWeight:'bold'}}>
                          {detail.category.name}
                        </div>
                        <div style={{fontSize:'12px'}}>
                          {detail.product.createdAt?.substring(0, 10)}
                        </div>
                    </div>

                    <Label style={{fontSize:"20px", fontWeight:'bold'}}>
                      {detail.product.name}
                    </Label>

                    <div style={{marginTop:'10px'}}>
                        <Label style={{fontSize:"22px", fontWeight:'bold'}}>
                          {((detail.product.price || 0) + (detail.product.abroadShippingCost || 0)).toLocaleString()}원
                        </Label>
                    </div>

                    <hr style={{border:'1px solid #000', margin:'20px 0'}}/>

                    <div style={{display:'flex', alignItems:'center'}}>
                        <img src="/clock.png" style={{width:'22px', marginRight:'8px'}}/>
                        <Label style={{color:'#C40000', fontSize:'14px', fontWeight:'bold'}}>
                          {timeLeft || (detail.product?.endDate ? detail.product.endDate.substring(0, 10) : "")}
                        </Label>
                    </div>

                    <div style={{display:'flex', alignItems:'center', marginTop:'5px'}}>
                        <img src="/person.png" style={{width:'22px', marginRight:'6px'}}/>
                        <Label style={{fontSize:'12px'}}>
                          참여 인원 : {(detail.product.participants || 0).toLocaleString()}
                          /{(detail.product.minParticipants || 0).toLocaleString()}
                        </Label>
                    </div>

                    <div style={{marginTop:'8px'}}>
                        <div style={{width:"100%", height:'10px', border:'1px solid #000'}}>
                            <div style={{width:`${progress}%`, height:'100%', backgroundColor:'#000'}} />
                        </div>
                    </div>

                    <hr style={{border:'1px solid #000', margin:'20px 0'}}/>

                    <Label className="fw-bold" style={{fontSize:'12px'}}>
                      옵션선택
                      <div style={{fontSize:'11px', color:'#555', margin:'8px 0'}}>
                        옵션에 따라 가격이 변동될 수 있음
                      </div>
                    </Label>

                    {Object.entries(optionGroups).map(([groupName, options]) => (
                        <FormGroup key={groupName}>
                          <Input
                            type="select"
                            value={selectedOptions[groupName] || ""}
                            style={{border:'2px solid #000'}}
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

                    <hr style={{border:'1px solid #000', margin:'20px 0'}}/>

                    <div style={{fontSize:'14px'}}>
                        <div>상품 가격 {((detail.product.price || 0) + (detail.product.abroadShippingCost || 0)).toLocaleString()}원</div>
                        <div>국내 배송비 {(detail.product.shippingAmount || 0).toLocaleString()}원</div>
                        <div>옵션 추가 금액 {getOptionTotalPrice().toLocaleString()}원</div>
                        <div className="fw-bold" style={{fontSize:'18px', marginTop:'5px'}}>
                          최종 상품 가격 {finalPrice.toLocaleString()}원
                        </div>
                        <div style={{fontSize:'13px', marginTop:'10px'}}>
                          ※ 해외 배송 2~3주, 국내 배송 2~3일 소요
                        </div>
                    </div>

                    <hr style={{border:'1px solid #000', margin:'20px 0'}}/>

                    <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                        <div className="fw-bold" style={{fontSize:'14px'}}>원사이트</div>
                        <Button
                          style={{backgroundColor:PRIMARY_BLUE, color:'#fff', width:"70px", height:"25px", fontSize:"12px", padding:"0", border:'none'}}
                          onClick={() => window.open(detail.product.originalSiteUrl, "_blank")}
                        >
                          바로가기
                        </Button>
                    </div>

                    <hr style={{border:'1px solid #000', margin:'20px 0'}}/>

                    <div style={{display:"flex", alignItems:"center", marginTop:'20px'}}>
                        <img src={isHeart ? "/heart.png" : "/wHeart.png"} style={{width:"22px", marginRight:'8px'}}/>
                        <div style={{fontSize:'22px', marginRight:'20px'}}>{wishCount}</div>

                        <Button
                          style={{backgroundColor: isClosed ? PRIMARY_BLUE_DISABLED : PRIMARY_BLUE, color:'#fff', width:"120px", height:"35px", fontSize:"15px", padding:"0", border:'none'}}
                          onClick={handleWishList}
                          disabled={isClosed}
                        >
                          {isClosed ? "마감" : isHeart ? "취소하기" : "찜하기"}
                        </Button>

                        <img src="/share.png" style={{width:"22px", margin:'0 30px'}}/>

                        <Button
                          style={{backgroundColor: isClosed ? PRIMARY_BLUE_DISABLED : PRIMARY_BLUE, color:'#fff', width:"120px", height:"35px", fontSize:"15px", padding:"0", border:'none'}}
                          onClick={() => submit()}
                          disabled={isClosed}
                        >
                          장바구니
                        </Button>

                        <Button
                          onClick={handleParticipate}
                          disabled={isClosed}
                          style={{
                            backgroundColor: isClosed ? PRIMARY_BLUE_DISABLED : PRIMARY_BLUE,
                            color: "#fff",
                            width: "120px",
                            height: "35px",
                            fontSize: "15px",
                            padding: "0",
                            border: "none",
                            cursor: isClosed ? "not-allowed" : "pointer",
                            marginLeft: "10px",
                          }}
                        >
                          {isClosed ? "마감" : "참여하기"}
                        </Button>

                    </div>
                </div>
            </div>
          </div>
        </div>

        <div style={styles.pageWrapper}>
            <div style={styles.container}>
                <div style={{ display: "flex", gap: "45px", flexWrap: "wrap" }}>
                    {detail.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={`${baseUrl}/files/${img.fileName}`}
                        style={{width:"220px", border:'1px solid #000', cursor:"pointer"}}
                        onClick={() => handleSubImageClick(idx)}
                      />
                    ))}
                </div>
            </div>
        </div>
        <div style={styles.pageWrapper}>
            <div style={styles.container}>
              <hr/>
           </div>
        </div>

        
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              backgroundColor: "#fff",
              gap: "20px",
              padding: "20px 0",
            }}
          >
            {/* 이미지 리스트 */}
            {detail.details && detail.details.length > 0 && (
              <>
                {/* 첫 번째 이미지 */}
                <div
                  style={{
                    width: "100%",
                    maxWidth: "800px",
                    height: "auto",
                    maxHeight: "800px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={`${baseUrl}/files/${detail.details[0].fileName}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      cursor: "default",
                      pointerEvents: "none",
                    }}
                  />
                </div>

                {/* 나머지 이미지 */}
                {showAllDetails &&
                  detail.details.slice(1).map((img, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: "100%",
                        maxWidth: "800px",
                        height: "auto",
                        maxHeight: "800px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={`${baseUrl}/files/${img.fileName}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          cursor: "default",
                          pointerEvents: "none",
                        }}
                      />
                    </div>
                  ))}
              </>
            )}

            {/* 더보기 / 접기 버튼을 이미지 영역과 분리 */}
            {detail.details && detail.details.length > 1 && (
              <div style={{ marginTop: "10px" }}> {/* 이미지와 버튼 사이 공백 */}
                <button
                  onClick={() => setShowAllDetails(!showAllDetails)}
                  style={{
                    padding: "8px 16px",
                    fontSize: "14px",
                    cursor: "pointer",
                    border: "1px solid #000",
                    backgroundColor: "#fff",
                  }}
                >
                  {showAllDetails ? "접기" : "더보기"}
                </button>
              </div>
            )}
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

const PRIMARY_BLUE = "#7693FC";
const PRIMARY_BLUE_DISABLED = "#C7D2FE";


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
