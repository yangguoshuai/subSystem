import request from '@/utils/request'

export function page(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var aisoName = query.aisoName
  var didiName = query.didiName
  var category = query.category
  var source = query.source
  const data = {
    pageNum,
    pageSize,
    aisoName,
    didiName,
    category,
    source
  }
  return request({
    url: '/didi/selectRelationByPage',
    method: 'post',
    data
  })
}

export function downloadAll(query) {
  return request({
    url: '/didi/downloadRelationAll',
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

export function pageDidi(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var name = query.name.trim()
  const data = {
    pageNum,
    pageSize,
    name
  }
  return request({
    url: '/didi/getDidiDataPageList',
    method: 'post',
    data
  })
}

export function addAisoDidiData(query) {
  var aisoCode = query.aiso.code
  var aisoName = query.aiso.name
  var didiCode = query.didi.code
  var didiName = query.didi.name
  var category = query.aiso.category
  var source = 2
  const data = {
    aisoCode,
    aisoName,
    didiCode,
    didiName,
    category,
    source
  }
  return request({
    url: '/didi/addAisoDidiData',
    method: 'post',
    data
  })
}

export function delObj(id) {
  return request({
    url: '/didi/deleteRelation?id=' + id,
    method: 'get'
  })
}

export function getObj(id) {
  return request({
    url: '/didi/getRelationById?id=' + id,
    method: 'get'
  })
}

export function addObj(data) {
  return request({
    url: '/didi/updateDidiById',
    method: 'post',
    data
  })
}

export function uploadExcel(obj) {
  return request({
    url: '/didi/importAisoDidiData',
    method: 'post',
    data: obj
  })
}

