const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    let initialPool = null;
    let dbPool = null;

    try {
        console.log('Connecting to PostgreSQL...');
        
        // Create initial connection
        initialPool = new Pool({
            user: 'postgres',
            host: '127.0.0.1',
            password: 'postgres',
            port: 5432,
            database: 'postgres' // Connect to default database first
        });

        console.log('Connected to PostgreSQL successfully');

        // Drop database if exists and create new one
        console.log('Setting up database...');
        await initialPool.query('DROP DATABASE IF EXISTS linktree_db');
        await initialPool.query('CREATE DATABASE linktree_db');
        console.log('Database created successfully');

        // Close initial connection
        await initialPool.end();

        // Wait a moment for the database to be ready
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Connect to new database
        console.log('Connecting to linktree_db...');
        dbPool = new Pool({
            user: 'postgres',
            host: '127.0.0.1',
            database: 'linktree_db',
            password: 'postgres',
            port: 5432
        });

        // Read and execute schema
        console.log('Reading schema file...');
        const schemaPath = path.join(__dirname, 'src', 'config', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        console.log('Creating tables...');
        await dbPool.query(schema);
        console.log('Schema created successfully');

        // Close the connection
        await dbPool.end();
        console.log('Database setup completed successfully');
        
    } catch (error) {
        console.error('Error details:', error);
        if (error.code === 'ECONNREFUSED') {
            console.error('\nCould not connect to PostgreSQL. Please ensure that:');
            console.error('1. PostgreSQL is installed');
            console.error('2. PostgreSQL service is running');
            console.error('3. Password is correct (should be "postgres")');
            console.error('\nTo check PostgreSQL service:');
            console.error('1. Press Windows + R');
            console.error('2. Type "services.msc" and press Enter');
            console.error('3. Find "PostgreSQL" in the list');
            console.error('4. Ensure its status is "Running"');
        }
    }
}

setupDatabase(); 