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
      <Card style={{ width: "860px" }}>
        <CardHeader className="CardHeaderCss">
          <div style={{ marginTop: "5px", color: "#2D81EF", fontSize: "16px" }}>
            {member.name}님 환영합니다.
          </div>
        </CardHeader>

        <CardBody className="CardBodyCss" style={{ display: "flex", alignItems: "center" }}>

          {/* 왼쪽 영역 : 아이디 + 회원 등급 */}
          <div style={{ flex: 1 }}>

            {/* 회원 등급 */}
            <CardText style={{ fontSize: "12px", margin: 0 }}>
              <div style={{
                display: 'flex',          
                alignItems: 'center',    
                gap: '6px'               
              }}>
                회원 등급 : {member.grade}
                <img
                  src={`/grade/${member.grade}.png`}
                  alt={grade}
                  style={{
                    width: '16px',
                    height: '16px',
                    objectFit: 'contain'
                  }}
                  className="grade-icon"
                />
              </div>
            </CardText>

          </div>

          {/* 오른쪽 영역 : 보유 포인트 */}
          <div style={{ textAlign: "right", minWidth: "150px" }}>
           <div style={{ fontSize:"12px" }}>
  보유 포인트 : {Number(member.pointBalance || 0).toLocaleString()}P
</div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
