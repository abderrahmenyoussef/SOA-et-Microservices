const express = require('express');
const app = express();
const PORT = 3002;
const products = [ 
  { id: 1, name: 'Laptop', price: 999.99 },
  { id: 2, name: 'Smartphone', price: 699.99 }
];

app.get('/', (req, res) => res.json(products));
app.listen(PORT, () => console.log(`Service B running on :${PORT}`));