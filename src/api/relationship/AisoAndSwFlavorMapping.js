import request from '@/utils/request'
export function insertData(query) {
  var aisoID = query.aisoID
  var autoID = query.autoID
  var version = query.version
  const data = {
    aisoID,
    autoID,
    version
  }
  return request({
    url: '/AisoAndSwFlavorMappingController/insertData',
    method: 'post',
    data
  })
}
export function uploadFile(obj) {
  return request({
    url: '/AisoAndSwFlavorMappingController/InsertList',
    method: 'post',
    data: obj
  })
}
export function page(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var id = query.id
  var aisoID
  if (query.aisoID != null) {
    aisoID = query.aisoID.trim()
  } else {
    aisoID = query.aisoID
  }
  var autoID
  if (query.autoID != null) {
    autoID = query.autoID.trim()
  } else {
    autoID = query.autoID
  }
  var aisoInfo
  if (query.aisoInfo != null) {
    aisoInfo = query.aisoInfo.trim()
  } else {
    aisoInfo = query.aisoInfo
  }
  var autoInfo
  if (query.autoInfo != null) {
    autoInfo = query.autoInfo.trim()
  } else {
    autoInfo = query.autoInfo
  }
  var version = query.version
  const data = {
    pageNum,
    pageSize,
    id,
    aisoID,
    autoID,
    aisoInfo,
    autoInfo,
    version
  }
  return request({
    url: '/AisoAndSwFlavorMappingController/selectByPage',
    method: 'post',
    data
  })
}

export function getVersion() {
  return request({
    url: '/AisoAndSwFlavorMappingController/getVersion',
    method: 'post'
  })
}
// 这是查询aisoBrand的信息
export function pageAiso(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var name = query.cnInfo
  var category = 1
  const data = {
    pageNum,
    pageSize,
    name,
    category
  }
  return request({
    url: '/data/getAisoDataPageList',
    method: 'post',
    data
  })
}
export function updateData(query) {
  var id = query.id
  var aisoID = query.aisoID
  var autoID = query.autoID
  var version = query.version
  const data = {
    id,
    aisoID,
    autoID,
    version
  }
  return request({
    url: '/AisoAndSwFlavorMappingController/updateData',
    method: 'post',
    data
  })
}
export function deleteData(query) {
  var id = query.id
  var aisoID = query.aisoID
  var autoID = query.autoID
  var version = query.version
  const data = {
    id,
    aisoID,
    autoID,
    version
  }
  return request({
    url: '/AisoAndSwFlavorMappingController/deleteById',
    method: 'post',
    data
  })
}
export function downloadData(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var id = query.id
  var aisoID
  if (query.aisoID != null) {
    aisoID = query.aisoID.trim()
  } else {
    aisoID = query.aisoID
  }
  var autoID
  if (query.autoID != null) {
    autoID = query.autoID.trim()
  } else {
    autoID = query.autoID
  }
  var aisoInfo
  if (query.aisoInfo != null) {
    aisoInfo = query.aisoInfo.trim()
  } else {
    aisoInfo = query.aisoInfo
  }
  var autoInfo
  if (query.autoInfo != null) {
    autoInfo = query.autoInfo.trim()
  } else {
    autoInfo = query.autoInfo
  }
  var version = query.version
  const data = {
    pageNum,
    pageSize,
    id,
    aisoID,
    autoID,
    aisoInfo,
    autoInfo,
    version
  }
  return request({
    url: '/AisoAndSwFlavorMappingController/exportRelation',
    method: 'post',
    data
  })
}
