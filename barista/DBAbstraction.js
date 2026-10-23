'use strict'

const { MongoClient, ObjectId } = require('mongodb');

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

    isValidObjectId(id) {
        return typeof id === 'string' && ObjectId.isValid(id)
    }

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
                        { $sort: selectedSort },
                        { $skip: skip },
                        { $limit: limit },
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

    async close() {
        if (this.client) {
            await this.client.close();
            this.client = null;
            this.db = null;
        }
    }
}

module.exports = DBAbstraction;