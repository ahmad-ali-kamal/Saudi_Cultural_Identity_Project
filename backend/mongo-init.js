db = db.getSiblingDB('admin');
db.auth('admin', 'admin123');

db = db.getSiblingDB('saudiculture');

db.createUser({
  user: 'admin',
  pwd: 'admin123',
  roles: [{ role: 'readWrite', db: 'saudiculture' }],
});
