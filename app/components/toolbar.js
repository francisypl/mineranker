import React, {Component} from 'react';
import {StyleSheet, css} from 'aphrodite';

var styles;

class Toolbar extends Component {
    render() {
        const {label} = this.props;
        return (
            <div className={css(styles.toolbar)}>
                <div className={css(styles.label)}>
                    <span style={{
                        textAlign: 'center'
                    }}>{label}</span>
                </div>
            </div>
        );
    }
}

styles = StyleSheet.create({
    toolbar: {
        width: '100%',
        height: '120px',
        backgroundColor: 'white',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'auto'
    },

    label: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        width: '200px',
        margin: '0 10px 0 10px'
    }
});

export default Toolbar;
