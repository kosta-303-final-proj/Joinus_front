import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import SearchFilter from './SearchFilter';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './admin-common.css';
import './FaqAndInquiryList.css'


const FaqAndInquiryList = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('FAQ');
    const [inquiryFilter, setInquiryFilter] = useState('전체');
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedFaq, setExpandedFaq] = useState(null);

    // FAQ 데이터
    const faqs = [
        {
            id: 1,
            question: 'Q. 공동구매 언제 환불이 가능한가요?',
            answer: '공동 최저 수 이상이 달성되지 않을 때는 즉 자동으로 환불이 가능합니다.',
            date: '2024-10-09'
        },
        {
            id: 2,
            question: 'Q. 공동구매 교환이 가능한가요?',
            answer: '네, 상품 수령 후 7일 이내에 교환 신청이 가능합니다.',
            date: '2024-10-09'
        },
        {
            id: 3,
            question: 'Q. 공동구매 상품은 언제 배송이 시작되나요?',
            answer: '최저 인원 달성 후 발주가 진행되며, 약 2-3주 후 배송이 시작됩니다.',
            date: '2024-10-09'
        },
        {
            id: 4,
            question: 'Q. 공동구매  교환이 가능한가요?',
            answer: '네, 상품 수령 후 7일 이내에 교환 신청이 가능합니다.',
            date: '2024-10-09'
        },
        {
            id: 5,
            question: 'Q. 공동구매  교환이 가능한가요?',
            answer: '네, 상품 수령 후 7일 이내에 교환 신청이 가능합니다.',
            date: '2024-10-09'
        },
    ];

    // 1:1 문의 데이터
    const inquiries = [
        {
            id: 1,
            type: '배송',
            inquiryType: '1:1문의',
            title: '배송이 아직도 안 와요',
            content: '주문한지 2주가 넘었는데 아직도 배송이 안 옵니다. 언제쯤 받을 수 있나요?',
            author: 'hong1234',
            date: '2025-10-24',
            status: '답변대기',
            orderNumber: 'ORD-20251020-001' // 주문번호
        },
        {
            id: 2,
            type: '주문',
            inquiryType: '1:1문의',
            title: '주문 취소 하고 싶어요',
            content: '실수로 주문했는데 취소 가능한가요?',
            author: 'kim5678',
            date: '2025-10-24',
            status: '답변대기',
            orderNumber: 'ORD-20251021-002'
        },
        {
            id: 3,
            type: '상품 문의',
            inquiryType: '공구상품',
            title: '이 제품 색상 옵션 있나요?',
            content: '사진에는 파란색만 있는데 다른 색상도 주문 가능한가요?',
            author: 'park9012',
            date: '2025-10-23',
            status: '답변완료',
            productUrl: '/admin/gbProductMngList/123', // 공구 상품 URL
            answer: '안녕하세요. 현재 파란색 외에 빨간색, 검정색도 주문 가능합니다. 옵션 선택에서 확인하실 수 있습니다.'
        },
    ];

    const filteredInquiries = inquiryFilter === '전체'
        ? inquiries
        : inquiries.filter(i => i.status === '답변대기');

    const toggleFaq = (id) => {
        setExpandedFaq(expandedFaq === id ? null : id);
    };

    const handleInquiryDetail = (id) => {
        navigate(`/inquiry/${id}`);
    };

    return (
        <div className="admin-layout">
            <Sidebar />

            <div className="main-content">
                <Header title="문의 내역" />

                <div className="content-area">

                    {/* 탭 */}
                    <div className="tabs-container">
                        <div className="tabs">
                            <button
                                className={`tab ${activeTab === 'FAQ' ? 'active' : ''}`}
                                onClick={() => setActiveTab('FAQ')}
                            >
                                FAQ
                            </button>
                            <button
                                className={`tab ${activeTab === '문의' ? 'active' : ''}`}
                                onClick={() => setActiveTab('문의')}
                            >
                                문의
                            </button>
                        </div>
                    </div>

                    {/* FAQ 탭 */}
                    {activeTab === 'FAQ' && (
                        <>
                            {/* 테이블 */}
                            <div className="table-container">
                                <table className="admin-table">
                                    <colgroup>
                                        <col style={{ width: '30px' }} />
                                        <col style={{ width: 'auto' }} />
                                        <col style={{ width: '80px' }} />
                                        <col style={{ width: '40px' }} />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th>번호</th>
                                            <th>내용</th>
                                            <th>작성 날짜</th>
                                            <th>작업</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {faqs.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="empty-state">
                                                    <p>등록된 FAQ가 없습니다.</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            faqs.map((faq) => (
                                                <React.Fragment key={faq.id}>
                                                    
                                                    {/* 질문 행 */}
                                                    <tr
                                                        onClick={() => toggleFaq(faq.id)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <td>{faq.id}</td>
                                                        <td className="title-cell" style={{ textAlign: 'left' }}>
                                                            {faq.question}
                                                        </td>
                                                        <td>{faq.date}</td>
                                                        <td>
                                                            <button
                                                                className="btn-secondary"
                                                                style={{ padding: '6px 16px' }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    navigate(`/admin/faqForm/${faq.id}`);
                                                                }}
                                                            >
                                                                수정
                                                            </button>
                                                        </td>
                                                    </tr>

                                                    {/* 답변 행 (아코디언 확장 시) */}
                                                    {expandedFaq === faq.id && (
                                                        <tr className="faq-answer-row">
                                                            <td colSpan="4" className="faq-answer-cell">
                                                                <div className="faq-answer-content">
                                                                    <strong className="answer-label">A.</strong>
                                                                    <div className="answer-text">
                                                                        {faq.answer}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* 등록 버튼 */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                marginBottom: '16px'
                            }}>
                                <button
                                    className="btn-primary"
                                    onClick={() => navigate('/admin/faqForm')}
                                >
                                    등록
                                </button>
                            </div>

                            {/* 페이지네이션 */}
                            <div className="pagination">
                                <button className="page-btn active">1</button>
                                <button className="page-btn">2</button>
                                <button className="page-btn">3</button>
                            </div>

                            
                        </>
                    )}
                    {/* =============== 문의 탭 =================*/}
                    {activeTab === '문의' && (
                        <>
                            {/* 검색 필터 */}
                            <SearchFilter
                                variant="withDate"
                                onSearch={(filters) => {
                                    console.log('검색:', filters);
                                }}
                            />

                            {/* 답변대기/전체 탭 */}
                            <div className="tabs-container">
                                <div className="tabs">
                                    <button
                                        className={`tab ${inquiryFilter === '답변대기' ? 'active' : ''}`}
                                        onClick={() => setInquiryFilter('답변대기')}
                                    >
                                        답변대기
                                    </button>
                                    <button
                                        className={`tab ${inquiryFilter === '전체' ? 'active' : ''}`}
                                        onClick={() => setInquiryFilter('전체')}
                                    >
                                        전체
                                    </button>
                                </div>
                            </div>

                            {/* 테이블 */}
                            <div className="table-container">
                                <table className="admin-table">
                                    <colgroup>
                                        <col style={{ width: '60px' }} />
                                        <col style={{ width: '150px' }} />
                                        <col style={{ width: 'auto' }} />
                                        <col style={{ width: '100px' }} />
                                        <col style={{ width: '120px' }} />
                                        <col style={{ width: '100px' }} />
                                        <col style={{ width: '120px' }} />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th>번호</th>
                                            <th>문의 유형</th>
                                            <th>문의 내용</th>
                                            <th>작성자</th>
                                            <th>작성 날짜</th>
                                            <th>상태</th>
                                            <th>작업</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredInquiries.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="empty-state">
                                                    <p>문의 내역이 없습니다.</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredInquiries.map((inquiry) => (
                                                <tr key={inquiry.id}>
                                                    <td>{inquiry.id}</td>
                                                    <td>{inquiry.type}</td>
                                                    <td className="title-cell" style={{ textAlign: 'left' }}>
                                                        {inquiry.title}
                                                    </td>
                                                    <td>{inquiry.author}</td>
                                                    <td>{inquiry.date}</td>
                                                    <td>
                                                        <span className={`status-badge ${inquiry.status === '답변대기' ? 'red' : 'green'
                                                            }`}>
                                                            {inquiry.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn-secondary"
                                                            style={{ padding: '6px 16px' }}
                                                            onClick={() => navigate(`/admin/inquiryDetail/${inquiry.id}`, {
                                                                state: { inquiry }
                                                            })}
                                                        >
                                                            {inquiry.status === '답변대기' ? '답변하기' : '상세보기'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* 페이지네이션 */}
                            <div className="pagination">
                                <button className="page-btn active">1</button>
                                <button className="page-btn">2</button>
                                <button className="page-btn">3</button>
                                <span className="page-dots">...</span>
                                <button className="page-btn">67</button>
                                <button className="page-btn">68</button>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};

export default FaqAndInquiryList;