import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Upload } from "lucide-react";
import productService from "../../../services/productService";
import categoryService from "../../../services/categoryService";

const ProductsManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false); // ✅ เพิ่ม saving state
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        name: "",
        details: "",
        description: "",
        categoryId: "",
        sizes: [{ holdingCapacity: "", weight: "", handleMoves: "", barMoves: "" }],
    });
    const [imageFiles, setImageFiles] = useState([]);
    const [modelFiles, setModelFiles] = useState({ gltf: null, bin: null });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await categoryService.getAllCategories();
            setCategories(res.data.data);
        } catch (err) {
            console.error("Error fetching categories:", err);
            alert("Failed to fetch categories. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await productService.getAllProducts();
            setProducts(res.data.data);
        } catch (err) {
            console.error("Error fetching products:", err);
            alert("Failed to fetch products. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ เพิ่มฟังก์ชัน handleInputChange
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // ✅ เพิ่มฟังก์ชัน handleSizeChange
    const handleSizeChange = (index, e) => {
        const { name, value } = e.target;
        const updatedSizes = [...formData.sizes];
        updatedSizes[index] = {
            ...updatedSizes[index],
            [name]: value
        };
        setFormData(prev => ({
            ...prev,
            sizes: updatedSizes
        }));
    };

    // ✅ เพิ่มฟังก์ชัน addSizeRow
    const addSizeRow = () => {
        setFormData(prev => ({
            ...prev,
            sizes: [...prev.sizes, { holdingCapacity: "", weight: "", handleMoves: "", barMoves: "" }]
        }));
    };

    // ✅ เพิ่มฟังก์ชัน removeSizeRow
    const removeSizeRow = (index) => {
        if (formData.sizes.length > 1) {
            const updatedSizes = formData.sizes.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                sizes: updatedSizes
            }));
        }
    };

    // ✅ เพิ่มฟังก์ชัน resetForm
    const resetForm = () => {
        setFormData({
            id: null,
            name: "",
            details: "",
            description: "",
            categoryId: "",
            sizes: [{ holdingCapacity: "", weight: "", handleMoves: "", barMoves: "" }],
        });
        setImageFiles([]);
        setModelFiles({ gltf: null, bin: null });
    };

    // ✅ เพิ่มฟังก์ชัน handleDelete
    const handleDelete = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }
        
        try {
            await productService.deleteProduct(productId);
            fetchProducts();
            alert("Product deleted successfully!");
        } catch (err) {
            console.error("Error deleting product:", err);
            alert("Failed to delete product. Please try again.");
        }
    };

    const handleSave = async () => {
        // ✅ ปรับปรุง validation
        if (!formData.name.trim() || !formData.categoryId) {
            alert("Please fill out product name and category!");
            return;
        }

        try {
            setSaving(true); // ✅ เพิ่ม loading state
            let productId = formData.id;
            
            if (formData.id) {
                await productService.updateProduct(formData.id, formData);
            } else {
                const res = await productService.createProduct(formData);
                productId = res.data.data.id;
            }
            
            if (imageFiles.length > 0) {
                for (const file of imageFiles) {
                    await productService.uploadProductImage(productId, file);
                }
            }
            
            if (modelFiles.gltf || modelFiles.bin) {
                await productService.uploadProductModel(productId, modelFiles.gltf, modelFiles.bin);
            }
            
            await fetchProducts();
            setShowModal(false);
            resetForm();
            alert("Product saved successfully!");
        } catch (err) {
            console.error("Error saving product:", err);
            alert("Failed to save product. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const openModal = (product = null) => {
        setShowModal(true);
        if (product) {
            setFormData({
                id: product.id,
                name: product.name,
                details: product.details || "",
                description: product.description,
                categoryId: product.categoryId,
                sizes: product.sizes?.length
                    ? product.sizes
                    : [{ holdingCapacity: "", weight: "", handleMoves: "", barMoves: "" }],
            });
        } else {
            resetForm();
        }
    };

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Products Management</h2>
                <button
                    onClick={() => openModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                    disabled={loading} // ✅ เพิ่ม disabled state
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Product
                </button>
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
                            {products.map((p) => (
                                <tr key={p.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        {p.images?.[0] ? (
                                            <img
                                                src={p.images[0].imageUrl}
                                                alt={p.name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
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
                                            <button
                                                onClick={() => openModal(p)}
                                                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                                                title="Edit Product"
                                            >
                                                <Edit className="w-4 h-4 text-blue-600" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                                                title="Delete Product"
                                            >
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

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-2/3 max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold">
                                {formData.id ? "Edit Product" : "Add Product"}
                            </h3>
                            <button 
                                onClick={() => setShowModal(false)}
                                className="p-1 hover:bg-gray-100 rounded"
                                disabled={saving}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form Inputs */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Product Name *"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={saving}
                            />
                            <input
                                type="text"
                                name="details"
                                placeholder="Details"
                                value={formData.details}
                                onChange={handleInputChange}
                                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={saving}
                            />
                        </div>

                        <div className="mb-4">
                            <textarea
                                name="description"
                                placeholder="Description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={saving}
                            />
                        </div>

                        <div className="mb-6">
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={saving}
                            >
                                <option value="">Select Category *</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sizes Section */}
                        <div className="mb-6">
                            <h4 className="font-semibold mb-3">Product Sizes</h4>
                            {formData.sizes.map((size, index) => (
                                <div key={index} className="grid grid-cols-5 gap-2 mb-2">
                                    {[
                                        { field: "holdingCapacity", placeholder: "Holding Capacity" },
                                        { field: "weight", placeholder: "Weight" },
                                        { field: "handleMoves", placeholder: "Handle Moves" },
                                        { field: "barMoves", placeholder: "Bar Moves" }
                                    ].map(({ field, placeholder }) => (
                                        <input
                                            key={field}
                                            type="text"
                                            name={field}
                                            placeholder={placeholder}
                                            value={size[field]}
                                            onChange={(e) => handleSizeChange(index, e)}
                                            className="border border-gray-300 px-2 py-1 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            disabled={saving}
                                        />
                                    ))}
                                    <button
                                        onClick={() => removeSizeRow(index)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm transition-colors disabled:opacity-50"
                                        disabled={formData.sizes.length === 1 || saving}
                                        title="Remove Size"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={addSizeRow}
                                className="mt-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm transition-colors disabled:opacity-50"
                                disabled={saving}
                            >
                                + Add Size
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
                                    onChange={(e) => setImageFiles([...e.target.files])}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    disabled={saving}
                                />
                                {imageFiles.length > 0 && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        {imageFiles.length} file(s) selected
                                    </p>
                                )}
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Upload 3D Model</h4>
                                <div className="space-y-2">
                                    <input
                                        type="file"
                                        accept=".gltf"
                                        onChange={(e) =>
                                            setModelFiles((prev) => ({ ...prev, gltf: e.target.files[0] }))
                                        }
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                        disabled={saving}
                                    />
                                    <input
                                        type="file"
                                        accept=".bin"
                                        onChange={(e) =>
                                            setModelFiles((prev) => ({ ...prev, bin: e.target.files[0] }))
                                        }
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                        disabled={saving}
                                    />
                                </div>
                                {(modelFiles.gltf || modelFiles.bin) && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        {modelFiles.gltf ? '✓ GLTF ' : ''}{modelFiles.bin ? '✓ BIN' : ''}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md transition-colors disabled:opacity-50"
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 flex items-center"
                                disabled={saving}
                            >
                                {saving && (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                )}
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