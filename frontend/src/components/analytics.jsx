import React, { useEffect, useState } from 'react';
import { LOOKBACK_PERIOD } from '../util/sharedConstants';
import '../styling/analytics.css';

const getNum = (message) => {
    return Number(message.price)
}

const calculateAverage = (messages) => {
    const total = messages.reduce((acc, message) => acc + getNum(message), 0);
    return total / messages.length;
}

const calculateStandardDeviation = (messages, mean) => {
    const variance = messages.reduce((acc, message) => acc + Math.pow(getNum(message) - mean, 2), 0) / messages.length;
    return Math.sqrt(variance);
}

const calculateMaxPrice = (messages) => {
    return Math.max(...messages.map(message => getNum(message)));
}

const calculateMinPrice = (messages) => {
    return Math.min(...messages.map(message => getNum(message)));
}

const Analytics = ({ messages }) => {
    const [startingPriceMessage, setStartingPriceMessage] = useState();
    const [recentPercentChange, setRecentPercentChange] = useState();
    const [averagePrice, setAveragePrice] = useState();
    const [priceStandardDeviation, setPriceStandardDeviation] = useState();
    const [maxPrice, setMaxPrice] = useState();
    const [minPrice, setMinPrice] = useState();
    const [purchaseInput, setPurchaseInput] = useState(0);
    const [walletValueUSD, setWalletValueUSD] = useState(0);
    const [walletValueBTC, setWalletValueBTC] = useState(0);
    const [transactions, addTransaction] = useState([]);

    useEffect(() => {
        if (messages.length === 1) {
            setStartingPriceMessage(messages[0]);
        } else if (messages.length > LOOKBACK_PERIOD) {
            let messageLength = messages.length - 1;
            let lastPrice = getNum(messages[messageLength]);
            let prevPrice = getNum(messages[messageLength - LOOKBACK_PERIOD]);

            let percentChange;
            if (lastPrice && prevPrice) {
                percentChange = ((lastPrice - prevPrice) / prevPrice) * 100;
                setRecentPercentChange(percentChange);
            }

            const avgPrice = calculateAverage(messages);
            setAveragePrice(avgPrice);

            const stdDev = calculateStandardDeviation(messages, avgPrice);
            setPriceStandardDeviation(stdDev);

            const max = calculateMaxPrice(messages);
            setMaxPrice(max);

            const min = calculateMinPrice(messages);
            setMinPrice(min);

            // Simulated bot trades
            if (percentChange > 0 && walletValueUSD > 0) {
                // Buy if trending up
                const BTCValue = walletValueUSD / lastPrice;
                setWalletValueBTC(walletValueBTC + BTCValue);
                setWalletValueUSD(0);
                addTransaction(transactions => [...transactions, {
                    type: 'Purchase',
                    source: 'bot',
                    amount: BTCValue,
                    timestamp: new Date().toLocaleString()
                }]);
            } else if (percentChange < 0 && walletValueBTC > 0) {
                // Sell if trending down
                const USDValue = walletValueBTC * lastPrice;
                setWalletValueUSD(USDValue);
                setWalletValueBTC(0);
                addTransaction(transactions => [...transactions, {
                    type: 'Sale',
                    source: 'bot',
                    amount: USDValue,
                    timestamp: new Date().toLocaleString()
                }]);
            }
        }

    }, [messages, walletValueUSD, walletValueBTC])

    const handleUpdate = (e) => {
        setPurchaseInput(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setWalletValueUSD(purchaseInput);
        const BTCValue = purchaseInput / getNum(messages[messages.length - 1]);
        setWalletValueBTC(BTCValue);
        addTransaction([...transactions, {
            type: 'Purchase',
            source: 'human',
            amount: BTCValue,
            timestamp: new Date().toLocaleString()
        }]);
    }

    return (
        <div className='analytics-container'>
            <div className='analytics-section'>
                <h3>Live Analytics</h3>
                Tracking start price at <u>${startingPriceMessage?.price} at {startingPriceMessage?.timestamp}</u>
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
                <br />
                {averagePrice ? (
                    <span>
                        Average Price: ${averagePrice.toFixed(4)}
                    </span>
                ) : (
                    ""
                )}
                <br />
                {priceStandardDeviation ? (
                    <span>
                        Price Standard Deviation: ${priceStandardDeviation.toFixed(4)}
                    </span>
                ) : (
                    ""
                )}
                <br />
                {maxPrice ? (
                    <span>
                        Max Price: ${maxPrice.toFixed(4)}
                    </span>
                ) : (
                    ""
                )}
                <br />
                {minPrice ? (
                    <span>
                        Min Price: ${minPrice.toFixed(4)}
                    </span>
                ) : (
                    ""
                )}
                <br />
                <h3>Wallet Holdings</h3>
                USD equivalent value: ${walletValueUSD} USD
                BTC value: ${walletValueBTC} BTC
                <br />
                <form onSubmit={(e) => handleSubmit(e)}>
                    Select Purchase Amount in USD:
                    <input type="number" step='0.01' min='0' value={`${purchaseInput}`} onChange={(e) => handleUpdate(e)} />
                </form>
            </div>
            <div className='analytics-section'>
                <h3>
                    Transaction History
                </h3>
                <ul>
                    {transactions.map((transaction, index) => {
                        const { type, amount, timestamp, source } = transaction;
                        return (
                            <li key={index}>
                                {type} of {amount} USD at {timestamp} ordered by {source}
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    );
};

export default Analytics;