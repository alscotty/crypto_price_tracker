import express from 'express';
import axios from "axios";

const router = express.Router();

router.get('/products-list', (_req, res) => {
    let config = {
        method: 'get',
        limit: 10,
        maxBodyLength: Infinity,
        url: 'https://api.coinbase.com/api/v3/brokerage/market/products',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    axios.request(config)
        .then((response) => {
            res.json(response.data);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({msg: `Encountered server error: ${error}`})
        });

});

export default router;