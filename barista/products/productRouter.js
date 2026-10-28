const express = require("express")

const { sendError } = require("../helpers")
const { validateProduct } = require("./productValidation")
const { createAuthMiddleware } = require("../auth/authMiddleware")

const allowedCategories = new Set(['coffee', 'equipment', 'merch']);
const allowedSorts = new Set(['featured', 'name-asc', 'price-asc', 'price-desc', 'rating-desc', 'popular', 'discount-disc']);
const MAX_PAGE_SIZE = 100;

function createProductRouter(db) {

    const productRouter = express.Router();
    const { requireAdmin } = createAuthMiddleware(db);

    // Retrieves FilterOptions for the ShopPage
    productRouter.get("/filter-options", async (req, res, next) => {
        try {
            const category = req.query.category;

            if (category !== undefined) {
                if (typeof category !== "string" || !allowedCategories.has(category)) {
                    return sendError(res, 400, "Invalid Product Category.");
                }
            }

            const filterOptions = await db.getProductFilterOptions(category);

            return res.status(200).json(filterOptions);
        } catch (error) {
            next(error);
        }
    });

    // Retrieves all Products of a category
    productRouter.get("/", async (req, res, next) => {
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

    productRouter.get("/all", async (req, res, next) => {
        try {
            const result = await db.getAllProducts();
            return res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    })

    // Retrieves Product Info from Product ID
    productRouter.get("/:id", async (req, res, next) => {
        try {
            const { id } = req.params;

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

    // Inserts Product into Database
    productRouter.post("/", requireAdmin, async (req, res, next) => {
        try {
            const validation = validateProduct(req.body)

            if (!validation.valid) {
                return sendError(res, 400, "Product Validation Failed.", validation.errors);
            }

            const createdProduct = await db.insertProduct(req.body);

            return res.location(`/${createdProduct._id}`).status(201).json(createdProduct);
        } catch (err) {
            next(err);
        }
    })

    // Updates Product Info
    productRouter.patch("/:id", requireAdmin, async (req, res, next) => {
        try {

            const { id } = req.params;

            if (!db.isValidObjectId(id)) {
                sendError(res, 400, "Invalid Product ID.");
            }

            const validation = validateProduct(req.body, { partial: true });

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

    // Removes Product from Database
    productRouter.delete("/:id", requireAdmin, async (req, res, next) => {
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

    return productRouter;
}

module.exports = createProductRouter;