import * as SQLite from 'expo-sqlite';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export const getDBConnection = async () => {
  if (dbInstance) {
    return dbInstance;
  }
  dbInstance = await SQLite.openDatabaseAsync('checklist_producao.db');
  return dbInstance;
};

export const initDatabase = async () => {
  const db = await getDBConnection();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT,
      clientName TEXT,
      osNumber TEXT,
      serialNumber TEXT,
      productModel TEXT,
      status TEXT,
      startDate TEXT,
      endDate TEXT,
      checklist TEXT
    );
  `);

  try {
    await db.execAsync('ALTER TABLE sessions ADD COLUMN checklist TEXT;');
  } catch (e) {
    // Column likely already exists
    console.log('Migration check: checklist column might already exist');
  }
};
