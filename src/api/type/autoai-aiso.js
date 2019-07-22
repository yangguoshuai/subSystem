import request from '@/utils/request'

export function page(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var autoaiName = query.autoaiName
  var autaoaiCode = query.autoaiCode
  var aisoCode = query.aisoCode
  var aisoName = query.aisoName
  const data = {
    pageNum,
    pageSize,
    autoaiName,
    autaoaiCode,
    aisoCode,
    aisoName
  }
  return request({
    url: '/type//getRelationPage?true',
    method: 'post',
    data
  })
}

export function downloadRelation() {
  return request({
    url: '/type/downLoadAutoaiTypeRelation',
    method: 'get',
    responseType: 'arraybuffer'
  })
}

