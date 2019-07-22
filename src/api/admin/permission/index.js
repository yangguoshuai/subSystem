import request from '@/utils/request'

export function page(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var systemName = query.systemName
  const data = {
    pageNum,
    pageSize,
    systemName
  }
  return request({
    url: '/systempage/pageList?true',
    method: 'post',
    data
  })
}

export function getAuthList() {
  return request({
    url: '/systempage/getAuthAllList',
    method: 'get'
  })
}

export function getUserAuthority(userInfoId) {
  const data = {
    userInfoId
  }
  return request({
    url: '/systempage/getUserSystemAuth',
    method: 'post',
    data
  })
}

export function addUserAuthority(systemPageIds, userInfoId) {
  const data = {
    systemPageIds,
    userInfoId
  }
  return request({
    url: '/systempage/addSystemAuthByUser',
    method: 'post',
    data
  })
}

export function removeUserAuthority(systemPageIds, userInfoId) {
  const data = {
    systemPageIds,
    userInfoId
  }
  return request({
    url: '/systempage/delSystemAuthByUser',
    method: 'post',
    data
  })
}

export function getObj(systemId) {
  return request({
    url: '/systempage/getBySystemId',
    method: 'get',
    params: { systemId }
  })
}

export function putObj(data) {
  return request({
    url: '/systempage/updateSystemPage',
    method: 'post',
    data
  })
}
