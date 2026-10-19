require('dotenv').config();
const { initDatabase } = require('./database');
const { seedDatabase } = require('./seed');

async function runSeed() {
  try {
    console.log('Initializing database...');
    await initDatabase();
    
    console.log('\nSeeding data...');
    await seedDatabase();
    
    console.log('\n✅ All done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

runSeed();
