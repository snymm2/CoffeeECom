'use strict'


const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const DBAbstraction = require("./DBAbstraction");
const { validateProduct } = require('./productValidation');
const createOrderRouter = require("./orderRoutes")
const { sendError } = require("./helpers");

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";
const port = process.env.PORT || 53140;

const db = new DBAbstraction(uri);
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors())

const allowedCategories = new Set(['coffee', 'equipment', 'merch']);
const allowedSorts = new Set(['featured', 'name-asc', 'price-asc', 'price-desc', 'rating-desc', 'popular', 'discount-disc']);
const MAX_PAGE_SIZE = 100;

// Retrieves FilterOptions for the ShopPage
app.get("/products/filter-options", async(req, res, next) => {
    try {
        const category = req.query.category;

        if (category !== undefined) {
            if ( typeof category !== "string" || !allowedCategories.has(category) ) {
                return sendError(res, 400, "Invalid Product Category.");
            }
        }

        const filterOptions = await db.getProductFilterOptions(category);

        return res.status(200).json(filterOptions);
    } catch (error) {
        next(error);
    }
}); 

// Retrieves all Products
app.get("/products", async (req, res, next) => {
    try {
        const { category, search = '', sort = 'featured', filters: filtersParam = '{}' } = req.query;
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 12);

        if (!Number.isInteger(page) || page < 1 ||
            !Number.isInteger(limit) || limit < 1 || limit > MAX_PAGE_SIZE) {
            return sendError(res, 400, `page must be a positive integer, limit must be between 1 and ${MAX_PAGE_SIZE}`);
        }

        if (category !== undefined && !allowedCategories.has(category)) {
            return sendError(res, 400, `Unsupported Product Category.`);
        }

        if (!allowedSorts.has(sort)) {
            return sendError(res, 400, `Unsupported Sort Option.`);
        }

        if (typeof search !== 'string' || search.length > 100) {
            return sendError(res, 400, `Search string must be at most 100 characters.`)
        }

        let filters;

        try {
            filters = JSON.parse(filtersParam);
        } catch {
            return sendError(res, 400, `"filters" must contain valid JSON.`);
        }

        if (filters === null || typeof filters !== 'object' || Array.isArray(filters)) {
            return sendError(res, 400, `"filters" must be a JSON object.`);
        }

        const featuredParam = req.query.featured;
        let featured;

        if (featuredParam !== undefined) {
            if (featuredParam !== "true" && featuredParam !== "false") {
                return sendError(res, 400, "featured must be either true or false.")
            }
            featured = featuredParam === "true";
        }


        const result = await db.getProducts({
            category,
            search: search.trim(),
            filters,
            sort,
            page,
            limit,
            featured
        });

        return res.status(200).json(result);

    } catch (err) {
        next(err);
    }
})

// Retrieves Product Info from Product ID
app.get("/products/:id", async (req, res, next) => {
    try {
        const {id} = req.params;

        if (!db.isValidObjectId(id)) {
            return sendError(res, 400, "Invalid Product ID.");
        }

        const product = await db.getProductById(id);
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

        return res.status(200).json(updatedProduct);
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

// Router for Handling Orders
app.use("/orders", createOrderRouter(db));

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