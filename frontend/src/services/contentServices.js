import http from './http-common'

// ----- Content -----
const getAllContents = () => http.get('/api/contents/')
const getContentById = (id) => http.get(`/api/contents/${id}`)
const createContent = (data) => http.post('/api/contents/', data)
const updateContent = (id, data) => http.put(`/api/contents/${id}`, data)
const deleteContent = (id) => http.delete(`/api/contents/${id}`)

// ----- Content Types -----
const getAllContentTypes = () => http.get('/api/content-types/')
const getContentTypeById = (id) => http.get(`/api/content-types/${id}`)
const createContentType = (data) => http.post('/api/content-types/', data)
const updateContentType = (id, data) => http.put(`/api/content-types/${id}`, data)
const deleteContentType = (id) => http.delete(`/api/content-types/${id}`)

// ----- Export -----
const contentService = {
  getAllContents,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  getAllContentTypes,
  getContentTypeById,
  createContentType,
  updateContentType,
  deleteContentType
}

export default contentService
