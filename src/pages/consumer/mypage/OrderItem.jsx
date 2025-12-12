import React from "react";
import { Button } from "reactstrap";

export default function OrderItem({
  requestedAt,
  orderDate,
  orderNum,
  product,
  options,
  quantity,
  price,
  status,
}) {
  return (
    <div style={styles.row}>
      <div style={{ ...styles.col, width: "10%" }}>{requestedAt}</div>
      <div style={{ ...styles.col, width: "10%" }}>{orderDate}</div>
      <div style={{ ...styles.col, width: "15%" }}>{orderNum}</div>

      <div style={{ ...styles.col, width: "30%", textAlign: "left" }}>
        <div style={styles.productWrap}>
          <div style={styles.imageBox}>이미지</div>
          <div>
            <div style={styles.product}>{product}</div>
            <div style={styles.option}>{options}</div>
          </div>
        </div>
      </div>

      <div style={{ ...styles.col, width: "5%" }}>{quantity}</div>
      <div style={{ ...styles.col, width: "10%" }}>
        <strong>{price}원</strong>
      </div>

      <div style={{ ...styles.col, width: "10%" }}>
        <span style={styles.status}>{status}</span>
      </div>

      <div style={{ ...styles.col, width: "10%" }}>
        <Button size="sm" outline style={styles.detailBtn}>
          상세보기
        </Button>
      </div>
    </div>
  );
}

const styles = {
  row: {
    display: "flex",
    alignItems: "center",
    padding: "14px 0",
    borderBottom: "1px solid #eee",
    fontSize: "12px",
  },
  col: {
    textAlign: "center",
  },
  productWrap: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  imageBox: {
    width: "50px",
    height: "50px",
    border: "1px solid #ddd",
    fontSize: "11px",
    color: "#aaa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  product: {
    fontWeight: "bold",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "220px",
  },
  option: {
    fontSize: "11px",
    color: "#777",
  },
 status: {
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    whiteSpace: "nowrap",
    backgroundColor: "rgb(242, 249, 252)",
    color: "rgb(118, 147, 252)",
    border: "1px solid rgb(118, 147, 252)",
    display: "inline-block",
  },
  detailBtn: {
    width: "80px",
    fontSize: "10px",
    marginBottom: "5px",
    padding: "5px 0px",
    border: "1px solid rgb(204, 204, 204)",
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: "4px",
    cursor: "pointer",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
};
