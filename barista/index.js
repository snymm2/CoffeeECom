'use strict'

const express = require('express');
const morgan = require('morgan');
const path = require('path')

const DBAbstraction = require("./DBAbstraction");
const { validateProduct } = require('./productValidation');
const { send } = require('process');

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";
const port = process.env.PORT || 53140;

const db = new DBAbstraction(uri);
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

function sendError(res, status, message, details) {
    const response = {error: message}

    if (details) {
        response.details = details;
    }

    return res.status(status).json(response);
}

// GET /products
// Retrieves all Products
app.get("/products", async (req, res, next) => {
    try {
        const allProducts = await db.getAllProducts();
        res.status(200).json(allProducts);
    } catch (err) {
        next(err);
    }
})

app.get("/products/:id", async (req, res, next) => {
    try {
        const {id} = req.params;

        if (!db.isValidObjectId(id)) {
            return sendError(res, 400, "Invalid Product ID.");
        }

        const product = db.getProductById(id);

        if (!product) {
            return sendError(res, 404, "Product Not Found.");
        }

        res.status(200).json(product);
    } catch (err) {
        next(err);
    }
})

app.post("/products", async (req, res, next) => {
    try {
        const validation = validateProduct(req.body)

        if (!validation.valid) {
            return sendError(res, 400, "Product Validation Failed.", validation.errors);
        }

        const createdProduct = await db.insertProduct(req.body);

        return res.location(`/products/${createdProduct._id}`).status(201).json(createdProduct);
    } catch (err) {
        next(err);
    }
})

app.patch("/products/:id", async (req, res, next) => {
    try {

        const {id} = req.params;

        if (!db.isValidObjectId(id)) {
            sendError(res, 400, "Invalid Product ID.");
        }

        const validation = validateProduct(req.body, {partial: true});

        if (!validation.valid) {
            return sendError(res, 400, "Product Validation Failed.", validation.errors);
        }

        const updatedProduct = await db.updateProduct(id, req.body);

        if (!updatedProduct) {
            return sendError(res, 404, "Product not Found.");
        }

        return res.status(200).json(createdProduct);
    } catch (err) {
        next(err);
    }
});

app.delete("/products/:id", async (req, res, next) => {
    try {

        const { id } = req.params;

        if (!db.isValidObjectId(id)) {
            sendError(res, 400, "Invalid Product ID.");
        }

        const result = await db.removeProduct(id);

        if (!result || result.deleteCount === 0) {
            return sendError(res, 404, "Product not Found.");
        }

        return res.status(204).send();
    } catch (err) {
        next(err);
    }
})

app.use((req, res) => {
    return sendError(res, 404, "Route not Found.")
})

// Centralized error-handling middleware.
// Keep this after all routes.
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