import React, { useState } from 'react';
import {Accordion,AccordionBody,AccordionHeader,AccordionItem, UncontrolledAccordion} from 'reactstrap';
export default function InquiryHistoryList(){
    const [open, setOpen] = useState('1');
            const toggle = (id) => {
                if (open === id) {
                setOpen();
                } else {
                setOpen(id);
                }
            };
    return(
        
        <>
            <div className="containe" style={{width:'860px'}}>
                <div className="title">1:1 문의 내역</div>

                <div className="box-container" style={{display:'flex'}}>
                    <div className="review-box" style={{textAlign:'center', fontSize:"16px", flexDirection: "column", width:'280px', marginRight:'10px'}}>전체 문의
                        <div>2건</div>
                    </div>
                    <div className="review-box" style={{textAlign:'center', fontSize:"16px", flexDirection: "column", width:'280px', marginRight:'10px'}}>답변 완료
                        <div>1건</div>
                    </div>
                    <div className="review-box" style={{textAlign:'center', fontSize:"16px", flexDirection: "column", width:'280px'}}>답변 대기
                        <div>1건</div>
                    </div>
                </div>
            </div><br/><br/>

            <UncontrolledAccordion defaultOpen="1">
                <AccordionItem>
                    <AccordionHeader targetId="1">
                        첫 번째 질문
                    </AccordionHeader>
                    <AccordionBody accordionId="1">
                        첫 번째 답변입니다.
                    </AccordionBody>
                </AccordionItem>
            </UncontrolledAccordion>
        </>
    )
}