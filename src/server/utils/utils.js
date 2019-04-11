import parse from 'url-parse'

import { isNil } from 'ramda'

const getGameUrl = url => parse(url)
export const getUrlMatch = hash => hash.match(/#([^[]+)\[([^\]]+)\]/)

export const gotToLogin = (gameUrl) => {

  const { hash } = getGameUrl(gameUrl)

  const match = getUrlMatch(hash)

  if (isNil(match)) {
    return { userName: null, roomName: null }
  }
  return { userName: match[2], roomName: match[1] }
}
