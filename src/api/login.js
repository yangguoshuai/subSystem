import request from '@/utils/request'

export function loginByUsername(loginName, passWord) {
  const data = {
    loginName,
    passWord
  }
  return request({
    url: '/userInfo/userLogin',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo() {
  return request({
    url: '/userInfo/getInfo',
    method: 'post'
  })
}

export function updatePassword(obj) {
  return request({
    url: '/userInfo/updatePassword',
    method: 'post',
    data: obj
  })
}
