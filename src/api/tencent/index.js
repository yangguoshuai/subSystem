import request from '@/utils/request'

export function page(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var id = query.id
  var tencentName = null
  if (query.tencentName == null) {
    tencentName = query.tencentName
  } else {
    tencentName = query.tencentName.trim()
  }
  var parentCode = null
  if (query.parentCode == null) {
    parentCode = query.parentCode
  } else {
    parentCode = query.parentCode.trim()
  }
  var tencentCode = null
  if (query.tencentCode == null) {
    tencentCode = query.tencentCode
  } else {
    tencentCode = query.tencentCode.trim()
  }
  var level = query.level
  var aisoCode = null
  const data = {
    pageNum,
    pageSize,
    id,
    tencentName,
    tencentCode,
    parentCode,
    level,
    aisoCode
  }
  return request({
    url: '/tencentData/selectTencent',
    method: 'post',
    data
  })
}
export function pageRelation(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var id = query.id
  var tencentName = null
  if (query.tencentName == null) {
    tencentName = query.tencentName
  } else {
    tencentName = query.tencentName.trim()
  }
  var tencentCode = null
  if (query.tencentCode == null) {
    tencentCode = query.tencentCode
  } else {
    tencentCode = query.tencentCode.trim()
  }
  var parentCode = null
  if (query.parentCode == null) {
    parentCode = query.parentCode
  } else {
    parentCode = query.parentCode.trim()
  }

  var level = query.level
  var aisoCode = null
  if (query.aisoCode == null) {
    aisoCode = query.aisoCode
  } else {
    aisoCode = query.aisoCode.trim()
  }
  const data = {
    pageNum,
    pageSize,
    id,
    tencentName,
    tencentCode,
    parentCode,
    level,
    aisoCode
  }
  return request({
    url: '/tencentData/selectRelationByPage',
    method: 'post',
    data
  })
}
export function uplaodCSV(obj) {
  return request({
    url: '/tencentData/importTencentData',
    method: 'post',
    data: obj
  })
}

export function downLoadAll() {
  return request({
    url: '/tencentData/downLoadTencentData',
    method: 'get',
    responseType: 'arraybuffer'
  })
}
export function downLoadRelation() {
  return request({
    url: '/tencentData/downLoadRelation',
    method: 'get',
    responseType: 'arraybuffer'
  })
}

export function downLoadRelationAll() {
  return request({
    url: '/tencentData/downloadRelationAll',
    method: 'get',
    responseType: 'arraybuffer'
  })
}
