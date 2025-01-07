import React, { useEffect, useState } from 'react';

const getNum = (message) => {
    return Number(message.price)
}

const Analytics = ({ messages }) => {
    const [startingPriceMessage, setStartingPriceMessage] = useState();
    const [recentPercentChange, setRecentPercentChange] = useState();

    useEffect(() => {
        if (messages.length === 1) {
            setStartingPriceMessage(messages[0]);
        } else if (messages.length > 10) {
            let messageLength = messages.length - 1;
            let lastPrice = getNum(messages[messageLength]);
            let prevPrice = getNum(messages[messageLength - 10]);

            if (lastPrice && prevPrice) {
                let percentChange = ((lastPrice - prevPrice) / prevPrice) * 100;
                console.log({ percentChange })
                setRecentPercentChange(percentChange);
            }

        }

    }, [messages])

    if (!startingPriceMessage) return null;

    return (
        <div>
            <h1>Live Analytics</h1>
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