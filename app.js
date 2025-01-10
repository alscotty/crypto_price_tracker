// app.js
import express from 'express';
import cookies from 'cookie-parser'
import bodyParser from 'body-parser';

import productList from './routes/products.js';

const app = express();
app.use(cookies());
app.use(bodyParser.urlencoded({ limit: '300mb', extended: false }));
app.use(bodyParser.json({ limit: '300mb' }));


app.use('/api', productList);

const port = 5000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
