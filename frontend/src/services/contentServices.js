import http from './http-common'

// ----- API ENDPOINTS -----
const API = {
  CONTENTS: '/api/contents',
  CONTENT_TYPES: '/api/content-types'
}

// ----- Content -----
const getAllContents = () => http.get(`${API.CONTENTS}/`)
const getContentById = (id) => http.get(`${API.CONTENTS}/${id}`)
const createContent = (data) => http.post(`${API.CONTENTS}/`, data)
const updateContent = (id, data) => http.put(`${API.CONTENTS}/${id}`, data)
const deleteContent = (id) => http.delete(`${API.CONTENTS}/${id}`)
const searchContentsByType = (contentType) =>
  http.get(`${API.CONTENTS}/search`, { params: { contentType } });

// ----- Content Types -----
const getAllContentTypes = () => http.get(`${API.CONTENT_TYPES}/`)
const getContentTypeById = (id) => http.get(`${API.CONTENT_TYPES}/${id}`)
const createContentType = (data) => http.post(`${API.CONTENT_TYPES}/`, data)
const updateContentType = (id, data) => http.put(`${API.CONTENT_TYPES}/${id}`, data)
const deleteContentType = (id) => http.delete(`${API.CONTENT_TYPES}/${id}`)

// ----- Export -----
const contentService = {
  getAllContents,
  searchContentsByType,
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
