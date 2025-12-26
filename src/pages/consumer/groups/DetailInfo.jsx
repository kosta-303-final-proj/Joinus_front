import { useEffect, useState } from "react";
import { Link, useParams, Outlet, useOutletContext } from "react-router-dom";
import { Button, Label, } from "reactstrap";
import { myAxios, baseUrl } from "../../../config";
export default function DetailInfo() {
  const { id } = useParams();
  const [detail, setDetail] = useState({ product: {}, category: {}, thumbnailFile: {}, images: [], options: [], details: [] });

  const [expanded, setExpanded] = useState(false);

  const { showAllDetails, setShowAllDetails, details } = useOutletContext();

  const getProduct = () => {
    myAxios().get(`/gbProductDetail/${id}`)
      .then(res => {
        console.log(res)
        setDetail(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    getProduct();
  }, [])

  const getProposalUrl = () => {
    myAxios().get(`getProductUrl/${id}`)
  }

  const description = detail.product.description || "";
  const limit = 200; // 200글자 이상이면 접기/펼치기 적용
  const isLong = description.length > limit;
  const displayedText = expanded || !isLong ? description : description.substring(0, limit) + "...";

  return (
    <>
      <div>
        <div style={styles.pageWrapper}>
          <div style={styles.container}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '860px', }}>
              <div style={{ background: '#E5EEFF', padding: '5px 0' }}>
                <Label style={{ fontWeight: 'bold', margin: '0', width: '255px', textAlign: 'center' }}>상품 설명</Label>
              </div>
              <div style={{ padding: '5px 0' }}><Link to={`/gbProductDetail/${id}/reviews`} style={{ color: 'black' }}>
                <Label style={{ fontWeight: 'bold', margin: '0', width: '255px', textAlign: 'center' }}>리뷰</Label></Link>
              </div>
              <div style={{ padding: '5px 0' }}><Link to={`/gbProductDetail/${id}/qAndA`} style={{ color: 'black' }}>
                <Label style={{ fontWeight: 'bold', margin: '0', width: '255px', textAlign: 'center' }}>Q & A</Label></Link>
              </div>
              <div style={{ padding: '5px 0' }}><Link to={`/gbProductDetail/${id}/policy`} style={{ color: 'black' }}>
                <Label style={{ fontWeight: 'bold', margin: '0', width: '255px', textAlign: 'center' }}>배송/환뷸 규칙</Label></Link>
              </div>
            </div>
            <hr style={{ marginTop: '0' }} />
          </div>
        </div>
        <div style={styles.pageWrapper}>
          <div style={styles.container}>
            <div style={{ padding: '0' }}>
              {/* <Label style={{ fontSize: '24px' }}>상품 설명</Label> */}

              {/* 여기에 상세 이미지 더보기/접기 버튼 추가 */}
              {/* 이미지 리스트 */}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                  backgroundColor: "#fff",
                  gap: "20px",
                }}
              >

                {detail.details && detail.details.length > 0 && (
                  <>
                    {/* 첫 번째 이미지 */}
                    <div
                      style={{
                        width: "100%",
                        maxWidth: "800px",
                        height: "auto",
                        maxHeight: "800px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={`${baseUrl}/files/${detail.details[0].fileName}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          cursor: "default",
                          pointerEvents: "none",
                        }}
                      />
                    </div>

                    {/* 나머지 이미지 */}
                    {showAllDetails &&
                      detail.details.slice(1).map((img, idx) => (
                        <div
                          key={idx}
                          style={{
                            width: "100%",
                            maxWidth: "800px",
                            height: "auto",
                            maxHeight: "800px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={`${baseUrl}/files/${img.fileName}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              cursor: "default",
                              pointerEvents: "none",
                            }}
                          />
                        </div>
                      ))}
                  </>
                )}

                {/* 더보기 / 접기 버튼을 이미지 영역과 분리 */}
                {detail.details && detail.details.length > 1 && (
                  <div style={{ marginTop: "10px" }}> {/* 이미지와 버튼 사이 공백 */}
                    <button
                      onClick={() => setShowAllDetails(!showAllDetails)}
                      style={{
                        padding: "12px 200px",
                        fontSize: "14px",
                        cursor: "pointer",
                        border: "1px solid #d0d0d0",
                        backgroundColor: "#fff",
                        borderRadius: "4px",
                        color: "#666",
                        fontWeight: "500",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f8f8f8";
                        e.currentTarget.style.borderColor = "#999";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#fff";
                        e.currentTarget.style.borderColor = "#d0d0d0";
                      }}
                    >
                      이미지 {showAllDetails ? "접기" : "더보기"}
                      <span style={{
                        fontSize: "12px",
                        transform: showAllDetails ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s"
                      }}>
                        ▼
                      </span>
                    </button>
                  </div>
                )}
              </div>


              <div style={{
                marginTop: "24px",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontSize: "16px",
                lineHeight: "1.5",
              }}>
                {displayedText}
                {isLong && (
                  <span
                    onClick={() => setExpanded(!expanded)}
                    style={{ color: "#739FF2", cursor: "pointer", marginLeft: "5px" }}
                  >
                    {expanded ? "접기" : "더보기"}
                  </span>
                )}
              </div> <br />

              {/* 제안 링크(PROPOSALID) 있을 때만 표시! */}
              {detail.product.proposalId && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '20px',
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div className="fw-bold" style={{
                    fontSize: '16px',
                    marginRight: '12px',
                    color: '#374151'
                  }}>
                    💡 이 공구는 제안에서 시작되었습니다
                  </div>
                  <Button
                    onClick={() => window.open(`/proposalDetail/${detail.product.proposalId}`, "_blank")}
                    style={{
                      backgroundColor: '#739FF2',
                      width: "100px",
                      height: "32px",
                      fontSize: "13px",
                      fontWeight: "600",
                      padding: "0",
                      border: 'none',
                      borderRadius: '6px'
                    }}
                  >
                    제안 보기
                  </Button>
                </div>
              )}
            </div>
            <hr />
            <div style={{ padding: '0 20px' }}>
              <Label style={{ fontSize: '24px' }}>가격 계산 방식</Label>
              <div style={{ border: '1px solid #b2b6f3ff', backgroundColor: '#F2F9FC', padding: "10px", height: '100px', alignContent: 'center' }}>
                <div>(원가 × 환율) + (해외배송비 × 환율 ÷ 인원) × (1 + 수수료) + 국내배송비</div>
                <div>※ 환율 변동 및 참여 인원에 따라 최종 가격이 소폭 변동될 수 있습니다.</div>
              </div> <br />
            </div>
            <hr />
          </div>
        </div>
        <Outlet context={{ id }} />
      </div>
    </>
  )
}

const styles = {
  pageWrapper: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#fff",
  },
  container: {
    width: "1020px",
    padding: "20px 0",
  },
  container2: {
    width: "1020px",
    padding: "0 20px",
  },

  // 전체 폭 hr
  fullWidthHr: {
    width: "100%",
    margin: "0",
  },

  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "10px",
    marginTop: "10px",
  },
  imageBox: {
    border: "1px dashed #bbb",
    height: "140px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "4px",
    position: "relative",
    cursor: "pointer",
    overflow: "hidden",
    backgroundColor: "#fafafa",
  },
  fileInput: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0,
    cursor: "pointer",
  },
  preview: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  tag: {
    backgroundColor: "#E7EBF3",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    cursor: "pointer",
  },

  tagWhite: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #CED4DA",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    cursor: "pointer",
  }
};