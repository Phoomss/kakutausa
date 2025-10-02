import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Upload, Eye } from "lucide-react";
import productService from "../../../services/productService";
import categoryService from "../../../services/categoryService";
import ViewProductModal from "../props/ViewProductModal";
import { API_IMAGE_URL } from "../../../configs/constants";

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    details: "",
    description: "",
    categoryId: "",
    sizes: [{
      holdingCapacityMetric: "",
      weightMetric: "",
      handleMovesMetric: "",
      barMovesMetric: "",
      drawingMovementMetric: "",
      holdingCapacityInch: "",
      weightInch: "",
      handleMovesInch: "",
      barMovesInch: "",
      drawingMovementInch: ""
    }],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [modelFiles, setModelFiles] = useState({ gltf: null, bin: null, step: null });
  const [viewProduct, setViewProduct] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [existingModels, setExistingModels] = useState({ gltf: null, bin: null, step: null });
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      const updatedProducts = await Promise.all(products.map(async (p) => {
        const res = await productService.getProductImages(p.id);
        return { ...p, images: res.data.data };
      }));
      setProducts(updatedProducts);
    };

    fetchImages();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getAllProducts();
      const productsData = res.data.data;
      console.log(productsData)

      // fetch images + models
      const updatedProducts = await Promise.all(
        productsData.map(async (p) => {
          const imagesRes = await productService.getProductImages(p.id);
          const modelsRes = await productService.getProductModels(p.id);
          return {
            ...p,
            images: imagesRes.data.data || [],
            models: modelsRes.data.data || [],
          };
        })
      );

      setProducts(updatedProducts);
      // console.log(
      //   updatedProducts.map(p => ({
      //     id: p.id,
      //     name: p.name,
      //     images: p.images.map(img => img.imageUrl),
      //     models: p.models.map(m => ({ gltf: m.gltfUrl, bin: m.binUrl }))
      //   }))
      // );

    } catch (err) {
      console.error(err);
      alert("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getAllCategories();
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (index, e, type) => {
    const { name, value } = e.target;
    const newSizes = [...formData.sizes];
    newSizes[index][name] = value;
    setFormData(prev => ({ ...prev, sizes: newSizes }));
  };

  const addSizeRow = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, {
        holdingCapacityMetric: "",
        weightMetric: "",
        handleMovesMetric: "",
        barMovesMetric: "",
        drawingMovementMetric: "",
        holdingCapacityInch: "",
        weightInch: "",
        handleMovesInch: "",
        barMovesInch: "",
        drawingMovementInch: ""
      }]
    }));
  };

  const removeSizeRow = (index) => {
    if (formData.sizes.length > 1) {
      const updatedSizes = formData.sizes.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, sizes: updatedSizes }));
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      details: "",
      description: "",
      categoryId: "",
      sizes: [{
        holdingCapacityMetric: "",
        weightMetric: "",
        handleMovesMetric: "",
        barMovesMetric: "",
        drawingMovementMetric: "",
        holdingCapacityInch: "",
        weightInch: "",
        handleMovesInch: "",
        barMovesInch: "",
        drawingMovementInch: ""
      }],
    });
    setImageFiles([]);
    setModelFiles({ gltf: null, bin: null, step: null });
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await productService.deleteProduct(productId);
      fetchProducts();
      alert("Product deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.categoryId) {
      alert("Please fill out product name and category!");
      return;
    }
    try {
      setSaving(true);
      let productId = formData.id;

      if (formData.id) {
        await productService.updateProduct(formData.id, formData);
      } else {
        const res = await productService.createProduct(formData);
        productId = res.data.data.id;
      }

      if (imageFiles.length > 0) {
        await productService.uploadProductImages(productId, imageFiles);
      }

      if (modelFiles.gltf || modelFiles.bin || modelFiles.step) {
        await productService.uploadProductModel(
          productId,
          modelFiles.gltf,
          modelFiles.bin,
          modelFiles.step
        );
      }

      await fetchProducts();
      setShowModal(false);
      resetForm();
      alert("Product saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const openModal = (product = null) => {
    setShowModal(true);
    if (product) {
      const mappedSizes = product.sizes?.map(s => ({
        holdingCapacityMetric: s.holdingCapacityMetric || "",
        weightMetric: s.weightMetric || "",
        handleMovesMetric: s.handleMovesMetric || "",
        barMovesMetric: s.barMovesMetric || "",
        drawingMovementMetric: s.drawingMovementMetric || "",
        holdingCapacityInch: s.holdingCapacityInch || "",
        weightInch: s.weightInch || "",
        handleMovesInch: s.handleMovesInch || "",
        barMovesInch: s.barMovesInch || "",
        drawingMovementInch: s.drawingMovementInch || ""
      }));

      setFormData({
        id: product.id,
        name: product.name || "",
        details: product.details || "",
        description: product.description || "",
        categoryId: product.categoryId || "",
        sizes: mappedSizes.length ? mappedSizes : [{
          holdingCapacityMetric: "",
          weightMetric: "",
          handleMovesMetric: "",
          barMovesMetric: "",
          drawingMovementMetric: "",
          holdingCapacityInch: "",
          weightInch: "",
          handleMovesInch: "",
          barMovesInch: "",
          drawingMovementInch: ""
        }]
      });

      // Load existing images and models
      setExistingImages(product.images || []);
      setExistingModels(product.models?.[0] || { gltf: null, bin: null, step: null }); // ถ้า models เป็น array
      setImageFiles([]); // reset new uploads
      setModelFiles({ gltf: null, bin: null, step: null });
    } else {
      resetForm();
      setExistingImages([]);
      setExistingModels({ gltf: null, bin: null, step: null });
    }
  };

  const getFullImageUrl = (imagePath) => {
    return imagePath ? `${API_IMAGE_URL}${imagePath}` : null;
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Products Management</h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          disabled={loading}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        {/* Search by Name */}
        <input
          type="text"
          placeholder="Search by product name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Search by Category */}
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow border">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No products found. Click "Add Product" to create your first product.
          </div>
        ) : (
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Image</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Sizes</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products
                .filter(p =>
                  p.name.toLowerCase().includes(searchName.toLowerCase()) &&
                  (searchCategory === "" || p.category?.name === searchCategory)
                )
                .map(p => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {p.images && p.images.length > 0 ? (
                        <div className="flex gap-1">
                          {p.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={getFullImageUrl(img.imageUrl)}
                              alt={`Product ${p.name} - ${idx + 1}`}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded">
                          <Upload className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-gray-600">{p.category?.name || 'No Category'}</td>
                    <td className="px-4 py-3 text-gray-600">{p.sizes?.length || 0} size(s)</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => setViewProduct(p)} className="p-2 hover:bg-gray-100 rounded-md" title="View Product">
                          <Eye className="w-4 h-4 text-green-600" />
                        </button>
                        <button onClick={() => openModal(p)} className="p-2 hover:bg-gray-100 rounded-md" title="Edit Product">
                          <Edit className="w-4 h-4 text-blue-600" />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-gray-100 rounded-md" title="Delete Product">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      {viewProduct && (
        <ViewProductModal product={viewProduct} onClose={() => setViewProduct(null)} />
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-2/3 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">{formData.id ? "Edit Product" : "Add Product"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded" disabled={saving}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Inputs */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input type="text" name="name" placeholder="Product Name *" value={formData.name} onChange={handleInputChange} className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={saving} />
              <input type="text" name="details" placeholder="Details" value={formData.details} onChange={handleInputChange} className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={saving} />
            </div>
            <div className="mb-4">
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={saving} />
            </div>
            <div className="mb-6">
              <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={saving}>
                <option value="">Select Category *</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>

            {/* Sizes Section */}
            <div className="mb-6">
              <h4 className="font-semibold mb-4">Product Specifications</h4>
              {formData.sizes.map((size, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="font-medium text-gray-700">Size {index + 1}</h5>
                    {formData.sizes.length > 1 && (
                      <button onClick={() => removeSizeRow(index)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Metric */}
                    <div>
                      <h6 className="font-medium text-green-600 mb-2">Metric Specifications</h6>
                      <div className="space-y-2">
                        <input type="text" name="holdingCapacityMetric" placeholder="Holding Capacity (kg)" value={size.holdingCapacityMetric} onChange={e => handleSizeChange(index, e, "metric")} className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500" disabled={saving} />
                        <input type="text" name="weightMetric" placeholder="Weight (g)" value={size.weightMetric} onChange={e => handleSizeChange(index, e, "metric")} className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500" disabled={saving} />
                        <input type="text" name="handleMovesMetric" placeholder="Handle Moves" value={size.handleMovesMetric} onChange={e => handleSizeChange(index, e, "metric")} className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500" disabled={saving} />
                        <input type="text" name="barMovesMetric" placeholder="Bar Moves" value={size.barMovesMetric} onChange={e => handleSizeChange(index, e, "metric")} className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500" disabled={saving} />
                        <input type="text" name="drawingMovementMetric" placeholder="Drawing Movement" value={size.drawingMovementMetric} onChange={e => handleSizeChange(index, e, "metric")} className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500" disabled={saving} />
                      </div>
                    </div>

                    {/* Imperial */}
                    <div>
                      <h6 className="font-medium text-blue-600 mb-2">Imperial Specifications</h6>
                      <div className="space-y-2">
                        <input type="text" name="holdingCapacityInch" placeholder="Holding Capacity (lbs)" value={size.holdingCapacityInch} onChange={e => handleSizeChange(index, e, "imperial")} className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" disabled={saving} />
                        <input type="text" name="weightInch" placeholder="Weight (lbs)" value={size.weightInch} onChange={e => handleSizeChange(index, e, "imperial")} className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" disabled={saving} />
                        <input type="text" name="handleMovesInch" placeholder="Handle Moves" value={size.handleMovesInch} onChange={e => handleSizeChange(index, e, "imperial")} className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" disabled={saving} />
                        <input type="text" name="barMovesInch" placeholder="Bar Moves" value={size.barMovesInch} onChange={e => handleSizeChange(index, e, "imperial")} className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" disabled={saving} />
                        <input type="text" name="drawingMovementInch" placeholder="Drawing Movement" value={size.drawingMovementInch} onChange={e => handleSizeChange(index, e, "imperial")} className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" disabled={saving} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button onClick={addSizeRow} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center" disabled={saving}>
                <Plus className="w-5 h-5 mr-2" /> Add Another Size Specification
              </button>
            </div>

            {/* Upload Section */}
            <div className="mb-6 grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Upload Images</h4>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setImageFiles(Array.from(e.target.files))}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
             file:rounded file:border-0 file:text-sm file:font-medium 
             file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  disabled={saving}
                />
                {imageFiles.length > 0 && <p className="text-sm text-gray-600 mt-1">{imageFiles.length} file(s) selected</p>}
              </div>
              <div>
                <h4 className="font-semibold mb-2">Upload 3D Model</h4>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept=".gltf"
                    onChange={e => setModelFiles(prev => ({ ...prev, gltf: e.target.files[0] }))}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 
      file:rounded file:border-0 file:text-xs file:font-medium 
      file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    disabled={saving}
                  />
                  <input
                    type="file"
                    accept=".bin"
                    onChange={e => setModelFiles(prev => ({ ...prev, bin: e.target.files[0] }))}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 
      file:rounded file:border-0 file:text-xs file:font-medium 
      file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    disabled={saving}
                  />
                  {/* ✅ New STEP file input */}
                  <input
                    type="file"
                    accept=".step"
                    onChange={e => setModelFiles(prev => ({ ...prev, step: e.target.files[0] }))}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 
      file:rounded file:border-0 file:text-xs file:font-medium 
      file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    disabled={saving}
                  />
                </div>
                {(modelFiles.gltf || modelFiles.bin || modelFiles.step) && <p className="text-sm text-gray-600 mt-1">{modelFiles.gltf ? '✓ GLTF ' : ''}{modelFiles.bin ? '✓ BIN' : ''} {modelFiles.step ? '✓ STEP' : ''}</p>}
              </div>
            </div>

            {/* New Images Preview */}
            {imageFiles.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-2">
                {imageFiles.map((file, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setImageFiles(prev => prev.filter((_, i) => i !== idx))
                      }
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Existing Models Preview */}
            {(existingModels.gltf || existingModels.bin || existingModels.step) && (
              <div className="mb-2">
                {existingModels.gltf && <p>GLTF: {existingModels.gltf}</p>}
                {existingModels.bin && <p>BIN: {existingModels.bin}</p>}
                {existingModels.step && <p>STEP: {existingModels.step}</p>}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md" disabled={saving}>Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center" disabled={saving}>
                {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                {saving ? "Saving..." : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;