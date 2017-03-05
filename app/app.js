import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import { Router, Route, hashHistory } from 'react-router'

import store from './store'
import Post from './providers/post'

const history = syncHistoryWithStore(hashHistory, store)

class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route path="/" component={Post} />
          <Route path="/search/:q" component={Post} />
          <Route path="/global" component={Post} />
        </Router>
      </Provider>
    )
  }
}

export default App
