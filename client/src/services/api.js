
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const apiRequest = async (endpoint, options = {}) => {
const token =
  localStorage.getItem('token') ||
  sessionStorage.getItem('token')
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}

export const registerUser = (userData) => {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

export const loginUser = (credentials) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export const createHousehold = (name) => {
  return apiRequest('/households', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
}

export const addHouseholdMember = (householdId, email) => {
  return apiRequest(`/households/${householdId}/members`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export const joinHousehold = (inviteCode) => {
  return apiRequest('/households/join', {
    method: 'POST',
    body: JSON.stringify({ inviteCode }),
  })
}

// Get households belonging to the logged-in user
export const getHouseholds = () => {
  return apiRequest('/households')
}

// Get inventory items for a household
export const getInventoryItems = (householdId, filters = {}) => {
  const params = new URLSearchParams({
    householdId,
    ...filters,
  })

  return apiRequest(`/inventory?${params.toString()}`)
}

// Add a new inventory item
export const createInventoryItem = (itemData) => {
  return apiRequest('/inventory', {
    method: 'POST',
    body: JSON.stringify(itemData),
  })
}

// Update inventory item details
export const updateInventoryItem = (itemId, updatedData) => {
  return apiRequest(`/inventory/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify(updatedData),
  })
}

// Update only the item's quantity
export const updateInventoryQuantity = (itemId, quantity) => {
  return apiRequest(`/inventory/${itemId}/quantity`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  })
}

// Delete an inventory item
export const deleteInventoryItem = (itemId) => {
  return apiRequest(`/inventory/${itemId}`, {
    method: 'DELETE',
  })
}