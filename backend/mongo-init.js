// MongoDB initialization script
// Note: Environment variables are passed from docker-compose.yml
const rootUsername = process.env.MONGO_INITDB_ROOT_USERNAME || 'admin';
const rootPassword = process.env.MONGO_INITDB_ROOT_PASSWORD || 'admin123';
const dbName = process.env.MONGO_INITDB_DATABASE || 'saudiculture';

db = db.getSiblingDB('admin');
db.auth(rootUsername, rootPassword);

db = db.getSiblingDB(dbName);

db.createUser({
  user: rootUsername,
  pwd: rootPassword,
  roles: [{ role: 'readWrite', db: dbName }],
});
