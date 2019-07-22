import request from '@/utils/request'

export function page(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var code = query.code
  var name = query.name
  var pCode = query.pcode
  var pName = query.pname
  const data = {
    pageNum,
    pageSize,
    code,
    name,
    pCode,
    pName
  }
  return request({
    url: '/type/getAutoAiPageList?true',
    method: 'post',
    data
  })
}

export function downloadData() {
  return request({
    url: '/type/downLoadAutoaiType',
    method: 'get',
    responseType: 'arraybuffer'
  })
}

export function downloadCodeData() {
  return request({
    url: '/type/downLoadAutoaiTypeRelationCode',
    method: 'get',
    responseType: 'arraybuffer'
  })
}

export function uploadExcel(obj) {
  return request({
    url: '/type/importAutoaiType',
    method: 'post',
    data: obj
  })
}
