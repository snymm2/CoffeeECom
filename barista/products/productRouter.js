const express = require("express");

const { sendError } = require("../helpers");
const { validateProduct } = require("./productValidation");
const { createAuthMiddleware } = require("../auth/authMiddleware");

const { uploadProductImage } = require("./productImageUpload")

const fs = require("fs/promises");
const path = require("path");

const allowedCategories = new Set([
    'coffee', 
    'equipment', 
    'merch']);

const allowedSorts = new Set([
    'featured', 
    'name-asc', 
    'price-asc', 
    'price-desc', 
    'rating-desc', 
    'popular', 
    'discount-desc', 
    'random']);

const MAX_PAGE_SIZE = 100;

function parseProductBody(req) {
    if (typeof req.body.product !== 'string') {
        throw new Error("Missing Product Data.");
    }

    let product;

    try {
        product = JSON.parse(req.body.product);
    } catch {
        throw new Error("Product Data must be valid JSON.");
    }

    if (!product || typeof product !== 'object' || Array.isArray(product)) {
        throw new Error("Product data must be a JSON object.");
    }

    return product;
}

async function removeUploadedFile(file) {
    if (!file?.path) return;

    await fs.unlink(file.path).catch((error) => {
        if (error.code !== "ENDENT") {
            console.error("Failed to remove uploaded image:", error);
        }
    });
}

async function removeProductImage(imageUrl) {
    if (typeof imageUrl !== 'string' || !imageUrl.startsWith("/uploads/products")) return;

    const filename = path.basename(imageUrl);

    if (!/^[a-f0-9-]+\.(jpg|png|webp)$/i.test(filename)) return;

    const imagePath = path.resolve(process.cwd(), "uploads", "products", filename);

    await fs.unlink(imagePath).catch((error) => {
        if (error.code !== "ENDENT") {
            console.error("Failed to remove uploaded image:", error);
        }
    });
}

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
    productRouter.post("/", requireAdmin, uploadProductImage.single("image"), async (req, res, next) => {
        let productImage;
        try {
            const product = parseProductBody(req);

            productImage = req.file;
            if (productImage) {
                product.imageUrl = `/uploads/products/${productImage.filename}`;
            }

            const validation = validateProduct(product)
            if (!validation.valid) {
                await removeUploadedFile(productImage);
                return sendError(res, 400, "Product Validation Failed.", validation.errors);
            }

            const createdProduct = await db.insertProduct(product);

            return res.location(`/${createdProduct._id}`).status(201).json(createdProduct);
        } catch (err) {
            await removeUploadedFile(productImage);
            next(err);
        }
    })

    // Updates Product Info
    productRouter.put("/:id", requireAdmin, uploadProductImage.single("image"), async (req, res, next) => {
        
        let newImage;

        try {
            const { id } = req.params;

            if (!db.isValidObjectId(id)) {
                await removeUploadedFile(req.file);
                return sendError(res, 400, "Invalid Product ID.");
            }
            
            const existingProduct = await db.getProductById(id);
            if (!existingProduct) {
                await removeUploadedFile(req.file);
                return sendError(res, 404, "Product Not Found.")
            }

            const product = parseProductBody(req);
            newImage = req.file;

            if (newImage) {
                product.imageUrl = `/uploads/products/${newImage.filename}`;
            } else {
                product.imageUrl = existingProduct.imageUrl || "";
            }

            const validation = validateProduct(product);
            if (!validation.valid) {
                await removeUploadedFile(newImage);
                return sendError(res, 400, "Product Validation Failed.", validation.errors);
            }

            const updatedProduct = await db.updateProduct(id, product);
            if (!updatedProduct) {
                await removeUploadedFile(newImage);
                return sendError(res, 404, "Product not Found.");
            }

            if (newImage && existingProduct.imageUrl !== updatedProduct.imageUrl) {
                await removeProductImage(existingProduct.imageUrl);
            }

            return res.status(200).json(updatedProduct);
        } catch (err) {
            await removeUploadedFile(newImage || req.file);
            next(err);
        }
    });

    // productRouter.patch("/:id", requireAdmin, async (req, res, next) => {
    //     try {

    //         const { id } = req.params;

    //         if (!db.isValidObjectId(id)) {
    //             sendError(res, 400, "Invalid Product ID.");
    //         }

    //         const validation = validateProduct(req.body, { partial: true });

    //         if (!validation.valid) {
    //             return sendError(res, 400, "Product Validation Failed.", validation.errors);
    //         }

    //         const updatedProduct = await db.updateProduct(id, req.body);

    //         if (!updatedProduct) {
    //             return sendError(res, 404, "Product not Found.");
    //         }

    //         return res.status(200).json(updatedProduct);
    //     } catch (err) {
    //         next(err);
    //     }
    // });

    productRouter.patch("/:id/status", requireAdmin, async (req, res, next) => {
        try {

            const { id } = req.params;

            if (!db.isValidObjectId(id)) {
                sendError(res, 400, "Invalid Product ID.");
            }

            const isActive = req.body.isActive;

            if (typeof isActive !== "boolean") {
                sendError(res, 400, "isActive must be a Boolean.")
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