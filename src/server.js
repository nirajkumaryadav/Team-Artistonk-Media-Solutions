require('dotenv').config();
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);
const app = require('./app');

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Inventory & Order API listening on port ${port}`);
});
