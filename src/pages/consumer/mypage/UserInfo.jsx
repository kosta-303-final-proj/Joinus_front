import { Card, CardHeader, CardBody, CardTitle, CardText } from "reactstrap";
import '../../../css/mypage/UserInfo.css'

export default function UserInfo() {
  return (
    <>
      <Card style={{ width:"860px" }}>
        <CardHeader className="CardHeaderCss">
          <div style={{ marginTop:"5px", color:"#2D81EF", fontSize:"16px" }}>
            최지성님 환영합니다.
          </div>
        </CardHeader>

        <CardBody className="CardBodyCss" style={{ display: "flex", alignItems: "center" }}>
          
          {/* 왼쪽 영역 : 아이디 + 회원 등급 */}
          <div style={{ flex: 1 }}>
            
            {/* 아이디 */}
            <CardTitle tag="h5" style={{ fontSize:"12px", marginBottom:"8px" }}>
              아이디 : projjang2000
            </CardTitle>

            {/* 회원 등급 */}
            <CardText style={{ fontSize:"12px", margin: 0 }}>
              회원 등급 : Diamond
            </CardText>

          </div>

          {/* 오른쪽 영역 : 보유 포인트 */}
          <div style={{ textAlign: "right", minWidth: "150px" }}>
            <div style={{ fontSize:"12px" }}>
              보유 포인트 : 25,000P
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
