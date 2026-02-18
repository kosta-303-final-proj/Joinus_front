import { myAxios } from '../config';

export const createProduct = async (formData) => {
  const response = await myAxios().post(
    '/admin/gbProductCreate',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
};

export const updateProduct = async (productId, formData) => {
  await myAxios().put(
    `/admin/gbProduct/${productId}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
};

export const createOptions = async (productId, options) => {
  await myAxios().post(
    `/admin/gbProducts/${productId}/options`,
    options
  );
};

export const getProduct = async (productId) => {
  const response = await myAxios().get(`/admin/gbProduct/${productId}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await myAxios().get('/admin/categories');
  return response.data;
};

export const getFileBlob = async (fileId) => {
  const response = await myAxios().get(`/admin/file/${fileId}`, {
    responseType: 'blob'
  });
  return response.data;
};

