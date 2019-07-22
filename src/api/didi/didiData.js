import request from '@/utils/request'

export function page(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var code = query.code
  var name = query.name
  var category = query.category
  var isParent = query.isParent
  const data = {
    pageNum,
    pageSize,
    code,
    name,
    category,
    isParent
  }
  return request({
    url: '/didi/getDidiDataPageList?true',
    method: 'post',
    data
  })
}

export function downloadAll(query) {
  var code = query.code
  var name = query.name
  var category = query.category
  var isParent = query.isParent

  const data = {
    code,
    name,
    category,
    isParent
  }

  return request({
    url: '/didi/downLoadAllDidi',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

export function downloadRelation() {
  return request({
    url: '/didi/downLoadDidiAisoTypeRelation',
    method: 'get',
    responseType: 'arraybuffer'
  })
}

export function uploadExcel(obj) {
  return request({
    url: '/didi/importFile',
    method: 'post',
    data: obj
  })
}

