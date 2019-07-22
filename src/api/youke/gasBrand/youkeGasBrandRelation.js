import request from '@/utils/request'
export function page(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var youkeName = query.youkeName
  var aisoName = query.aisoName
  var leftTableName = 'gas_brand_youke'
  var rightTableName = 'aiso_data'
  var tableName = 'gas_brand_relation_youke_aiso'
  const data = {
    pageNum,
    pageSize,
    youkeName,
    aisoName,
    leftTableName,
    rightTableName,
    tableName
  }
  return request({
    url: '/youkeRelation/selectBrandRelation',
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
// yuke数据查询
export function pageInstitute(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var cnInfo = query.cnInfo.trim()
  var tableName = 'gas_brand_youke'
  const data = {
    pageNum,
    pageSize,
    cnInfo,
    tableName
  }
  return request({
    url: '/youke/selectYoukeGas',
    method: 'post',
    data
  })
}
// 添加油客网-aiso对应关系
export function addAisoInstituteData(query) {
  var aisoId = query.aiso.dataId
  var aisoName = query.aiso.cnInfo
  var youkeId = query.institute.cnId
  var youkeName = query.institute.cnInfo
  var tableName = 'gas_brand_relation_youke_aiso'
  const data = {
    aisoId,
    aisoName,
    youkeId,
    youkeName,
    tableName
  }
  return request({
    url: '/youkeRelation/addYoukeAisoRelation',
    method: 'post',
    data
  })
}

export function delObj(id) {
  var tableName = 'gas_brand_relation_youke_aiso'
  const data = {
    id,
    tableName
  }
  return request({
    url: '/youkeRelation/delYoukeAisoRelation',
    method: 'post',
    data
  })
}

export function downloadData() {
  var leftTableName = 'gas_brand_youke'
  var rightTableName = 'aiso_data'
  var tableName = 'gas_brand_relation_youke_aiso'
  const data = {
    leftTableName,
    rightTableName,
    tableName
  }
  return request({
    url: '/youkeRelation/exportYoukeBrandData',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

export function uploadFile(obj) {
  var tableName = 'gas_brand_relation_youke_aiso'
  return request({
    url: '/youkeRelation/importRelationFile?tableName=' + tableName,
    method: 'post',
    data: obj
  })
}
