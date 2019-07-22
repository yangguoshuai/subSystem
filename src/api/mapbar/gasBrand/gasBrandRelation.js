import request from '@/utils/request'
export function page(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var mapbarName = query.mapbarName
  var aisoName = query.aisoName
  var leftTableName = 'gas_brand_mapbar'
  var rightTableName = 'aiso_data'
  var tableName = 'gas_brand_relation_mapbar_aiso'
  const data = {
    pageNum,
    pageSize,
    mapbarName,
    aisoName,
    leftTableName,
    rightTableName,
    tableName
  }
  return request({
    url: '/mapbarRelation/selectBrandRelation',
    method: 'post',
    data
  })
}

export function pageAiso(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var name = query.cnInfo.trim()
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
// mapbar数据查询
export function pageInstitute(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var cnInfo = query.cnInfo.trim()
  var tableName = 'gas_brand_mapbar'
  const data = {
    pageNum,
    pageSize,
    cnInfo,
    tableName
  }
  return request({
    url: '/mapbarGas/selectMapbarGas',
    method: 'post',
    data
  })
}
// 添加mapbar-aiso对应关系
export function addAisoInstituteData(query) {
  var aisoId = query.aiso.dataId
  var aisoName = query.aiso.cnInfo
  var mapbarId = query.institute.cnId
  var mapbarName = query.institute.cnInfo
  var tableName = 'gas_brand_relation_mapbar_aiso'
  const data = {
    aisoId,
    aisoName,
    mapbarId,
    mapbarName,
    tableName
  }
  return request({
    url: '/mapbarRelation/addMapbarAisoRelation',
    method: 'post',
    data
  })
}

export function delObj(id) {
  var tableName = 'gas_brand_relation_mapbar_aiso'
  const data = {
    id,
    tableName
  }
  return request({
    url: '/mapbarRelation/delMapbarAisoRelation',
    method: 'post',
    data
  })
}

export function downloadData() {
  var leftTableName = 'gas_brand_mapbar'
  var rightTableName = 'aiso_data'
  var tableName = 'gas_brand_relation_mapbar_aiso'
  const data = {
    leftTableName,
    rightTableName,
    tableName
  }
  return request({
    url: '/mapbarRelation/exportMapbarBrandData',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

export function uploadFile(obj) {
  var tableName = 'gas_brand_relation_mapbar_aiso'
  return request({
    url: '/mapbarRelation/importRelationFile?tableName=' + tableName,
    method: 'post',
    data: obj
  })
}

