import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApprovedSupplierList, createSupplyProduct } from '../../../services/supplyApi';
import AdminHeader from '../../../components/layout/AdminHeader';
import './DeliveryProductForm.css';

export default function DeliveryProductForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    productName: '',
    vendorId: '',
    quantity: '',
    unitPrice: '',
    totalPrice: '',
    deliveryDate: '',
    note: ''
  });
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 승인된 업체 목록 로드
  useEffect(() => {
    const fetchVendors = async () => {
      setIsLoading(true);
      try {
        const data = await getApprovedSupplierList('', '전체', 'name');
        setVendors(data || []);
      } catch (err) {
        console.error('업체 목록 조회 실패:', err);
        alert('업체 목록을 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...form, [name]: value };

    if (name === 'quantity' || name === 'unitPrice') {
      const quantity = name === 'quantity' ? Number(value) : Number(form.quantity);
      const unitPrice = name === 'unitPrice' ? Number(value) : Number(form.unitPrice);
      if (!Number.isNaN(quantity) && !Number.isNaN(unitPrice)) {
        updated.totalPrice = quantity * unitPrice;
      } else {
        updated.totalPrice = '';
      }
    }

    setForm(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productName || !form.vendorId || !form.quantity || !form.unitPrice) {
      alert('필수 항목을 모두 입력하세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const productData = {
        productName: form.productName,
        supplierId: Number(form.vendorId),
        quantity: Number(form.quantity),
        unitPrice: Number(form.unitPrice),
        deliveryDate: form.deliveryDate ? new Date(form.deliveryDate).toISOString() : null,
        memo: form.note || ''
      };

      await createSupplyProduct(productData);
      alert('납품 상품이 등록되었습니다.');
      navigate('/admin/suppliy/products');
    } catch (err) {
      console.error('상품 등록 실패:', err);
      alert('상품 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-layout">
      <div className="main-content">
        <AdminHeader title="납품상품 등록" />
        <div className="content-area">
    <div className="delivery-product-form-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">납품 상품 등록</h1>
          <p className="page-description">
            승인된 납품 업체 중 선택하여 상품명, 수량, 단가 등을 입력합니다.
          </p>
        </div>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="form-field">
            <span>상품명 *</span>
            <input
              type="text"
              name="productName"
              value={form.productName}
              onChange={handleChange}
              placeholder="예) 친환경 텀블러 세트"
              required
            />
          </label>

          <label className="form-field">
            <span>납품 업체 *</span>
            <select
              name="vendorId"
              value={form.vendorId}
              onChange={handleChange}
              required
              disabled={isLoading}
            >
              <option value="">{isLoading ? '로딩 중...' : '선택하세요'}</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.companyName}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>수량 *</span>
            <input
              type="number"
              name="quantity"
              min="1"
              value={form.quantity}
              onChange={handleChange}
              placeholder="예) 100"
              required
            />
          </label>

          <label className="form-field">
            <span>단가(원) *</span>
            <input
              type="number"
              name="unitPrice"
              min="0"
              value={form.unitPrice}
              onChange={handleChange}
              placeholder="예) 8000"
              required
            />
          </label>

          <label className="form-field">
            <span>총 금액(자동 계산)</span>
            <input
              type="text"
              name="totalPrice"
              value={
                form.totalPrice
                  ? form.totalPrice.toLocaleString('ko-KR') + '원'
                  : ''
              }
              readOnly
            />
          </label>

          <label className="form-field">
            <span>납품 예정일</span>
            <input
              type="date"
              name="deliveryDate"
              value={form.deliveryDate}
              onChange={handleChange}
            />
          </label>

          <label className="form-field full">
            <span>비고</span>
            <textarea
              name="note"
              rows="4"
              value={form.note}
              onChange={handleChange}
              placeholder="추가 참고 사항을 입력하세요."
            />
          </label>
        </div>

        <div className="form-actions">
          <button 
            type="reset" 
            onClick={() => setForm({
              productName: '',
              vendorId: '',
              quantity: '',
              unitPrice: '',
              totalPrice: '',
              deliveryDate: '',
              note: ''
            })}
            disabled={isSubmitting}
          >
            초기화
          </button>
          <button type="submit" className="primary-btn" disabled={isSubmitting}>
            {isSubmitting ? '등록 중...' : '등록하기'}
          </button>
        </div>
      </form>
    </div>
        </div>
      </div>
    </div>
  );
}