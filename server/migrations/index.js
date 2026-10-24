/**
 * Migrations Runner
 * Executes raw Mongo Shell (.js) migrations.
 * Uses `mongosh` if available; otherwise executes via MongoDB connection with mongosh-compatible environment.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rhythm_clinic';

const migrationsDir = __dirname;
const files = fs
  .readdirSync(migrationsDir)
  .filter((f) => f.endsWith('.js') && f !== 'index.js' && f !== 'run.js')
  .sort();

console.log(`Found ${files.length} Mongo Shell migration script(s).`);

// Check if mongosh is available
let hasMongosh = false;
try {
  execSync('mongosh --version', { stdio: 'ignore' });
  hasMongosh = true;
} catch {
  hasMongosh = false;
}

async function runWithDriver() {
  console.log('[Runner] Connecting to MongoDB to execute shell queries...');
  await mongoose.connect(MONGO_URI);
  const nativeDb = mongoose.connection.db;

  // Build mongosh compatible `db` proxy
  const dbProxy = new Proxy(nativeDb, {
    get(target, prop) {
      if (prop === 'createCollection') {
        return (name, opts) => target.createCollection(name, opts);
      }
      if (prop === 'runCommand') {
        return (cmd) => target.command(cmd);
      }
      if (prop === 'getCollectionNames') {
        return async () => {
          const list = await target.listCollections().toArray();
          return list.map((c) => c.name);
        };
      }
      if (typeof target[prop] === 'function') {
        return target[prop].bind(target);
      }
      // Return collection instance for db.<collName>
      return target.collection(prop);
    }
  });

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    console.log(`\n--- Executing: ${file} ---`);
    let scriptContent = fs.readFileSync(filePath, 'utf-8');

    // Auto-await db calls so mongosh scripts execute sequentially in Node.js
    scriptContent = scriptContent.replace(/(?<!await\s+)\b(db\.[a-zA-Z0-9_.]+\()/g, 'await $1');

    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    const runScript = new AsyncFunction('db', 'print', 'ObjectId', scriptContent);

    try {
      await runScript(dbProxy, console.log, mongoose.Types.ObjectId);
    } catch (err) {
      console.error(`Error executing ${file}:`, err);
      await mongoose.disconnect();
      process.exit(1);
    }
  }

  await mongoose.disconnect();
  console.log('\nAll migrations executed successfully!');
  process.exit(0);
}

function runWithMongosh() {
  console.log('[Runner] Executing via mongosh CLI...');
  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    console.log(`\n--- Executing: ${file} ---`);
    try {
      execSync(`mongosh "${MONGO_URI}" "${filePath}"`, { stdio: 'inherit' });
    } catch (err) {
      console.error(`Migration failed at ${file}:`, err);
      process.exit(1);
    }
  }
  console.log('\nAll migrations executed successfully!');
  process.exit(0);
}

if (hasMongosh) {
  runWithMongosh();
} else {
  runWithDriver().catch((err) => {
    console.error('Migration runner failed:', err);
    process.exit(1);
  });
}
