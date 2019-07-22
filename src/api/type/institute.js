import request from '@/utils/request'

export function page(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var code = query.code
  var name = query.name
  var isParent = query.isParent
  var pcode = query.pcode
  const data = {
    pageNum,
    pageSize,
    code,
    name,
    isParent,
    pcode
  }
  return request({
    url: '/type/getInstitutePageList?true',
    method: 'post',
    data
  })
}

export function downloadRelation() {
  return request({
    url: '/type/exportTypeAisoInstituteDate',
    method: 'get',
    responseType: 'arraybuffer'
  })
}

export function downloadAll() {
  return request({
    url: '/type/downLoadAllInstitute',
    method: 'get',
    responseType: 'arraybuffer'
  })
}

export function uploadExcel(obj) {
  return request({
    url: '/type/importTypeExcel',
    method: 'post',
    data: obj
  })
}
