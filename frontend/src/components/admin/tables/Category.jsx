import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import categoryService from '../../../services/categoryService';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    // Alert
    const [alert, setAlert] = useState({ message: '', type: '' });

    // Confirm delete
    const [confirmDelete, setConfirmDelete] = useState({ open: false, ids: [] });

    // Selected for bulk delete
    const [selectedIds, setSelectedIds] = useState([]);

    // Show alert
    const showAlert = (message, type = 'success', duration = 3000) => {
        setAlert({ message, type });
        setTimeout(() => setAlert({ message: '', type: '' }), duration);
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await categoryService.getAllCategories();
            setCategories(res.data.data);
        } catch (err) {
            console.error(err);
            showAlert('Error fetching categories', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Add / Update
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return showAlert('Name is required', 'error');

        try {
            if (editingId) {
                await categoryService.updateCategory(editingId, { name });
                showAlert('Category updated successfully!');
            } else {
                await categoryService.createCategory({ name });
                showAlert('Category created successfully!');
            }
            setName('');
            setEditingId(null);
            fetchCategories();
        } catch (err) {
            console.error(err);
            showAlert('Error saving category', 'error');
        }
    };

    // Delete single or multiple
    const deleteCategory = async () => {
        try {
            await Promise.all(confirmDelete.ids.map((id) => categoryService.deleteCategory(id)));
            showAlert(`${confirmDelete.ids.length} category(s) deleted successfully!`);
            setSelectedIds([]);
            fetchCategories();
        } catch (err) {
            console.error(err);
            showAlert('Error deleting category', 'error');
        } finally {
            setConfirmDelete({ open: false, ids: [] });
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Pagination calculations
    const totalPages = Math.ceil(categories.length / pageSize);
    const paginatedData = categories.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Toggle select
    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        const pageIds = paginatedData.map((c) => c.id);
        const allSelected = pageIds.every((id) => selectedIds.includes(id));
        if (allSelected) {
            setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
        } else {
            setSelectedIds((prev) => [...new Set([...prev, ...pageIds])]);
        }
    };

    return (
        <div className="space-y-6 relative">
            {/* Alert */}
            {alert.message && (
                <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300">
                    <div className={`alert shadow-lg ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                        <span>{alert.message}</span>
                    </div>
                </div>
            )}

            {/* Confirm Delete */}
            {confirmDelete.open && (
                <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-96">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Confirm Delete</h3>
                        <p className="mb-6 text-gray-600">
                            Are you sure you want to delete {confirmDelete.ids.length} category(s)?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setConfirmDelete({ open: false, ids: [] })}
                                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={deleteCategory}
                                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">
                    {editingId ? 'Edit Category' : 'Add Category'}
                </h3>
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter category name"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                        {editingId ? <Edit className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                        {editingId ? 'Update' : 'Add'}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingId(null);
                                setName('');
                            }}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-2 rounded-lg flex items-center"
                        >
                            <X className="w-4 h-4 mr-1" /> Cancel
                        </button>
                    )}
                </form>
            </div>

            {/* Page size & bulk delete */}
            <div className="flex justify-between items-center p-2">
                <div className="flex items-center gap-2">
                    <label className="text-gray-700">Rows per page:</label>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded-lg px-2 py-1"
                    >
                        {[5, 10, 20, 50].map((n) => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                </div>

                {selectedIds.length > 0 && (
                    <button
                        onClick={() => setConfirmDelete({ open: true, ids: selectedIds })}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-1"
                    >
                        <Trash2 className="w-4 h-4" /> Delete Selected ({selectedIds.length})
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={paginatedData.every((c) => selectedIds.includes(c.id))}
                        onChange={toggleSelectAll}
                    />
                    <h3 className="text-lg font-semibold">Categories</h3>
                </div>
                {loading ? (
                    <p className="p-4 text-center">Loading...</p>
                ) : paginatedData.length === 0 ? (
                    <p className="p-4 text-center text-gray-500">No categories found</p>
                ) : (
                    <table className="w-full table-auto text-left border-collapse">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="w-1/12 px-6 py-3 border-b text-sm font-medium text-gray-500 uppercase">Select</th>
                                <th className="w-1/12 px-6 py-3 border-b text-sm font-medium text-gray-500 uppercase">#</th>
                                <th className="w-7/12 px-6 py-3 border-b text-sm font-medium text-gray-500 uppercase">Name</th>
                                <th className="w-3/12 px-6 py-3 border-b text-sm font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paginatedData.map((c, idx) => (
                                <tr key={c.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(c.id)}
                                            onChange={() => toggleSelect(c.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-sm">{(currentPage - 1) * pageSize + idx + 1}</td>
                                    <td className="px-6 py-4 text-sm">{c.name}</td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingId(c.id);
                                                setName(c.name);
                                            }}
                                            className="p-1 hover:bg-gray-100 rounded"
                                        >
                                            <Edit className="w-4 h-4 text-blue-600" />
                                        </button>
                                        <button
                                            onClick={() => setConfirmDelete({ open: true, ids: [c.id] })}
                                            className="p-1 hover:bg-gray-100 rounded"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 p-4">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 flex items-center gap-1"
                    >
                        <ChevronLeft className="w-4 h-4" /> Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 rounded-lg ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 flex items-center gap-1"
                    >
                        Next <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Category;
