import request from '@/utils/request'

export function page(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var code = query.code
  var name = query.name
  var isSupportSceen = query.isSupportSceen
  var category = query.category
  var isParent = query.isParent
  var aisoAliasStr = query.aisoAlias
  var type = query.type
  const data = {
    pageNum,
    pageSize,
    code,
    name,
    isSupportSceen,
    category,
    isParent,
    aisoAliasStr,
    type
  }
  return request({
    url: '/data/getAisoDataPageList?true',
    method: 'post',
    data
  })
}

export function downloadAll(query) {
  var code = query.code
  var name = query.name
  var isSupportSceen = query.isSupportSceen
  var category = query.category
  var isParent = query.isParent
  var aisoAliasStr = query.aisoAlias

  const data = {
    code,
    name,
    isSupportSceen,
    category,
    isParent,
    aisoAliasStr
  }

  return request({
    url: '/data/downLoadAllAiso',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

export function uploadExcel(obj) {
  return request({
    url: '/data/importAisoData',
    method: 'post',
    data: obj
  })
}

