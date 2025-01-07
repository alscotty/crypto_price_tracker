import React, {useEffect, useState} from 'react';

const Analytics = ({ messages }) => {
    const [startingPriceMessage, setStartingPriceMessage] = useState();

    useEffect(() => {
        if (messages.length === 1) setStartingPriceMessage(messages[0]);
    }, [messages])

    if (!startingPriceMessage) return null;
    return (
        <div>
            <h1>Live Analytics</h1>
            Tracking start price at <u>${startingPriceMessage.price} at {startingPriceMessage.timestamp}</u>
        </div>
    );
};

export default Analytics;