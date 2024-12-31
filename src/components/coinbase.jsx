import React, { useEffect, useState, useRef } from "react";
import CryptoJS from "crypto-js";

const CoinbaseWebSocket = ({ productId = "BTC-USD" }) => {
    const apiKey = "Import me as env variable";
    const privateKey = "todo";

    const [_socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const lastUpdateTimeRef = useRef(Date.now()); // To track the last update time

    const url = 'https://api.coinbase.com/api/v3/brokerage/market/products';

 fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(JSON.stringify(data));
      })
      .catch((error) => {
        console.log(error);
      });

    useEffect(() => {
        // Generate a signature if API key and secret are provided
        const generateAuthMessage = () => {
            const timestamp = Math.floor(Date.now() / 1000);
            const message = timestamp + "GET/users/self/verify";
            const signature = CryptoJS.HmacSHA256(message, privateKey).toString(CryptoJS.enc.Base64);

            return {
                type: "subscribe",
                key: apiKey,
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

            // If API key and secret are provided, add authentication message
            if (apiKey) {
                const authMessage = generateAuthMessage();
                ws.send(JSON.stringify(authMessage));
            }

            ws.send(JSON.stringify(subscribeMessage));
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            // Throttle updates to every 3 seconds
            const now = Date.now();
            if (now - lastUpdateTimeRef.current >= 1000) {
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
    }, [apiKey, productId]);

    if (messages.length === 0) {
        return <span>Setting up Coinbase WebSocket Feed...</span>;
    }

    return (
        <div>
            <h1>Coinbase WebSocket Feed</h1>
            <h2>Product: {productId}</h2>
            <ul>
                {messages.slice(-10).map((message, index) => (
                    <li key={index}>
                        {message.product_id} at ${message.price}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CoinbaseWebSocket;
