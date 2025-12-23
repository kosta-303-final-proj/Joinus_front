import { useState, useEffect } from "react";
import { Label, FormGroup, Input, Button } from "reactstrap";
import { Link, useParams, useLocation, useNavigate  } from "react-router-dom";
import { myAxios , baseUrl} from "../../../config";

export default function Pay(){
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
const username = userInfo?.username;
    const [addressType, setAddressType] = useState("new");
    
    const { id } = useParams();
    const location = useLocation();
    const [detail, setDetail] = useState({ product: {}, category: {}, thumbnailFile: {}, images: [], options: []});
    const { productId, thumbnail, finalPrice, productName, quantity, selectedOptions: selectedOptionsFromDetail } = location.state || {};
    const navigate = useNavigate();
    // 🔹 회원 포인트
    const [memberPoint, setMemberPoint] = useState(0);
    // 🔹 사용 포인트
    const [usingPoint, setUsingPoint] = useState(0);

    // const [address, setAddress] = useState

    const [shipRecipient, setShipRecipient] = useState("");
    const [phone, setPhone] = useState("");
    const [postcode, setPostcode] = useState("");
    const [name, setName] = useState(""); // 이름
    const [email, setEmail] = useState(""); // 이메일
    const [streetAddress, setStreetAddress] = useState("");
    const [addressDetail, setAddressDetail] = useState("");
    const [accessInstructions, setAccessInstructions] = useState("");
    const [note, setNote] = useState("");

    //기존 배송지 목록 상태 추가
    const [addressList, setAddressList] = useState([]);
    const [selectedAddressName, setSelectedAddressName] = useState("");

    //
    const resetAddress = () => {
        setShipRecipient("");
        setName("");
        setPhone("");
        setPostcode("");
        setStreetAddress("");
        setAddressDetail("");
        setEmail(userInfo?.email || "");
        setAccessInstructions("");
        setNote("");
    };
    // Pay 내부 상태
    const [optionIds, setOptionIds] = useState(
        selectedOptionsFromDetail?.map(opt => opt.optionId) || []
    );
    const [selectedOptions, setSelectedOptions] = useState(
        selectedOptionsFromDetail || []
    );
    

    const shippingAmount = 0;

    const maxUsablePoint = Math.min(memberPoint, finalPrice + shippingAmount);

    const safeUsingPoint = Math.min(usingPoint, maxUsablePoint);

    const totalAmount = Math.max(finalPrice + shippingAmount - safeUsingPoint, 0);

    const remainingPoint = Math.max(memberPoint - safeUsingPoint, 0);

    const getMemberPoint = () => {
        myAxios().get("/member/detail", { 
            params: { username } 
        })

        .then(res => {
            console.log(res.data);
        setMemberPoint(res.data.pointBalance);
        })
        .catch(err => {
        console.log("회원 포인트 조회 실패", err);
        });
    };
    
    const getAddress = () => {
        myAxios().get("/getAddress", {
            params: { username }
        })
        .then(res => {
            console.log("기존 배송지 데이터:", res.data);
            setAddressList(res.data);

            // 기본 배송지 자동 선택 (있다면)
            const defaultAddr = res.data.find(a => a.defaultAddress);
            if (defaultAddr) {
                setSelectedAddressName(defaultAddr.addressName);
            }
        })
        .catch(err => {
            console.log("기존 배송지 조회 실패", err);
        });
    };

    useEffect(() => {
        if (!selectedAddressName) return;

        const selected = addressList.find(
            addr => addr.addressName === selectedAddressName
        );

        if (!selected) return;

        setShipRecipient(selected.addressName);
        setName(selected.recipientName);
        setPhone(selected.phone);
        setPostcode(selected.postcode);
        setStreetAddress(selected.streetAddress);
        setAddressDetail(selected.addressDetail);
        setAccessInstructions(selected.accessInstructions);
        setEmail(userInfo?.email || "");
        setNote("");
    }, [selectedAddressName, addressList]);

    useEffect(() => {
        if(addressType === "old"){
            getAddress();
        }

        if (addressType === "new") {
            resetAddress();   // ⭐ 핵심
        }
    }, [addressType]);
    
    //상품 상세 조회
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
        getMemberPoint();   // ⭐ 포인트 조회
    },[])


    // 주문 생성 함수 
    const [orderId, setOrderId] = useState(null);
    const createOrder = async () => {
        try {
            const response = await myAxios().post("/orders", {
                member: { username },
                gbProduct: { id: productId },
                optionIds,
                quantity,
                subtotalAmount: finalPrice,
                shippingAmount,
                totalAmount,
                usingPoint,
                shipRecipient,
                email,
                phone,
                postcode, //우편번호
                streetAddress, // 도로명 주소
                addressDetail, //상세주소
                accessInstructions,
                note,
            });
            return response.data.orderId;
        } catch (e) {
            console.log("주문 생성 에러:", e.response?.data || e.message);
            throw e;
        }
    };

    // ===============================
    // 다음 주소 검색
    // ===============================
    const openDaumPostcode = () => {
        if (!window.daum || !window.daum.Postcode) {
            alert("주소 검색 서비스를 불러오지 못했습니다.");
            return;
        }

        new window.daum.Postcode({
            oncomplete: function (data) {
            setPostcode(data.zonecode);       // 우편번호
            setStreetAddress(data.roadAddress); // 도로명 주소
            },
        }).open();
    };

    const validateShippingInfo = () => {
        if (!shipRecipient.trim()) {
            alert("배송지명을 입력해주세요.");
            return false;
        }
        if (!name.trim()) {
            alert("이름을 입력해주세요.");
            return false;
        }
        if (!phone.trim()) {
            alert("전화번호를 입력해주세요.");
            return false;
        }
        if (!postcode || !streetAddress) {
            alert("주소를 검색해주세요.");
            return false;
        }
        if (!addressDetail.trim()) {
            alert("상세주소를 입력해주세요.");
            return false;
        }
        if (!email.trim()) {
            alert("이메일을 입력해주세요.");
            return false;
        }
        return true;
    };
    


    return(
        <>
            <div style={styles.pageWrapper}>
                <div style={styles.container2}>
                    <div style={{border:'none', height:"100px", display:'flex'}}>
                        <div style={{border:'none', width:"100px", height:'100px', backgroundColor:'#d9d9d9', justifyContent:'center',display:'flex',alignItems: 'center'}}>
                            <img src='/check.png' style={{width:'50px', height:'50px'}}/>
                        </div>
                        <div style={{border:'none', width:'920px', height:'100px', backgroundColor:'#F7F7F7', padding:'10px 20px'}}>
                            <div className="fw-bold" style={{fontSize:'24px'}}>주의</div>
                            <div style={{fontSize:'12px'}}>결제 전에 주문정보와 배송지를 반드시 확인해주세요. 입력된 정보가 정확하지 않으면 배송 지연이나 통관 문제가 발생할 수 있습니다.</div>
                            <div style={{fontSize:'12px'}}>결제 후에는 주문 정보 변경이 불가합니다. 배송지, 수량, 결제 수단을 다시 한 번 확인해주세요.</div>
                        </div>
                    </div>
                    <br/><br/>
                    <div style={{ border: "1px solid black" , borderRadius:'5px'}}>
                        {/* 1행(헤더) */}
                        <div style={{display: "flex", borderBottom: "1px solid black", height: "32px", fontSize:'12px'}}>
                            <div style={{ flex: 1, borderRight: "1px solid black", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor:'#E5EEFF' }}>주문일자</div>
                            <div style={{ flex: 2, borderRight: "1px solid black", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor:'#E5EEFF' }}>상품정보</div>
                            <div style={{ flex: 1, borderRight: "1px solid black", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor:'#E5EEFF' }}>수량</div>
                            <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor:'#E5EEFF' }}>가격</div>
                        </div>

                        {/* 2행(내용) */}
                        <div style={{ display: "flex", height: "118px", fontSize:'12px' }}>
                            <div style={{ flex: 1, borderRight: "1px solid black", display: "flex", justifyContent: "center", alignItems: "center" }}>{new Date().toISOString().slice(0,10)}</div>
                            <div style={{flex: 2,borderRight: "1px solid black",display: "flex",alignItems: "center",gap: "10px",}}>
                                <img src={`${baseUrl}/files/${thumbnail}`} style={{ width: "60px", height: "60px", marginLeft:'20px' }} />
                                <div>{productName}</div>
                            </div>
                            <div style={{ flex: 1, borderRight: "1px solid black", display: "flex", justifyContent: "center", alignItems: "center" }}>{quantity}</div>
                            <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>{finalPrice?.toLocaleString()}원</div>
                        </div>
                    </div>
                </div>
            </div>
            {/* 배송지 + 오른쪽 박스 2개 */}
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    
                    {/* 왼쪽 배송지 박스 */}
                    
                        {/* 왼쪽 배송지 박스 */}
                        <div style={{ border: '1px solid black', overflow: 'hidden', width: '500px' }}>
                            <div style={row}>
                            <div style={leftCol}>배송지 선택</div>
                            <div style={rightCol}>
                            <FormGroup tag="fieldset" style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                                <FormGroup check style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                <Input
                                    name="addressType"
                                    type="radio"
                                    value="new"
                                    checked={addressType === "new"}
                                    onChange={() => setAddressType("new")}
                                />
                                <Label check>신규 배송지</Label>
                                </FormGroup>

                                <FormGroup check style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                <Input
                                    name="addressType"
                                    type="radio"
                                    value="old"
                                    checked={addressType === "old"}
                                    onChange={() => setAddressType("old")}
                                />
                                <Label check>기존 배송지</Label>
                                </FormGroup>
                            </FormGroup>

                            {addressType === "old" && (
                                <FormGroup>
                                    <Input
                                        type="select"
                                        value={selectedAddressName}
                                        onChange={(e) => setSelectedAddressName(e.target.value)}
                                        style={{ fontSize: "12px", width: "150px" }}
                                    >
                                        <option value="">배송지 선택</option>
                                        {addressList.map(addr => (
                                            <option key={addr.id} value={addr.addressName}>
                                                {addr.addressName}
                                            </option>
                                        ))}
                                    </Input>
                                </FormGroup>
                            )}
                            </div>
                        </div>

                        {/* 배송지명 */}
                        <div style={row}>
                            <div style={leftCol}>배송지명</div>
                            <div style={rightCol}>
                            <Input
                                value={shipRecipient}
                                onChange={(e) => setShipRecipient(e.target.value)}
                                style={{ fontSize: "12px", height: "20px" }}
                                placeholder="배송지명 입력"
                            />
                            </div>
                        </div>

                        {/* 이름 */}
                        <div style={row}>
                            <div style={leftCol}>이름</div>
                            <div style={rightCol}>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{ fontSize: "12px", height: "20px" }}
                            />
                            </div>
                        </div>
                        {/* 주소 */}
                        <div style={row}>
                        <div style={leftCol}>주소</div>
                            <div style={rightCol}>
                                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                {/* 우편번호 + 도로명 주소 표시 */}
                                <Input
                                    type="text"
                                    readOnly
                                    value={postcode ? `[${postcode}] ${streetAddress}` : ""}
                                    placeholder="[우편번호] 주소"
                                    style={{ flex: 1, fontSize: "12px", height: "20px" }}
                                />
                                <button
                                    type="button"
                                    style={{
                                    fontSize: "12px",
                                    height: "20px",
                                    padding: "0 5px",
                                    whiteSpace: "nowrap",
                                    }}
                                    onClick={openDaumPostcode}
                                >
                                    주소 검색
                                </button>
                                </div>

                                {/* 상세주소 입력 */}
                                <Input
                                type="text"
                                value={addressDetail}
                                onChange={(e) => setAddressDetail(e.target.value)}
                                style={{ width: "100%", marginTop: "5px", fontSize: "12px", height: "20px" }}
                                placeholder="상세주소를 입력하세요."
                                />
                            </div>
                        </div>
      

                        {/* 이메일 */}
                        <div style={row}>
                            <div style={leftCol}>이메일</div>
                            <div style={rightCol}>
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ fontSize: "12px", height: "20px" }}
                                placeholder="이메일 입력"
                            />
                            </div>
                        </div>

                        {/* 전화번호 */}
                        <div style={row}>
                            <div style={leftCol}>전화번호</div>
                            <div style={rightCol}>
                            <Input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                style={{ fontSize: "12px", height: "20px" }}
                                placeholder="예) 010-1234-5678"
                            />
                            </div>
                        </div>

                        {/* 출입방법 */}
                        <div style={row}>
                            <div style={leftCol}>출입방법</div>
                            <div style={rightCol}>
                            <Input
                                type="textarea"
                                value={accessInstructions}
                                onChange={(e) => setAccessInstructions(e.target.value)}
                                style={{ fontSize: "12px", height: "20px", resize: "none" }}
                            />
                            </div>
                        </div>

                        {/* 요청사항 */}
                        <div style={row}>
                            <div style={leftCol}>요청사항</div>
                            <div style={rightCol}>
                            <Input
                                type="textarea"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                style={{ fontSize: "12px", height: "50px", resize: "none" }}
                                placeholder="배송 요청사항"
                            />
                            </div>
                        </div>
                        </div>

                        {/* 오른쪽 박스 3개 */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ border: '1px solid black', width: '500px', height: '145px' }}>
                                <div style={row}>
                                    <div style={{width: '128px',padding: '5px',fontWeight: 'bold',borderRight: '1px solid #A09B9B',display: 'flex',          
                                        alignItems: 'center',justifyContent: 'center',textAlign: 'center', fontSize:'12px', height:'35px'}}>
                                        포인트
                                    </div>
                                    <div style={{flex: 1,flexDirection: 'column',display:'flex',padding: '5px', justifyContent:'center'}}></div>
                                </div>
                                <hr style={{border:'1px solid black', margin:'0'}}/>
                                <div style={row}>
                                    <div style={{width: '128px',padding: '5px',fontWeight: 'bold',borderRight: '1px solid #A09B9B',display: 'flex',          
                                        alignItems: 'center',justifyContent: 'center',textAlign: 'center', fontSize:'12px', height:'34px'}}>보유 포인트</div>
                                    <div style={{flex: 1, flexDirection: 'column', display:'flex',padding: '5px', justifyContent:'center', color:'#5173D2'}}>{memberPoint.toLocaleString()}p</div>
                                </div>
                                <div style={row}>
                                    <div style={{width: '128px',padding: '5px',fontWeight: 'bold',borderRight: '1px solid #A09B9B',display: 'flex',          
                                        alignItems: 'center',justifyContent: 'center',textAlign: 'center', fontSize:'12px', height:'35px'}}>사용 포인트</div>
                                    <div style={{flex: 1, flexDirection: 'column', display:'flex',padding: '5px', justifyContent:'center'}}>
                                        <Input
                                            type="number"
                                            style={{ fontSize: '12px', height: '20px' }}
                                            value={usingPoint}
                                            onChange={(e) => {
                                                const value = e.target.value;

                                                // ✅ 완전히 지운 경우
                                                if (value === "") {
                                                setUsingPoint("");
                                                return;
                                                }

                                                const num = Number(value);

                                                if (isNaN(num)) return;

                                                // ✅ 최대 사용 포인트 제한
                                                setUsingPoint(Math.min(num, maxUsablePoint));
                                            }}
                                            placeholder="사용할 포인트"
                                            />
                                    </div>
                                </div>
                                <div style={row}>
                                    <div style={{width: '128px',padding: '5px',fontWeight: 'bold',borderRight: '1px solid #A09B9B',display: 'flex',          
                                        alignItems: 'center',justifyContent: 'center',textAlign: 'center', fontSize:'12px', height:'34px'}}>남은 포인트</div>
                                    <div style={{flex: 1, flexDirection: 'column', display:'flex',padding: '5px', justifyContent:'center', color:'#5173D2'}}>{remainingPoint.toLocaleString()}p</div>
                                </div>
                            </div>
                            <div style={{ border: '1px solid black', width: '500px', height: '190px' }}>
                                <div style={row}>
                                    <div className="fw-bold" style={{width: '500px',padding: '10px',fontWeight: 'bold',display: 'flex',          
                                        alignItems: 'center',textAlign: 'center', fontSize:'20px', height:'45px', justifyContent:'center'}}>
                                        결제 금액
                                    </div>
                                </div>
                                <div style={{padding:'5px', fontSize:'12px'}}>
                                    <div style={{padding:'3px', justifyContent:'space-between',display:'flex'}}>
                                        <div>상품 가격</div>
                                        <div>{finalPrice?.toLocaleString()}</div>
                                    </div>
                                    <div style={{padding:'3px', justifyContent:'space-between',display:'flex'}}>
                                        <div>국내 배송비</div>
                                        <div>{shippingAmount.toLocaleString()}</div>
                                    </div>
                                    <div style={{padding:'3px', justifyContent:'space-between',display:'flex'}}>
                                        <div>포인트 사용</div>
                                        <div>- {usingPoint.toLocaleString()}</div>
                                    </div>
                                </div>
                                <hr style={{border:'1px solid black', margin:'0'}}/>
                                <div style={{padding:'5px', fontSize:'12px'}}>
                                    <div style={{padding:'3px', justifyContent:'space-between',display:'flex'}}>
                                        <div style={{padding:'3px', justifyContent:'space-between',display:'flex'}}>
                                            <div style={{color:'red'}}>총 주문 금액</div>
                                            <div>{totalAmount.toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button style={{ fontSize: '12px', backgroundColor: '#739FF2', padding: '3px', border:'none'}}
                                                onClick={async () => {
                                                    if (!validateShippingInfo()) return;
                                                    try {
                                                    // 1️⃣ 주문 먼저 생성
                                                    const createdOrderId = await createOrder();
                                                    setOrderId(createdOrderId);

                                                    // 2️⃣ 옵션 체크
                                                    const selectedOptionsArray = selectedOptions.map(opt => {
                                                        if (!opt.optionId) throw new Error("모든 옵션을 선택해주세요");
                                                        return {
                                                        groupName: opt.groupName,
                                                        optionId: Number(opt.optionId),
                                                        };
                                                    });

                                                    // 3️⃣ CheckoutPage로 이동
                                                    navigate(`/checkout/${id}`, {
                                                        state: {
                                                        orderId: createdOrderId,
                                                        amount: totalAmount,
                                                        productId:id, // id fallback
                                                        productName,
                                                        quantity, 
                                                        selectedOptions: selectedOptionsArray,
                                                        },
                                                    });
                                                    } catch (e) {
                                                    alert(e.message);
                                                    }
                                                }}
                                                >
                                                결제하기
                                            </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br/><br/><br/>
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
    padding: "0 0 20px 0",
  },
}

const row = {
    display: 'flex',
    borderBottom: '1px solid #A09B9B',
    fontSize:'12px'
    
};

const leftCol = {
    width: '135px',
    padding: '10px',
    fontWeight: 'bold',
    borderRight: '1px solid #A09B9B',
    display: 'flex',          
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize:'12px'
};
const rightCol = {
    flex: 1,
    flexDirection: 'column',
    padding: '10px',
    display:'flex'
};
