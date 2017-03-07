import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'
import { StyleSheetTestUtils } from 'aphrodite'

import Post from './../post'
import PostImage from './../post-image'
import PostVideo from './../post-video'

describe('<Post {...props} />', () => {
  let defaultProps: Post

  beforeEach(() => {
    StyleSheetTestUtils.suppressStyleInjection()

    defaultProps = {
      _id: 'abc',
      description: 'React Native has come a long way since it was open-sourced in 2015. Fewer than two years later, it’s being used not only in Facebook and Facebook Ads Manager, but also in many other companies, from Fortune 500 companies to hot new startups',
      downvote: 24,
      og_image_url: 'localhost/photo-url',
      source: 'new york times',
      title: 'React Native at Instagram',
      upvote: 142,
      url: 'https://example.com/',
    }
  })

  afterEach(() => {
    StyleSheetTestUtils.clearBufferAndResumeStyleInjection()
  })

  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<Post {...defaultProps} />, div)
  })

  it('renders correctly', () => {
    const tree = renderer.create(
      <Post {...defaultProps} />
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders image', () => {
    const post = mount(
      <Post
        { ...defaultProps }
      />
    )

    expect(post.contains(
      <PostImage
        photo={'localhost/photo-url'}
      />
    )).toBe(true)
  })

  // it('renders video', () => {
    // const dom = (
      // <Post
        // { ...defaultProps }
        // video_url={'localhost/video-url'}
        // isMobile={true}
      // />
    // )
    // const post = mount(dom)

    // const children = post.find(PostVideo)

    // expect(children.length).toBe(1)
    // expect(children.first().props().photo).toEqual('localhost/photo-url')
    // expect(children.first().props().video).toEqual('localhost/video-url')
  // })

  it('renders children', () => {
    const child = (<div>Test 1</div>)
    const child2 = (<div>Test 2</div>)
    const dom = (
      <Post { ...defaultProps }>
        {child}
        {child2}
      </Post>
    )
    const post = mount(dom)

    expect(post.children().length).toBe(5)
    expect(post.children().contains(child)).toBe(true)
    expect(post.children().contains(child2)).toBe(true)

    // snapshot
    const tree = renderer.create(dom).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
