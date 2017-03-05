/* @flow */

import React, { Component } from 'react'
import Icon from 'react-fa'
import { StyleSheet, css } from 'aphrodite'

type Props = {|
  style: ?Object
|}

export default class Loader extends Component {
  props: Props

  render () {
    const { style } = this.props
    return (
      <Icon
        spin
        name='spinner'
        className={css(styles.spinner, style)}
      />
    )
  }
}

const styles = StyleSheet.create({
  spinner: {
    fontSize: '36px',
  }
})
