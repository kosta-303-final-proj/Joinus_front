import { Card, CardHeader, CardBody, CardTitle, CardText } from "reactstrap";
import '../../../css/mypage/UserInfo.css'
import { useEffect, useState } from "react";
import { myAxios } from "../../../config";

export default function UserInfo() {

  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  const username = userInfo?.username;
  const [member, setMember] = useState({ username: username, grade: '', pointBalance: '', name: '' });

  const rawGrade = userInfo?.grade;
  const grade = rawGrade
    ? rawGrade.charAt(0).toUpperCase() + rawGrade.slice(1).toLowerCase()
    : null;

  const getUserInfo = () => {
    myAxios().get(`/consumerInfo?username=${username}`)
      .then(res => {
        console.log(res)
        setMember(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }
  
  useEffect(() => {
    getUserInfo();
  }, [])

  return (
    <>
      <Card style={{ 
        width: "860px", 
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        boxShadow: 'none'
      }}>
        <CardHeader style={{
          backgroundColor: '#fafafa',
          borderBottom: '1px solid #eaeaea',
          padding: '16px 24px'
        }}>
          <div style={{ 
            color: "#2D81EF", 
            fontSize: "16px",
            fontWeight: '600'
          }}>
            {member.name}님 환영합니다.
          </div>
        </CardHeader>

        <CardBody style={{ 
          display: "flex", 
          alignItems: "center",
          padding: '20px 24px',
          backgroundColor: '#fff'
        }}>
          {/* 왼쪽 영역 : 회원 등급 */}
          <div style={{ flex: 1 }}>
            <CardText style={{ fontSize: "14px", margin: 0, color: '#555' }}>
              <div style={{
                display: 'flex',          
                alignItems: 'center',    
                gap: '8px'               
              }}>
                <span style={{ fontWeight: '500' }}>회원 등급</span>
                <span style={{ fontWeight: '600', color: '#222' }}>{member.grade}</span>
                <img
                  src={`/grade/${member.grade}.png`}
                  alt={grade}
                  style={{
                    width: '18px',
                    height: '18px',
                    objectFit: 'contain'
                  }}
                />
              </div>
            </CardText>
          </div>

          {/* 오른쪽 영역 : 보유 포인트 */}
          <div style={{ textAlign: "right", minWidth: "150px" }}>
            <div style={{ fontSize:"14px", color: '#555' }}>
              <span style={{ fontWeight: '500' }}>보유 포인트</span>
              <span style={{ fontWeight: '700', color: '#222', marginLeft: '8px' }}>
                {Number(member.pointBalance || 0).toLocaleString()}P
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}