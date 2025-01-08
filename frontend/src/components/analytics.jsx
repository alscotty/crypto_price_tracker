import React, { useEffect, useState } from 'react';
import { LOOKBACK_PERIOD } from '../util/sharedConstants';

const getNum = (message) => {
    return Number(message.price)
}

const Analytics = ({ messages }) => {
    const [startingPriceMessage, setStartingPriceMessage] = useState();
    const [recentPercentChange, setRecentPercentChange] = useState();

    useEffect(() => {
        if (messages.length === 1) {
            setStartingPriceMessage(messages[0]);
        } else if (messages.length > LOOKBACK_PERIOD) {
            let messageLength = messages.length - 1;
            let lastPrice = getNum(messages[messageLength]);
            let prevPrice = getNum(messages[messageLength - LOOKBACK_PERIOD]);

            if (lastPrice && prevPrice) {
                let percentChange = ((lastPrice - prevPrice) / prevPrice) * 100;
                setRecentPercentChange(percentChange);
            }

        }

    }, [messages])

    if (!startingPriceMessage) return null;

    return (
        <div>
            <h3>Live Analytics</h3>
            Tracking start price at <u>${startingPriceMessage.price} at {startingPriceMessage.timestamp}</u>
            <br />
            ------
            <br />
            {recentPercentChange ? (
                <span
                    style={{
                        color: recentPercentChange >= 0 ? "green" : "red",
                    }}
                >
                    Recent % Change: {recentPercentChange.toFixed(4)}%
                </span>
            ) : (
                ""
            )}
        </div>
    );
};

export default Analytics;