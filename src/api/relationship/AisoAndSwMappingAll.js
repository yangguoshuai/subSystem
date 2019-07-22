import request from '@/utils/request'
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
  var relationTableName = query.relationTableName
  var aisoTableName = query.aisoTableName
  var autoTableName = query.autoTableName
  var version = query.version
  const data = {
    pageNum,
    pageSize,
    id,
    aisoID,
    autoID,
    aisoInfo,
    autoInfo,
    relationTableName,
    aisoTableName,
    autoTableName,
    version
  }
  return request({
    url: '/AisoAndSwMappingAllController/selectByPage',
    method: 'post',
    data
  })
}
export function insertData(query) {
  var aisoID = query.aisoID
  var autoID = query.autoID
  var relationTableName = query.relationTableName
  var aisoTableName = query.aisoTableName
  var autoTableName = query.autoTableName
  var version = query.version
  const data = {
    aisoID,
    autoID,
    relationTableName,
    aisoTableName,
    autoTableName,
    version
  }
  return request({
    url: '/AisoAndSwMappingAllController/insertData',
    method: 'post',
    data
  })
}

export function updateData(query) {
  var id = query.id
  var aisoID = query.aisoID
  var autoID = query.autoID
  var relationTableName = query.relationTableName
  var aisoTableName = query.aisoTableName
  var autoTableName = query.autoTableName
  var version = query.version
  const data = {
    id,
    aisoID,
    autoID,
    relationTableName,
    aisoTableName,
    autoTableName,
    version
  }
  return request({
    url: '/AisoAndSwMappingAllController/updateData',
    method: 'post',
    data
  })
}
export function deleteData(query) {
  var id = query.id
  var aisoID = query.aisoID
  var autoID = query.autoID
  var relationTableName = query.relationTableName
  var aisoTableName = query.aisoTableName
  var autoTableName = query.autoTableName
  var version = query.version
  const data = {
    id,
    aisoID,
    autoID,
    relationTableName,
    aisoTableName,
    autoTableName,
    version
  }
  return request({
    url: '/AisoAndSwMappingAllController/deleteById',
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
  var relationTableName = query.relationTableName
  var aisoTableName = query.aisoTableName
  var autoTableName = query.autoTableName
  var version = query.version
  const data = {
    pageNum,
    pageSize,
    id,
    aisoID,
    autoID,
    aisoInfo,
    autoInfo,
    relationTableName,
    aisoTableName,
    autoTableName,
    version
  }
  return request({
    url: '/AisoAndSwMappingAllController/exportRelation',
    method: 'post',
    data
  })
}
export function uploadFile(obj) {
  return request({
    url: '/AisoAndSwMappingAllController/InsertList',
    method: 'post',
    data: obj
  })
}
export function getVersion(query) {
  return request({
    url: '/AisoAndSwMappingAllController/getVersion',
    method: 'post',
    data: query
  })
}

export function pageBrand(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var mapbarName = query.mapbarName
  var aisoName = query.aisoName
  var autoTableName = 'auto_gas_brand'
  var aisoTableName = 'aiso_data'
  var relationTableName = 'gasbrand_aiso_and_auto_mapping'
  var version = query.version
  const data = {
    pageNum,
    pageSize,
    mapbarName,
    aisoName,
    autoTableName,
    aisoTableName,
    relationTableName,
    version
  }
  return request({
    url: '/AisoAndSwMappingAllController/selectBrandRelation',
    method: 'post',
    data
  })
}

export function downloadDataBrand(query) {
  var autoTableName = 'auto_gas_brand'
  var aisoTableName = 'aiso_data'
  var relationTableName = 'gasbrand_aiso_and_auto_mapping'
  var version = query.version
  const data = {
    autoTableName,
    aisoTableName,
    relationTableName,
    version
  }
  return request({
    url: '/AisoAndSwMappingAllController/exportBrandRelation',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
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
