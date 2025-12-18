import "../../../css/mypage/ReviewManage.css";
import { Outlet } from 'react-router-dom';
import { useEffect, useState } from "react";
import { myAxios } from "../../../config";

export default function ReviewManage({children}) {

    const [reviewCount, setReviewCount] = useState(0);
    const [pointBalance, setPointBalance] = useState(0);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const username = userInfo?.username;
        myAxios().get(`/mypage/reviewInfo/${username}`)
            .then(res => {
                setReviewCount(res.data.reviewCount || 0);
                setPointBalance(res.data.pointBalance || 0);
            })
            .catch(err => console.error("리뷰/포인트 조회 실패:", err));
    }, []);


    return (
        <>
            <div className="containe" style={{width:'860px'}}>
                <div className="mb-0 fw-bold text-start" style={{fontSize:'20px', padding:'20px 0'}}>리뷰 관리</div>

                <div className="box-container" style={{display:'flex'}}>
                    <div className="review-box" style={{textAlign:'center', fontSize:"16px", flexDirection: "column", width:'500px', marginRight:'20px' }}>전체 리뷰
                        <div>{reviewCount}건</div>
                    </div>
                    <div className="review-box" style={{textAlign:'center', fontSize:"16px", flexDirection: "column", width:'500px'}}>적립 포인트
                        <div>{pointBalance}p</div>
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
