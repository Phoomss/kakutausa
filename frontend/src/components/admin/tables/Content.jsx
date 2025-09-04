import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import contentService from '../../../services/contentServices';

const Content = () => {
  const [contents, setContents] = useState([]);
  const [contentTypes, setContentTypes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    contentTypeId: '',
    language: 'en',
    title: '',
    detail: '',
    imageUrl: '',
    isPublished: false,
  });

  const [alert, setAlert] = useState({ message: '', type: '' });

  const showAlert = (message, type = 'success', duration = 3000) => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: '', type: '' }), duration);
  };

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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;
    try {
      await contentService.deleteContent(id);
      showAlert('Content deleted successfully!');
      fetchContents();
    } catch (err) {
      console.error(err);
      showAlert('Error deleting content', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {alert.message && (
        <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {alert.message}
        </div>
      )}

      {/* Button */}
      <div className="flex justify-end">
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
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
                {contents.map((c, i) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{i + 1}</td>
                    <td className="px-6 py-4 text-sm">{c.contentType?.name}</td>
                    <td className="px-6 py-4 text-sm">{c.language}</td>
                    <td className="px-6 py-4 text-sm">{c.title}</td>
                    <td className="px-6 py-4 text-sm">{c.isPublished ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 flex gap-2">
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
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Content' : 'Add Content'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block">Content Type</label>
                <select
                  value={formData.contentTypeId}
                  onChange={(e) => setFormData({ ...formData, contentTypeId: Number(e.target.value) })}
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
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="border px-3 py-2 rounded-lg w-full"
                >
                  <option value="en">English</option>
                  <option value="th">Thai</option>
                  <option value="ja">Japanese</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="border px-3 py-2 rounded-lg w-full"
                />
              </div>
              <div>
                <label className="mb-1 block">Detail</label>
                <textarea
                  value={formData.detail}
                  onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                  className="border px-3 py-2 rounded-lg w-full"
                />
              </div>
              <div>
                <label className="mb-1 block">Image URL</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="border px-3 py-2 rounded-lg w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                />
                <span>Published</span>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                  {editingId ? 'Update' : 'Add'}
                </button>
                <button type="button" onClick={closeModal} className="bg-gray-300 px-4 py-2 rounded-lg">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Content;
