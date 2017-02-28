/* @flow */

import React, { Component } from 'react'
import { StyleSheet, css } from 'aphrodite'
import Video from 'react-html5video'
import Waypoint from 'react-waypoint'

type Props = {|
  photo: string,
  video: string,
  onStartVideo: (video: Object) => Promise<void>,
  onStopVideo: (video: Object) => Promise<void>
|}

class PostVideo extends Component {
  props: Props
  video: Object

  render (): React.Element<any> {
    const { photo, video, onStartVideo, onStopVideo } = this.props

    return (
      <div className={css(styles.container)}>
        <Video
          ref={r => (this.video = r)}
          height={'100%'}
          width={'100%'}
          poster={photo}
          autoPlay={false}
          loop={false}
          playsInline
        >
          <source src={video} type="video/mp4" />
        </Video>
        <Waypoint
          key={`waypoint-${video}`}
          onEnter={() => onStartVideo(this.video)}
          onLeave={() => onStopVideo(this.video)}
        />
      </div>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  image: {
    height: '100%',
    width: '100%',
  }
})

export default PostVideo
