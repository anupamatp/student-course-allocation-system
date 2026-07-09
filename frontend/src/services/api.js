import axios from 'axios'

const api = axios.create({
  baseURL: 'https://student-course-allocation-backend.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ---- Students ----
export const getStudents = (params) => api.get('/students/', { params })
export const createStudent = (data) => api.post('/students/', data)
export const updateStudent = (id, data) => api.put(`/students/${id}`, data)
export const deleteStudent = (id) => api.delete(`/students/${id}`)

// ---- Courses ----
export const getCourses = () => api.get('/courses/')
export const createCourse = (data) => api.post('/courses/', data)
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data)
export const deleteCourse = (id) => api.delete(`/courses/${id}`)

// ---- Allocation ----
export const runAllocation = () => api.post('/allocation/run')
export const getAllocations = () => api.get('/allocation/')

// ---- Dashboard ----
export const getDashboardStats = () => api.get('/dashboard/statistics')

export default api