import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";


const MILISECONDS_IN_MINUTE = 60000;
const MILISECONDS_IN_SECOND = 1000;

const TimeView = (props) => {

    const [count, setCount] = useState(0);

    const textStyle = {
        fontSize: '3.5em'
    }

    const preZero = (time) => {
        return (time < 10 ? '0' : '') + time;
    };

    const getStringTime = () => {
        const minutes = (props.time - props.time % MILISECONDS_IN_MINUTE) / MILISECONDS_IN_MINUTE;
        const seconds = Math.floor((props.time - minutes * MILISECONDS_IN_MINUTE) / MILISECONDS_IN_SECOND);
        return preZero(minutes) + ':' + preZero(seconds);
    }

    return(
        <h1 style={textStyle}>{getStringTime()}</h1>
    )
}

TimeView.propTypes = {
    time: PropTypes.number.isRequired,
};

export default TimeView;
