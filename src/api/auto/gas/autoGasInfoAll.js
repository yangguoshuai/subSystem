import request from '@/utils/request'
export function page(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var autoDataId
  if (query.autoDataId != null) {
    autoDataId = query.autoDataId.trim()
  } else {
    autoDataId = query.autoDataId
  }
  var cnInfo
  if (query.cnInfo != null) {
    cnInfo = query.cnInfo.trim()
  } else {
    cnInfo = query.cnInfo
  }
  var enInfo
  if (query.enInfo != null) {
    enInfo = query.enInfo.trim()
  } else {
    enInfo = query.enInfo
  }
  var tableName = query.tableName
  var version = query.version
  const data = {
    pageNum,
    pageSize,
    autoDataId,
    cnInfo,
    enInfo,
    tableName,
    version
  }
  return request({
    url: '/autoGasInfoAllController/selectByPage',
    method: 'post',
    data
  })
}
export function downloadData(query) {
  var autoDataId
  if (query.autoDataId != null) {
    autoDataId = query.autoDataId.trim()
  } else {
    autoDataId = query.autoDataId
  }
  var cnInfo
  if (query.cnInfo != null) {
    cnInfo = query.cnInfo.trim()
  } else {
    cnInfo = query.cnInfo
  }
  var enInfo
  if (query.enInfo != null) {
    enInfo = query.enInfo.trim()
  } else {
    enInfo = query.enInfo
  }
  var tableName = query.tableName
  var version = query.version
  const data = {
    autoDataId,
    cnInfo,
    enInfo,
    tableName,
    version
  }
  return request({
    url: '/autoGasInfoAllController/exportAutoGasBrand',
    method: 'post',
    data
  })
}
export function insertData(query) {
  var autoDataId
  if (query.autoDataId != null) {
    autoDataId = query.autoDataId.trim()
  } else {
    autoDataId = query.autoDataId
  }
  var cnInfo
  if (query.cnInfo != null) {
    cnInfo = query.cnInfo.trim()
  } else {
    cnInfo = query.cnInfo
  }
  var enInfo
  if (query.enInfo != null) {
    enInfo = query.enInfo.trim()
  } else {
    enInfo = query.enInfo
  }
  var tableName = query.tableName
  var version = query.version
  const data = {
    autoDataId,
    cnInfo,
    enInfo,
    tableName,
    version
  }
  return request({
    url: '/autoGasInfoAllController/insertData',
    method: 'post',
    data
  })
}

export function updateData(query) {
  var autoDataId
  if (query.autoDataId != null) {
    autoDataId = query.autoDataId.trim()
  } else {
    autoDataId = query.autoDataId
  }
  var cnInfo
  if (query.cnInfo != null) {
    cnInfo = query.cnInfo.trim()
  } else {
    cnInfo = query.cnInfo
  }
  var enInfo
  if (query.enInfo != null) {
    enInfo = query.enInfo.trim()
  } else {
    enInfo = query.enInfo
  }
  var tableName = query.tableName
  var version = query.version
  const data = {
    autoDataId,
    cnInfo,
    enInfo,
    tableName,
    version
  }
  return request({
    url: '/autoGasInfoAllController/updateData',
    method: 'post',
    data
  })
}
export function uploadFile(obj) {
  return request({
    url: '/autoGasInfoAllController/InsertList',
    method: 'post',
    data: obj
  })
}
export function getVersion(query) {
  return request({
    url: '/autoGasInfoAllController/getVersion',
    method: 'post',
    data: query
  })
}
