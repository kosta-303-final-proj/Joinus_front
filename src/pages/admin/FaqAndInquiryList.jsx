import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { myAxios } from '../../config';
import Header from './Header';
import SearchFilter from './SearchFilter';
import { ChevronDown, ChevronUp } from 'lucide-react';
import '../../styles/components/button.css';
import '../../styles/components/table.css';
import './admin-common.css';
import './FaqAndInquiryList.css'


const FaqAndInquiryList = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('FAQ');
    const [inquiryFilter, setInquiryFilter] = useState('전체');

    const [faqCurrentPage, setFaqCurrentPage] = useState(0);
    const [expandedFaq, setExpandedFaq] = useState(null);

    const [faqPage, setFaqPage] = useState({
        content: [], // FaqDto 목록
        totalPages: 0,
        totalElements: 0,
        number: 0,
    });

    // const filteredInquiries = inquiryFilter === '전체'
    //     ? inquiries
    //     : inquiries.filter(i => i.status === '답변대기');

    // FAQ 데이터 조회
    const fetchFaqList = useCallback(async (page) => {
        try {
            const params = {
                page: page,
                size: 10,
            };
            const response = await myAxios().get('/admin/faqList', { params });
            setFaqPage(response.data);
            setFaqCurrentPage(page);
        } catch (error) {
            console.error("FAQ 목록 조회 실패:", error);
        }
    }, []);

    // FAQ 탭일 때만 데이터 로딩
    useEffect(() => {
        if (activeTab === 'FAQ') {
            fetchFaqList(faqCurrentPage);
        }
    }, [activeTab, faqCurrentPage, fetchFaqList]); // activeTab이나 페이지 변경 시 재요청

    //  FAQ 페이지 변경 핸들러
    const handleFaqPageChange = (pageNumber) => {
        if (pageNumber >= 0 && pageNumber < faqPage.totalPages) {
            setFaqCurrentPage(pageNumber);
        }
    };

    const toggleFaq = (id) => {
        setExpandedFaq(expandedFaq === id ? null : id);
    };

    const handleInquiryDetail = (id) => {
        navigate(`/inquiry/${id}`);
    };

    return (
        <div className="admin-layout">

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