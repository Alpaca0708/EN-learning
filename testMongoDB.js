// import NextAuth from "next-auth"
// import Providers from "next-auth/providers"
// import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();
import { MongoClient } from 'mongodb';

// const { MongoClient } = require('mongodb');

const uri = process.env.DATABASE_URL; // 确保设置了环境变量
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    // 进行一些数据库操作，例如读取或写入数据
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  } finally {
    await client.close();
  }
}

run();