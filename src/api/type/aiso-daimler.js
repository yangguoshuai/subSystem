import request from '@/utils/request'

export function page(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var searchName = query.searchName
  var searchCode = query.searchCode
  var aisoCategory = query.aisoCategory
  const data = {
    pageNum,
    pageSize,
    searchName,
    searchCode,
    aisoCategory
  }
  return request({
    url: '/type/getAisoDaimlerPageList?true',
    method: 'post',
    data
  })
}

export function downloadRelation() {
  return request({
    url: '/type/exportAisoDaimlerDate',
    method: 'get',
    responseType: 'arraybuffer'
  })
}

