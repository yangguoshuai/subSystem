import request from '@/utils/request'

export function page(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var aisoName = query.aisoName
  var tencentName = query.tencentName
  var category = query.category
  var source = query.source
  const data = {
    pageNum,
    pageSize,
    aisoName,
    tencentName,
    category,
    source
  }
  return request({
    url: '/tencentData/selectRelationByPage',
    method: 'post',
    data
  })
}

export function downloadAll(query) {
  return request({
    url: '/tencentData/downloadRelationAll',
    method: 'get',
    responseType: 'arraybuffer'
  })
}

export function pageAiso(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var name = query.name.trim()
  var englishName = query.englishName
  var isSupportSceen = query.isSupportSceen
  var category = query.category
  var isParent = query.isParent
  var parentCode = query.parentCode
  var parentName = query.parentName
  var parentEnglishName = query.parentEnglishName
  const data = {
    pageNum,
    pageSize,
    name,
    englishName,
    isSupportSceen,
    category,
    isParent,
    parentCode,
    parentName,
    parentEnglishName
  }
  return request({
    url: '/data/getAisoDataPageList',
    method: 'post',
    data
  })
}

export function pageTencent(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var tencentName = query.name.trim()
  const data = {
    pageNum,
    pageSize,
    tencentName
  }
  return request({
    url: '/tencentData/selectTencent',
    method: 'post',
    data
  })
}

export function addAisoTencentData(query) {
  var aisoCode = query.aiso.code
  var aisoName = query.aiso.name
  var tencentCode = query.tencent.code
  var tencentName = query.tencent.name
  var category = query.aiso.category
  var source = 2
  const data = {
    aisoCode,
    aisoName,
    tencentCode,
    tencentName,
    category,
    source
  }
  return request({
    url: '/tencentData/addAisoTencentData',
    method: 'post',
    data
  })
}

export function delObj(id) {
  return request({
    url: '/tencentData/deleteRelation?id=' + id,
    method: 'get'
  })
}

export function getObj(id) {
  return request({
    url: '/tencentData/getRelationById?id=' + id,
    method: 'get'
  })
}

export function addObj(data) {
  return request({
    url: '/tencentData/updateTencentById',
    method: 'post',
    data
  })
}

export function uploadExcel(obj) {
  return request({
    url: '/tencentData/importAisoTencentType',
    method: 'post',
    data: obj
  })
}

