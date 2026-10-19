require('dotenv').config();
const { getDatabase, initDatabase, closeDatabase } = require('./database');

/**
 * Migration script to add scrap fields to equipment table
 */
async function migrate() {
  try {
    console.log('🔄 Running database migration...');
    
    // Initialize database connection
    await initDatabase();
    const db = getDatabase();

    // Add new columns for equipment scrapping
    const migrations = [
      {
        name: 'Add is_scrapped column',
        sql: `ALTER TABLE equipment ADD COLUMN is_scrapped BOOLEAN DEFAULT 0`
      },
      {
        name: 'Add scrapped_date column',
        sql: `ALTER TABLE equipment ADD COLUMN scrapped_date DATE`
      },
      {
        name: 'Add scrapped_reason column',
        sql: `ALTER TABLE equipment ADD COLUMN scrapped_reason TEXT`
      }
    ];

    for (const migration of migrations) {
      try {
        await new Promise((resolve, reject) => {
          db.run(migration.sql, (err) => {
            if (err) {
              // Check if column already exists
              if (err.message.includes('duplicate column name')) {
                console.log(`⏭️  ${migration.name} - Already exists, skipping`);
                resolve();
              } else {
                reject(err);
              }
            } else {
              console.log(`✅ ${migration.name} - Success`);
              resolve();
            }
          });
        });
      } catch (err) {
        console.error(`❌ ${migration.name} - Failed:`, err.message);
      }
    }

    await closeDatabase();
    console.log('\n✅ Migration completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
