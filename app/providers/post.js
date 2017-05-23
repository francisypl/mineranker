import React, {Component} from 'react';
import MobileDetect from 'mobile-detect';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';

// import the root view that this provider is connected to
import PostView from './../views/post';

// grab any actions we need to perform
import {getPosts} from './../reducer/ducks/post';

// import any services we might need
import * as api from './../services/api';

// pull any application data from redux needed for view
function mapStateToProps(state) {
    let finalObj =  {
        ...state.post
    };
    finalObj.currentMiners = state.miners.currentMiners;
    return finalObj;
}

class PostProvider extends Component {
    constructor() {
        super(...arguments);

        // Detect if we're on mobile so we can automuted videos to autoplay
        const md = new MobileDetect(window.navigator.userAgent);
        this.isMobile = (md.mobile() !== null || md.tablet() !== null);

        // Bind functions
        this.onLoadMore = this.onLoadMore.bind(this);
    }

    componentDidMount() {
        this.onLoadMore();
    }

    render() {
        const props = {
            ...this.props,
            onLoadMore: this.onLoadMore
        };
        return (<PostView {...props}/>);
    }

    onLoadMore() {
        const {dispatch, pagination, currentMiners} = this.props;
        console.log('loading more | pagination', pagination);

        dispatch(getPosts(pagination, api, currentMiners));
    }
}

export default connect(mapStateToProps)(PostProvider);
