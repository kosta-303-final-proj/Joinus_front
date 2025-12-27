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
    const [memberPoint, setMemberPoint] = useState(0);
    const [usingPoint, setUsingPoint] = useState(0);

    const [shipRecipient, setShipRecipient] = useState("");
    const [phone, setPhone] = useState("");
    const [postcode, setPostcode] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [addressDetail, setAddressDetail] = useState("");
    const [accessInstructions, setAccessInstructions] = useState("");
    const [note, setNote] = useState("");

    const [addressList, setAddressList] = useState([]);
    const [selectedAddressName, setSelectedAddressName] = useState("");

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
            resetAddress();
        }
    }, [addressType]);
    
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
        getMemberPoint();
    },[])

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
                postcode,
                streetAddress,
                addressDetail,
                accessInstructions,
                note,
            });
            return response.data.orderId;
        } catch (e) {
            console.log("주문 생성 에러:", e.response?.data || e.message);
            throw e;
        }
    };

    const openDaumPostcode = () => {
        if (!window.daum || !window.daum.Postcode) {
            alert("주소 검색 서비스를 불러오지 못했습니다.");
            return;
        }

        new window.daum.Postcode({
            oncomplete: function (data) {
                setPostcode(data.zonecode);
                setStreetAddress(data.roadAddress);
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
            {/* 페이지 타이틀 */}
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#222', margin: '40px 0 30px 0' }}>
                        주문/결제
                    </h2>
                </div>
            </div>

            {/* 주의사항 */}
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <div style={{ background: '#FFF9E6', border: '1px solid #FFE082', borderRadius: '8px', padding: '20px', marginBottom: '30px', display: 'flex', gap: '16px' }}>
                        <div style={{ width: '40px', height: '40px', backgroundColor: '#FFD54F', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                        </div>
                        <div>
                            <div style={{ fontSize: '16px', fontWeight: '700', color: '#222', marginBottom: '8px' }}>주문 전 확인사항</div>
                            <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>
                                • 결제 전에 주문정보와 배송지를 반드시 확인해주세요.<br/>
                                • 입력된 정보가 정확하지 않으면 배송 지연이나 통관 문제가 발생할 수 있습니다.<br/>
                                • 결제 후에는 주문 정보 변경이 불가합니다.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 주문 상품 정보 */}
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <div style={styles.sectionTitle}>주문 상품</div>
                    <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff' }}>
                        <div style={{ display: 'flex', backgroundColor: '#f8f8f8', borderBottom: '1px solid #e0e0e0', padding: '12px 20px', fontSize: '13px', fontWeight: '600', color: '#666' }}>
                            <div style={{ width: '120px' }}>주문일자</div>
                            <div style={{ flex: 1 }}>상품정보</div>
                            <div style={{ width: '80px', textAlign: 'center' }}>수량</div>
                            <div style={{ width: '120px', textAlign: 'right' }}>가격</div>
                        </div>
                        <div style={{ display: 'flex', padding: '20px', alignItems: 'center' }}>
                            <div style={{ width: '120px', fontSize: '13px', color: '#666' }}>
                                {new Date().toISOString().slice(0,10)}
                            </div>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <img src={`${baseUrl}/files/${thumbnail}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #eaeaea' }} />
                                <div style={{ fontSize: '14px', color: '#222' }}>{productName}</div>
                            </div>
                            <div style={{ width: '80px', textAlign: 'center', fontSize: '14px' }}>{quantity}개</div>
                            <div style={{ width: '120px', textAlign: 'right', fontSize: '16px', fontWeight: '700' }}>
                                {finalPrice?.toLocaleString()}원
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 배송지 정보 & 결제 정보 */}
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
                        
                        {/* 왼쪽: 배송지 정보 */}
                        <div style={{ flex: 1 }}>
                            <div style={styles.sectionTitle}>배송지 정보</div>
                            <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff' }}>
                                
                                {/* 배송지 선택 */}
                                <div style={styles.formRow}>
                                    <div style={styles.formLabel}>배송지 선택</div>
                                    <div style={styles.formInput}>
                                        <FormGroup tag="fieldset" style={{ display: "flex", gap: "20px", alignItems: "center", margin: 0 }}>
                                            <FormGroup check style={{ display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                                                <Input
                                                    name="addressType"
                                                    type="radio"
                                                    value="new"
                                                    checked={addressType === "new"}
                                                    onChange={() => setAddressType("new")}
                                                />
                                                <Label check style={{ margin: 0, fontSize: '14px' }}>신규 배송지</Label>
                                            </FormGroup>

                                            <FormGroup check style={{ display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                                                <Input
                                                    name="addressType"
                                                    type="radio"
                                                    value="old"
                                                    checked={addressType === "old"}
                                                    onChange={() => setAddressType("old")}
                                                />
                                                <Label check style={{ margin: 0, fontSize: '14px' }}>기존 배송지</Label>
                                            </FormGroup>
                                        </FormGroup>

                                        {addressType === "old" && (
                                            <FormGroup style={{ marginTop: '12px', marginBottom: 0 }}>
                                                <Input
                                                    type="select"
                                                    value={selectedAddressName}
                                                    onChange={(e) => setSelectedAddressName(e.target.value)}
                                                    style={{ fontSize: "14px", padding: '8px 12px', borderRadius: '6px', border: '1px solid #d0d0d0' }}
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
                                <div style={styles.formRow}>
                                    <div style={styles.formLabel}>배송지명</div>
                                    <div style={styles.formInput}>
                                        <Input
                                            value={shipRecipient}
                                            onChange={(e) => setShipRecipient(e.target.value)}
                                            style={styles.inputField}
                                            placeholder="배송지명 입력"
                                        />
                                    </div>
                                </div>

                                {/* 이름 */}
                                <div style={styles.formRow}>
                                    <div style={styles.formLabel}>수령인</div>
                                    <div style={styles.formInput}>
                                        <Input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            style={styles.inputField}
                                            placeholder="받으시는 분 이름"
                                        />
                                    </div>
                                </div>

                                {/* 전화번호 */}
                                <div style={styles.formRow}>
                                    <div style={styles.formLabel}>연락처</div>
                                    <div style={styles.formInput}>
                                        <Input
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            style={styles.inputField}
                                            placeholder="예) 010-1234-5678"
                                        />
                                    </div>
                                </div>

                                {/* 주소 */}
                                <div style={styles.formRow}>
                                    <div style={styles.formLabel}>주소</div>
                                    <div style={styles.formInput}>
                                        <div style={{ display: "flex", gap: "8px", marginBottom: '8px' }}>
                                            <Input
                                                type="text"
                                                readOnly
                                                value={postcode ? `[${postcode}] ${streetAddress}` : ""}
                                                placeholder="주소 검색 버튼을 클릭하세요"
                                                style={{ ...styles.inputField, flex: 1 }}
                                            />
                                            <button
                                                type="button"
                                                style={{
                                                    fontSize: "14px",
                                                    padding: "0 16px",
                                                    backgroundColor: '#739FF2',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontWeight: '600',
                                                    whiteSpace: 'nowrap'
                                                }}
                                                onClick={openDaumPostcode}
                                            >
                                                주소 검색
                                            </button>
                                        </div>
                                        <Input
                                            type="text"
                                            value={addressDetail}
                                            onChange={(e) => setAddressDetail(e.target.value)}
                                            style={styles.inputField}
                                            placeholder="상세주소를 입력하세요"
                                        />
                                    </div>
                                </div>

                                {/* 이메일 */}
                                <div style={styles.formRow}>
                                    <div style={styles.formLabel}>이메일</div>
                                    <div style={styles.formInput}>
                                        <Input
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            style={styles.inputField}
                                            placeholder="이메일 주소"
                                        />
                                    </div>
                                </div>

                                {/* 출입방법 */}
                                <div style={styles.formRow}>
                                    <div style={styles.formLabel}>출입방법</div>
                                    <div style={styles.formInput}>
                                        <Input
                                            type="textarea"
                                            value={accessInstructions}
                                            onChange={(e) => setAccessInstructions(e.target.value)}
                                            style={{ ...styles.inputField, minHeight: '60px', resize: 'none' }}
                                            placeholder="공동현관 출입방법 등"
                                        />
                                    </div>
                                </div>

                                {/* 요청사항 */}
                                <div style={{ ...styles.formRow, border: 'none' }}>
                                    <div style={styles.formLabel}>배송 요청사항</div>
                                    <div style={styles.formInput}>
                                        <Input
                                            type="textarea"
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            style={{ ...styles.inputField, minHeight: '80px', resize: 'none' }}
                                            placeholder="배송 시 요청사항을 입력해주세요"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 오른쪽: 포인트 & 결제 정보 */}
                        <div style={{ width: '380px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            
                            {/* 포인트 */}
                            <div>
                                <div style={styles.sectionTitle}>포인트</div>
                                <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff' }}>
                                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '14px', color: '#666' }}>보유 포인트</span>
                                        <span style={{ fontSize: '16px', fontWeight: '700', color: '#739FF2' }}>
                                            {memberPoint.toLocaleString()}P
                                        </span>
                                    </div>
                                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #eaeaea' }}>
                                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>사용 포인트</div>
                                        <Input
                                            type="number"
                                            style={{ ...styles.inputField, textAlign: 'right' }}
                                            value={usingPoint}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value === "") {
                                                    setUsingPoint("");
                                                    return;
                                                }
                                                const num = Number(value);
                                                if (isNaN(num)) return;
                                                setUsingPoint(Math.min(num, maxUsablePoint));
                                            }}
                                            placeholder="0"
                                        />
                                    </div>
                                    <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '14px', color: '#666' }}>남은 포인트</span>
                                        <span style={{ fontSize: '16px', fontWeight: '700', color: '#739FF2' }}>
                                            {remainingPoint.toLocaleString()}P
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 결제 금액 */}
                            <div>
                                <div style={styles.sectionTitle}>결제 금액</div>
                                <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff' }}>
                                    <div style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                            <span style={{ fontSize: '14px', color: '#666' }}>상품 가격</span>
                                            <span style={{ fontSize: '14px' }}>{finalPrice?.toLocaleString()}원</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                            <span style={{ fontSize: '14px', color: '#666' }}>국내 배송비</span>
                                            <span style={{ fontSize: '14px' }}>{shippingAmount.toLocaleString()}원</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                            <span style={{ fontSize: '14px', color: '#666' }}>포인트 사용</span>
                                            <span style={{ fontSize: '14px', color: '#ff4444' }}>- {usingPoint.toLocaleString()}원</span>
                                        </div>
                                    </div>
                                    
                                    <div style={{ borderTop: '2px solid #222', backgroundColor: '#fafafa', padding: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '16px', fontWeight: '700', color: '#222' }}>총 주문 금액</span>
                                            <span style={{ fontSize: '24px', fontWeight: '800', color: '#ff4444' }}>
                                                {totalAmount.toLocaleString()}원
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ padding: '16px 20px' }}>
                                        <button
                                            style={{
                                                width: '100%',
                                                backgroundColor: '#739FF2',
                                                color: 'white',
                                                border: 'none',
                                                padding: '16px',
                                                borderRadius: '8px',
                                                fontSize: '16px',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#5a7cd6'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#739FF2'}
                                            onClick={async () => {
                                                if (!validateShippingInfo()) return;
                                                try {
                                                    const createdOrderId = await createOrder();
                                                    setOrderId(createdOrderId);

                                                    const selectedOptionsArray = selectedOptions.map(opt => {
                                                        if (!opt.optionId) throw new Error("모든 옵션을 선택해주세요");
                                                        return {
                                                            groupName: opt.groupName,
                                                            optionId: Number(opt.optionId),
                                                            optionName: opt.optionName,
                                                        };
                                                    });

                                                    navigate(`/checkout/${id}`, {
                                                        state: {
                                                            orderId: createdOrderId,
                                                            amount: totalAmount,
                                                            productId:id,
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
                                            {totalAmount.toLocaleString()}원 결제하기
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ height: '60px' }}></div>
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
        padding: "0 20px",
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#222',
        marginBottom: '16px',
        paddingBottom: '8px',
        borderBottom: '2px solid #222',
    },
    formRow: {
        display: 'flex',
        borderBottom: '1px solid #eaeaea',
        minHeight: '56px',
    },
    formLabel: {
        width: '140px',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#444',
        backgroundColor: '#f8f8f8',
        display: 'flex',
        alignItems: 'center',
    },
    formInput: {
        flex: 1,
        padding: '12px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    inputField: {
        fontSize: '14px',
        padding: '8px 12px',
        border: '1px solid #d0d0d0',
        borderRadius: '6px',
        outline: 'none',
    },
}