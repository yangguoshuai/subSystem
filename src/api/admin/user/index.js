import request from '@/utils/request'

export function page(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var userName = query.userName
  const data = {
    pageNum,
    pageSize,
    userName
  }
  return request({
    url: '/userInfo/selectUserInfo?true',
    method: 'post',
    data
  })
}

export function addObj(obj) {
  return request({
    url: '/userInfo/editUserInfo',
    method: 'post',
    data: obj
  })
}

export function getObj(userId) {
  const data = {
    userId
  }
  return request({
    url: '/userInfo/findUserInfoByid',
    method: 'post',
    data
  })
}

export function delObj(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: '/userInfo/delUserInfo',
    method: 'post',
    data
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/admin/gateLog/' + id,
    method: 'put',
    data: obj
  })
}
