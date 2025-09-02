import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import contentService from '../../../services/contentServices';

const ContentType = () => {
  const [contentTypes, setContentTypes] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Default รายการต่อหน้า

  // Alert state
  const [alert, setAlert] = useState({ message: '', type: '' });

  // Confirm delete modal
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  // Show alert
  const showAlert = (message, type = 'success', duration = 3000) => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: '', type: '' }), duration);
  };

  // Fetch all content types
  const fetchContentTypes = async () => {
    try {
      setLoading(true);
      const res = await contentService.getAllContentTypes();
      setContentTypes(res.data.data);
    } catch (err) {
      console.error('Error fetching content types:', err);
      showAlert('Error fetching content types', 'error');
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
        await contentService.updateContentType(editingId, { name });
        showAlert('Content type updated successfully!', 'success');
      } else {
        await contentService.createContentType({ name });
        showAlert('Content type created successfully!', 'success');
      }
      setName('');
      setEditingId(null);
      fetchContentTypes();
    } catch (err) {
      console.error('Error saving content type:', err);
      showAlert('Error saving content type', 'error');
    }
  };

  // Delete
  const deleteContentType = async () => {
    try {
      await contentService.deleteContentType(confirmDelete.id);
      fetchContentTypes();
      showAlert('Content type deleted successfully!', 'success');
    } catch (err) {
      console.error('Error deleting content type:', err);
      showAlert('Error deleting content type', 'error');
    } finally {
      setConfirmDelete({ open: false, id: null });
    }
  };

  useEffect(() => {
    fetchContentTypes();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(contentTypes.length / pageSize);
  const paginatedData = contentTypes.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Handle page size change
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // reset page to 1
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

      {/* Confirm Delete Modal */}
      {confirmDelete.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Confirm Delete</h3>
            <p className="mb-6 text-gray-600">Are you sure you want to delete this content type?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete({ open: false, id: null })}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={deleteContentType}
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
          {editingId ? 'Edit Content Type' : 'Add Content Type'}
        </h3>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter content type name"
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
              onClick={() => { setEditingId(null); setName(''); }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-2 rounded-lg flex items-center"
            >
              <X className="w-4 h-4 mr-1" /> Cancel
            </button>
          )}
        </form>
      </div>

      {/* Page size selector */}
      <div className="flex justify-end items-center gap-2">
        <label className="text-gray-700">Rows per page:</label>
        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          className="border border-gray-300 rounded-lg px-2 py-1"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Content Types</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-4 text-center">Loading...</p>
          ) : paginatedData.length === 0 ? (
            <p className="p-4 text-center text-gray-500">No content types found</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.map((ct) => (
                  <tr key={ct.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{ct.id}</td>
                    <td className="px-6 py-4 text-sm">{ct.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setEditingId(ct.id); setName(ct.name); }}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete({ open: true, id: ct.id })}
                          className="p-1 hover:bg-gray-100 rounded"
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

        {/* Pagination Controls */}
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
                className={`px-3 py-1 rounded-lg ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
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
    </div>
  );
};

export default ContentType;
