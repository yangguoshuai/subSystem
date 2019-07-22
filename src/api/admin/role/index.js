import request from '@/utils/request'

export function page(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var roleName = query.roleName
  const data = {
    pageNum,
    pageSize,
    roleName
  }
  return request({
    url: '/role/pageList?true',
    method: 'post',
    data
  })
}

export function list() {
  const data = {}
  return request({
    url: '/role/getList',
    method: 'post',
    data
  })
}
export function addObj(obj) {
  return request({
    url: '/api/admin/gateLog',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/admin/gateLog/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/admin/gateLog/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/admin/gateLog/' + id,
    method: 'put',
    data: obj
  })
}
