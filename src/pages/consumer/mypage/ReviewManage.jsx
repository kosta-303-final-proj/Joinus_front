import "../../../css/mypage/ReviewManage.css";
import ReviewWrite from './ReviewWrite'
import { Outlet } from 'react-router-dom'

export default function ReviewManage({children}) {
    return (
        <>
            <div className="containe" style={{width:'860px'}}>
                <div className="title">리뷰 관리</div>

                <div className="box-container">
                    <div className="review-box" style={{textAlign:'center', fontSize:"16px", flexDirection: "column"}}>전체 리뷰
                        <div>5건</div>
                    </div>
                    <div className="review-box" style={{textAlign:'center', fontSize:"16px", flexDirection: "column"}}>적립 포인트
                        <div>5000p</div>
                    </div>
                </div>
            </div>
            {/* <div style={{ flex: 1, paddingTop:'10px', width:'860px'}}><ReviewWrite/>{children}</div> */}
            <div style={{ flex: 1, paddingTop:'10px', width:'860px'}}>
                <Outlet /> {/* 여기서 ReviewWrite / ReviewWrited 렌더링 */}
            </div>
        </>
    )
}
