import request from '@/utils/request'

export function page(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var code = query.code
  var name = query.name
  var areaCode = query.areaCode
  var type = query.type
  const data = {
    pageNum,
    pageSize,
    code,
    name,
    areaCode,
    type
  }
  return request({
    url: '/district/getPageList?true',
    method: 'post',
    data
  })
}

export function uplaodCSV(obj) {
  return request({
    url: '/district/importDistrictCSV',
    method: 'post',
    data: obj
  })
}
export function selectAll(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var code = query.code
  var name = query.name
  var areaCode = query.areaCode
  var type = query.type
  const data = {
    pageNum,
    pageSize,
    code,
    name,
    areaCode,
    type
  }
  return request({
    url: '/district/getAllList?true',
    method: 'post',
    data
  })
}
