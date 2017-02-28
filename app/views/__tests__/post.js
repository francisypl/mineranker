import React from 'react'
import TestUtils from 'react-addons-test-utils'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import { StyleSheetTestUtils } from 'aphrodite'

import PostView from './../post'
import Post from './../../components/post'
import Loader from './../../components/loader'

describe('<PostView {...props} />', () => {
  let defaultPost
  let defaultProps

  beforeEach(() => {
    StyleSheetTestUtils.suppressStyleInjection()

    defaultPost = {
      __v: 0,
      _id: 'test-id',
      comments: [],
      comments_count: 0,
      company_name: 'acme inc',
      created: 'Mon Jan 02 2012 00:00:00 GMT+0100 (CET)',
      likes: 42,
      photo_url: 'localhost/photo-url',
      user: {
        avatar_url: 'localhost/avatar-url',
        id: 'test-user-id',
        username: 'test-username',
      },
      video_url: 'localhost/video-url',
      voted: false,
    }

    defaultProps = {
      error: undefined,
      onLoadMore: () => {},
      onStartVideo: () => {},
      onStopVideo: () => {},
      loadMoreThreshold: 4,
      hasError: false,
      isWorking: false,
      posts: [defaultPost],
    }
  })

  afterEach(() => {
    StyleSheetTestUtils.clearBufferAndResumeStyleInjection()
  })

  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<PostView {...defaultProps} />, div)
  })

  it('renders correctly', () => {
    const tree = renderer.create(
      <PostView {...defaultProps} posts={[{ ...defaultPost, video_url: null }]} />
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders multiple posts', () => {
    const posts = defaultProps.posts
    const newPost = {
      __v: 0,
      _id: 'test-id-1',
      comments: [],
      comments_count: 0,
      company_name: 'acme inc',
      created: 'Mon Jan 01 2012 00:00:00 GMT+0100 (CET)',
      likes: 87,
      photo_url: 'localhost/photo-url-1',
      user: {
        avatar_url: 'localhost/avatar-url',
        id: 'test-user-id',
        username: 'test-username',
      },
      video_url: 'localhost/video-url-1',
      voted: false,
    }
    const postViewPosts = [
      ...posts,
      newPost,
    ]

    const post = shallow(
      <PostView
        { ...defaultProps }
        posts={postViewPosts}
      />
    )

    const children = post.children().children(Post)
    expect(children.length).toEqual(2)
    children.forEach((node, i) => {
      expect(node.props()._id).toEqual(postViewPosts[i]._id)
    })
  })

  it('renders single post', () => {
    const post = shallow(
      <PostView
        { ...defaultProps }
      />
    )

    const children = post.children().children(Post)
    expect(children.length).toEqual(1)
  })

  it('renders zero posts', () => {
    const dom = (
      <PostView
        { ...defaultProps }
        posts={[]}
      />
    )
    const post = shallow(dom)

    const children = post.children().children(Post)
    expect(children.length).toEqual(0)

    // snapshot
    const tree = renderer.create(dom).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('loads more posts before hitting end of view', () => {
    const posts = defaultProps.posts
    const newPost = {
      __v: 0,
      _id: 'test-id-1',
      comments: [],
      comments_count: 0,
      company_name: 'acme inc',
      created: 'Mon Jan 01 2012 00:00:00 GMT+0100 (CET)',
      likes: 87,
      photo_url: 'localhost/photo-url-1',
      user: {
        avatar_url: 'localhost/avatar-url',
        id: 'test-user-id',
        username: 'test-username',
      },
      video_url: 'localhost/video-url-1',
      voted: false,
    }

    const mockOnLoadMore = jest.fn()

    const post = TestUtils.renderIntoDocument(
      <PostView
        { ...defaultProps }
        loadMoreThreshold={1}
        posts={[
          ...posts,
          newPost,
          newPost,
          newPost,
        ]}
        onLoadMore={() => mockOnLoadMore()}
      />
    )
    // Find the first post node and scroll
    const postNode = ReactDOM.findDOMNode(post)
    document.body.scrollTop = 500
    window.dispatchEvent(new window.UIEvent('scroll', { target: postNode, detail: 0 }))

    expect(mockOnLoadMore.mock.calls.length).toBe(1)
  })

  it('renders loading icon when loading more posts', () => {
    const dom = (
      <PostView
        { ...defaultProps }
        posts={[ { ...defaultPost, video_url: null } ]}
        isWorking={true}
      />
    )
    const post = shallow(dom)

    const children = post.children().children(Loader)
    expect(children.length).toBe(1)

    // snapshot
    const tree = renderer.create(dom).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('gracefully handles error if a problem was encountered', () => {
    const dom = (
      <PostView
        { ...defaultProps }
        hasError={true}
        posts={[]}
        error={'Problem connecting to the network'}
      />
    )
    const post = shallow(dom)

    const children = post.children().children('span')
    expect(children.length).toBe(1)

    // snapshot
    const tree = renderer.create(dom).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
