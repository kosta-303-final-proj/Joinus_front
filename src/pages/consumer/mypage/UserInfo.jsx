import { Card, CardHeader, CardBody, CardTitle, CardText } from "reactstrap";
import '../../../css/mypage/UserInfo.css'
import { useEffect, useState } from "react";
import { myAxios } from "../../../config";

export default function UserInfo() {
  const username = "kakao_4436272679";
  const [member, setMember] = useState({username:username, grade:'', pointBalance:'', name:''});

  const getUserInfo = ()=>{
    
    myAxios().get(`/consumerInfo?username=${username}`)
    .then(res=>{
      console.log(res)
      setMember(res.data)
    })
    .catch(err=>{
      console.log(err)
    })
  }
  useEffect(()=>{
    getUserInfo();
  }, [])
  return (
    <>
      <Card style={{ width:"860px" }}>
        <CardHeader className="CardHeaderCss">
          <div style={{ marginTop:"5px", color:"#2D81EF", fontSize:"16px" }}>
            {member.name} 환영합니다.
          </div>
        </CardHeader>

        <CardBody className="CardBodyCss" style={{ display: "flex", alignItems: "center" }}>
          
          {/* 왼쪽 영역 : 아이디 + 회원 등급 */}
          <div style={{ flex: 1 }}>
            
            {/* 아이디 */}
            <CardTitle tag="h5" style={{ fontSize:"12px", marginBottom:"8px",border:'none' }}>
              아이디 : {member.username}
            </CardTitle>

            {/* 회원 등급 */}
            <CardText style={{ fontSize:"12px", margin: 0 }}>
              회원 등급 : {member.grade}
            </CardText>

          </div>

          {/* 오른쪽 영역 : 보유 포인트 */}
          <div style={{ textAlign: "right", minWidth: "150px" }}>
            <div style={{ fontSize:"12px" }}>
              보유 포인트 : {member.pointBalance}P
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
