import React, {Component} from 'react';
import {StyleSheet, css} from 'aphrodite';

var styles;

class Toolbar extends Component {
    render() {
        const {label, miners, rankers} = this.props;
        var listVals = label == 'miners' ? miners : rankers;
        return (
            <div className={css(styles.toolbar)}>
                <div className={css(styles.label)}>
                    <span style={{
                        textAlign: 'center',
                        fontWeight: 900
                    }}>{label}</span>
                </div>
                {listVals.map((listVal, i) => (
                    <div key={`${label}-${i}`} className={css(styles.label, styles.clickable)}>
                        <span style={{
                            textAlign: 'center'
                        }}>{listVal.name}</span>
                    </div>
                ))}
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
    },

    clickable: {
        cursor: 'pointer'
    }
});

export default Toolbar;
