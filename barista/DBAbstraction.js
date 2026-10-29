'use strict'

const { MongoClient, ObjectId } = require('mongodb');
const { token } = require('morgan');

const DEMO_SHIPPING_FEE = 150;

const PAYMENT_METHODS = {
    "mock-esewa": "Mock eSewa",
    "mock-khalti": "Mock Khalti",
    "cash-on-delivery": "Cash on Delivery"
}

const createOrderNumber = () => {
    return `CE-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

const getUpdatedDocument = (result) => {
    return result?.value ?? result ?? null;
}

const createHttpError = (message, statusCode = 400) => {
    const error = new Error(message);
    error,statusCode = statusCode;
    return error;
}

class DBAbstraction {
    constructor(dbUrl) {
        this.dbUrl = dbUrl;
        this.client = null;
        this.db = null;
    }

    async init() {
        
        this.client = new MongoClient(this.dbUrl);

        try {
            await this.client.connect();
            this.db = this.client.db("CodenCoffeeDB");

            const products = this.db.collection('products');
            await products.createIndex({sku: 1}, {unique: true});

            const orders = this.db.collection('orders');
            await orders.createIndex({orderNumber: 1}, { unique: true});

            const users = this.db.collection("users");
            await users.createIndex({username: 1}, {unique: true});

            const adminSessions = this.db.collection("adminSessions");
            await adminSessions.createIndex({ tokenHash: 1 }, { unique: true });
            await adminSessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
            await adminSessions.createIndex({ userId: 1 });

            console.log("Connected to Database Successfully");
        } catch (err) {
            await this.client.close().catch(() => {});
            this.client = null;
            this.db = null;
            console.log("Failed to initialize DB: ", err);
            throw err;
        }
    }

    get products() {
        if (!this.db) {
            throw new Error('Database has not been initialized.');
        }
        return this.db.collection('products');
    }

    get orders() {
        if (!this.db) {
            throw new Error('Database has not been initialized.');
        }
        return this.db.collection('orders');
    }

    get users() {
        if (!this.db) {
            throw new Error('Database has not been initialized.');
        }
        return this.db.collection('users');
    }

    get adminSessions() {
        if (!this.db) {
            throw new Error('Database has not been initialized.');
        }
        return this.db.collection('adminSessions');
    }

    isValidObjectId(id) {
        return typeof id === 'string' && ObjectId.isValid(id)
    }

    // Products Related
    async insertProduct(productInfo) {
        const result = await this.products.insertOne(productInfo);
        return this.products.findOne({_id: result.insertedId})
    }

    async getProducts({category, search, filters = {}, sort = "featured", page = 1, limit = 12, featured}) {
        const match = { isActive: true };

        if (category) {
            match.category = category;
        }

        if (featured !== undefined) {
            match.isFeatured = featured;
        }

        if (search) {
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            const searchRegex = new RegExp(escapedSearch, 'i');

            match.$or = [
                { name: searchRegex },
                { brand: searchRegex },
                { type: searchRegex },
                { origin: searchRegex },
                { location: searchRegex },
                { roastLevel: searchRegex },
            ];
        }

        const checkboxFields = new Set([
            'brand',
            'type',
            'coffeeType',
            'roastLevel',
            'grindSize',
            'origin',
            'process',
            'machineType',
            'brewingMethod',
            'grinderType',
            'material',
            'operationMode',
            'accessoryType',
            'drinkwareType',
            'storageType',
            'supplyType',
            'merchandiseType',
            'color',
            'location',
            'variant',
            'flavor',
            'skillLevel'
        ]);

        const rangeFields = new Set([
            'price',
            'stock',
            'ratingAvg',
            'weightGrams',
            'volumeMl',
            'powerWatts',
            'pressureBar',
            'capacityLiters',
            'capacityMl',
            'capacityGrams',
            'grindSettings',
            'quantity'
        ]);

        for (const [field, value] of Object.entries(filters)) {
            if (checkboxFields.has(field)) {
                const values = Array.isArray(value) ? value : [value];

                if (values.length > 0 && values.every(item => typeof item === 'string')) {
                    match[field] = { $in: values }
                }

                continue;
            }

            if (rangeFields.has(field)) {
                if (value === null || typeof value !== 'object' || Array.isArray(value)) {
                    continue;
                }

                const range = {};

                if (value.min !== undefined && Number.isFinite(value.min)) {
                    range.$gte = value.min;
                }

                if (value.max !== undefined && Number.isFinite(value.max)) {
                    range.$lte = value.max;
                }

                if (Object.keys(range).length > 0) {
                    match[field] = range;
                }
            }
        }

        const sortOptions = {
            featured: { isFeatured: -1, _id: 1 },
            'name-asc': { name: 1, _id: 1 },
            'price-asc': { effectivePrice: 1, _id: 1 },
            'price-desc': { effectivePrice: -1, _id: 1 },
            'rating-desc': { ratingAvg: -1, _id: 1 },
            popular: { ratingTotal: -1, _id: 1 },
            'discount-desc': { discountPercent: -1, _id: 1 }
        };

        const selectedSort = sortOptions[sort] || sortOptions.featured;
        const skip = (page - 1) * limit;

        const dataPipeline = sort === 'random'
            ? [
                { $sample: { size: skip + limit } },
                { $skip: skip }
            ]
            : [
                { $sort: selectedSort },
                { $skip: skip },
                { $limit: limit }
            ];

        const pipeline = [
            { $match: match },
            { $addFields: {
                effectivePrice: {
                    $multiply: [
                        '$price', {
                            $subtract: [
                                1, { $ifNull: ['$discountPercent', 0]}
                            ]
                        }
                    ]
                }
            }},
            {
                $facet: {
                    data: [
                        ...dataPipeline,
                        {
                            $project: {
                                effectivePrice: 0
                            }
                        }
                    ],
                    metadata: [
                        { $count: 'totalItems'}
                    ]
                }
            }
        ];

        const [result] = await this.products.aggregate(pipeline).toArray();

        const totalItems = result?.metadata[0]?.totalItems ?? 0;

        return {
            data: result?.data ?? [],
            pagination: {
                page,
                limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit)
            }
        };
    }

    async getAllProducts() {

        return await this.products.find({}).toArray();
    }

    async getProductById(productId) {
        
        if (!this.isValidObjectId(productId)) {
            return null;
        }

        const product = await this.products.findOne({_id: new ObjectId(productId)});

        return product
    }

    async updateProduct(productId, updates) {
        if (!this.isValidObjectId(productId)) {
            return null;
        }

        const _id = new ObjectId(productId);

        const result = await this.products.updateOne({ _id }, { $set: updates });

        if (result.matchedCount === 0) {
            return null;
        }

        // Return the updated document.
        return await this.products.findOne({ _id });
    }

    async removeProduct(productId) {

        if (!this.isValidObjectId(productId)) {
            return null;
        }
        
        return await this.products.deleteOne({_id: new ObjectId(productId)});
    }

    async getProductFilterOptions(category) {
        const checkboxFields = [
            "brand",
            "type",
            "coffeeType",
            "roastLevel",
            "grindSize",
            "origin",
            "process",
            "machineType",
            "brewingMethod",
            "grinderType",
            "material",
            "operationMode",
            "accessoryType",
            "drinkwareType",
            "storageType",
            "supplyType",
            "merchandiseType",
            "color",
            "location",
            "variant",
            "flavor",
            "skillLevel"
        ];

        const rangeFields = [
            "price",
            "ratingAvg",
            "weightGrams",
            "volumeMl",
            "powerWatts",
            "pressureBar",
            "capacityLiters",
            "capacityMl",
            "capacityGrams",
            "grindSettings",
            "quantity"
        ];

        // Only include active products, optionally within a category.
        const match = { isActive: true };

        if (category) {
            match.category = category;
        }

        // Build one aggregation group containing all filter statistics.
        const group = {};

        for (const field of checkboxFields) {
            group[field] = {$addToSet: `$${field}`};
        }

        for (const field of rangeFields) {
            group[`${field}Min`] = { $min: `$${field}` };
            group[`${field}Max`] = { $max: `$${field}` };
        }

        const [stats] = await this.products.aggregate([
            { $match: match },
            { $group: { _id: null, ...group }}
        ]).toArray();

        const options = {};
        const ranges = {};

        for (const field of checkboxFields) {
            const values = (stats?.[field] ?? []).filter(value => typeof value === "string" && value.trim().length > 0);
            
            options[field] = [...new Set(values)].sort((a, b) => a.localeCompare(b));
        }

        for (const field of rangeFields) {
            const min = stats?.[`${field}Min`];
            const max = stats?.[`${field}Max`];

            if (Number.isFinite(min) && Number.isFinite(max)) {
                ranges[field] = { min, max};
            }
        }

        return {
            category: category ?? null,
            options,
            ranges
        }
    }

    // Orders Related
    async createOrder({customer, items, paymentMethod}) {

        if (!this.client || !this.db) {
            throw new Error("Database is not initialized.");
        }
        if (!Object.hasOwn(PAYMENT_METHODS, paymentMethod)) {
            throw createHttpError("Invalid payment method.", 400);
        }
        if (!Array.isArray(items) || items.length === 0) {
            throw createHttpError("Order must contain at least one item.", 400);
        }
        if (!customer || !customer.address) {
            throw createHttpError("Customer and Address details are required.", 400);
        }
        if (!Number.isFinite(DEMO_SHIPPING_FEE) || DEMO_SHIPPING_FEE < 0) {
            throw new Error("Invalid backend shipping fee configuration.");
        }

        const quantities = new Map();

        for (const item of items) {
            const id = item.productId ?? item.id;
            if (!this.isValidObjectId(id)) {
                throw createHttpError(`Invalid Product ID: ${id}`, 400);
            }
            if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
                throw createHttpError("Invalid item quantity.", 400);
            }
            const combinedQuantity = (quantities.get(id) || 0) + item.quantity;
            if (combinedQuantity > 99) {
                throw createHttpError("Combined quantity for a product cannot exceed 99.");
            }
            quantities.set(id, combinedQuantity);
        }

        const session = this.client.startSession();

        try {
            let createdOrder = null;
            
            await session.withTransaction(async () => {
                const orderItems = [];
                let subtotal = 0;
    
                for (const [id, quantity] of quantities) {
                    const product = await this.products.findOne(
                        {_id: new ObjectId(id), isActive: {$ne: false}},
                        { session }
                    );

                    if (!product) {
                        throw createHttpError(`Product ${id} not found or inactive.`, 409)
                    }
    
                    const price = Number(product.price);
                    const discount = Number(product.discountPercent ?? 0);
    
                    if (!Number.isFinite(price) || price < 0 || 
                        !Number.isFinite(discount) || discount < 0 || discount > 1) {
                        throw createHttpError(`Invalid price/discount for ${product.name}.`, 409);
                    }
    
                    const stockResult = await this.products.updateOne(
                        { _id: product._id, isActive: { $ne: false }, stock: { $gte: quantity } },
                        { $inc: { stock: -quantity } },
                        { session }
                    );
    
                    if (stockResult.modifiedCount !== 1) {
                        throw createHttpError(`Insufficient stock for ${product.name}.`, 409);
                    }
    
                    const unitPrice = Math.round(price * (1 - discount) * 100) / 100;
                    const lineTotal = Math.round(unitPrice * quantity * 100) / 100;
                    subtotal = Math.round((subtotal + lineTotal) * 100) / 100;
    
                    orderItems.push({
                        productId: product._id,
                        name: product.name,
                        sku: product.sku || null,
                        imageUrl: product.imageUrl || null,
                        quantity,
                        unitPrice,
                        discountPercent: discount,
                        lineTotal
                    });
                }

                const shippingCost = DEMO_SHIPPING_FEE;
                const total = Math.round((subtotal + shippingCost) * 100) / 100;
                const now = new Date();

                const order = {
                    orderNumber: createOrderNumber(),

                    customer: {
                        name: customer.name.trim(),
                        email: customer.email.trim().toLowerCase(),
                        phone: customer.phone.trim(),
                        address: {
                            street: customer.address.street.trim(),
                            city: customer.address.city.trim(),
                            district: customer.address.district.trim(),
                            province: (customer.address.province || "").trim(),
                            postalCode: (customer.address.postalCode || "").trim(),
                            otherInstructions: (customer.address.otherInstructions || "").trim(),
                        }
                    },

                    items: orderItems,
                    subtotal,
                    shippingCost,
                    total,
                    currency: "NPR",

                    payment: {
                        method: paymentMethod,
                        methodLabel: PAYMENT_METHODS[paymentMethod],
                        status: "pending",
                        reference: null,
                        isMock: paymentMethod !== "cash-on-delivery"
                    },

                    status: "pending_payment",
                    stockReserved: true,
                    createdAt: now,
                    updatedAt: now
                };
    
                const insertResult = await this.orders.insertOne(order, {session});
                order._id = insertResult.insertedId;
                createdOrder = order;
            })
            return createdOrder;
        } finally {
            await session.endSession();
        }
    }

    async getOrderById(orderId) {
        if (!this.isValidObjectId(orderId)) {
            throw createHttpError("Invalid Order ID.", 400)
        }
        return await this.orders.findOne({ _id: new ObjectId(orderId) });
    }

    async completeMockPayment(orderId, outcome) {
        if (!this.isValidObjectId(orderId)) {
            throw createHttpError("Invalid Order ID", 400);
        }

        if (!["success", "failure"].includes(outcome)) {
            throw createHttpError("Outcome must be 'success' or 'failure'", 400);
        }

        const session = this.client.startSession();

        try {

            let updatedOrder = null;

            await session.withTransaction(async () => {
                const id = new ObjectId(orderId)
                const order = await this.orders.findOne({ _id: id}, { session });

                if (!order) {
                    throw createHttpError("Order not Found", 404);
                }
                if (order.payment.method === "cash-on-delivery") {
                    throw createHttpError("COD doesn't use mock online payments.", 400);
                }
        
                if (order.status !== "pending_payment" || 
                    order.payment.status !== "pending" || 
                    order.stockReserved !== true) {
                    throw createHttpError("Order isn't awaiting payment.", 409);
                }

                const failed = outcome === "failure";
                const now = new Date();

                if (failed) {
                    for (const item of order.items) {
                        const result = await this.products.updateOne(
                            { _id: item.productId ?? item.id ?? item._id },
                            { $inc: { stock: item.quantity }},
                            { session }
                        );

                        if (result.matchedCount !== 1) {
                            throw new Error(`Could not restore stock for product ${item.productId ?? item.id ?? item._id}`);
                        }
                    }
                }

                const updateResult = await this.orders.findOneAndUpdate(
                    { 
                        _id: id, 
                        status: "pending_payment",
                        "payment.status": "pending", 
                        stockReserved: true,
                    },
                    {
                        $set: {
                            status: failed ? "payment_failed" : "confirmed",
                            "payment.status": failed ? "failed" : "simulated_success",
                            "payment.reference": failed ? null : `MOCK-${Date.now().toString(36).toUpperCase()}`,
                            stockReserved: false,
                            updatedAt: new Date(),
                        }
                    },
                    { 
                        session,
                        returnDocument: "after" }
                );

                const updatedDocument= getUpdatedDocument(updateResult)

                if (!updatedDocument) {
                    throw createHttpError("Order state changed; Refresh and Retry.", 409);
                }

                updatedOrder = updatedDocument
            });

            return updatedOrder;

        } finally {
            await session.endSession();
        }
    }

    async confirmCashOnDelivery(orderId) {

        if (!this.isValidObjectId(orderId)) {
            return null;
        }

        const updatedOrder = await this.orders.findOneAndUpdate(
            { 
                _id: new ObjectId(orderId), 
                status: "pending_payment", 
                "payment.method": "cash-on-delivery", 
                "payment.status": "pending",
                stockReserved: true},
            { 
                $set: { 
                    status: "confirmed", 
                    "payment.status": "pay_on_delivery", 
                    stockReserved: false, 
                    updatedAt: new Date() } 
            },
            { returnDocument: "after" }
        );

        return getUpdatedDocument(updatedOrder);
    }

    // Auth Related
    async getAdminByUsername(username) {

        if (typeof username !== "string" || !username.trim() || username.trim().length > 99) {
            throw createHttpError("Invalid Username.", 400);
        }
        return await this.users.findOne({ username: username.trim(), isActive: true, role: "admin" });
    }

    async getAdminById(userId) {

        if (!this.isValidObjectId(userId)) {
            throw createHttpError("Invalid User Id.", 400);
        }
        return await this.users.findOne({ _id: new ObjectId(userId), isActive: true, role: "admin" });
    }

    async createSession(userId, tokenHash, sessionDurationMs) {

        if (!this.isValidObjectId(userId)) {
            throw createHttpError("Invalid User Id.", 400);
        }

        if (typeof tokenHash !== 'string' || !/^[a-f0-9]{64}$/i.test(tokenHash)) {
            throw createHttpError("Invalid Session Token Hash.", 400);
        }

        if (!Number.isSafeInteger(sessionDurationMs) || sessionDurationMs <= 0) {
            throw createHttpError("Invalid Session Duration.", 400)
        }

        const now = new Date();
        const expiresAt = new Date(now.getTime() + sessionDurationMs);

        const result = await this.adminSessions.insertOne({ 
            userId: new ObjectId(userId), tokenHash: tokenHash, createdAt: now, expiresAt })

        return result.insertedId;
    }

    async removeSessionByHash(tokenHash) {
        if (typeof tokenHash !== 'string' || !/^[a-f0-9]{64}$/i.test(tokenHash)) {
            throw createHttpError("Invalid Session Token Hash.", 400);
        }

        const result = await this.adminSessions.deleteOne({ tokenHash: tokenHash });
        
        return result.deletedCount;
    }

    async removeSessionById(sessionId) {

        if (!this.isValidObjectId(sessionId)) {
            throw createHttpError("Invalid Session ID.", 400);
        }

        const result = await this.adminSessions.deleteOne({ _id: new ObjectId(sessionId) });
        return result.deletedCount;
    }

    async getSessionByHash(tokenHash) {

        if (typeof tokenHash !== 'string' || !/^[a-f0-9]{64}$/i.test(tokenHash)) {
            throw createHttpError("Invalid Session Token Hash.", 400);
        }
        return  await this.adminSessions.findOne({ tokenHash: tokenHash, expiresAt: { $gt: new Date()}});
    }

    async close() {
        if (this.client) {
            await this.client.close();
            this.client = null;
            this.db = null;
        }
    }
}

module.exports = DBAbstraction;