import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
export default function OrderDetail(){
    const navigate = useNavigate();
    return(
        <>
            <div style={styles.pageWrapper}>
                <div style={styles.container2}>
                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                        <h3 className="mb-0 fw-bold text-start" style={{marginTop:'10px'}}>주문 상세 조회</h3>
                        
                        {/* 오른쪽 버튼 그룹 */}
                        <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
                            <Button style={{backgroundColor:'#739FF2', border:'none', color:'white', fontSize:'12px'}}>상품 조회</Button>
                            <Button style={{backgroundColor:'#F2CE73', border:'none', color:'black', fontSize:'12px'}}>교환 신청</Button>
                            <Button style={{backgroundColor:'#F27373', border:'none', color:'white', fontSize:'12px'}}>환불 신청</Button>
                        </div>
                    </div>
                </div>
            </div>
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <div style={{height:'50px', border:'1px solid #2833D1', backgroundColor:'#F2F9FC', color:'#2833D1',padding:'11px'}}>
                        주문이 정상적으로 완료되었습니다. 배송 상황은 마이페이지에서 확인 가능합니다.
                    </div>
                </div>
            </div>
            
            {/* 주문 정보 영역 */}
            <div style={styles.pageWrapper}>
                <div style={{width:'1020px'}}>
                    <div>
                        <h3 className="mb-0 fw-bold text-start" style={{fontSize:'20px'}}>주문 정보</h3>
                    </div>
                </div>
            </div>
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <div style={{border: '1px solid black',borderRadius: '5px',overflow: 'hidden'}}>
                        <div style={row}>
                            <div style={leftCol}>주문 일자</div>
                            <div style={rightCol}>2025-11-16</div>
                        </div>
                        <div style={row}>
                            <div style={leftCol }>상품 정보</div>
                            <div style={{ ...rightCol, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img src="https://picsum.photos/80" style={{width: '80px',height: '80px',borderRadius: '8px', objectFit: 'cover'}}/>
                                <div>샘플 상품명입니다</div>
                            </div>
                        </div>
                        <div style={row}>
                            <div style={leftCol}>수량</div>
                            <div style={rightCol}>1</div>
                        </div>
                        <div style={row}>
                            <div style={leftCol}>가격</div>
                            <div style={rightCol}>10,000원</div>
                        </div>
                        <div style={row}>
                            <div style={leftCol}>요청사항</div>
                            <div style={rightCol}>요청사항 내용이 여기에 들어갑니다.</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 결제 정보 */}
            <div style={styles.pageWrapper}>
                <div style={{width:'1020px'}}>
                    <div>
                        <h3 className="mb-0 fw-bold text-start" style={{fontSize:'20px'}}>결제 정보</h3>
                    </div>
                </div>
            </div>
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <div style={{border: '1px solid black',borderRadius: '5px',overflow: 'hidden'}}>
                        <div style={row}>
                            <div style={leftCol}>총 주문금액</div>
                            <div style={rightCol}>1,057,314원</div>
                        </div>
                        <div style={row}>
                            <div style={leftCol }>국내 배송비</div>
                            <div style={{ ...rightCol, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div>3,000원</div>
                            </div>
                        </div>
                        <div style={row}>
                            <div style={leftCol}>포인트 사용</div>
                            <div style={rightCol}>1,000p</div>
                        </div>
                        <div style={row}>
                            <div style={leftCol}>결제 수단</div>
                            <div style={rightCol}>신용카드</div>
                        </div>
                        <div style={row}>
                            <div style={leftCol}>최종 결제 금액</div>
                            <div style={rightCol}>1,056,314원</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 배송 정보 */}   
            <div style={styles.pageWrapper}>
                <div style={{width:'1020px'}}>
                    <div>
                        <h3 className="mb-0 fw-bold text-start" style={{fontSize:'20px'}}>배송 정보</h3>
                    </div>
                </div>
            </div>
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <div style={{border: '1px solid black',borderRadius: '5px',overflow: 'hidden'}}>
                        <div style={row}>
                            <div style={leftCol}>주문자 이름</div>
                            <div style={rightCol}>최지성</div>
                        </div>
                        <div style={row}>
                            <div style={leftCol }>수령인 이름</div>
                            <div style={{ ...rightCol, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div>최지성</div>
                            </div>
                        </div>
                        <div style={row}>
                            <div style={leftCol}>주소</div>
                            <div style={rightCol}>경기도 수원시 권선구 경수대로 212번길 34 수원아이파크시티10단지 1002동 1002호</div>
                        </div>
                        <div style={row}>
                            <div style={leftCol}>이메일</div>
                            <div style={rightCol}>jisung0628jisung@gmail.com</div>
                        </div>
                        <div style={row}>
                            <div style={leftCol}>전화번호</div>
                            <div style={rightCol}>010-4627-6195</div>
                        </div>
                        <div style={row}>
                            <div style={leftCol}>배달 요청사항</div>
                            <div style={rightCol}>문 앞에 놓아주세요</div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <div style={{justifyContent:'center',display:'flex'}}>
                        <Button style={{fontSize:'12px', backgroundColor:'#739FF2', border:'none'}}>주문 목록</Button>
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
    padding: "10px 0",
    display:'flex',
  },
};
const row = {
    display: 'flex',
    borderBottom: '1px solid #A09B9B',
    fontSize:'12px'
    
};

const leftCol = {
    width: '200px',
    padding: '10px',
    fontWeight: 'bold',
    borderRight: '1px solid #A09B9B',
    backgroundColor: '#E5EEFF',
    display: 'flex',          
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize:'12px'
};
const rightCol = {
    flex: 1,
    padding: '10px',
};
