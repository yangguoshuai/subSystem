import request from '@/utils/request'

export function page(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var aisoName = query.aisoName
  var category = query.category
  var source = query.source
  var autoaiName = query.autoaiName
  const data = {
    pageNum,
    pageSize,
    aisoName,
    category,
    source,
    autoaiName
  }
  return request({
    url: '/autoaiData/getPageList',
    method: 'post',
    data
  })
}

export function downloadAll(query) {
  return request({
    url: '/autoaiData/downloadAll',
    method: 'get',
    responseType: 'arraybuffer'
  })
}

export function pageAiso(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var name = query.name.trim()
  const data = {
    pageNum,
    pageSize,
    name
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
  const data = {
    pageNum,
    pageSize,
    name
  }
  return request({
    url: '/type/getAutoAiPageList',
    method: 'post',
    data
  })
}

export function addAisoInstituteData(query) {
  var aisoCode = query.aiso.code
  var aisoName = query.aiso.name
  var autoaiCode = query.institute.code
  var autoaiName = query.institute.name
  var category = query.aiso.category
  var source = 2
  const data = {
    aisoCode,
    aisoName,
    autoaiCode,
    autoaiName,
    category,
    source
  }
  return request({
    url: '/autoaiData/addData',
    method: 'post',
    data
  })
}

export function delObj(id) {
  return request({
    url: '/autoaiData/deleteById?id=' + id,
    method: 'get'
  })
}

export function getObj(id) {
  return request({
    url: '/autoaiData/getById?id=' + id,
    method: 'get'
  })
}

export function addObj(data) {
  return request({
    url: '/autoaiData/updateById',
    method: 'post',
    data
  })
}

export function uploadExcel(obj) {
  return request({
    url: '/autoaiData/importAutoaiAisoType',
    method: 'post',
    data: obj
  })
}

