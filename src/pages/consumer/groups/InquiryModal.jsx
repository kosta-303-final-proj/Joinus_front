import React, { useState } from "react";
import { myAxios } from "../../../config";

export default function InquiryModal({ onClose, gbProductId, onQnaAdded }) {
    const [question, setQuestion] = useState("");

    const submit = () => {
        if(!question.trim()){
            alert("문의 내용을 입력해주세요");
            return;
        }

        // 로그인 유저 정보 가져오기
        const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        if(!userInfo || !userInfo.username){
            alert("로그인 정보가 없습니다.");
            return;
        }
        const memberUsername = userInfo.username;

        // 서버에 보낼 payload
        const payload = {
            username: memberUsername, // 세션에서 가져온 username 사용
            gbProductId: gbProductId,
            question: question
        };

        myAxios().post("/qna", payload)
        .then(res=>{
            console.log(res);
            alert("문의가 정상적으로 등록되었습니다."); // 성공 시 alert
            onQnaAdded && onQnaAdded(res.data); // 부모 컴포넌트에 새로운 QnA 전달
            onClose();
        })
        .catch(err=>{
            console.log(err);
            alert("문의 등록 중 오류가 발생했습니다.");
        })
    }

    
    return (
        <>
            {/* ⭐ 모달 배경 */}
            <div style={overlayStyle}></div>

            {/* ⭐ 모달 박스 */}
            <div style={modalStyle}>
                {/* 닫기 버튼 */}
                <div style={topBarStyle}>
                    <span style={titleStyle}>상품 문의하기</span>
                    <span style={closeBtnStyle} onClick={onClose}>✕</span>
                </div>

                <div style={{ padding: '20px 30px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                        배송 * 반품 * 교환 문의는 1:1 문의로 남겨주세요.
                    </div>

                    {/* textarea */}
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="성분, 사용법, 구성 등 상품에 대해 문의할 내용을 입력해 주세요."
                        style={textareaStyle}
                    ></textarea>

                    {/* 안내문 */}
                    <div style={{ fontSize: '13px', marginTop: '10px', color: '#333' }}>
                        <ul style={{ paddingLeft: '15px' }}>
                            <li>문의하신 내용에 대한 답변은 마이페이지에서 확인할 수 있습니다.</li>
                            <li>재판매글, 상업성 홍보글, 미풍양속을 해치는 글 등 상품 Q&A의 취지에 맞지 않은 글은 삭제될 수 있습니다.</li>
                        </ul>
                    </div>

                    {/* 등록하기 버튼 */}
                    <button onClick={submit} style={submitBtnStyle}>등록하기</button>
                </div>
            </div>
        </>
    );
}

/* ---------------- 스타일 ---------------- */

const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 999,
};

const modalStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "450px",
    backgroundColor: "#fff",
    borderRadius: "6px",
    zIndex: 1000,
    overflow: "hidden",
};

const topBarStyle = {
    background: "#EA5323",
    padding: "12px 15px",
    display: "flex",
    justifyContent: "space-between",
    color: "#fff",
    fontWeight: "bold",
};

const titleStyle = {
    fontSize: "16px",
};

const closeBtnStyle = {
    cursor: "pointer",
    fontSize: "18px",
};

const textareaStyle = {
    width: "100%",
    height: "180px",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    resize: "none",
    fontSize:'14px'
};

const submitBtnStyle = {
    width: "100%",
    marginTop: "20px",
    background: "#5A83F7",
    color: "#fff",
    padding: "12px 0",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
};
