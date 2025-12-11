import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { myAxios } from '../../config';
import Header from './Header';
import SearchFilter from './SearchFilter';
import { ChevronDown, ChevronUp } from 'lucide-react';
import '../../styles/components/button.css';
import '../../styles/components/table.css';
import './admin-common.css';
import './FaqAndInquiryList.css';

const FaqAndInquiryList = () => {
    const navigate = useNavigate();

    // 기본 탭: 문의
    const [activeTab, setActiveTab] = useState('문의');

    // ========== FAQ 관련 ==========
    const [faqCurrentPage, setFaqCurrentPage] = useState(0);
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [faqPage, setFaqPage] = useState({
        content: [],
        totalPages: 0,
        totalElements: 0,
        number: 0,
    });

    // ========== 문의 관련 ==========
    const [inquiryFilter, setInquiryFilter] = useState('전체');
    const [inquiryCurrentPage, setInquiryCurrentPage] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchType, setSearchType] = useState('question');
    const [inquiryPage, setInquiryPage] = useState({
        content: [],
        totalPages: 0,
        totalElements: 0,
        number: 0,
    });

    // ========================================
    // FAQ 데이터 조회
    // ========================================
    const fetchFaqList = useCallback(async (page) => {
        try {
            const params = {
                page: page,
                size: 10,
            };
            const response = await myAxios().get('/admin/faqList', { params });  // ✅ 수정!
            setFaqPage(response.data);
            setFaqCurrentPage(page);
        } catch (error) {
            console.error("FAQ 목록 조회 실패:", error);
        }
    }, []);

    // ========================================
    // 문의 조회
    // ========================================
    const fetchInquiryList = async (page, status, type, keyword) => {
    try {
        const params = {
            page: page,
            size: 10,
            status: status === '전체' ? null : status,
            searchType: type,
            searchKeyword: keyword || null
        };
        const response = await myAxios().get('/admin/inquiryList', { params });
        setInquiryPage(response.data);
        setInquiryCurrentPage(page);
    } catch (error) {
        console.error("문의 목록 조회 실패:", error);
    }
};

    // ========================================
    // FAQ 탭 활성화 시 데이터 로딩
    // ========================================
    useEffect(() => {
        if (activeTab === 'FAQ') {
            fetchFaqList(faqCurrentPage);
        }
    }, [activeTab, faqCurrentPage, fetchFaqList]);

    // ========================================
    // 문의 탭 활성화 시 데이터 로딩
    // ========================================
    useEffect(() => {
        if (activeTab === '문의') {
            fetchInquiryList(inquiryCurrentPage, inquiryFilter, searchType, searchKeyword);
        }
    }, [activeTab, inquiryCurrentPage, inquiryFilter, searchType, searchKeyword]);

    // ========================================
    // FAQ 페이지 변경
    // ========================================
    const handleFaqPageChange = (pageNumber) => {
        if (pageNumber >= 0 && pageNumber < faqPage.totalPages) {
            setFaqCurrentPage(pageNumber);
        }
    };

    // ========================================
    // 문의 페이지 변경
    // ========================================
    const handleInquiryPageChange = (pageNumber) => {
        if (pageNumber >= 0 && pageNumber < inquiryPage.totalPages) {
            setInquiryCurrentPage(pageNumber);
        }
    };

    // ========================================
    // FAQ 아코디언 토글
    // ========================================
    const toggleFaq = (id) => {
        setExpandedFaq(expandedFaq === id ? null : id);
    };

    // ========================================
    // 문의 필터 변경
    // ========================================
    const handleInquiryFilterChange = (filter) => {
        setInquiryFilter(filter);
        setInquiryCurrentPage(0);  // 첫 페이지로
    };

    // ========================================
    // 문의 검색
    // ========================================

    const handleInquirySearch = (filters) => {
        setSearchType(filters.searchType || 'question');
        setSearchKeyword(filters.searchKeyword || '');
        setInquiryCurrentPage(0);
    };

    return (
        <div className="admin-layout">
            <div className="main-content">
                <Header title="문의 내역" />

                <div className="content-area">

                    {/* ========== 메인 탭 (FAQ / 문의) ========== */}
                    <div className="tabs-container">
                        <div className="tabs">
                            <button
                                className={`tab ${activeTab === 'FAQ' ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveTab('FAQ');
                                    setFaqCurrentPage(0);  // 페이지 초기화
                                }}
                            >
                                FAQ
                            </button>
                            <button
                                className={`tab ${activeTab === '문의' ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveTab('문의');
                                    setInquiryCurrentPage(0);  // 페이지 초기화
                                }}
                            >
                                문의
                            </button>
                        </div>
                    </div>

                    {/* ========================================
                        FAQ 탭
                    ======================================== */}
                    {activeTab === 'FAQ' && (
                        <>
                            {/* 테이블 */}
                            <div className="table-container">
                                <table className="admin-table">
                                    <colgroup>
                                        <col style={{ width: '80px' }} />
                                        <col style={{ width: 'auto' }} />
                                        <col style={{ width: '120px' }} />
                                        <col style={{ width: '80px' }} />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th>번호</th>
                                            <th>질문</th>
                                            <th>작성 날짜</th>
                                            <th>작업</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {faqPage.content.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="empty-state">
                                                    <p>등록된 FAQ가 없습니다.</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            faqPage.content.map((faq) => (
                                                <React.Fragment key={faq.id}>
                                                    {/* 질문 행 */}
                                                    <tr
                                                        onClick={() => toggleFaq(faq.id)}
                                                        style={{ cursor: 'pointer' }}
                                                        className={expandedFaq === faq.id ? 'faq-expanded' : ''}
                                                    >
                                                        <td>{faq.id}</td>
                                                        <td className="title-cell" style={{ textAlign: 'left' }}>
                                                            <span style={{ fontWeight: 500 }}>Q.</span> {faq.question}
                                                            {expandedFaq === faq.id ? (
                                                                <ChevronUp size={16} style={{ marginLeft: '10px', verticalAlign: 'middle' }} />
                                                            ) : (
                                                                <ChevronDown size={16} style={{ marginLeft: '10px', verticalAlign: 'middle' }} />
                                                            )}
                                                        </td>
                                                        <td>{faq.createdAt ? faq.createdAt.substring(0, 10) : 'N/A'}</td>
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

                                                    {/* 답변 행 */}
                                                    {expandedFaq === faq.id && (
                                                        <tr className="faq-answer-row">
                                                            <td colSpan="4" className="faq-answer-cell">
                                                                <div className="faq-answer-content">
                                                                    <strong className="answer-label">A.</strong>
                                                                    <div className="answer-text">{faq.answer}</div>
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
                                marginTop: '16px',
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
                            {faqPage.totalPages > 0 && (
                                <div className="pagination">
                                    {Array.from({ length: faqPage.totalPages }, (_, i) => (
                                        <button
                                            key={i}
                                            className={`page-btn ${i === faqCurrentPage ? 'active' : ''}`}
                                            onClick={() => handleFaqPageChange(i)}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {/* ========================================
                        문의 탭
                    ======================================== */}
                    {activeTab === '문의' && (
                        <>
                            {/* 검색 필터 */}
                            <SearchFilter
                                variant="simple"
                                searchOptions={[
                                    { value: 'question', label: '문의 내용' },
                                    { value: 'memberUsername', label: '작성자' }
                                ]}
                                onSearch={handleInquirySearch}
                            />

                            {/* 답변대기/전체 서브 탭 */}
                            <div className="tabs-container">
                                <div className="tabs">
                                    <button
                                        className={`tab ${inquiryFilter === '답변대기' ? 'active' : ''}`}
                                        onClick={() => handleInquiryFilterChange('답변대기')}
                                    >
                                        답변대기
                                    </button>
                                    <button
                                        className={`tab ${inquiryFilter === '전체' ? 'active' : ''}`}
                                        onClick={() => handleInquiryFilterChange('전체')}
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
                                        {inquiryPage.content.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="empty-state">
                                                    <p>문의 내역이 없습니다.</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            inquiryPage.content.map((inquiry) => (
                                                <tr
                                                    key={`${inquiry.type}-${inquiry.id}`}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => navigate(`/admin/admininquiryDetail/${inquiry.type}/${inquiry.id}`)}
                                                >
                                                    <td>{inquiry.id}</td>
                                                    <td>
                                                        {inquiry.type === 'QNA'
                                                            ? '상품문의'
                                                            : (inquiry.categoryDescription || inquiry.category || '1:1문의')}
                                                    </td>
                                                    <td className="title-cell" style={{ textAlign: 'left' }}>
                                                        {inquiry.question}
                                                    </td>
                                                    <td>{inquiry.memberUsername}</td>
                                                    <td>
                                                        {inquiry.questionedAt
                                                            ? new Date(inquiry.questionedAt).toLocaleDateString('ko-KR')
                                                            : 'N/A'}
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge ${inquiry.status === 'PENDING' ? 'red' : 'green'
                                                            }`}>
                                                            {inquiry.statusDescription}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn-secondary"
                                                            style={{ padding: '6px 16px' }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`/admin/admininquiryDetail/${inquiry.type}/${inquiry.id}`);
                                                            }}
                                                        >
                                                            {inquiry.status === 'PENDING' ? '답변하기' : '상세보기'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* 페이지네이션 */}
                            {inquiryPage.totalPages > 0 && (
                                <div className="pagination">
                                    {Array.from({ length: inquiryPage.totalPages }, (_, i) => (
                                        <button
                                            key={i}
                                            className={`page-btn ${i === inquiryCurrentPage ? 'active' : ''}`}
                                            onClick={() => handleInquiryPageChange(i)}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FaqAndInquiryList;