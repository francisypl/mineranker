import React, {Component} from 'react';
import Icon from 'react-fa';
import {StyleSheet, css} from 'aphrodite';

var styles;

export default class Loader extends Component {
    render() {
        const {style} = this.props;

        return (<Icon spin name='spinner' className={css(styles.spinner, style)}/>);
    }
}

styles = StyleSheet.create({
    spinner: {
        fontSize: '36px'
    }
});
