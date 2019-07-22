import request from '@/utils/request'
export function page(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var cnId = query.cnId
  var cnInfo = query.cnInfo
  var status = query.status
  var tableName = 'gas_status_youke'
  const data = {
    pageNum,
    pageSize,
    cnId,
    cnInfo,
    status,
    tableName
  }
  return request({
    url: '/youke/selectYoukeGas',
    method: 'post',
    data
  })
}

export function insertData(query) {
  var tableName = 'gas_status_youke'
  var cnId = query.cnId
  var cnInfo
  if (query.cnInfo != null) {
    cnInfo = query.cnInfo.trim()
  } else {
    cnInfo = query.cnInfo
  }
  var enInfo
  if (query.enInfo != null) {
    enInfo = query.enInfo.trim()
  } else {
    enInfo = query.enInfo
  }
  const data = {
    cnId,
    cnInfo,
    tableName,
    enInfo
  }
  return request({
    url: '/youke/addYouke',
    method: 'post',
    data
  })
}

export function updateData(query) {
  var tableName = 'gas_status_youke'
  var cnId = query.cnId
  var cnInfo
  if (query.cnInfo != null) {
    cnInfo = query.cnInfo.trim()
  } else {
    cnInfo = query.cnInfo
  }
  var enInfo
  if (query.enInfo != null) {
    enInfo = query.enInfo.trim()
  } else {
    enInfo = query.enInfo
  }
  const data = {
    cnId,
    cnInfo,
    tableName,
    enInfo
  }
  return request({
    url: '/youke/updateYouke',
    method: 'post',
    data
  })
}

export function downloadData() {
  var tableName = 'gas_status_youke'
  return request({
    url: '/youke/exportYoukeData?tableName=' + tableName,
    method: 'get',
    responseType: 'arraybuffer'
  })
}

export function uploadFile(obj) {
  var tableName = 'gas_status_youke'
  return request({
    url: '/youke/importFile?tableName=' + tableName,
    method: 'post',
    data: obj
  })
}
