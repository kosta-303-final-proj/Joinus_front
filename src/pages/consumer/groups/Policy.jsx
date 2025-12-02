import  {React, useState } from 'react';
import {  Accordion,  AccordionBody,  AccordionHeader,  AccordionItem, Label } from 'reactstrap';
import { Link, useParams } from "react-router-dom";

export default function Policy(){
    const { id } = useParams();
    const [open, setOpen] = useState('1');
    const toggle = (id) => {
        if (open === id) {
            setOpen();
        } else {
            setOpen(id);
        }
    };
    return(
        <>
            
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <div style={{display: 'flex',justifyContent: 'space-between',alignItems: 'center',width: '860px',}}>
                        <div style={{  padding: '5px 0' }}><Link to={`/gbProductDetail/${id}/detailInfo`} style={{color:'black'}}>
                            <Label style={{ fontWeight: 'bold', margin: '0', width:'255px', textAlign:'center'}}>상품 설명</Label></Link>
                        </div>
                        <div style={{ padding: '5px 0' }}><Link to={`/gbProductDetail/${id}/reviews`} style={{color:'black'}}>
                            <Label style={{ fontWeight: 'bold', margin: '0',width:'255px', textAlign:'center' }}>리뷰</Label></Link>
                        </div>
                        <div style={{  padding: '5px 0' }}><Link to={`/gbProductDetail/${id}/qAndA`} style={{color:'black'}}>
                            <Label style={{ fontWeight: 'bold', margin: '0', width:'255px', textAlign:'center'}}>Q & A</Label></Link>
                        </div>
                        <div style={{background: '#E5EEFF', padding: '5px 0' }}><Link to={`/gbProductDetail/${id}/policy`} style={{color:'black'}}>
                            <Label style={{ fontWeight: 'bold', margin: '0',width:'255px', textAlign:'center' }}>배송/환뷸 규칙</Label></Link>
                        </div>
                    </div>
                    <hr style={{marginTop:'0'}}/>
                    <br/>
                    <Accordion open={open} toggle={toggle}>
                        <AccordionItem>
                        <AccordionHeader targetId="1">배송 조회</AccordionHeader>
                        <AccordionBody accordionId="1">
                            <div className='fw-bold' style={{color:'#3C75F0', fontSize:'16px', marginBottom:'5px'}}>해외 배송</div>
                            <div style={{fontSize:'14px', padding:'10px'}}>미국 → 한국 항공 배송 (약 14-21일 소요), 관세 및 통관 절차 포함</div>
                            <hr/>
                            <div className='fw-bold' style={{color:'#3C75F0', fontSize:'16px', marginBottom:'5px'}}>국내 배송</div>
                            <div style={{fontSize:'14px', padding:'10px'}}>공구 마감 후 3-5일 이내 국내 배송 시작</div>
                            <div style={{border:'1px solid black', padding:'20px 10px'}}>
                                <div style={{fontSize:'16px'}}>배송 지연 관련 안내</div><br/>
                                <div>1. 통관 절차 지연 시 배송이 1-2주 추가 지연될 수 있습니다.</div>
                                <div>2. 천재지변, 물류 대란 등 불가항력적 사유로 배송이 지연될 수 있습니다.</div>
                                <div>3. 명절 연휴 기간에는 배송이 일시 중단됩니다.</div>
                                <div>4. 배송 지연으로 인한 환불은 불가하오니 양해부탁드립니다.</div>
                            </div>
                        </AccordionBody>
                        </AccordionItem>
                        <AccordionItem>
                        <AccordionHeader targetId="2">환불 규정</AccordionHeader>
                        <AccordionBody accordionId="2">
                            {/* <div className='fw-bold' style={{color:'#3C75F0', fontSize:'16px', marginBottom:'5px'}}>해외 배송</div> */}
                            <div style={{fontSize:'14px', padding:'10px'}}>공구 마감 전 : 100% 환불 가능</div>
                            <div style={{fontSize:'14px', padding:'10px'}}>공구 마감 후 : 환불 x → 환불 사유 작성 바랍니다.</div>
                            <div style={{fontSize:'14px', padding:'10px'}}>상품 발송 후 : 단순 변심 시 왕복 배송비 고객 부담 (해외배송비 포함)</div>
                            <div style={{fontSize:'14px', padding:'10px'}}>해외 직구 특성상 공구 마감 후 최소가 어려우니 신중히 결정해주시기 바랍니다.</div><br/>
                            <div style={{border:'1px solid black', padding:'20px 10px'}}>
                                <div style={{fontSize:'16px'}}>배송 지연 관련 안내</div><br/>
                                <div>1. 단순 변심으로 인한 공구 마감 후 환불</div>
                                <div>2. 상품 개봉 및 사용 흔적이 있는 경우</div>
                                <div>3. 상품 TAG 제거, 라벨 훼손 등</div>
                                <div>4. 시간 경과로 재판매가 어려운 상품</div>
                            </div>
                        </AccordionBody>
                        </AccordionItem>
                        <AccordionItem>
                        <AccordionHeader targetId="3">파손 및 불량 처리</AccordionHeader>
                        <AccordionBody accordionId="3">
                            <div style={{fontSize:'14px', padding:'10px'}}>배송 중 파손 : 수령 후 23시간 이내 사진과 함께 고객센터 접수 시 100% 교환/환불</div>
                            <div style={{fontSize:'14px', padding:'10px'}}>초기 불량 : 수량 후 7일 이내 교환 또는 환불 가능 (왕복 배송비 판매자 부담)</div>
                            <div style={{border:'1px solid black', padding:'20px 10px'}}>
                                <div style={{fontSize:'16px'}}>파손 신고 절차</div><br/>
                                <div>1. 상품 수령 시 택배 기사 앞에서 즉시 개봉 확인</div>
                                <div>2. 파손이 확인되면 즉시 사진/영상 촬영 (택배 포장 상태 포함)</div>
                                <div>3. 고객센터로 증빙 자료 제출 (24-48시간 이내)</div>
                                <div>4. 파손 확인 후 교환 또는 환불 진행 (3-5 영업일)</div>
                            </div>
                        </AccordionBody>
                        </AccordionItem>
                        <AccordionItem>
                        <AccordionHeader targetId="4">공동구매 이용 안내</AccordionHeader>
                        <AccordionBody accordionId="4">
                            <div className='fw-bold' style={{color:'#D549D3', fontSize:'16px', marginBottom:'5px'}}>공동구매란?</div>
                            <div style={{fontSize:'14px', padding:'10px'}}>여러 명이 함께 구매하여 대량 구매 할인 혜택을 받는 쇼핑 방식입니다. 최소 인원이 모여야 공구가 성사되며, 해외 직구의 경우 배송비를 나눠 부담하여 
                                더욱 저렴한 가격에 구매할 수 있습니다.
                            </div>
                            <hr/>
                            <div className='fw-bold' style={{color:'#D549D3', fontSize:'16px', marginBottom:'5px'}}>공동구매 과정</div>
                            <div style={{fontSize:'14px', padding:'10px'}}>1. 공구 참여 및 결제 (공구 마감 전까지)</div>
                            <div style={{fontSize:'14px', padding:'10px'}}>2. 최소 인원 달성 시 공구 확정</div>
                            <div style={{fontSize:'14px', padding:'10px'}}>3. 해외에서 상품 구매 및 발송</div>
                            <div style={{fontSize:'14px', padding:'10px'}}>4. 통관 및 국내 배송 시작</div>
                            <div style={{fontSize:'14px', padding:'10px'}}>5. 개별 배송지로 상품 발송</div>
                            <hr/>
                            <div className='fw-bold' style={{color:'#D549D3', fontSize:'16px', marginBottom:'5px'}}>주의사항</div>
                            <div style={{fontSize:'14px', padding:'10px'}}>1. 공구 미달 시 전액 환불 처리됩니다.</div>
                            <div style={{fontSize:'14px', padding:'10px'}}>2. 해외 직구 상품은 AS가 제한적일 수 있습니다.</div>
                            <div style={{fontSize:'14px', padding:'10px'}}>3. 환율 변동에 따라 최종 가격이 변경될 수 있습니다.</div>
                            <div style={{fontSize:'14px', padding:'10px'}}>4. 개인통관고유부호가 필요할 수 있습니다.</div>
                        </AccordionBody>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
            <hr style={{marginTop:'0'}}/>
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