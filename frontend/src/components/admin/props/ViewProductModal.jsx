import React from "react";
import { X, Upload } from "lucide-react";

const ViewProductModal = ({ product, onClose }) => {
    if (!product) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-2/3 max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Product Details</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-4">
                    <h4 className="font-semibold">Name:</h4>
                    <p>{product.name}</p>
                </div>
                <div className="mb-4">
                    <h4 className="font-semibold">Category:</h4>
                    <p>{product.category?.name || "No Category"}</p>
                </div>
                <div className="mb-4">
                    <h4 className="font-semibold">Description:</h4>
                    <p>{product.description || "-"}</p>
                </div>

                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Sizes ({product.sizes?.length || 0})</h4>
                    {product.sizes?.map((size, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3 mb-2">
                            <h5 className="font-medium text-gray-700 mb-2">Size {index + 1}</h5>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h6 className="font-medium text-green-600 mb-1">Metric</h6>
                                    <p>Holding Capacity: {size.holdingCapacityMetric || "-"}</p>
                                    <p>Weight: {size.weightMetric || "-"}</p>
                                    <p>Handle Moves: {size.handleMovesMetric || "-"}</p>
                                    <p>Bar Moves: {size.barMovesMetric || "-"}</p>
                                    <p>Drawing Movement: {size.drawingMovementMetric || "-"}</p>
                                </div>
                                <div>
                                    <h6 className="font-medium text-blue-600 mb-1">Imperial</h6>
                                    <p>Holding Capacity: {size.holdingCapacityInch || "-"}</p>
                                    <p>Weight: {size.weightInch || "-"}</p>
                                    <p>Handle Moves: {size.handleMovesInch || "-"}</p>
                                    <p>Bar Moves: {size.barMovesInch || "-"}</p>
                                    <p>Drawing Movement: {size.drawingMovementInch || "-"}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Images</h4>
                    <div className="flex gap-2 flex-wrap">
                        {product.images?.length > 0 ? (
                            product.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img.imageUrl}
                                    alt={`Product ${idx}`}
                                    className="w-24 h-24 object-cover rounded"
                                />
                            ))
                        ) : (
                            <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded">
                                <Upload className="w-5 h-5 text-gray-500" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-6">
                    <h4 className="font-semibold mb-2">3D Model Files</h4>
                    <ul className="list-disc list-inside text-gray-700">
                        {product.models?.length > 0 ? (
                            product.models.map((model, idx) => (
                                <li key={idx}>
                                    {model.gltfUrl && <span>GLTF: {model.gltfUrl}</span>}
                                    {model.binUrl && <span> | BIN: {model.binUrl}</span>}
                                </li>
                            ))
                        ) : (
                            <li>No models uploaded</li>
                        )}
                    </ul>
                </div>

                <div className="flex justify-end pt-2 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewProductModal;