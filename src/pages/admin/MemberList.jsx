import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { myAxios } from '../../config';
import AdminHeader from '../../components/layout/AdminHeader';
import SearchFilter from './SearchFilter';
import './admin-common.css';

const MemberList = () => {
  const navigate = useNavigate();

  const [hasSearched, setHasSearched] = useState(false);  // 검색 여부
  const [loading, setLoading] = useState(false);

  // 검색 결과
  const [memberPage, setMemberPage] = useState({
    content: [],
    totalPages: 0,
    totalElements: 0,
    number: 0,
  });
  
  // 검색 조건
  const [searchFilters, setSearchFilters] = useState({
    searchType: 'username',
    searchKeyword: ''
  });

  
// ========================================
  // 회원 검색
  // ========================================
  const handleSearch = async (filters) => {
    // 키워드 체크
    if (!filters.searchKeyword || filters.searchKeyword.trim() === '') {
      alert('검색어를 입력해주세요.');
      return;
    }
    
    try {
      setLoading(true);
      
      const params = {
        searchType: filters.searchType || 'username',
        searchKeyword: filters.searchKeyword.trim(),
        page: 0,
        size: 10
      };
      
      // API 호출
      const response = await myAxios().get('/admin/memberList', { params });
      
      setMemberPage(response.data);
      setSearchFilters(filters);
      setHasSearched(true);
      
    } catch (error) {
      console.error('회원 검색 실패:', error);
      alert('회원 검색에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // 초기화
  // ========================================
  const handleReset = () => {
    setSearchFilters({
      searchType: 'username',
      searchKeyword: ''
    });
    setMemberPage({
      content: [],
      totalPages: 0,
      totalElements: 0,
      number: 0,
    });
    setHasSearched(false);
  };

  // ========================================
  // 페이지 변경
  // ========================================
  const handlePageChange = async (pageNumber) => {
    try {
      setLoading(true);
      
      const params = {
        searchType: searchFilters.searchType,
        searchKeyword: searchFilters.searchKeyword,
        page: pageNumber,
        size: 10
      };
      
      const response = await myAxios().get('/admin/memberList', { params });
      setMemberPage(response.data);
      
    } catch (error) {
      console.error('페이지 이동 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // 회원 상세 페이지로 이동
  // ========================================
  const handleMemberClick = (username) => {
    navigate(`/admin/memberDetail/${username}`);
  };

  return (
    <div className="admin-layout">
      <div className="main-content">
        <AdminHeader title="회원 관리" />
        
        <div className="content-area">
          {/* 검색 필터 */}
          <SearchFilter 
            variant="simple"
            searchOptions={[
              { value: 'username', label: '아이디' },
              { value: 'name', label: '이름' },
              { value: 'nickname', label: '닉네임' }
            ]}
            showResetButton={true}
            onSearch={handleSearch}
            onReset={handleReset}
          />

          {/* 로딩 */}
          {loading && (
            <div className="loading">검색 중...</div>
          )}

          {/*  테이블 */}
          {!loading && (
            <div className="table-container">
              <table className="admin-table">
                <colgroup>
                  <col style={{ width: '50px' }} />      {/* 번호 */}
                  <col style={{ width: '100px' }} />     {/* 회원가입 날짜 */}
                  <col style={{ width: '90px' }} />      {/* 아이디 */}
                  <col style={{ width: '80px' }} />      {/* 닉네임 */}
                  <col style={{ width: '70px' }} />      {/* 이름 */}
                  <col style={{ width: '70px' }} />      {/* 등급 */}
                  <col style={{ width: '150px' }} />     {/* 이메일 */}
                  <col style={{ width: '80px' }} />      {/* 포인트 */}
                  <col style={{ width: '80px' }} />      {/* 상태 */}
                </colgroup>
                <thead>
                  <tr>
                    <th>번호</th>                  
                    <th>회원가입 날짜</th>
                    <th>아이디</th>
                    <th>닉네임</th>
                    <th>이름</th>
                    <th>등급</th>
                    <th>이메일</th>
                    <th>포인트</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {!hasSearched ? (
                    <tr>
                      <td colSpan="9" className="empty-state">
                        <p>검색하면 결과가 보여집니다.</p>
                      </td>
                    </tr>
                  ) : memberPage.content.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="empty-state">
                        <p>검색 결과가 없습니다.</p>
                      </td>
                    </tr>
                  ) : (
                    memberPage.content.map((member, index) => (
                      <tr 
                        key={member.username}
                        onClick={() => handleMemberClick(member.username)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>{memberPage.number * memberPage.size + index + 1}</td>
                        <td>
                          {member.createdAt 
                            ? new Date(member.createdAt).toLocaleDateString('ko-KR')
                            : 'N/A'}
                        </td>
                        <td>{member.username}</td>
                        <td>{member.nickname}</td>
                        <td>{member.name}</td>
                        <td>{member.gradeDescription}</td>
                        <td>{member.email}</td>
                        <td>{member.pointBalance?.toLocaleString() || 0}p</td>
                        <td>
                          <span className={`status-badge ${
                            member.status === 'ACTIVE' ? 'blue' : 'gray'
                          }`}>
                            {member.statusDescription}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* 페이지네이션 */}
          {hasSearched && memberPage.totalPages > 0 && (
            <div className="pagination">
              {Array.from({ length: memberPage.totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`page-btn ${memberPage.number === i ? 'active' : ''}`}
                  onClick={() => handlePageChange(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default MemberList;