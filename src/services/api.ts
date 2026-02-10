/**
 * API Client Service
 * Handles all HTTP requests to the Next.js backend API
 */

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  body?: any
  headers?: Record<string, string>
}

interface AuthSession {
  userId: string
  email: string
}

let cachedSession: AuthSession | null = null

/**
 * Set the cached session (called after login/register)
 */
export function setSession(session: AuthSession) {
  cachedSession = session
}

/**
 * Get the cached session
 */
export function getSession(): AuthSession | null {
  return cachedSession
}

/**
 * Clear the cached session (called on logout)
 */
export function clearSession() {
  cachedSession = null
}

/**
 * Make an API request
 */
async function apiRequest(endpoint: string, options: FetchOptions = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  // Add session cookie if available
  if (cachedSession) {
    const sessionAuth = Buffer.from(JSON.stringify(cachedSession)).toString('base64')
    headers['X-Session-Auth'] = sessionAuth
  }

  const fetchOptions: RequestInit = {
    method: options.method || 'GET',
    headers,
  }

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body)
  }

  const response = await fetch(url, fetchOptions)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `API request failed: ${response.status}`)
  }

  return response.json()
}

/**
 * Auth API endpoints
 */
export const authAPI = {
  async login(email: string, password: string) {
    const response = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    if (response.user) {
      setSession({
        userId: response.user.id,
        email: response.user.email,
      })
    }
    return response
  },

  async register(email: string, password: string) {
    const response = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: { email, password },
    })
    if (response.user) {
      setSession({
        userId: response.user.id,
        email: response.user.email,
      })
    }
    return response
  },

  async logout() {
    clearSession()
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' })
    } catch {
      // Logout endpoint might not exist, that's ok
    }
  },

  async getMe() {
    return apiRequest('/api/auth/me', { method: 'GET' })
  },
}

/**
 * Entries API endpoints (notes and tasks)
 */
export const entriesAPI = {
  async list(date: string, type?: string) {
    let endpoint = `/api/entries?date=${encodeURIComponent(date)}`
    if (type) {
      endpoint += `&type=${encodeURIComponent(type)}`
    }
    return apiRequest(endpoint, { method: 'GET' })
  },

  async create(data: {
    type: 'NOTE' | 'TASK' | 'SESSION'
    date: string
    content: string
    status?: string
    progress?: number
    duration?: number
    linkedTaskId?: string
  }) {
    return apiRequest('/api/entries', {
      method: 'POST',
      body: data,
    })
  },

  async getById(id: string) {
    return apiRequest(`/api/entries/${id}`, { method: 'GET' })
  },

  async update(id: string, data: any) {
    return apiRequest(`/api/entries/${id}`, {
      method: 'PATCH',
      body: data,
    })
  },

  async delete(id: string) {
    return apiRequest(`/api/entries/${id}`, { method: 'DELETE' })
  },
}

/**
 * Task Sets API endpoints
 */
export const taskSetsAPI = {
  async list() {
    return apiRequest('/api/tasksets', { method: 'GET' })
  },

  async create(data: {
    name: string
    periodType: 'week' | 'month'
    tasks: string[]
  }) {
    return apiRequest('/api/tasksets', {
      method: 'POST',
      body: data,
    })
  },

  async getById(id: string) {
    return apiRequest(`/api/tasksets/${id}`, { method: 'GET' })
  },

  async update(id: string, data: { name?: string; tasks?: string[] }) {
    return apiRequest(`/api/tasksets/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  async delete(id: string) {
    return apiRequest(`/api/tasksets/${id}`, { method: 'DELETE' })
  },
}

/**
 * Daily State API endpoints
 */
export const dailyStateAPI = {
  async get(taskSetId: string, date: string) {
    return apiRequest(`/api/daily-state/${taskSetId}/${date}`, {
      method: 'GET',
    })
  },

  async update(
    taskSetId: string,
    date: string,
    data: { task: string; completed: boolean }
  ) {
    return apiRequest(`/api/daily-state/${taskSetId}/${date}`, {
      method: 'POST',
      body: data,
    })
  },

  async getStreak(taskSetId: string) {
    return apiRequest(`/api/daily-state/${taskSetId}/streak`, {
      method: 'GET',
    })
  },
}

export default {
  authAPI,
  entriesAPI,
  taskSetsAPI,
  dailyStateAPI,
}
