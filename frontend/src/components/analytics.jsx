import React, { useEffect, useState } from 'react';
import { LOOKBACK_PERIOD } from '../util/sharedConstants';
import '../styling/analytics.css';

const getNum = (message) => {
    return Number(message.price)
}

const Analytics = ({ messages }) => {
    const [startingPriceMessage, setStartingPriceMessage] = useState();
    const [recentPercentChange, setRecentPercentChange] = useState();
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

            if (lastPrice && prevPrice) {
                let percentChange = ((lastPrice - prevPrice) / prevPrice) * 100;
                setRecentPercentChange(percentChange);
            }
        }

    }, [messages])

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
        <div className='flex'>
            <div>
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
                <h3>Wallet Holdings</h3>
                USD equivalent value: ${walletValueUSD} USD
                BTC value: ${walletValueBTC} BTC
                <br />
                <form onSubmit={(e) => handleSubmit(e)}>
                    Select Purchase Amount in USD:
                    <input type="number" step='0.01' min='0' value={`${purchaseInput}`} onChange={(e) => handleUpdate(e)} />
                </form>
            </div>
            <div>
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