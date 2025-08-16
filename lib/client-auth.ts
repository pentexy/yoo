"use client"

export interface User {
  id: string
  name: string
  email: string
  created_at: string
}

export const setAuthToken = (token: string) => {
  localStorage.setItem("auth_token", token)
}

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

export const removeAuthToken = () => {
  localStorage.removeItem("auth_token")
}

export const setUser = (user: User) => {
  localStorage.setItem("user", JSON.stringify(user))
}

export const getUser = (): User | null => {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("user")
  return userStr ? JSON.parse(userStr) : null
}

export const removeUser = () => {
  localStorage.removeItem("user")
}

export const logout = () => {
  removeAuthToken()
  removeUser()
  window.location.href = "/login"
}

export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}
