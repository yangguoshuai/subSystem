import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

const USERIDKey = 'userId'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserId() {
  return Cookies.get(USERIDKey)
}

export function setUserId(userId) {
  return Cookies.set(USERIDKey, userId)
}
export function removeUserId() {
  return Cookies.remove(USERIDKey)
}
