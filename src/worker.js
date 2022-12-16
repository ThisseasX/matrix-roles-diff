import { parentPort } from 'worker_threads';
import mongoose from 'mongoose';

parentPort.once('message', async (dbName) => {
  console.time(dbName);
  console.log(`${dbName} worker started`);

  const conn = await mongoose
    .createConnection(process.env[dbName])
    .asPromise();

  const result = await conn
    .collection('Promotion')
    .aggregate()
    .project({
      _id: -1,
      partNum: 1,
      fixedPricePointRolePermissions: 1,
    })
    .toArray();

  console.log(`${dbName} worker ended`);
  console.timeEnd(dbName);

  conn.close();

  parentPort.postMessage(result);
});
