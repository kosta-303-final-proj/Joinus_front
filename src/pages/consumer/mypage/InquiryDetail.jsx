import "bootstrap/dist/css/bootstrap.min.css";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";

export default function InquiryDetail(){
    return(
        <>
            {/* 제목 영역 (1020px 고정) */}
            <div style={styles.pageWrapper}>
              <div style={styles.container}>

                {/* 제목 + 뒤로가기 영역 */}
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  marginBottom: "20px"
                }}>
                  <h3 className="mb-0 fw-bold text-start">1:1 문의 상세조회</h3>

                  <Label className="fw-bold d-flex align-items-center" style={{ cursor: "pointer" }}>
                    <img 
                      src="/left.png" 
                      alt="뒤로가기" 
                      className="back" 
                      style={{ width: "20px", height: "20px", marginRight: "5px" }}
                    />
                    뒤로가기
                  </Label>
                </div>

              </div>
            </div>

            {/* 전체 폭 가로선 */}
            <hr style={styles.fullWidthHr} />

            {/* 본문 영역 */}
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                <Form>
                    <FormGroup style={{ display:'flex'}}>
                      <div style={{margin:'0',width:'150px'}}>
                        <div>상품 주문 번호</div>
                        <div>#1024593</div><br/>
                        <div>문의 날짜</div>
                        <div>2025-11-27</div>
                      </div>
                      <div style={{width:'880px'}}>
                        <div className="fw-bold" style={{fontSize:"20px"}}>언노운 플레이어</div>
                        <br/>
                        <div style={{fontSize:"14px"}}>접속했더니 영정을 당한건지 뭔지, 언노운 플레이어라고 되어있습니다. 제제 내역 확인해봤는데 금일 날짜로 온 메시지가
                        없더군요. 원인을 알려주시고 해결방법도 알려주세요</div>
                      </div>
                      
                    </FormGroup>
                    <hr style={{ width:'880px', marginLeft: 'auto', marginRight: '0'}}/>
                    <FormGroup style={{ display:'flex', width:'880px', marginLeft: 'auto', marginRight: '0'}}>
                      <img src="/note.png" alt="상품 이미지" style={{padding:'10px', width:'100px', height:'100px'}}/>
                      <div style={{fontSize:'14px', padding:'10px' }}>ASUS 비보북 S 16 M3607KA-SH035W (SSD 512GB)</div>
                    </FormGroup>
                    <hr style={{ width:'880px', marginLeft: 'auto', marginRight: '0'}}/>
                    <FormGroup style={{ display:'flex', width:'880px', marginLeft: 'auto', marginRight: '0', padding:'10px'}}>
                      <div style={{width:'880px'}}>
                        <div className="fw-bold" style={{fontSize:"14px"}}>운영자 닉네임</div>
                        <div style={{fontSize:"14px"}}>2025년 2월 7일 오전 11:58</div>
                        <div style={{fontSize:"14px"}}>
                          안녕하세요. 플레이어님! 
                          - 자이라님의 정원사가 되기 위해 꽃 백과사전을 읽던 중,
                          - 플레이어님의 문의 소식을 듣고 한달음에 달려온 [GM] 야생화🌸입니다. 
                          - 플레이어님의 문의 및 스크린샷을 꼼꼼하게 확인해 보니 어느 날 갑자기 제재가 되어있으셔서 찾아와 주신 것으로 보이네요.
                          - 속상하고 답답하셨을 텐데 저희를 찾아와 문의하신 점 정말 감사드립니다.
                          - 플레이어님의 계정을 살펴보았는데요. 현재 아무런 제재도 비활성화 계정 잠금, 등 아무런 조치도 되어 있지 않은 것으로 확인되었습니다.
                          - 지속적으로 제재에 대한 안내가 나올 시 다시 문의해 주시길 바랍니다. 
                          - 저는 항상 이 자리에서 플레이어님을 돕기 위해 노력하며 공부하고 있어요.
                          - 그러니 언제든지 부담 없이 찾아와 주셨으면 좋겠습니다. 
                          - 소중한 시간을 할애해 주신 플레이어님께서 제 답변으로 더욱 행복한 하루를 보내시면 좋겠습니다. 
                          - 오늘 남은 하루도 잘 마무리하시고 앞으로도 멋진 플레이를 응원할게요.
                        </div>
                      </div>
                    </FormGroup>
                    <hr style={{ width:'880px', marginLeft: 'auto', marginRight: '0', color:'#d9d9d9'}}/>
                    <br/><br/>
                    <hr style={{ width:'880px', marginLeft: 'auto', marginRight: '0'}}/>
                </Form>
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
};