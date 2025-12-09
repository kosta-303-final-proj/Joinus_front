import { Link, useParams,Outlet } from "react-router-dom";
import { Label } from "reactstrap";
import { useState } from "react";
import InquiryModal from "./InquiryModal";


export default function QAndA(){
    const { id } = useParams();
    const [openId, setOpenId] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);

    const toggle = (id) => {
        setOpenId(openId === id ? null : id);
    };

    const dummyQnaList = [
        {
            id: 1,
            status: "답변완료",
            question: "파손되지않게배송부탁드립니다~ 맛있음재구매할게요~ 수고하세요",
            user: "1611*****",
            date: "2024.01.08 11:39",
            answer:
                "네 고객님 최대한 신경써서 출고처리 해드리겠습니다.\n저희 선비 제품 말고도 다양한 브랜드 제품들이 있으니 다야하게 드셔보시는 것도 추천드립니다. 감사합니다.",
            answerDate: "2024.01.08 11:55"
        }
    ];
    return(
        <>
        <div>
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <div style={{display: 'flex',justifyContent: 'space-between',alignItems: 'center',width: '860px',}}>
                        <div style={{  padding: '5px 0' }}>
                        <Link to={`/gbProductDetail/${id}/detailInfo`} style={{color:'black'}}>
                        <Label style={{ fontWeight: 'bold', margin: '0', width:'255px', textAlign:'center'}}>상품 설명</Label>
                        </Link>
                        </div>
                        <div style={{ padding: '5px 0' }}><Link to={`/gbProductDetail/${id}/reviews`} style={{color:'black'}}>
                        <Label style={{ fontWeight: 'bold', margin: '0',width:'255px', textAlign:'center' }}>리뷰</Label></Link>
                        </div>
                        <div style={{background: '#E5EEFF',  padding: '5px 0' }}>
                        <Label style={{ fontWeight: 'bold', margin: '0', width:'255px', textAlign:'center'}}>Q & A</Label>
                        </div>
                        <div style={{ padding: '5px 0' }}><Link to={`/gbProductDetail/${id}/policy`} style={{color:'black'}}>
                        <Label style={{ fontWeight: 'bold', margin: '0',width:'255px', textAlign:'center' }}>배송/환뷸 규칙</Label></Link>
                        </div>
                    </div>
                    <hr style={{marginTop:'0'}}/>
                </div>
            </div>
            {/* 영역 */}
            <div style={styles.pageWrapper}>
                <div style={styles.container2}>
                    {/* HEADER */}
                    <div style={{ display: 'flex', padding: '12px 0', borderBottom: '1px solid #ddd', fontWeight: 'bold', color: '#555' }}>
                        <div style={{ flex: 1 }}>문의/답변</div>
                        <div style={{ width: '140px', textAlign: 'center' }}>작성자</div>
                        <div style={{ width: '120px', textAlign: 'center' }}>작성일</div>
                    </div>

                    {/* 리스트 */}
                    {dummyQnaList.map((item) => (
                        <div key={item.id}>
                            {/* 상단 라인 (클릭 영역) */}
                            <div
                                onClick={() => toggle(item.id)}
                                style={{display: 'flex', padding: '14px 0', borderBottom: '1px solid #eee', fontSize: '14px', alignItems: 'center',cursor: 'pointer'}}>

                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{background: '#C7DBFF',padding: '4px 10px',borderRadius: '4px', fontSize: '13px',fontWeight: 'bold',color: '#1E50A0'}}>
                                        {item.status}
                                    </span>
                                    <span style={{ color: '#333' }}>{item.question}</span>
                                </div>

                                <div style={{ width: '140px', textAlign: 'center', color: '#666' }}>
                                    {item.user}
                                </div>

                                <div style={{ width: '120px', textAlign: 'center', color: '#666' }}>
                                    {item.date}
                                </div>
                            </div>

                            {/* 펼침 영역 */}
                            {openId === item.id && (
                                <div style={{ background: '#fafafa', padding: '15px 20px 20px 20px' }}>
                                    {/* Q */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
                                        <div style={{ fontWeight: 'bold', color: '#1E50A0', fontSize: '24px', width: '40px' }}>Q</div>
                                        <div>
                                            <div style={{ marginBottom: '8px' }}>{item.question}</div>
                                        </div>
                                    </div>

                                    {/* A */}
                                    {item.answer && (
                                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                            <div style={{ fontWeight: 'bold', color: '#E54940', fontSize: '24px', width: '40px' }}>A</div>
                                            <div>
                                                <div style={{ marginBottom: '8px', lineHeight: '1.5' }}>{item.answer}</div>
                                                <div style={{ color: '#888', fontSize: '12px', marginBottom: '6px' }}>
                                                    판매자 / {item.answerDate}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* 상품 문의하기 버튼 */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                        <button
                            onClick={() => setModalOpen(true)}
                            style={{
                                background: '#4B4B4B',
                                color: '#fff',
                                padding: '10px 18px',
                                borderRadius: '4px',
                                border: 'none',
                                cursor: 'pointer'
                            }}>
                            상품 문의하기
                        </button>
                    </div>

                    {modalOpen && <InquiryModal onClose={() => setModalOpen(false)} />}
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
    padding: "0",
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