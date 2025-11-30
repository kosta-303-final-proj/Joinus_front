import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import SearchFilter from './SearchFilter';

const PageName = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

   const handleSearch = (filters) => {
    console.log('검색:', filters);
    setHasSearched(true);
    
    // 여기서 실제로는 API 호출해서 데이터 가져옴
    // 지금은 임시로 예시 데이터
    setSearchResults([
      {
        id: 1,
        joinDate: '2025-11-01',
        userId: 'hong1234',
        nickname: 'hong',
        name: '홍길동',
        grade: 'SILVER',
        email: 'hong@gmail.com',
        points: 1243,
        purchaseCount: 11,
        status: '정상'
      }
    ]);
  };

  const handleReset = () => {
    console.log('초기화');
    setSearchResults([]);
    setHasSearched(false);
  };

  // 회원 클릭 시 상세 페이지로 이동
  const handleMemberClick = (memberId) => {
    navigate(`/admin/member/${memberId}`);
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      
      <div className="main-content">
        <Header title="회원 관리" />
        
        <div className="content-area">
          {/* 검색 필터 */}
          <SearchFilter 
            variant="simple"
            onSearch={handleSearch}
            onReset={handleReset}
          />


          {/* 테이블 */}
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
                <col style={{ width: '90px' }} />      {/* 공구 내역 */}
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
                  <th>공구 내역</th>
                  <th>상태</th>
                </tr>
              </thead>
               <tbody>
                {!hasSearched ? (
                  <tr>
                    <td colSpan="10" className="empty-state">
                      <p>검색하면 결과가 보여집니다.</p>
                    </td>
                  </tr>
                ) : searchResults.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="empty-state">
                      <p>검색 결과가 없습니다.</p>
                    </td>
                  </tr>
                ) : (
                  searchResults.map((member) => (
                    <tr 
                      key={member.id}
                      onClick={() => handleMemberClick(member.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{member.id}</td>
                      <td>{member.joinDate}</td>
                      <td>{member.userId}</td>
                      <td>{member.nickname}</td>
                      <td>{member.name}</td>
                      <td>{member.grade}</td>
                      <td>{member.email}</td>
                      <td>{member.points.toLocaleString()}</td>
                      <td>{member.purchaseCount}건</td>
                      <td>
                        <span className="status-badge blue">{member.status}</span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageName;