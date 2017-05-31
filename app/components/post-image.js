import React, {Component} from 'react';
import {StyleSheet, css} from 'aphrodite';

var styles;

class PostImage extends Component {
    render() {
        const {photo} = this.props;

        return (
            <div className={css(styles.container)}>
                <img src={photo
                    ? photo
                    : require('./../assets/placeholder_image.svg')} className={css(styles.image)}/>
            </div>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
    },
    image: {
        height: '100%',
        width: '100%'
    }
});

export default PostImage;
