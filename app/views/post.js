/* @flow */

import React, { Component } from 'react'
import { StyleSheet, css } from 'aphrodite'
import Waypoint from 'react-waypoint'
import Icon from 'react-fa'

import Post from './../components/post'
import Loader from './../components/loader'

const logo = require('./../assets/logo.svg')

type Props = {|
  error: ?string,
  onLoadMore: () => Promise<void>,
  onNavigate: (path: string) => Promise<void>,
  hasError: boolean,
  isWorking: boolean,
  posts: Array<PostType>,
  loadMoreThreshold: number,
  query: string,
|}

class PostView extends Component {
  props: Props

  render (): React.Element<any> {
    const {
      onNavigate,
      onLoadMore,
      posts,
      loadMoreThreshold,
      isWorking,
      hasError,
      error,
      query,
    } = this.props

    const length = posts.length

    return (
      <div className={css(styles.container)}>
        <div className={css(styles.header)}>
          <img src={logo} className={css(styles.logo)} />
          <a
            href='javascript:void(0)'
            onClick={() => {}}
            className={css(styles.nav, styles.selected)}
          >
            news
          </a>
        </div>
        <div className={css(styles.wrapper)}>
          {!hasError && query && (
            <div className={css(styles.term)}>
              Showing results for <strong>{query}</strong>
            </div>
          )}

          {hasError && (<span className={css(styles.error)}>{error}</span>)}

          {!hasError && !isWorking && posts.length === 0 && (
            <div className={css(styles.noResults)}>
              Sorry, nothing found :(
            </div>
          )}

          {posts.map((post, i) => (
            <Post
              key={`post-${i}`}
              {...post}
            >
              {(length - loadMoreThreshold === i) && (
                <Waypoint key={'load-more'} onEnter={onLoadMore} />
              )}
            </Post>
          ))}
          {isWorking && (<Loader style={styles.spinner} />)}
        </div>
      </div>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#f9f9f9',
  },
  wrapper: {
    maxWidth: '790px',
    margin: '0 auto',
    padding: '20px 0',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignContent: 'center',
    marginBottom: '40px',
    padding: '10px 20px',
    borderBottom: '1px solid #222',
    display: 'flex',
    backgroundColor: '#fff',
  },

  nav: {
    marginTop: '5px',
    marginLeft: '10px',
    fontWeight: '700',
    fontSize: '24px',
    color: '#111',
    textDecoration: 'none',
  },

  selected: {
    textDecoration: 'underline',
  },

  logo: {
    marginRight: '10px',
    width: '45px',
    marginBottom: 0,
    height: 'auto',

    ':hover': {
      cursor: 'pointer',
    },
  },
  spinner: {
    display: 'block',
    color: '#333',
    textAlign: 'center',
  },
  navContainer: {
    textAlign: 'right',
    flex: 1,
  },
  error: {
    display: 'block',
    textAlign: 'center',
    color: 'red',
  },
  term: {
    fontSize: '24px',
    margin: '20px 0 30px 0',
    color: '#333',
  },
  noResults: {
    fontSize: '24px',
    textAlign: 'center',
    margin: '20px 0 30px 0',
    color: '#999',
  },
})

export default PostView
