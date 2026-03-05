/**
 * DATABASE CONNECTION GUIDANCE
 * 
 * This file serves as a template for connecting to MongoDB or PostgreSQL.
 * Before using, make sure to install the required library:
 * - for MongoDB: npm install mongoose
 * - for PostgreSQL: npm install pg
 */

import logger from './logger.js';

// --- MONGODB BOILERPLATE (Commented out until mongoose is installed) ---
/*
import mongoose from 'mongoose';

export const connectMongo = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error('MONGODB_URI is not defined in environment variables');

        await mongoose.connect(uri);
        logger.info('🚀 Successfully connected to MongoDB');
    } catch (error) {
        logger.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};
*/

// --- POSTGRESQL BOILERPLATE (Commented out until pg is installed) ---
/*
import pkg from 'pg';
const { Pool } = pkg;

export const postgresPool = new Pool({
    connectionString: process.env.POSTGRES_URI,
});

export const dbQuery = (text, params) => postgresPool.query(text, params);

postgresPool.on('connect', () => {
    logger.info('🐘 Connected to PostgreSQL');
});

postgresPool.on('error', (err) => {
    logger.error('❌ Unexpected error on idle PostgreSQL client', err);
    process.exit(-1);
});
*/
