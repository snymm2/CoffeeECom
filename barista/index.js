'use strict'

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const DBAbstraction = require("./DBAbstraction");
const { sendError } = require("./helpers");

const createProductRouter = require("./products/productRouter")
const createOrderRouter = require("./orders/orderRouter")
const createAuthRouter = require("./auth/authRouter")

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";
const port = process.env.PORT || 53140;

const db = new DBAbstraction(uri);
const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors(corsOptions))

// Router for Handling Auth
app.use("/auth", createAuthRouter(db))

// Router for Handling Products
app.use("/products", createProductRouter(db));

// Router for Handling Orders
app.use("/orders", createOrderRouter(db));

app.use((req, res) => {
    return sendError(res, 404, "Route not Found.")
})

// Centralized error-handling middleware.
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    // Malformed JSON sent to express.json().
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return sendError(res, 400, 'Invalid JSON request body.');
    }

    // MongoDB duplicate-key error, such as a duplicate SKU.
    if (err.code === 11000) {
        return sendError(res, 409, 'A product with that unique value already exists.');
    }

    console.error('Unhandled server error:', err);
    return sendError(res, 500, 'An unexpected server error occurred.');
});

async function startServer() {
    try {
        await db.init();

        const server = app.listen(port, () => console.log(`Server running on port ${port}.`));

        let shuttingDown = false;

        async function shutdown(signal) {
            if (shuttingDown) return;
            shuttingDown = true;

            console.log(`${signal} received, Shutting Down...`);

            server.close(async() => {
                try {
                    await db.close();
                    process.exit(0);
                } catch (err) {
                    console.error("Error closing dataabase: ", err);
                    process.exit(1);
                }
            });
        }

        process.once("SIGINT", () => shutdown('SIGINT'));
        process.once("SIGTERM", () => shutdown('SIGTERM'));
    } catch (err) {
        console.error("Couldn't start server: ", err);
        await db.close().catch(() => {});
        process.exitCode = 1;
    }
}

startServer();