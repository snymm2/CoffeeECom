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

    get product() {
        if (!this.db) {
            throw new Error('Database has not been initialized.');
        }
        
        return this.db.collection('products');
    }

    isValidObjectId(id) {
        return typeof id === 'string' && ObjectId.isValid(id)
    }

    async insertProduct(productInfo) {
        const result = await this.db.products.insertOne(productInfo);

        return this.products.findOne({_id: result.insertedId})
    }

    async getAllProducts() {

        return await this.products.find({}).toArray();
    }

    async getProductById(productId) {
        
        if (!this.isValidObjectId(productId)) {
            return null;
        }

        return await this.products.findOne({_id: new ObjectId(productId)});
    }

    async updateProduct(productId, updates) {
        if (!this.isValidObjectId(productId)) {
            return null;
        }

        const _id = new ObjectId(productId);

        const result = await this.products.updateOne(
            { _id },
            { $set: updates }
        );

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

    async close() {
        if (this.client) {
            await this.client.close();
            this.client = null;
            this.db = null;
        }
    }
}

module.exports = DBAbstraction;