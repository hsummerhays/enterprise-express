/**
 * DATABASE CONNECTION GUIDANCE
 *
 * This file serves as a template for connecting to MongoDB or PostgreSQL.
 */

// --- MONGODB BOILERPLATE (Commented out) ---
/*
import mongoose from 'mongoose';

export const connectMongo = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error('MONGODB_URI is not defined');

        await mongoose.connect(uri);
        logger.info('🚀 Successfully connected to MongoDB');
    } catch (error) {
        logger.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};
*/

// --- POSTGRESQL BOILERPLATE (Commented out) ---
/*
import pkg from 'pg';
const { Pool } = pkg;

export const postgresPool = new Pool({
    connectionString: process.env.POSTGRES_URI,
});

export const dbQuery = (text: string, params?: any[]) => postgresPool.query(text, params);

postgresPool.on('connect', () => {
    logger.info('🐘 Connected to PostgreSQL');
});

postgresPool.on('error', (err: Error) => {
    logger.error('❌ Unexpected error on idle PostgreSQL client', err);
    process.exit(-1);
});
*/

// --- CLEANUP GUIDANCE ---

/**
 * Close all database connections properly.
 */
export const disconnectDatabase = async (): Promise<void> => {
	// await mongoose.disconnect();
	// await postgresPool.end();
};
