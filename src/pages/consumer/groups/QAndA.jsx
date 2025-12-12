import { Link, useParams,Outlet } from "react-router-dom";
import { Label } from "reactstrap";
import { useState,useEffect } from "react";
import InquiryModal from "./InquiryModal";
import { myAxios } from "../../../config";


export default function QAndA(){
    const { id } = useParams();
    const [openId, setOpenId] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);

    const [qnaList, setQnaList] = useState([]);

    const toggle = (id) => {
        setOpenId(openId === id ? null : id);
    };

    const fetchQna = () => {
        myAxios().get(`/qna/${id}`)
            .then(res => setQnaList(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchQna();   // 페이지 진입 시 QnA 로딩
    }, [id]);



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
                    {qnaList.map((item) => (
                        <div key={item.id}>
                            {/* 상단 라인 (클릭 영역) */}
                            <div
                                onClick={() => toggle(item.id)}
                                style={{display: 'flex', padding: '14px 0', borderBottom: '1px solid #eee', fontSize: '14px', alignItems: 'center',cursor: 'pointer'}}>

                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{background: '#C7DBFF',padding: '4px 10px',borderRadius: '4px', fontSize: '13px',fontWeight: 'bold',color: '#1E50A0'}}>
                                        {item.status === "PENDING" ? "답변대기" : "답변완료"}
                                    </span>
                                    <span style={{ color: '#333' }}>{item.question}</span>
                                </div>

                                <div style={{ width: '140px', textAlign: 'center', color: '#666' }}>
                                    {item.username ? item.username.substring(0, 4) + "*****" : ""}
                                </div>

                                <div style={{ width: '120px', textAlign: 'center', color: '#666' }}>
                                    {item.questionedAt ? item.questionedAt.split("T")[0] : ""}
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
                                                    {item.answeredAt ? item.answeredAt.split("T")[0] : ""}
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

                    {modalOpen && <InquiryModal gbProductId={id}  onClose={() => setModalOpen(false)} />}
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