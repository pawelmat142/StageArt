import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class MigrationService {
  constructor(
    @InjectConnection('source') private readonly sourceConnection: Connection,
    @InjectConnection('destination') private readonly destinationConnection: Connection,
  ) {}

  async migrate(): Promise<void> {
    const sourceDb = this.sourceConnection.db;
    const destinationDb = this.destinationConnection.db;

    const collections = await sourceDb.listCollections().toArray();

    for (const collection of collections) {
      const collectionName = collection.name;
      const sourceData = await sourceDb.collection(collectionName).find().toArray();
      console.log('');
      console.log('');
      console.log('');
      console.log('');
      console.log('collectionName:', collectionName);
      console.log(sourceData)

      if (sourceData.length > 0) {
        const destinationCollection = destinationDb.collection(collectionName);
        await destinationCollection.insertMany(sourceData);
      }
    }
  }
}