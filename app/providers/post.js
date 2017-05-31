import React, {Component} from 'react';
import MobileDetect from 'mobile-detect';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import _ from 'underscore';

// import the root view that this provider is connected to
import PostView from './../views/post';

// grab any actions we need to perform
import {getPosts} from './../reducer/ducks/post';
import {getMinersByIds} from './../reducer/ducks/miners';
import {getRankersByIds} from './../reducer/ducks/rankers';

// import any services we might need
import * as api from './../services/api';

// pull any application data from redux needed for view
function mapStateToProps(state) {
    let finalObj = {
        ...state.post
    };
    finalObj.currentMiners = state.miners.currentMiners;
    finalObj.currentRankers = state.rankers.currentRankers;
    finalObj.richRankers = state.rankers.richRankers;
    finalObj.richMiners = state.miners.richMiners;
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
        this.updateCurrentMiners = this.updateCurrentMiners.bind(this);
        this.updateCurrentRankers = this.updateCurrentRankers.bind(this);
    }

    componentDidMount() {
        this.updateCurrentMiners();
        this.updateCurrentRankers();
        this.onLoadMore();
    }

    updateCurrentMiners() {
        const {
            dispatch,
            currentMiners
        } = this.props;

        dispatch(getMinersByIds(api, currentMiners));
    }

    updateCurrentRankers() {
        const {
            dispatch,
            currentRankers
        } = this.props;

        dispatch(getRankersByIds(api, currentRankers));
    }

    render() {
        const props = {
            ...this.props,
            onLoadMore: this.onLoadMore
        };
        return (<PostView {...props}/>);
    }

    onLoadMore() {
        const {
            dispatch,
            pagination,
            currentMiners,
            currentRankers
        } = this.props;
        console.log('loading more | pagination', pagination);

        dispatch(getPosts(pagination, api, currentMiners, currentRankers));
    }
}

export default connect(mapStateToProps)(PostProvider);
