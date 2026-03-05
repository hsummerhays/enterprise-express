# 🗄️ Database Connection Guidance

This guide provides instructions and boilerplate for connecting your TypeScript Express backend to **MongoDB** and **PostgreSQL**.

---

## 1. MongoDB Setup (NoSQL)

MongoDB is a document-oriented database that is highly flexible.

### Recommended Library: `mongoose`

```bash
npm install mongoose
npm install --save-dev @types/mongoose
```

### Connection Boilerplate (`src/utils/db.ts`)

```typescript
import mongoose from 'mongoose';
import logger from './logger.js';

export const connectMongo = async (): Promise<void> => {
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
```

---

## 2. PostgreSQL Setup (SQL)

PostgreSQL is a powerful, open-source relational database.

### 2.1 Recommended Library: `pg` (node-postgres)

```bash
npm install pg
npm install --save-dev @types/pg
```

### Connection Boilerplate (using `pg` driver)

```typescript
import pkg from 'pg';
const { Pool } = pkg;
import logger from './logger.js';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URI,
});

export const dbQuery = (text: string, params?: any[]) => pool.query(text, params);

pool.on('connect', () => {
    logger.info('🐘 Connected to PostgreSQL');
});

pool.on('error', (err: Error) => {
    logger.error('❌ Unexpected error on idle PostgreSQL client', err);
    process.exit(-1);
});
```

---

## 3. Environment Configuration

Add the following to your `.env` file:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/your_db

# PostgreSQL
POSTGRES_URI=postgresql://user:password@localhost:5432/your_db
```

---

## 4. Integration in `server.ts`

To initialize the connection on startup:

```typescript
import { connectMongo } from './utils/db.js';

// ... after logger setup
await connectMongo();
```

To ensure connections are closed correctly during graceful shutdown, ensure `disconnectDatabase()` is called in your shutdown logic.
