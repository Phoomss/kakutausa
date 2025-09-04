import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import contentService from '../../../services/contentServices';

const Content = () => {
  const [contents, setContents] = useState([]);
  const [contentTypes, setContentTypes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, ids: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedIds, setSelectedIds] = useState([]);
  
  const [formData, setFormData] = useState({
    contentTypeId: '',
    language: 'en',
    title: '',
    detail: '',
    imageUrl: '',
    isPublished: false,
  });

  // Helper: Convert Google Drive URL to direct link
  const getDirectDriveLink = (url) => {
    const match = url.match(/\/d\/(.*?)\//);
    return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : url;
  };

  // Alert
  const showAlert = (message, type = 'success', duration = 3000) => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: '', type: '' }), duration);
  };

  // Fetch data
  const fetchContents = async () => {
    try {
      setLoading(true);
      const res = await contentService.getAllContents();
      setContents(res.data.data);
    } catch (err) {
      console.error(err);
      showAlert('Error fetching contents', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchContentTypes = async () => {
    try {
      const res = await contentService.getAllContentTypes();
      setContentTypes(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchContents();
    fetchContentTypes();
  }, []);

  // Open Add/Edit modal
  const openModal = (content = null) => {
    if (content) {
      setEditingId(content.id);
      setFormData({
        contentTypeId: content.contentTypeId,
        language: content.language,
        title: content.title || '',
        detail: content.detail || '',
        imageUrl: content.imageUrl || '',
        isPublished: content.isPublished,
      });
    } else {
      setEditingId(null);
      setFormData({
        contentTypeId: '',
        language: 'en',
        title: '',
        detail: '',
        imageUrl: '',
        isPublished: false,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // Submit Add/Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.contentTypeId) return showAlert('Content Type is required', 'error');
    try {
      if (editingId) {
        await contentService.updateContent(editingId, formData);
        showAlert('Content updated successfully!');
      } else {
        await contentService.createContent(formData);
        showAlert('Content created successfully!');
      }
      closeModal();
      fetchContents();
    } catch (err) {
      console.error(err);
      showAlert('Error saving content', 'error');
    }
  };

  // Delete
  const handleDelete = async (id) => {
    setConfirmDelete({ open: true, ids: [id] });
  };

  const deleteContentType = async () => {
    try {
      await Promise.all(confirmDelete.ids.map((id) => contentService.deleteContent(id)));
      fetchContents();
      showAlert(`${confirmDelete.ids.length} content deleted successfully!`);
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
      showAlert('Error deleting content', 'error');
    } finally {
      setConfirmDelete({ open: false, ids: [] });
    }
  };

  // View Details
  const viewDetails = (content) => {
    setSelectedContent(content);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedContent(null);
    setViewModalOpen(false);
  };

  // Pagination
  const totalPages = Math.ceil(contents.length / pageSize);
  const paginatedData = contents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 relative">

      {/* Alert */}
      {alert.message && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300">
          <div
            className={`px-4 py-2 rounded-lg shadow-lg ${alert.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}
          >
            <span>{alert.message}</span>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete.open && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete {confirmDelete.ids.length} content?
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDelete({ open: false, ids: [] })} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">
                Cancel
              </button>
              <button onClick={deleteContentType} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Button */}
      <div className="flex justify-end">
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
          <Plus className="w-4 h-4" /> Add Content
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Contents</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-4 text-center">Loading...</p>
          ) : contents.length === 0 ? (
            <p className="p-4 text-center text-gray-500">No contents found</p>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Language</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Published</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((c, i) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">{(currentPage - 1) * pageSize + i + 1}</td>
                      <td className="px-6 py-4 text-sm">{c.contentType?.name}</td>
                      <td className="px-6 py-4 text-sm">{c.language}</td>
                      <td className="px-6 py-4 text-sm">{c.title}</td>
                      <td className="px-6 py-4 text-sm">{c.isPublished ? 'Yes' : 'No'}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <button onClick={() => viewDetails(c)} className="p-1 hover:bg-gray-100 rounded">
                          <Eye className="w-4 h-4 text-green-600" />
                        </button>
                        <button onClick={() => openModal(c)} className="p-1 hover:bg-gray-100 rounded">
                          <Edit className="w-4 h-4 text-blue-600" />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="p-1 hover:bg-gray-100 rounded">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 p-4 mt-2">
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
            </>
          )}
        </div>
      </div>

      {/* View Modal */}
      {viewModalOpen && selectedContent && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40" onClick={closeViewModal}>
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeViewModal} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4">Content Details</h3>
            <p><strong>Content Type:</strong> {selectedContent.contentType?.name}</p>
            <p><strong>Language:</strong> {selectedContent.language}</p>
            <p><strong>Title:</strong> {selectedContent.title}</p>
            <p><strong>Detail:</strong> {selectedContent.detail}</p>
            <p><strong>Published:</strong> {selectedContent.isPublished ? 'Yes' : 'No'}</p>
            {selectedContent.imageUrl && (
              <img src={getDirectDriveLink(selectedContent.imageUrl)} alt={selectedContent.title} className="mt-4 rounded max-h-[300px] w-auto" />
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
            <button onClick={closeModal} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Content' : 'Add Content'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block">Content Type</label>
                <select
                  value={formData.contentTypeId}
                  onChange={(e) => setFormData({ ...formData, contentTypeId: e.target.value ? Number(e.target.value) : '' })}
                  className="border px-3 py-2 rounded-lg w-full"
                >
                  <option value="">Select Content Type</option>
                  {contentTypes.map((ct) => (
                    <option key={ct.id} value={ct.id}>{ct.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block">Language</label>
                <select value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} className="border px-3 py-2 rounded-lg w-full">
                  <option value="en">English</option>
                  <option value="th">Thai</option>
                  <option value="ja">Japanese</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block">Title</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="border px-3 py-2 rounded-lg w-full" placeholder="Enter title" />
              </div>
              <div>
                <label className="mb-1 block">Detail</label>
                <textarea value={formData.detail} onChange={(e) => setFormData({ ...formData, detail: e.target.value })} className="border px-3 py-2 rounded-lg w-full" rows={4} placeholder="Enter detail" />
              </div>
              <div>
                <label className="mb-1 block">Image URL</label>
                <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="border px-3 py-2 rounded-lg w-full" placeholder="Enter image URL" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} id="isPublished" />
                <label htmlFor="isPublished">Published</label>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">{editingId ? 'Update' : 'Add'}</button>
                <button type="button" onClick={closeModal} className="bg-gray-300 px-4 py-2 rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Content;
