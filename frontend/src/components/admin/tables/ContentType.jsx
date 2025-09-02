import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import contentService from '../../../services/contentServices';

const ContentType = () => {
  const [contentTypes, setContentTypes] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchContentTypes = async () => {
    try {
      setLoading(true);
      const res = await contentService.getAllContentTypes();
      setContentTypes(res.data.data)
    } catch (err) {
      console.error('Error fetching content types:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Name is required');

    try {
      if (editingId) {
        await contentService.updateContentType(editingId, { name });
      } else {
        await contentService.createContentType({ name });
      }
      setName('');
      setEditingId(null);
      fetchContentTypes();
    } catch (err) {
      console.error('Error saving content type:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      await contentService.deleteContentType(id);
      fetchContentTypes();
    } catch (err) {
      console.error('Error deleting content type:', err);
    }
  };

  useEffect(() => {
    fetchContentTypes();
  }, []);

  return (
    <div className="space-y-6">
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

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Content Types</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-4 text-center">Loading...</p>
          ) : contentTypes.length === 0 ? (
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
                {contentTypes.map((ct) => (
                  <tr key={ct.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{ct.id}</td>
                    <td className="px-6 py-4 text-sm">{ct.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingId(ct.id);
                            setName(ct.name);
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(ct.id)}
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
      </div>
    </div>
  );
};

export default ContentType;
