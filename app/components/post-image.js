/* @flow */

import React, { Component } from 'react'
import { StyleSheet, css } from 'aphrodite'

type Props = {|
  photo: string,
|}

class PostImage extends Component {
  props: Props

  render (): React.Element<any> {
    const { photo } = this.props
    return (
      <div className={css(styles.container)}>
        <img
            src={photo ? photo : require('./../assets/placeholder_image.svg')} 
            className={css(styles.image)}
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
  },
})

export default PostImage
