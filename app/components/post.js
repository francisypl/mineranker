import React, { Component } from 'react'
import { StyleSheet, css } from 'aphrodite'

import PostVideo from './post-video'
import PostImage from './post-image'

class Post extends Component {
  props: PostType

  render (): React.Element<any> {
    const {
      og_image_url,
      title,
      children,
      description,
      url,
      upvote,
      downvote,
    } = this.props

    return (
      <div className={css(styles.container)}>
        <PostImage photo={og_image_url} />
        <div className={css(styles.body)}>
          <span className={css(styles.title)}>{title}</span>
          <span className={css(styles.description)}>{description}</span>
        </div>
        {children}
        <div className={css(styles.footer)}>
          <div>
            <a
              href="javascript:void(0)"
              className={css(styles.vote)}
              onClick={() => (console.log('@todo - Implement upvote'))}
            >
              <img className={css(styles.svg)} src={require('./../assets/upvote_active.svg')} />
              <span className={css(styles.voteText)}>{upvote}</span>
            </a>
            <a
              href="javascript:void(0)"
              className={css(styles.vote)}
              onClick={() => (console.log('@todo - Implement downvote'))}
            >
              <img className={css(styles.svg)} src={require('./../assets/downvote_inactive.svg')} />
              <span className={css(styles.voteText)}>{downvote}</span>
            </a>
          </div>
          <div className={css(styles.link)}>
            <a className={css(styles.goto)} href={url} target='_blank'>
              <span className={css(styles.gotoText)}>go to site</span>
              <img className={css(styles.svg)} src={require('./../assets/gotosite.svg')} />
            </a>
          </div>
        </div>
      </div>
    )
  }
}

const styles = StyleSheet.create({
  body: {
    padding: '0px 10px 10px 10px',
  },

  container: {
    height: '100%',
    width: '100%',
    maxWidth: '750px',
    backgroundColor: '#FFF',
    border: '1px solid #e9e9e9',
    marginBottom: '40px',
  },

  description: {
    display: 'block',
    fontSize: '14px',
  },
  
  footer: {
    borderTop: '1px solid #999',
    margin: '0 10px',
    paddingTop: '10px',
    paddingBottom: '15px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  goto: {
    lineHeight: '16px',
    fontSize: '16px',
    color: '#333',
    textDecoration: 'none',
  },
  gotoText: {
    verticalAlign: 'middle',
  },

  link: {
    alignSelf: 'flex-end',
  },

  svg: {
    verticalAlign: 'middle',
    height: '16px',
    width: 'auto',
    margin: '0 5px 0 10px',
  },

  title: {
    fontWeight: '600',
    fontSize: '24px',
    display: 'block',
  },

  vote: {
    lineHeight: '16px',
    fontSize: '16px',
    color: '#333',
    textDecoration: 'none',
  },

  voteText: {
    verticalAlign: 'middle',
  },
})

export default Post
