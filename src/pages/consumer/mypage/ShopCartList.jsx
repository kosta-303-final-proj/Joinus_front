import "bootstrap/dist/css/bootstrap.min.css";
import { Label, FormGroup, Input, Button, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import '../../../css/mypage/ShopCartList.css';
import { useState } from "react";

export default function ShopCartList() {
  const [cartList, setCartList] = useState([]);
  return (
    <div className="container">
      <div className="fw-bold d-block" style={{ fontSize: "20px", margin: "20px auto" }}>장바구니</div>

      {/* 헤더 */}
      <hr style={{ margin: "5px auto 0 auto" }} />
      <FormGroup check className="header" style={{backgroundColor:'#F2F9FC', marginBottom:'0px', height:'35px'}}>
        <Label className="headerLabel" style={{ margin: "0 330px 0 5px " }}>상품정보</Label>
        <Label className="headerLabel" style={{ margin: "0 40px 0 0" }}>가격</Label>
        <Label className="headerLabel" style={{ margin: "0 45px 0 0" }}>수량</Label>
        <Label className="headerLabel" style={{ margin: "0 30px 0 0" }}>구매가</Label>
        <Label className="headerLabel" style={{ margin: "0 35px 0 0" }}>선택</Label>
      </FormGroup>
      <hr style={{ margin: "0 auto 5px auto" }} />
      {/* 상품 리스트 */}
      <div className="productList">
        {cartList.map(item=>(
          <FormGroup  check className="productItem" key={item.cartId}>
            <img src={item.thumbnailPath} alt="상품 이미지" className="productImg" />
            <div className="productName">{item.productName}</div>
            <div className="productPrice">{item.price}원</div>
            <div className="productQuantity">{item.quantity}</div>
            <div className="productTotal">{item.price * item.quantity}원</div>
            <div className="buttonGroup">
              <Button size="sm" className="buttonPrimary" style={{width:"70px"}}>결제</Button>
              <Button size="sm" className="buttonSecondary">삭제</Button>
            </div>
          </FormGroup>
          ))}
      </div>
      <hr style={{ margin: "5px auto" }} />

      {/* 페이지네이션 */}
      <Pagination className="paginationContainer">
        <PaginationItem><PaginationLink first href="#" /></PaginationItem>
        <PaginationItem><PaginationLink previous href="#" /></PaginationItem>
        {[1,2,3,4,5].map(num => (
          <PaginationItem key={num}><PaginationLink href="#">{num}</PaginationLink></PaginationItem>
        ))}
        <PaginationItem><PaginationLink next href="#" /></PaginationItem>
        <PaginationItem><PaginationLink last href="#" /></PaginationItem>
      </Pagination>
    </div>
  );
}
