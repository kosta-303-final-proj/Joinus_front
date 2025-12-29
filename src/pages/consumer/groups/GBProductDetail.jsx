import { Label, Button, Input, FormGroup } from "reactstrap";
import { Link, Outlet, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { baseUrl, myAxios } from "../../../config";

export default function GBProductDetail() {
  const { id } = useParams();
  const [detail, setDetail] = useState({ product: {}, category: {}, thumbnailFile: {}, images: [], options: [] });
  const [quantity, setQuantity] = useState(1);

  const [timeLeft, setTimeLeft] = useState("");
  const [selectedOptions, setSelectedOptions] = useState({});

  // 기존 코드 안에 넣기
  const [showAllDetails, setShowAllDetails] = useState(false);
  const [isTimeOver, setIsTimeOver] = useState(false);

  const navigate = useNavigate();

  /* ================ 로그인 필요 ================*/ 
  const checkLogin = () => {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
    if (!userInfo.username) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return false;
    }
    return true;
  };

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
        color: '#1976D2'
      }
    };

    return styles[categoryName] || {
      backgroundColor: '#F5F5F5',
      color: '#757575',
      border: '1px solid #E0E0E0'
    };
  };

  const handleParticipate = () => {
    if (!checkLogin()) return;
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
        quantity: quantity,
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
  useEffect(() => {
    if (!detail.product.endDate) return;

    const end = new Date(detail.product.endDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = end - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft("종료");
        setIsTimeOver(true);
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
  const getProduct = () => {
    myAxios().get(`/gbProductDetail/${id}`)
      .then(res => {
        console.log(res)
        setDetail(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    getProduct();
  }, [])


  

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



  const submit = () => {
    if (!checkLogin()) return;
    const selectedIds = Object.values(selectedOptions);
    if (selectedIds.includes("") || selectedIds.length !== Object.keys(optionGroups).length) {
      alert("모든 옵션을 선택해주세요");
      return;
    }
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    const memberUsername = userInfo.username;

    myAxios().post(`/addCart`, {
      username: memberUsername,
      gbProductId: detail.product.id,
      gbProductOptionIds: selectedIds.map(id => Number(id)),
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
      params: { username: memberUsername, gbProductId: id }
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
        params: { productId: id, username: memberUsername }
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

  return (
    <>
      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          <div style={{
            display: "flex",
            alignItems: "center",
            padding: "4px 0",
          }}>
            <Link
              to="/"
              style={{
                textDecoration: 'none',
                color: '#666',
                display: "flex",
                alignItems: "center",
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#4A90E2'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ marginRight: '8px' }}
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              홈
            </Link>

            <span style={{ margin: '0 10px', color: '#ccc' }}>›</span>

            <Link
              to="/gbProductList"
              style={{
                textDecoration: 'none',
                color: '#666',
                display: "flex",
                alignItems: "center",
                gap: '8px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#4A90E2'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
            >
              <img
                src="/logo.svg"
                alt="공구"
                style={{
                  width: '20px',
                  height: '20px',
                }}
              />
              공구 목록으로
            </Link>
          </div>

        </div>
      </div>

      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          <div style={{ display: "flex", justifyContent: 'space-between', marginBottom: "20px", gap: '30px' }}>
            <div>
              <img
                src={`${baseUrl}/files/${detail.thumbnailFile?.fileName}`}
                style={{ width: '520px', height: "500px", border: '2px solid #ffffffff' }}
              />


              <div style={{ margin: '20px 0 12px 0' }}>
                {/* <div style={{ fontSize: '14px', fontWeight: '600', color: '#1b1b1bff', margin: '12px 0'}}>
                현재 진행률
              </div>  */}
                <div style={{ width: "100%", height: '10px', border: '1px solid #7e7f80ff', borderRadius: '4px' }}>
                  <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#000' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* 왼쪽: 마감 시간 */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src="/clock.png" style={{ width: '22px', marginRight: '8px' }} />
                  <Label style={{ color: '#C40000', fontSize: '14px', fontWeight: 'bold', margin: 0 }}>
                    {timeLeft || (detail.product?.endDate ? detail.product.endDate.substring(0, 10) : "")}
                  </Label>
                </div>

                {/* 오른쪽: 참여 인원 */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src="/person.png" style={{ width: '22px', marginRight: '6px' }} />
                  <Label style={{ fontSize: '12px', margin: 0 }}>
                    참여 인원: {(detail.product.participants || 0).toLocaleString()}/{(detail.product.minParticipants || 0).toLocaleString()}
                  </Label>
                </div>
              </div>
              {/* <hr style={{ border: '1px solid #959596ff', margin: '12px 0' }} /> */}
            </div>

            <div style={{ width: "500px", border: '2px solid #ffffffff', padding: '8px 4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{
                  display: 'inline-block',
                  padding: '4px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  ...getCategoryStyle(detail.category.name)
                }}>
                  {detail.category.name}
                </div>
                <div style={{ fontSize: '12px', color: '#8f8f8fff' }}>
                  {detail.product.createdAt?.substring(0, 10)}
                </div>
              </div>

              <Label style={{ fontSize: "20px", fontWeight: 'bold' }}>
                {detail.product.name}
              </Label>

              <div style={{ marginTop: '10px' }}>
                <Label style={{ fontSize: "22px", fontWeight: 'bold' }}>
                  {((detail.product.price || 0) + (detail.product.abroadShippingCost || 0)).toLocaleString()}원
                </Label>
              </div>


              {Object.keys(optionGroups).length > 0 && (
                <>
                  <hr style={{ border: '1px solid #959596ff', margin: '20px 0' }} />

                  <Label className="fw-bold" style={{ fontSize: '14px' }}>
                    옵션선택
                    <div style={{ fontSize: '11px', color: '#8f8f8fff', margin: '8px 0', fontWeight: '500' }}>
                      옵션에 따라 가격이 변동될 수 있음
                    </div>
                  </Label>

                  {Object.entries(optionGroups).map(([groupName, options]) => (
                    <FormGroup key={groupName}>
                      <Input
                        type="select"
                        value={selectedOptions[groupName] || ""}
                        style={{ border: '1px solid #b4b4b4ff' }}
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

                  {/* 수량 선택 추가함 */}
                  <FormGroup style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <Label className="fw-bold" style={{ fontSize: '14px', margin: 0 }}>
                        수량
                      </Label>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d0d0d0', borderRadius: '6px', overflow: 'hidden' }}>
                        <button
                          type="button"
                          onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                          style={{
                            width: '36px',
                            height: '36px',
                            border: 'none',
                            borderRight: '1px solid #d0d0d0',
                            backgroundColor: '#fff',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#666',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}
                        >
                          −
                        </button>
                        <input
                          type="text"
                          value={quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 1;
                            setQuantity(Math.max(1, value));
                          }}
                          min="1"
                          style={{
                            width: '60px',
                            height: '36px',
                            textAlign: 'center',
                            border: 'none',
                            fontSize: '14px',
                            fontWeight: '600',
                            outline: 'none',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setQuantity(prev => prev + 1)}
                          style={{
                            width: '36px',
                            height: '36px',
                            border: 'none',
                            borderLeft: '1px solid #d0d0d0',
                            backgroundColor: '#fff',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#666',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </FormGroup>
                </>
              )}

              <hr style={{ border: '1px solid #959596ff', margin: '20px 0' }} />

              {/* 가격 정보 부분 수정 */}
              <div style={{ fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '400', marginBottom: '8px' }}>
                  <span>상품 가격</span>
                  <span>{((detail.product.price || 0) + (detail.product.abroadShippingCost || 0)).toLocaleString()}원</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '400', marginBottom: '8px' }}>
                  <span>국내 배송비</span>
                  <span>{(detail.product.shippingAmount || 0).toLocaleString()}원</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '400', marginBottom: '8px' }}>
                  <span>옵션 추가 금액</span>
                  <span>{getOptionTotalPrice().toLocaleString()}원</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '400', marginBottom: '8px' }}>
                  <span>수량</span>
                  <span>× {quantity}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', marginTop: '20px', marginBottom: '10px' }}>
                  <span>최종 상품 가격</span>
                  <span>{(finalPrice * quantity).toLocaleString()}원</span>
                </div>
                <div style={{ fontSize: '13px', marginTop: '10px', color: '#666' }}>
                  ※ 해외 배송 2~3주, 국내 배송 2~3일 소요
                </div>
              </div>

              <hr style={{ border: '1px solid #959596ff', margin: '20px 0' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="fw-bold" style={{ fontSize: '14px' }}>원사이트</div>
                <Button
                  style={{ backgroundColor: PRIMARY_BLUE, color: '#fff', width: "70px", height: "25px", fontSize: "12px", padding: "0", border: 'none' }}
                  onClick={() => window.open(detail.product.originalSiteUrl, "_blank")}
                >
                  바로가기
                </Button>
              </div>

              <hr style={{ border: '1px solid #959596ff', margin: '20px 0' }} />

              {/* 액션 버튼들 */}
              <div>
                {/* 첫 번째 줄: 하트 + 찜하기 + 장바구니 */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px"
                }}>
                  <img
                    src={isHeart ? "/heart.png" : "/wHeart.png"}
                    style={{ width: "24px", height: "24px" }}
                  />
                  <div style={{ fontSize: '20px', fontWeight: '700', marginRight: '4px' }}>
                    {wishCount}
                  </div>

                  <Button
                    style={{
                      backgroundColor: isHeart ? PRIMARY_BLUE : '#fff',
                      color: isHeart ? '#fff' : '#739FF2',
                      border: isHeart ? 'none' : '1px solid #739FF2',
                      flex: 1,
                      height: "40px",
                      fontSize: "15px",
                      fontWeight: "600",
                      padding: "0",
                      borderRadius: '6px',
                      cursor: isTimeOver ? 'not-allowed' : 'pointer',
                      opacity: isTimeOver ? 0.5 : 1
                    }}
                    onClick={handleWishList}
                    // disabled={isClosed}
                  >
                    {isHeart ? "찜 취소" : "찜하기"}
                  </Button>

                  <img src="/share.png" style={{ width: "22px", margin: '0 12px' }} />

                  <Button
                    style={{
                      backgroundColor: PRIMARY_BLUE,
                      color: '#fff',
                      flex: 1,
                      height: "40px",
                      fontSize: "15px",
                      fontWeight: "600",
                      padding: "0",
                      border: 'none',
                      borderRadius: '6px',
                      cursor: isTimeOver ? 'not-allowed' : 'pointer',
                      opacity: isTimeOver ? 0.5 : 1
                    }}
                    onClick={() => submit()}
                    // disabled={isClosed}
                  >
                    장바구니
                  </Button>
                </div>

                {/* 두 번째 줄: 참여하기 (전체 너비) */}
                <Button
                  onClick={handleParticipate}
                  disabled={isTimeOver}   // ✅ 시간 종료만 막기
                  style={{
                    backgroundColor: isTimeOver ? '#999' : '#000',
                    color: "#fff",
                    width: "100%",
                    height: "52px",
                    fontSize: "16px",
                    fontWeight: "700",
                    marginTop: "8px",
                    padding: "0",
                    border: "none",
                    borderRadius: '6px',
                    cursor: isTimeOver ? 'not-allowed' : 'pointer',
                    opacity: isTimeOver ? 0.5 : 1
                  }}
                >
                  {isTimeOver ? "종료된 공동구매입니다" : "참여하기"}
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
                style={{ width: "220px", border: 'none', cursor: "pointer" }}
                onClick={() => handleSubImageClick(idx)}
              />
            ))}
          </div>
        </div>
      </div>
      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          <hr />
        </div>
      </div>





      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          <div style={{ flex: 1, paddingTop: '10px', width: '1020px' }}>
            <Outlet context={{
              showAllDetails,
              setShowAllDetails,
              details: detail.details
            }} />
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
    padding: "8px 0",
  },
  container2: {
    width: "1020px",
    padding: "20px 0",
    marginTop: '10px'
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
    border: "1px solid #000",
    padding: "5px 12px",
    fontSize: "14px",
    cursor: "pointer",
  }
};
