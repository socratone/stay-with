import {
  AggregateOptions,
  DeleteOptions,
  Document,
  EstimatedDocumentCountOptions,
  Filter,
  FindOptions,
  MongoClient,
  OptionalId,
  UpdateFilter,
  UpdateOptions,
} from 'mongodb';

export enum CollectionName {
  Users = 'users',
  LexioDivinas = 'lexio-divinas',
}

const MONGO_CLIENT_URL = process.env.MONGO_CLIENT_URL as string;
const DB_NAME = 'mmm-database';

type FindParams = {
  filter?: Filter<Document>;
  options?: FindOptions<Document>;
};

type CountParams = {
  options?: EstimatedDocumentCountOptions;
};

type UpdateOneParams = {
  options?: UpdateOptions;
};

type DeleteOneParams = {
  options?: DeleteOptions;
};

type AggregateParams = {
  options?: AggregateOptions;
};

class Database {
  client: MongoClient;

  constructor() {
    this.client = new MongoClient(MONGO_CLIENT_URL); // Create a new MongoClient
  }

  async close() {
    try {
      await this.client.close();
    } catch {
      console.error('Database shutdown error.');
    }
  }

  static parseError(error: any) {
    const errorMessage = error?.message; // '500: Database connection failed.' | undefined

    if (typeof errorMessage === 'string') {
      const [status, message] = errorMessage.split(':');
      return {
        status: Number(status.trim()),
        message: message?.trim(),
      };
    }

    return {
      status: 500,
      message: 'Unknown error.',
    };
  }

  // https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/#find-multiple-documents
  async find<T>(
    collectionName: CollectionName,
    params?: FindParams
  ): Promise<T> {
    try {
      const database = this.client.db(DB_NAME);
      const collection = database.collection(collectionName);
      const cursor = collection.find(params?.filter ?? {}, params?.options);
      const documents: any = [];
      await cursor.forEach((document) => {
        documents.push(document);
      });
      return documents;
    } catch (error: any) {
      this.close();
      throw new Error(`500: ${error?.message}`);
    }
  }

  // https://www.mongodb.com/docs/drivers/node/current/usage-examples/findOne/
  async findOne<T>(collectionName: CollectionName, filter: Filter<Document>) {
    try {
      const database = this.client.db(DB_NAME);
      const collection = database.collection(collectionName);
      return (await collection.findOne(filter)) as T | null;
    } catch (error: any) {
      this.close();
      throw new Error(`500: ${error?.message}`);
    }
  }

  async aggregate<T>(
    collectionName: CollectionName,
    pipeline: Document[],
    params?: AggregateParams
  ) {
    try {
      const database = this.client.db(DB_NAME);
      const collection = database.collection(collectionName);
      const cursor = collection.aggregate(pipeline, params?.options);
      const documents: any = [];
      await cursor.forEach((document) => {
        documents.push(document);
      });
      return documents as T;
    } catch (error: any) {
      this.close();
      throw new Error(`500: ${error?.message}`);
    }
  }

  // https://www.mongodb.com/docs/drivers/node/current/usage-examples/updateOne/
  async updateOne(
    collectionName: CollectionName,
    filter: Filter<Document>,
    update: UpdateFilter<Document> | Partial<Document>,
    params?: UpdateOneParams
  ) {
    try {
      const database = this.client.db(DB_NAME);
      const collection = database.collection(collectionName);
      return await collection.updateOne(filter, update, params?.options);
    } catch (error: any) {
      this.close();
      throw new Error(`500: ${error?.message}`);
    }
  }

  async deleteOne(
    collectionName: CollectionName,
    filter: Filter<Document>,
    params?: DeleteOneParams
  ) {
    try {
      const database = this.client.db(DB_NAME);
      const collection = database.collection(collectionName);
      return await collection.deleteOne(filter, params?.options);
    } catch (error: any) {
      this.close();
      throw new Error(`500: ${error?.message}`);
    }
  }

  async count(
    collectionName: CollectionName,
    params?: CountParams
  ): Promise<number> {
    const options = params?.options;

    try {
      const database = this.client.db(DB_NAME);
      const collection = database.collection(collectionName);
      return await collection.estimatedDocumentCount(options);
    } catch (error: any) {
      this.close();
      throw new Error(`500: ${error?.message}`);
    }
  }

  // https://www.mongodb.com/docs/drivers/node/current/usage-examples/insertOne/
  async insertOne(
    collectionName: CollectionName,
    document: OptionalId<Document>
  ) {
    try {
      const database = this.client.db(DB_NAME);
      const collection = database.collection(collectionName);
      return await collection.insertOne(document);
    } catch (error: any) {
      this.close();
      throw new Error(`500: ${error?.message}`);
    }
  }
}

export default Database;
