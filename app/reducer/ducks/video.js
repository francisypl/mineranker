/* @flow */

import debug from 'debug'

const log = debug('reducer:ducks:video')

type State = {|
  isPlaying: boolean,
  timeout: ?number,
  ref: Object | null,
|}

export function startVideo (video: Object, isMobile: ?boolean = false) {
  if (isMobile) {
    video.mute()
  }
  video.play()

  return { type: '@video/START_VIDEO', payload: { video } }
}

export function stopVideo (video: Object) {
  video.pause()
  video.seek(0)
  return { type: '@video/STOP_VIDEO', payload: {} }
}

const initialState = {
  isPlaying: false,
  timeout: 0,
  ref: null,
}

export default function reducer (state: State = initialState, action: Action) {
  const { type, payload } = action

  log('[reducer] processing payload')

  switch (type) {
    case '@video/START_VIDEO': {
      return { ...state, isPlaying: true, ref: payload.video }
    }

    case '@video/STOP_VIDEO': {
      return { ...state, isPlaying: false, ref: null }
    }

    default: {
      return state
    }
  }
}
