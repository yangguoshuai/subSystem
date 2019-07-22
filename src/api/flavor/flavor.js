import request from '@/utils/request'
export function getFlavorByPage(query) {
  var id = null
  var aisoID = null
  var aisoInfo = null
  var aisoEnInfo = null
  var autoID = query.autoFlavorID
  var autoInfo = query.cnInfo
  var version = query.version
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  const data = {
    id,
    aisoID,
    aisoInfo,
    aisoEnInfo,
    autoID,
    autoInfo,
    version,
    pageNum,
    pageSize
  }
  return request({
    url: '/flavor/selectFlavorByPage',
    method: 'post',
    data: data
  })
}
export function pageAisoFlavor(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var name = query.cnInfo
  var category = 2
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
