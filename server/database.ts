import {
  Document,
  Filter,
  FindOptions,
  MongoClient,
  OptionalId,
} from 'mongodb';

export enum CollectionName {
  Users = 'users',
}

const URI =
  'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.7.0';
const DATABASE_NAME = 'test';

class Database {
  client: MongoClient;

  constructor() {
    this.client = new MongoClient(URI); // Create a new MongoClient
  }

  private async close() {
    try {
      await this.client.close();
    } catch {
      console.error('Database shutdown error.');
    }
  }

  parseError(error: any) {
    const errorMessage = error?.message; // '500: Database connection failed.' | undefined

    if (typeof errorMessage === 'string') {
      const [status, message] = errorMessage.split(':');
      return {
        status: Number(status.trim()),
        message: message.trim(),
      };
    }

    return {
      status: 500,
      message: 'Unknown error.',
    };
  }

  // https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/#find-multiple-documents
  async find(
    collectionName: CollectionName,
    filter?: Filter<Document>,
    options?: FindOptions<Document>
  ): Promise<any[]> {
    try {
      const database = this.client.db(DATABASE_NAME);
      const collection = database.collection(collectionName);
      const cursor = filter
        ? collection.find(filter, options)
        : collection.find();
      const documents: any = [];
      await cursor.forEach((document) => {
        documents.push(document);
      });
      return documents;
    } catch (error: any) {
      throw new Error(`500: ${error?.message}`);
    } finally {
      this.close();
    }
  }

  // https://www.mongodb.com/docs/drivers/node/current/usage-examples/insertOne/
  async insertOne(
    collectionName: CollectionName,
    document: OptionalId<Document>
  ) {
    try {
      const database = this.client.db(DATABASE_NAME);
      const collection = database.collection(collectionName);
      return await collection.insertOne(document);
    } catch (error: any) {
      throw new Error(`500: ${error?.message}`);
    } finally {
      this.close();
    }
  }
}

export default Database;
