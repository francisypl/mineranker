import React, { Component } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { debounce } from 'lodash'

type Props = {|
  query: ?string,
  onSearch: (query: string, lastId: string) => Promise<void>,
|}

export default class SearchBar extends Component {
  props: Props

  constructor () {
    super(...arguments)

    this.onSearch = this.onSearch.bind(this)
    this.onSearchDebounced = debounce(this.onSearchDebounced, 500)

    this.state = {
      query: ''
    }
  }

  componentWillReceiveProps (props) {
    this.setState({
      query: props.query
    })
  }

  onSearch (event) {
    const query = event.target.value
    this.setState({ query })
    this.onSearchDebounced(query)
  }

  onSearchDebounced (query) {
    const { onSearch } = this.props
    onSearch(query)
  }

  render () {
    const { query } = this.props

    return (
      <input
        type="text"
        defaultValue={query}
        value={this.state.query}
        className={css(styles.search)}
        onChange={this.onSearch}
        placeholder="Search for a brand ..."
      />
    )
  }
}

const styles = StyleSheet.create({
  search: {
    width: '100%',
    padding: '15px 20px',
    border: '1px solid #d9d9d9',
    borderRadius: '20px',
    backgroundColor: '#fff',
    fontSize: '18px',
    color: '#111',

    ':focus': {
      outline: 0,
      border: '1px solid #111',
    }
  }
})
