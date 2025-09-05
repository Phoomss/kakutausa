import http from "./http-common";

const API_URL = "/api/products";

const getAllProducts = () => {
  return http.get(API_URL);
};

const getProductById = (id) => {
  return http.get(`${API_URL}/${id}`);
};

const createProduct = (data) => {
  return http.post(API_URL, data);
};

const updateProduct = (id, data) => {
  return http.put(`${API_URL}/${id}`, data);
};

const deleteProduct = (id) => {
  return http.delete(`${API_URL}/${id}`);
};

const uploadProductImage = (id, file) => {
  const formData = new FormData();
  formData.append("images", file);

  return http.post(`${API_URL}/${id}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const uploadProductModel = (id, gltfFile, binFile) => {
  const formData = new FormData();
  if (gltfFile) formData.append("gltf", gltfFile);
  if (binFile) formData.append("bin", binFile);

  return http.post(`${API_URL}/${id}/models`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const getProductImages = (id) => {
  return http.get(`${API_URL}/${id}/images`);
};

const getProductModels = (id) => {
  return http.get(`${API_URL}/${id}/models`);
};

const productService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  uploadProductModel,
  getProductImages,
  getProductModels,
};

export default productService;
