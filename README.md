# Inventory & Order API

A clean MVC Node.js + Express.js backend using MongoDB and the native `mongodb` driver. It does not use an ORM.

## Setup

1. Install Node.js 18+ and MongoDB, or use MongoDB Atlas.
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env` and set `MONGODB_URI`, `MONGODB_DB`, and `JWT_SECRET`.
4. Create MongoDB indexes:

```bash
npm run migrate
```

6. Start the API:

```bash
npm start
```

Use `npm run dev` for the nodemon development server. The health check is available at `GET /health`.

## Environment Variables

- `MONGODB_URI`: MongoDB connection string, for example `mongodb://127.0.0.1:27017`.
- `MONGODB_DB`: Database name, default `inventory_order_api`.
- `JWT_SECRET`: Secret used to sign and verify JWTs.
- `JWT_EXPIRES_IN`: JWT lifetime such as `1d` or `2h`.
- `PORT`: HTTP port, default `3000`.
- `NODE_ENV`: Runtime environment.

## API Summary

- MongoDB document IDs are 24-character hexadecimal strings.
- `POST /auth/register`, `POST /auth/login`
- `POST /products`, `GET /products`, `GET /products/:id`, `PATCH /products/:id`, `DELETE /products/:id`
- `POST /orders`, `GET /orders`, `GET /orders/:id` (JWT required)

Import `postman/Inventory-Order-API.postman_collection.json` into Postman for the complete request set, including not-found, insufficient-stock, missing-auth, and cross-user order cases.

## Preventing the Last-Item Race

Order creation uses one MongoDB transaction and decrements each product with `findOneAndUpdate({ _id, stockQuantity: { $gte: quantity } }, { $inc: { stockQuantity: -quantity } })`. MongoDB applies the conditional update atomically for the document. If two users try to buy the last item, only one update can match; the other receives no document and the transaction aborts. Use MongoDB Atlas or a local replica set because MongoDB transactions require a replica set deployment.

## AI Tools Used

GitHub Copilot was used to convert the project from PostgreSQL to the native MongoDB driver, draft the collection models and transaction flow, and review the API documentation and validation coverage. The implementation was checked with Node syntax validation and package installation.
# Team-Artistonk-Media-Solutions
# Team-Artistonk-Media-Solutions
