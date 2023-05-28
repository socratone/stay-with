import { CollectionName } from 'constants/mongodb';
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

class Mongodb {
  client: MongoClient;

  constructor(url = MONGO_CLIENT_URL) {
    this.client = new MongoClient(url); // Create a new MongoClient
  }

  async close() {
    await this.client.close();
  }

  // https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/#find-multiple-documents
  async find<T>(
    collectionName: CollectionName,
    params?: FindParams
  ): Promise<T> {
    const database = this.client.db(DB_NAME);
    const collection = database.collection(collectionName);
    const cursor = collection.find(params?.filter ?? {}, params?.options);
    const documents: any = [];
    await cursor.forEach((document) => {
      documents.push(document);
    });
    return documents;
  }

  // https://www.mongodb.com/docs/drivers/node/current/usage-examples/findOne/
  async findOne<T>(collectionName: CollectionName, filter: Filter<Document>) {
    const database = this.client.db(DB_NAME);
    const collection = database.collection(collectionName);
    return (await collection.findOne(filter)) as T | null;
  }

  async aggregate<T>(
    collectionName: CollectionName,
    pipeline: Document[],
    params?: AggregateParams
  ) {
    const database = this.client.db(DB_NAME);
    const collection = database.collection(collectionName);
    const cursor = collection.aggregate(pipeline, params?.options);
    const documents: any = [];
    await cursor.forEach((document) => {
      documents.push(document);
    });
    return documents as T;
  }

  // https://www.mongodb.com/docs/drivers/node/current/usage-examples/updateOne/
  async updateOne(
    collectionName: CollectionName,
    filter: Filter<Document>,
    update: UpdateFilter<Document> | Partial<Document>,
    params?: UpdateOneParams
  ) {
    const database = this.client.db(DB_NAME);
    const collection = database.collection(collectionName);
    return await collection.updateOne(filter, update, params?.options);
  }

  async deleteOne(
    collectionName: CollectionName,
    filter: Filter<Document>,
    params?: DeleteOneParams
  ) {
    const database = this.client.db(DB_NAME);
    const collection = database.collection(collectionName);
    return await collection.deleteOne(filter, params?.options);
  }

  async count(
    collectionName: CollectionName,
    params?: CountParams
  ): Promise<number> {
    const options = params?.options;
    const database = this.client.db(DB_NAME);
    const collection = database.collection(collectionName);
    return await collection.estimatedDocumentCount(options);
  }

  // https://www.mongodb.com/docs/drivers/node/current/usage-examples/insertOne/
  async insertOne(
    collectionName: CollectionName,
    document: OptionalId<Document>
  ) {
    const database = this.client.db(DB_NAME);
    const collection = database.collection(collectionName);
    return await collection.insertOne(document);
  }

  // https://www.mongodb.com/docs/drivers/node/current/usage-examples/insertMany/
  async insertMany(collectionName: CollectionName, documents: Document[]) {
    const database = this.client.db(DB_NAME);
    const collection = database.collection(collectionName);
    return await collection.insertMany(documents);
  }

  // 💀 특별한 경우를 제외하고는 사용 금지
  async drop(collectionName: CollectionName) {
    const database = this.client.db(DB_NAME);
    const collection = database.collection(collectionName);
    return await collection.drop();
  }
}

export default Mongodb;
