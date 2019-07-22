import request from '@/utils/request'

export function selectAisoAlias(query) {
  var id = null
  var aisoCode = query
  var aisoAlias = null
  const data = {
    id,
    aisoCode,
    aisoAlias
  }
  return request({
    url: '/aisoAlias/getAisoAliasByAisoCode',
    method: 'post',
    data
  })
}

export function insertAisoAlias(query) {
  var id = query.id
  var aisoCode = query.aisoCode
  var aisoAlias = query.aliasName.trim()
  const data = {
    id,
    aisoCode,
    aisoAlias
  }
  return request({
    url: '/aisoAlias/insertAisoAlias',
    method: 'post',
    data
  })
}
export function deleteAisoAliasById(val) {
  var id = val.id
  var aisoCode = val.aisoCode
  var aisoAlias = val.aisoAlias.trim()
  const data = {
    id,
    aisoCode,
    aisoAlias
  }
  return request({
    url: '/aisoAlias/deleteAisoAliasById',
    method: 'post',
    data
  })
}

export function updateAisoAliasById(val) {
  var id = val.id
  var aisoCode = val.aisoCode
  var aisoAlias = val.aliasName.trim()
  const data = {
    id,
    aisoCode,
    aisoAlias
  }
  return request({
    url: '/aisoAlias/updateAisoAliasById',
    method: 'post',
    data
  })
}
