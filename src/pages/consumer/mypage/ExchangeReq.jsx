import React, { useState } from "react";
import {
    Container,
    Row,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Button,
    Card,
    CardBody,
    CardImg,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import "./exchRtrn.css";
export default function ExchangeReq() {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("orderId");
    const [option, setOption] = useState("");
    const [reason, setReason] = useState("");
    const [details, setDetails] = useState("");
    const [images, setImages] = useState([null, null, null]);
    const [returnInfo, setReturnInfo] = useState({
        name: '',
        tel: '',
        part: '',
        postcode: '',
        addr: '',
        detailAddr: '',
        note: ''
    })
    const [shippingInfo, setShippingInfo] = useState({
        name: '',
        tel: '',
        postcode: '',
        addr: '',
        detailAddr: '',
        note: ''
    })
    // 상품정보 조회
    // 상품 변경 가능 옵션 조회


    // 취소신청
    const regist = () => {
        
        const formData = new FormData();
        formData.append("status", 'EXCHANGE_REQUESTED');
        formData.append("order_id", orderId);
        formData.append("order_item_id", "");
        formData.append("gb_product_option_id", "");
        // 변경(재배송) 상품 옵션 ID
        formData.append("req_option_id", option)
        // 신청사유
        formData.append("req_reason", reason)
        // 상품이미지
        formData.append("image1_file_id", images[0])
        formData.append("image2_file_id", images[1])
        formData.append("image3_file_id", images[2])
        // 회수정보
        // 성함
        formData.append("return_name", returnInfo.name)
        // 연락처
        formData.append("return_tel", returnInfo.tel)
        // 회수방법
        formData.append("return_part", returnInfo.part)
        // 우편번호
        formData.append("return_postcode", returnInfo.postcode)
        // 기본주소
        formData.append("return_address", returnInfo.addr)
        // 상세주소
        formData.append("return_detail_address", returnInfo.detailAddr)
        // 요청사항
        formData.append("return_note", returnInfo.note)
        // 배송정보
        // 성함
        formData.append("shipping_username", shippingInfo.name)
        // 연락처
        formData.append("shipping_tel", shippingInfo.tel)
        // 우편번호
        formData.append("shipping_postcode", shippingInfo.postcode)
        // 기본주소
        formData.append("shipping_address", shippingInfo.addr)
        // 상세주소
        formData.append("shipping_detail_address", shippingInfo.detailAddr)
        // 요청사항
        formData.append("shipping_note", shippingInfo.note)
    }
    // 결제 버튼 클릭
    const pay = () => {
        console.log("orderID", params);
        confirm("결제하시겠습니까?", () => {
            regist();
        })


    }

    return (
        <Container className="bg-white p-4" style={{ maxWidth: "860px" }}>
            {/* 타이틀 */}
            <h5 className="mb-4 fw-bold">교환 신청</h5>
            {/* 신청 상품 */}
            <section className="border p-3 mb-4">
                <h6 className="fw-bold mb-3 exch-rtrn-section-header">신청 상품</h6>
                <Row>
                    <Col md="2">
                        <Card className="border-0">
                            <CardImg src="/productSampleImg.png" alt="상품 이미지" />
                        </Card>
                    </Col>
                    <Col md="10">
                        <div className="mb-2">상품명: Start Fuck 500ml 세트</div>
                        <hr />
                        <div className="mb-2 d-flex flex-row"><span style={{ width: "50px" }}>옵션: </span><Input
                            type="select"
                            value={option}
                            style={{ width: "100px" }}
                            onChange={(e) => setOption(e.target.value)}
                        >
                            <option value="s">S size</option>
                            <option value="m">M size</option>
                            <option value="l">L size</option>
                        </Input></div>
                        <hr />
                        <div>₩2000000 / 1개</div>
                    </Col>
                </Row>
            </section>

            {/* 신청 사유 */}
            <section className="border p-3 mb-4">
                <h6 className="fw-bold mb-3 exch-rtrn-section-header">신청 사유</h6>

                <FormGroup>
                    <Input
                        type="select"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    >
                        <option value="">신청 사유를 선택하세요</option>
                        <option value="">배송문제 - 다른 상품이 배송됨</option>
                        <option value="">상품문제 -  상품 구성 누락</option>
                        <option value="">상품문제 - 상품 파손</option>
                        <option value="">상품문제 - 상품 결함/기능 이상</option>
                    </Input>
                </FormGroup>

                <FormGroup>
                    <Input
                        type="textarea"
                        rows={4}
                        placeholder="신청 사유의 자세한 내용을 입력하세요. (선택사항)"
                        style={{ resize: 'none' }}
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                    />
                </FormGroup>
            </section>

            {/* 상품 이미지 첨부 */}
            <section className="border p-3 mb-4">
                <h6 className="fw-bold mb-3 exch-rtrn-section-header">상품 이미지 첨부</h6>

                <Row>
                    {images.map((img, index) => (
                        <Col md="4" key={index} className="text-center">
                            <div
                                className="border d-flex align-items-center justify-content-center"
                                style={{
                                    height: "120px",
                                    cursor: "pointer",
                                    backgroundColor: "#fafafa",
                                }}
                            >
                                <Label
                                    htmlFor={`upload-${index}`}
                                    className="h-100 d-flex align-items-center justify-content-center"
                                    style={{ cursor: "pointer", width: "100%" }}
                                >
                                    {img ? (
                                        <img
                                            src={URL.createObjectURL(img)}
                                            alt="preview"
                                            style={{ maxWidth: "100%", maxHeight: "100%" }}
                                        />
                                    ) : (
                                        <div className="d-flex flex-column justify-content-center text-center align-items-center"><FontAwesomeIcon icon={faPlus} />upload</div>
                                    )}
                                </Label>
                                <Input
                                    id={`upload-${index}`}
                                    type="file"
                                    hidden
                                    onChange={(e) => {
                                        const newImages = [...images];
                                        newImages[index] = e.target.files[0];
                                        setImages(newImages);
                                    }}
                                />
                            </div>
                        </Col>
                    ))}
                </Row>
            </section>

            {/* 회수 정보 */}
            <section className="border p-3 mb-4">
                <h6 className="fw-bold mb-3 exch-rtrn-section-header">회수 정보</h6>

                <FormGroup>
                    <div className="d-flex flex-row justify-content-between gap-5">
                        <Label className="sub-title mt-0">성함</Label>
                        <div className="d-flex gap-2">
                            <Input
                                id="sameInfo"
                                type="checkbox"
                            />
                            {' '}
                            <Label check for="sameInfo">
                                주문정보와 동일
                            </Label>
                        </div>

                    </div>
                    <Input type="text" placeholder="보내는 분 성함" />
                </FormGroup>

                <FormGroup>
                    <Label className="sub-title">연락처</Label>
                    <Input type="text" placeholder="보내는 분 연락처" />
                </FormGroup>

                <FormGroup>
                    <Label className="sub-title">회수 방법</Label>
                    <div className="d-flex flex-row gap-2">
                        <Input type="radio" id="pickup" name="method" className="me-1" />
                        <Label for="pickup" className="me-3">회수 신청</Label>

                        <Input type="radio" id="direct" name="method" className="me-1" />
                        <Label for="direct">직접 배송</Label>
                    </div>
                </FormGroup>

                <FormGroup>
                    <Label className="sub-title">주소</Label>
                    <Row className="d-flex flex-row gap-1">
                        <Col md="4">
                            <Input type="text" placeholder="우편번호" />
                        </Col>
                        <Col md="3">
                            <Button style={{ backgroundColor: '#739FF2' }} block>
                                우편번호 검색
                            </Button>
                        </Col>
                    </Row>
                    <Input className="mt-2" type="text" placeholder="기본 주소" />
                    <Input className="mt-2 mb-2" type="text" placeholder="상세 주소" />
                    <div className="d-flex flex-row gap-2 text-center">
                        <Input type="radio" id="1" name="pickup" className="me-1" />
                        <Label for="1" className="me-3">문앞</Label>
                        <Input type="radio" id="2" name="pickup" className="me-1" />
                        <Label for="2" className="me-3">경비실</Label>
                        <div className="d-flex flex-row gap-2">
                            <div className="d-flex flex-row">
                                <Input type="radio" id="etc" name="pickup" className="me-1" />
                                <Label for="etc" style={{ width: "70px" }}>그 외 장소</Label>
                            </div>
                            <Input type="text" className="w-auto" placeholder="상세 장소입력" />
                        </div>
                    </div>
                </FormGroup>
            </section>

            {/* 배송 정보 */}
            <section className="border p-3 mb-4">
                <h6 className="fw-bold mb-3 exch-rtrn-section-header">배송 정보</h6>

                <FormGroup>
                    <div className="d-flex flex-row justify-content-between gap-5">
                        <Label className="sub-title mt-0">성함</Label>
                        <div className="d-flex gap-2">
                            <Input
                                id="sameInfo"
                                type="checkbox"
                            />
                            {' '}
                            <Label check for="sameInfo">
                                회수정보와 동일
                            </Label>
                        </div>

                    </div>
                    <Input type="text" placeholder="받는분 성함" />
                </FormGroup>

                <FormGroup>
                    <Label className="sub-title">연락처</Label>
                    <Input type="text" placeholder="받는분 연락처" />
                </FormGroup>
                <FormGroup>
                    <Label className="sub-title">주소</Label>
                    <Row className="d-flex flex-row gap-1">
                        <Col md="4">
                            <Input type="text" placeholder="우편번호" style={{ width: 300 }} />
                        </Col>
                        <Col md="3">
                            <Button style={{ backgroundColor: '#739FF2' }} block>
                                우편번호 검색
                            </Button>
                        </Col>
                    </Row>
                    <Input className="mt-2" type="text" placeholder="기본 주소" />
                    <Input className="mt-2 mb-2" type="text" placeholder="상세 주소" />
                    <Input
                        type="textarea"
                        rows={4}
                        placeholder="배송요청 내용을 입력하세요. (선택사항)"
                        value={details}
                        style={{ resize: 'none' }}
                        onChange={(e) => setDetails(e.target.value)}
                    />
                </FormGroup>
            </section>

            {/* 결제 정보 */}
            <section className="border p-3 mb-4">
                <h6 className="fw-bold mb-3 exch-rtrn-section-header">결제 정보</h6>
                <FormGroup>
                    <Label className="sub-title">결제수단</Label>
                    <div>
                        <Label for="card" className="me-3">신용카드</Label>
                    </div>
                </FormGroup>
                <hr />
                <FormGroup>
                    <Label className="sub-title">결제금액</Label>
                    <div>
                        <div className="mb-2">교환배송비 합계: <span>$200 *2 = $400</span></div>
                        <div className="small text-muted mt-2">
                            결제 정보를 확인 후 결제 버튼을 눌러주세요. 선택하신 결제 수단으로 결제됩니다.
                        </div>

                    </div>
                </FormGroup>
            </section>

            {/* 버튼 */}
            <Row className="mt-4">
                <Col className="text-center">
                    <Button color="secondary" className="me-2">
                        취소
                    </Button>
                    <Button style={{ backgroundColor: '#739FF2' }} onClick={pay}>결제 및 신청</Button>
                </Col>
            </Row>
        </Container >
    );
}