import request from '@/utils/request'

export function page(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var code = query.code
  var name = query.name
  const data = {
    pageNum,
    pageSize,
    code,
    name
  }
  return request({
    url: '/type/getDaimlerPageList?true',
    method: 'post',
    data
  })
}

export function downloadAll() {
  return request({
    url: '/type/downLoadAllDaimler',
    method: 'get',
    responseType: 'arraybuffer'
  })
}

export function uploadExcel(obj) {
  return request({
    url: '/type/importDaimlerInfo',
    method: 'post',
    data: obj
  })
}
