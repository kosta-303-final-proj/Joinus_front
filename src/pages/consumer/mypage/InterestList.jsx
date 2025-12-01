import "bootstrap/dist/css/bootstrap.min.css";
import { Label, FormGroup, Input, Button, Pagination, PaginationItem, PaginationLink} from "reactstrap";
import { useState } from "react";

export default function InterestList() {
  return (
    <>
      <div className="fw-bold d-block" style={{ fontSize: "20px", margin: "15px auto" }}>관심상품</div>
      <div>
        <hr style={{ margin: "5px auto" }} />
        <FormGroup check style={{display: "flex",justifyContent: "space-between",alignItems: "center"}}>
          {/* 전체선택 */}
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Input type="checkbox" />
            <Label check style={{ margin: 0, fontSize: "12px" }}>
              전체 선택
            </Label>
          </div>

          {/* 헤더 */}
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <Label style={{ color: "black", fontSize: "12px", margin: "0 250px 0 0 " }}>상품명</Label>
            <Label style={{ color: "black", fontSize: "12px", margin: "0 50px 0 0" }}>가격</Label>
            <Label style={{ color: "black", fontSize: "12px", margin: "0 50px 0 0" }}>만족도</Label>
            <Label style={{ color: "black", fontSize: "12px", margin: "0 35px 0 0" }}>주문</Label>
          </div>
        </FormGroup>
        <hr style={{ margin: "5px auto" }} />

        {/* 상품 리스트 */}
            <FormGroup check style={{ display: "flex", height: "120px", alignItems: "center" }}>
                <Input type="checkbox" style={{ marginRight: "30px" }} />

                {/* 상품 이미지 */}
                <img src="/note.png" style={{ width: "70px", height: "70px", marginRight: "20px" }}/>

                {/* 상품명 */}
                <div style={{ fontSize: "12px", width: "400px", marginRight: "20px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    ASUS 비보북 S 16 M3607KA-SH035W (SSD 512GB)
                </div>

                {/* 가격 */}
                <div style={{ fontSize: "12px", width: "100px", marginRight: "40px", textAlign: "right" }}>1,090,000원</div>

                {/* 만족도 */}
                <div style={{ fontSize: "12px", width: "50px", marginRight: "40px", textAlign: "center" }}>4.5</div>

                {/* 주문 버튼 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <Button size="sm" style={{backgroundColor:'#739FF2', color:'white', border:'none'}}>장바구니</Button>
                    <Button size="sm" style={{backgroundColor:'#f7f7f7', color:'black', border:'none'}}>삭제</Button>
                </div>
            </FormGroup>
            <hr style={{ margin: "10px auto" }} />
        </div>
        <Pagination>
            <PaginationItem>
                <PaginationLink
                first
                href="#"
                />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink
                href="#"
                previous
                />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink href="#">
                1
                </PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationLink href="#">
                2
                </PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationLink href="#">
                3
                </PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationLink href="#">
                4
                </PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationLink href="#">
                5
                </PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationLink
                href="#"
                next
                />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink
                href="#"
                last
                />
            </PaginationItem>
        </Pagination>
    </>
  );
}