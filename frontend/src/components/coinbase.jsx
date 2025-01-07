import React, { useEffect, useState, useRef } from "react";
import CryptoJS from "crypto-js";
import DynamicGraph from "./dynamicGraph";

// import { fetchCoinBaseProductsList } from '../util/productsList'
// useEffect(() => {
//     fetchCoinBaseProductsList()
//         .then(products => {
//             console.log({ products })
//         })

// }, [])


const CoinbaseWebSocket = ({ productId = "BTC-USD" }) => {
    const privateKey = "todo";

    const [_socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const lastUpdateTimeRef = useRef(Date.now()); // To track the last update time


    useEffect(() => {
        // Generate a signature if API key and secret are provided
        const generateAuthMessage = () => {
            const timestamp = Math.floor(Date.now() / 1000);
            const message = timestamp + "GET/users/self/verify";
            const signature = CryptoJS.HmacSHA256(message, privateKey).toString(CryptoJS.enc.Base64);

            return {
                type: "subscribe",
                signature,
                timestamp,
            };
        };

        // Create WebSocket connection
        const ws = new WebSocket("wss://ws-feed.exchange.coinbase.com");
        setSocket(ws);

        ws.onopen = () => {
            console.log("WebSocket connected");

            // Subscribe to the desired product feed
            const subscribeMessage = {
                type: "subscribe",
                channels: [
                    {
                        name: "ticker",
                        product_ids: [productId],
                    },
                ],
            };

            const authMessage = generateAuthMessage();
            ws.send(JSON.stringify(authMessage));

            ws.send(JSON.stringify(subscribeMessage));
        };

        ws.onmessage = (event) => {
            const now = Date.now();
            const readableTime = new Date().toUTCString()
            const data = JSON.parse(event.data);
            data.timestamp = readableTime;

            // Throttle updates displayed:
            const dataRefreshDelayInMsec = 2000;
            if (now - lastUpdateTimeRef.current >= dataRefreshDelayInMsec) {
                setMessages((prev) => [...prev, data]);
                lastUpdateTimeRef.current = now;
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.onclose = () => {
            console.log("WebSocket disconnected");
        };

        return () => {
            ws.close();
        };
    }, [productId]);

    if (messages.length === 0) {
        return <span>Setting up Coinbase WebSocket Feed...</span>;
    }

    return (
        <div>
            <h1>Coinbase WebSocket Feed</h1>
            <h2>Product: {productId}</h2>
            <ul>
                {messages.slice(-5).reverse().map((message, index) => (
                    <li key={index}>
                        {message.product_id} at ${message.price} @ {message.timestamp}
                    </li>
                ))}
            </ul>
            <DynamicGraph dataPoints={messages} />
        </div>
    );
};

export default CoinbaseWebSocket;
