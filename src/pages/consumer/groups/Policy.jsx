import { React, useState } from 'react';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Label } from 'reactstrap';
import { Link, useParams, Outlet } from "react-router-dom";

export default function Policy() {
    const { id } = useParams();
    const [open, setOpen] = useState('1');
    const toggle = (id) => {
        if (open === id) {
            setOpen();
        } else {
            setOpen(id);
        }
    };
    return (
        <>
            <div>
                <div style={styles.pageWrapper}>
                    <div style={styles.container}>
                        <div style={{
                            display: 'flex',
                            borderBottom: '2px solid #e0e0e0',
                            gap: '0'
                        }}>
                            <Link
                                to={`/gbProductDetail/${id}/detailInfo`}
                                style={{
                                    flex: 1,
                                    textAlign: 'center',
                                    padding: '16px 0',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    color: '#666',
                                    textDecoration: 'none',
                                    backgroundColor: '#fff',
                                    borderBottom: '3px solid transparent',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.color = '#222';
                                    e.target.style.backgroundColor = '#f8f8f8';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = '#666';
                                    e.target.style.backgroundColor = '#fff';
                                }}
                            >
                                상품 설명
                            </Link>

                            <Link
                                to={`/gbProductDetail/${id}/reviews`}
                                style={{
                                    flex: 1,
                                    textAlign: 'center',
                                    padding: '16px 0',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    color: '#666',
                                    textDecoration: 'none',
                                    backgroundColor: '#fff',
                                    borderBottom: '3px solid transparent',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.color = '#222';
                                    e.target.style.backgroundColor = '#f8f8f8';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = '#666';
                                    e.target.style.backgroundColor = '#fff';
                                }}
                            >
                                리뷰
                            </Link>

                            <Link
                                to={`/gbProductDetail/${id}/qAndA`}
                                style={{
                                    flex: 1,
                                    textAlign: 'center',
                                    padding: '16px 0',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    color: '#666',
                                    textDecoration: 'none',
                                    backgroundColor: '#fff',
                                    borderBottom: '3px solid transparent',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.color = '#222';
                                    e.target.style.backgroundColor = '#f8f8f8';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = '#666';
                                    e.target.style.backgroundColor = '#fff';
                                }}
                            >
                                Q & A
                            </Link>

                            {/* 배송/환불 규칙 탭 - 현재 활성화 */}
                            <div
                                style={{
                                    flex: 1,
                                    textAlign: 'center',
                                    padding: '16px 0',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    color: '#222',
                                    backgroundColor: '#f0f5ffff',
                                    borderBottom: '3px solid #739FF2',
                                    cursor: 'default'
                                }}
                            >
                                배송/환불 규칙
                            </div>
                        </div>
                        <hr style={{ marginTop: '0' }} />
                        <br />
                        <Accordion open={open} toggle={toggle}>
                            <AccordionItem style={{
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                marginBottom: '12px',
                                overflow: 'hidden'
                            }}>
                                <AccordionHeader
                                    targetId="1"
                                    style={{
                                        backgroundColor: '#f8f8f8',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#222'
                                    }}
                                >
                                    배송 조회
                                </AccordionHeader>
                                <AccordionBody accordionId="1" style={{ padding: '24px' }}>
                                    <div style={{
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        color: '#739FF2',
                                        marginBottom: '12px'
                                    }}>
                                        해외 배송
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        color: '#555',
                                        padding: '12px 16px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '6px',
                                        marginBottom: '20px'
                                    }}>
                                        미국 → 한국 항공 배송 (약 14-21일 소요), 관세 및 통관 절차 포함
                                    </div>

                                    <div style={{
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        color: '#739FF2',
                                        marginBottom: '12px'
                                    }}>
                                        국내 배송
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        color: '#555',
                                        padding: '12px 16px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '6px',
                                        marginBottom: '20px'
                                    }}>
                                        공구 마감 후 3-5일 이내 국내 배송 시작
                                    </div>

                                    <div style={{
                                        border: '1px solid #e0e0e0',
                                        padding: '20px',
                                        borderRadius: '8px',
                                        backgroundColor: '#fffbf0'
                                    }}>
                                        <div style={{
                                            fontSize: '15px',
                                            fontWeight: '700',
                                            color: '#222',
                                            marginBottom: '16px'
                                        }}>
                                            ⚠️ 배송 지연 관련 안내
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.8' }}>
                                            <div style={{ marginBottom: '8px' }}>
                                                • 통관 절차 지연 시 배송이 1-2주 추가 지연될 수 있습니다.
                                            </div>
                                            <div style={{ marginBottom: '8px' }}>
                                                • 천재지변, 물류 대란 등 불가항력적 사유로 배송이 지연될 수 있습니다.
                                            </div>
                                            <div style={{ marginBottom: '8px' }}>
                                                • 명절 연휴 기간에는 배송이 일시 중단됩니다.
                                            </div>
                                            <div>
                                                • 배송 지연으로 인한 환불은 불가하오니 양해 부탁드립니다.
                                            </div>
                                        </div>
                                    </div>
                                </AccordionBody>
                            </AccordionItem>

                            <AccordionItem style={{
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                marginBottom: '12px',
                                overflow: 'hidden'
                            }}>
                                <AccordionHeader
                                    targetId="2"
                                    style={{
                                        backgroundColor: '#f8f8f8',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#222'
                                    }}
                                >
                                    환불 규정
                                </AccordionHeader>
                                <AccordionBody accordionId="2" style={{ padding: '24px' }}>
                                    <div style={{
                                        fontSize: '14px',
                                        color: '#555',
                                        lineHeight: '1.8',
                                        marginBottom: '20px'
                                    }}>
                                        <div style={{
                                            padding: '12px 16px',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '6px',
                                            marginBottom: '8px'
                                        }}>
                                            <strong>공구 마감 전:</strong> 100% 환불 가능
                                        </div>
                                        <div style={{
                                            padding: '12px 16px',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '6px',
                                            marginBottom: '8px'
                                        }}>
                                            <strong>공구 마감 후:</strong> 환불 불가 (환불 사유 작성 필요)
                                        </div>
                                        <div style={{
                                            padding: '12px 16px',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '6px',
                                            marginBottom: '8px'
                                        }}>
                                            <strong>상품 발송 후:</strong> 단순 변심 시 왕복 배송비 고객 부담 (해외배송비 포함)
                                        </div>
                                        <div style={{
                                            padding: '12px 16px',
                                            backgroundColor: '#fff3cd',
                                            borderRadius: '6px',
                                            border: '1px solid #ffe69c'
                                        }}>
                                            해외 직구 특성상 공구 마감 후 취소가 어려우니 신중히 결정해주시기 바랍니다.
                                        </div>
                                    </div>

                                    <div style={{
                                        border: '1px solid #e0e0e0',
                                        padding: '20px',
                                        borderRadius: '8px',
                                        backgroundColor: '#fff0f0'
                                    }}>
                                        <div style={{
                                            fontSize: '15px',
                                            fontWeight: '700',
                                            color: '#222',
                                            marginBottom: '16px'
                                        }}>
                                            ❌ 환불 불가 사유
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.8' }}>
                                            <div style={{ marginBottom: '8px' }}>
                                                • 단순 변심으로 인한 공구 마감 후 환불
                                            </div>
                                            <div style={{ marginBottom: '8px' }}>
                                                • 상품 개봉 및 사용 흔적이 있는 경우
                                            </div>
                                            <div style={{ marginBottom: '8px' }}>
                                                • 상품 TAG 제거, 라벨 훼손 등
                                            </div>
                                            <div>
                                                • 시간 경과로 재판매가 어려운 상품
                                            </div>
                                        </div>
                                    </div>
                                </AccordionBody>
                            </AccordionItem>

                            <AccordionItem style={{
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                marginBottom: '12px',
                                overflow: 'hidden'
                            }}>
                                <AccordionHeader
                                    targetId="3"
                                    style={{
                                        backgroundColor: '#f8f8f8',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#222'
                                    }}
                                >
                                    파손 및 불량 처리
                                </AccordionHeader>
                                <AccordionBody accordionId="3" style={{ padding: '24px' }}>
                                    <div style={{
                                        fontSize: '14px',
                                        color: '#555',
                                        lineHeight: '1.8',
                                        marginBottom: '20px'
                                    }}>
                                        <div style={{
                                            padding: '12px 16px',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '6px',
                                            marginBottom: '8px'
                                        }}>
                                            <strong>배송 중 파손:</strong> 수령 후 24시간 이내 사진과 함께 고객센터 접수 시 100% 교환/환불
                                        </div>
                                        <div style={{
                                            padding: '12px 16px',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '6px'
                                        }}>
                                            <strong>초기 불량:</strong> 수령 후 7일 이내 교환 또는 환불 가능 (왕복 배송비 판매자 부담)
                                        </div>
                                    </div>

                                    <div style={{
                                        border: '1px solid #e0e0e0',
                                        padding: '20px',
                                        borderRadius: '8px',
                                        backgroundColor: '#f0f8ff'
                                    }}>
                                        <div style={{
                                            fontSize: '15px',
                                            fontWeight: '700',
                                            color: '#222',
                                            marginBottom: '16px'
                                        }}>
                                            📋 파손 신고 절차
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.8' }}>
                                            <div style={{ marginBottom: '8px' }}>
                                                <strong>1.</strong> 상품 수령 시 택배 기사 앞에서 즉시 개봉 확인
                                            </div>
                                            <div style={{ marginBottom: '8px' }}>
                                                <strong>2.</strong> 파손이 확인되면 즉시 사진/영상 촬영 (택배 포장 상태 포함)
                                            </div>
                                            <div style={{ marginBottom: '8px' }}>
                                                <strong>3.</strong> 고객센터로 증빙 자료 제출 (24-48시간 이내)
                                            </div>
                                            <div>
                                                <strong>4.</strong> 파손 확인 후 교환 또는 환불 진행 (3-5 영업일)
                                            </div>
                                        </div>
                                    </div>
                                </AccordionBody>
                            </AccordionItem>

                            <AccordionItem style={{
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                marginBottom: '12px',
                                overflow: 'hidden'
                            }}>
                                <AccordionHeader
                                    targetId="4"
                                    style={{
                                        backgroundColor: '#f8f8f8',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#222'
                                    }}
                                >
                                    공동구매 이용 안내
                                </AccordionHeader>
                                <AccordionBody accordionId="4" style={{ padding: '24px' }}>
                                    <div style={{
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        color: '#D549D3',
                                        marginBottom: '12px'
                                    }}>
                                        공동구매란?
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        color: '#555',
                                        padding: '12px 16px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '6px',
                                        marginBottom: '24px',
                                        lineHeight: '1.8'
                                    }}>
                                        여러 명이 함께 구매하여 대량 구매 할인 혜택을 받는 쇼핑 방식입니다. 최소 인원이 모여야 공구가 성사되며, 해외 직구의 경우 배송비를 나눠 부담하여 더욱 저렴한 가격에 구매할 수 있습니다.
                                    </div>

                                    <div style={{
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        color: '#D549D3',
                                        marginBottom: '12px'
                                    }}>
                                        공동구매 과정
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        color: '#555',
                                        marginBottom: '24px'
                                    }}>
                                        {[
                                            '공구 참여 및 결제 (공구 마감 전까지)',
                                            '최소 인원 달성 시 공구 확정',
                                            '해외에서 상품 구매 및 발송',
                                            '통관 및 국내 배송 시작',
                                            '개별 배송지로 상품 발송'
                                        ].map((step, idx) => (
                                            <div key={idx} style={{
                                                padding: '10px 16px',
                                                backgroundColor: '#f8f9fa',
                                                borderRadius: '6px',
                                                marginBottom: '6px',
                                                borderLeft: '3px solid #D549D3'
                                            }}>
                                                <strong>{idx + 1}.</strong> {step}
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        color: '#D549D3',
                                        marginBottom: '12px'
                                    }}>
                                        주의사항
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.8' }}>
                                        <div style={{
                                            padding: '12px 16px',
                                            backgroundColor: '#fff3cd',
                                            borderRadius: '6px',
                                            marginBottom: '8px',
                                            border: '1px solid #ffe69c'
                                        }}>
                                            • 공구 미달 시 전액 환불 처리됩니다.
                                        </div>
                                        <div style={{
                                            padding: '12px 16px',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '6px',
                                            marginBottom: '8px'
                                        }}>
                                            • 해외 직구 상품은 AS가 제한적일 수 있습니다.
                                        </div>
                                        <div style={{
                                            padding: '12px 16px',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '6px',
                                            marginBottom: '8px'
                                        }}>
                                            • 환율 변동에 따라 최종 가격이 변경될 수 있습니다.
                                        </div>
                                        <div style={{
                                            padding: '12px 16px',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '6px'
                                        }}>
                                            • 개인통관고유부호가 필요할 수 있습니다.
                                        </div>
                                    </div>
                                </AccordionBody>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
                <hr style={{ marginTop: '0' }} />
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