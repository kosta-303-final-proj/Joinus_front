import { Label,FormGroup,Button } from "reactstrap";
import { Link } from "react-router-dom";
import "../../../css/mypage/ReviewWrite.css";

export default function ReviewWrite() {
    return (
    <>
        <hr style={{ width: '860px', marginBottom: '0', border:'1px solid #000000' }} />

        <div
            style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '860px',
            }}
        >
            <div style={{ background: '#E5EEFF', padding: '5px 0' }}>
            <Label style={{ fontWeight: 'bold', margin: '0', width:'430px', textAlign:'center'}}>리뷰 작성</Label>
            </div>
            <div style={{ padding: '5px 0' }}><Link to="reviewWrited" style={{color:'black'}}>
            <Label style={{ fontWeight: 'bold', margin: '0',width:'430px', textAlign:'center' }}>나의 리뷰</Label>
            </Link>
            </div>
        </div>

        <hr style={{ width: '860px', marginTop: '0', border:'1px solid #000000'  }} />
        
        <hr style={{ width: '860px', margin: '0' }} />
        <div className="reviewWrite">
            <FormGroup check className="reviewItem">
                <img src="/note.png" alt="상품 이미지" className="reviewImg" />
                <div>
                    <div className="reviewName" style={{fontSize:'12px'}}>ASUS 비보북 S 16 M3607KA-SH035W (SSD 512GB)</div>
                    <br/>
                    <div className="reviewData" style={{fontSize:'12px'}}>결제 날짜 2025-11-26</div>
                </div>
                <div className="buttonGroup">
                    <Button size="sm" className="buttonPrimary" style={{width:'80px'}} >리뷰 작성</Button>
                </div>
            </FormGroup>
        </div>
        <hr style={{ width: '860px', marginTop: '0'}} />
    </>
  );
}
