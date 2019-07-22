import request from '@/utils/request'
export function page(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var id = query.id
  var dataId
  if (query.dataId != null) {
    dataId = query.dataId.trim()
  } else {
    dataId = query.dataId
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
  const data = {
    pageNum,
    pageSize,
    id,
    dataId,
    cnInfo,
    enInfo,
    tableName
  }
  return request({
    url: '/aisoGasInfoAllType/selectByPage',
    method: 'post',
    data
  })
}
export function downloadData(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var id = query.id
  var dataId
  if (query.dataId != null) {
    dataId = query.dataId.trim()
  } else {
    dataId = query.dataId
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
  const data = {
    pageNum,
    pageSize,
    id,
    dataId,
    cnInfo,
    enInfo,
    tableName
  }
  return request({
    url: '/aisoGasInfoAllType/exportAisoGasInfoAll',
    method: 'post',
    data
  })
}
export function insertData(query) {
  var id = query.id
  var dataId
  if (query.dataId != null) {
    dataId = query.dataId.trim()
  } else {
    dataId = query.dataId
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
  const data = {
    id,
    dataId,
    cnInfo,
    enInfo,
    tableName
  }
  return request({
    url: '/aisoGasInfoAllType/insertData',
    method: 'post',
    data
  })
}

export function updateData(query) {
  var id = query.id
  var dataId
  if (query.dataId != null) {
    dataId = query.dataId.trim()
  } else {
    dataId = query.dataId
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
  const data = {
    id,
    dataId,
    cnInfo,
    enInfo,
    tableName
  }
  return request({
    url: '/aisoGasInfoAllType/updateData',
    method: 'post',
    data
  })
}
export function uploadFile(obj) {
  return request({
    url: '/aisoGasInfoAllType/insertList',
    method: 'post',
    data: obj
  })
}
