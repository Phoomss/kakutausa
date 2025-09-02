import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import contentService from '../../../services/contentServices';

const Content = () => {
  const [contents, setContents] = useState([]);
  const [contentTypes, setContentTypes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

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
      setFormData({
        contentTypeId: '',
        language: 'en',
        title: '',
        detail: '',
        imageUrl: '',
        isPublished: false,
      });
      setEditingId(null);
      fetchContents();
    } catch (err) {
      console.error(err);
      showAlert('Error saving content', 'error');
    }
  };

  const handleEdit = (content) => {
    setEditingId(content.id);
    setFormData({
      contentTypeId: content.contentTypeId,
      language: content.language,
      title: content.title || '',
      detail: content.detail || '',
      imageUrl: content.imageUrl || '',
      isPublished: content.isPublished,
    });
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

      {/* Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Content' : 'Add Content'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="mb-1">Content Type</label>
            <select
              value={formData.contentTypeId}
              onChange={(e) => setFormData({ ...formData, contentTypeId: Number(e.target.value) })}
              className="border px-3 py-2 rounded-lg"
            >
              <option value="">Select Content Type</option>
              {contentTypes.map((ct) => (
                <option key={ct.id} value={ct.id}>{ct.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1">Language</label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="border px-3 py-2 rounded-lg"
            >
              <option value="en">English</option>
              <option value="th">Thai</option>
              <option value="ja">Japanese</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="border px-3 py-2 rounded-lg"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1">Detail</label>
            <textarea
              value={formData.detail}
              onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
              className="border px-3 py-2 rounded-lg"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1">Image URL</label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="border px-3 py-2 rounded-lg"
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
            {editingId && (
              <button
                type="button"
                onClick={() => { setEditingId(null); setFormData({ contentTypeId: '', language: 'en', title: '', detail: '', imageUrl: '', isPublished: false }); }}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                      <button
                        onClick={() => handleEdit(c)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
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
      </div>
    </div>
  );
};

export default Content;
