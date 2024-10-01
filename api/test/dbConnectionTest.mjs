// api/test/dbConnectionTest.mjs
import pkg from 'pg';
const { Client } = pkg;
import * as chai from 'chai';
const { expect } = chai;
import dotenv from 'dotenv';

dotenv.config();

describe('Database Connection', () => {
  it('should connect to the database successfully', async () => {
    const client = new Client({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

    try {
      await client.connect();
      expect(client._connected).to.be.true;
    } catch (err) {
      throw new Error('Failed to connect to the database');
    } finally {
      await client.end();
    }
  });
});