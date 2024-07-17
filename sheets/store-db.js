import { MongoClient } from 'mongodb';

const url = 'mongodb://admin:secret@sheets-db:27017';
const client = new MongoClient(url);
const dbName = 'sheets';

let sheets;
const sheetCollection = async () => {
  if (!sheets) {
    await client.connect();
    const db = client.db(dbName);
    sheets = db.collection('sheets');
  }
  return sheets;
};

const read = async () => {
  try {
    const collection = await sheetCollection();
    const docs = await collection.find({}).toArray();
    return docs[0] || {};
  } catch (err) {
    console.log(err);
  }
};

const write = async (sheets) => {
  try {
    const collection = await sheetCollection();
    await collection.deleteMany({});
    await collection.insertOne(sheets);
  } catch (err) {
    console.log(err);
  }
};

const drop = async () => {
  try {
    const collection = await sheetCollection();
    await collection.deleteMany({});
  } catch (err) {
    console.log(err);
  }
};

export default {
  read,
  write,
  drop,
};
