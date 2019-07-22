import request from '@/utils/request'

export function page(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var aisoName = query.aisoName
  var category = query.category
  var source = query.source
  const data = {
    pageNum,
    pageSize,
    aisoName,
    category,
    source
  }
  return request({
    url: '/data/selectAllByPage',
    method: 'post',
    data
  })
}

export function downloadAll(query) {
  return request({
    url: '/data/downloadAll',
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

export function pageInstitute(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var name = query.name.trim()
  var code = query.code
  var eName = query.eName
  var pCode = query.pCode
  var pName = query.pName
  var peName = query.peName
  var isParent = query.isParent
  var status = query.status
  const data = {
    pageNum,
    pageSize,
    name,
    code,
    eName,
    pCode,
    pName,
    peName,
    isParent,
    status
  }
  return request({
    url: '/type/getInstitutePageList',
    method: 'post',
    data
  })
}

export function addAisoInstituteData(query) {
  var aisoCode = query.aiso.code
  var aisoName = query.aiso.name
  var instituteCode = query.institute.code
  var instituteName = query.institute.name
  var category = query.aiso.category
  var source = 2
  const data = {
    aisoCode,
    aisoName,
    instituteCode,
    instituteName,
    category,
    source
  }
  return request({
    url: '/data/addAisoInstituteData',
    method: 'post',
    data
  })
}

export function delObj(id) {
  return request({
    url: '/data/deleteRelation?id=' + id,
    method: 'get'
  })
}

export function getObj(id) {
  return request({
    url: '/data/getRelationById?id=' + id,
    method: 'get'
  })
}

export function addObj(data) {
  return request({
    url: '/data/updateInstituteById',
    method: 'post',
    data
  })
}

export function selectByName(name, category, city, source) {
  const data = {
    name,
    category,
    city,
    source
  }
  return request({
    url: '/data/getSearchByName',
    method: 'post',
    data
  })
}

export function uploadExcel(obj) {
  return request({
    url: '/data/importAisoInstituteData',
    method: 'post',
    data: obj
  })
}

