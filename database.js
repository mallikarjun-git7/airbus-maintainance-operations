const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

let db = null;

/**
 * Initialize SQLite database connection and create tables
 */
function initDatabase() {
  return new Promise((resolve, reject) => {
    try {
      // Create data directory if it doesn't exist
      const dataDir = path.join(__dirname, '../../data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
        console.log('Created data directory:', dataDir);
      }

      // Connect to SQLite database
      const dbPath = path.join(dataDir, 'app.db');
      db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Database connection error:', err);
          reject(err);
          return;
        }
        console.log('Connected to SQLite database:', dbPath);

        // Enable foreign keys
        db.run('PRAGMA foreign_keys = ON');

        // Create users table
        createUsersTable()
          .then(() => createEquipmentTable())
          .then(() => createWorkCentersTable())
          .then(() => createRequestsTable())
          .then(() => resolve(db))
          .catch(reject);
      });
    } catch (error) {
      console.error('Database initialization error:', error);
      reject(error);
    }
  });
}

/**
 * Create users table if it doesn't exist
 */
function createUsersTable() {
  return new Promise((resolve, reject) => {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    db.run(createTableSQL, (err) => {
      if (err) {
        console.error('Error creating users table:', err);
        reject(err);
        return;
      }
      console.log('Users table ready');
      resolve();
    });
  });
}

/**
 * Get database instance
 */
function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

/**
 * Close database connection
 */
function closeDatabase() {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
          reject(err);
          return;
        }
        console.log('Database connection closed');
        resolve();
      });
    } else {
      resolve();
    }
  });
}

/**
 * Helper function to run queries with promises
 */
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

/**
 * Helper function to get a single row
 */
function getOne(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });
}

/**
 * Helper function to get all rows
 */
function getAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

/**
 * Create requests table if it doesn't exist
 */
function createRequestsTable() {
  return new Promise((resolve, reject) => {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS maintenance_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject TEXT NOT NULL,
        description TEXT,
        maintenance_for TEXT DEFAULT 'equipment' CHECK(maintenance_for IN ('equipment', 'work_center')),
        equipment_id INTEGER,
        work_center_id INTEGER,
        requester_employee_id INTEGER NOT NULL,
        assigned_team_id INTEGER,
        assigned_technician_id INTEGER,
        priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high', 'critical')),
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in-progress', 'resolved', 'closed')),
        maintenance_type TEXT DEFAULT 'corrective' CHECK(maintenance_type IN ('corrective', 'preventive')),
        category TEXT,
        request_date DATE,
        scheduled_date DATETIME,
        duration REAL DEFAULT 0,
        company TEXT,
        due_date DATETIME,
        notes TEXT,
        instructions TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (requester_employee_id) REFERENCES users(id),
        FOREIGN KEY (equipment_id) REFERENCES equipment(id),
        FOREIGN KEY (work_center_id) REFERENCES work_centers(id)
      )
    `;

    db.run(createTableSQL, (err) => {
      if (err) {
        console.error('Error creating maintenance_requests table:', err);
        reject(err);
        return;
      }
      console.log('Maintenance requests table ready');
      resolve();
    });
  });
}

/**
 * Create equipment table if it doesn't exist
 */
function createEquipmentTable() {
  return new Promise((resolve, reject) => {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS equipment (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT,
        type TEXT DEFAULT 'other' CHECK(type IN ('machine', 'vehicle', 'computer', 'other')),
        owner_department TEXT,
        owner_employee_id INTEGER,
        technician_id INTEGER,
        location TEXT,
        serial_no TEXT UNIQUE,
        vendor TEXT,
        warranty_start DATE,
        warranty_end DATE,
        assigned_date DATE,
        work_center_id INTEGER,
        company TEXT,
        health_percent INTEGER DEFAULT 100 CHECK(health_percent >= 0 AND health_percent <= 100),
        is_scrapped BOOLEAN DEFAULT 0,
        scrapped_date DATE,
        scrapped_reason TEXT,
        attachments_metadata TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_employee_id) REFERENCES users(id),
        FOREIGN KEY (technician_id) REFERENCES users(id),
        FOREIGN KEY (work_center_id) REFERENCES work_centers(id)
      )
    `;

    db.run(createTableSQL, (err) => {
      if (err) {
        console.error('Error creating equipment table:', err);
        reject(err);
        return;
      }
      console.log('Equipment table ready');
      resolve();
    });
  });
}

/**
 * Create work_centers table if it doesn't exist
 */
function createWorkCentersTable() {
  return new Promise((resolve, reject) => {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS work_centers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        code TEXT UNIQUE NOT NULL,
        tag TEXT,
        alternative_workcenters TEXT,
        cost_per_hour REAL DEFAULT 0,
        capacity REAL DEFAULT 0,
        time_efficiency REAL DEFAULT 0,
        oee_target REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    db.run(createTableSQL, (err) => {
      if (err) {
        console.error('Error creating work_centers table:', err);
        reject(err);
        return;
      }
      console.log('Work centers table ready');
      resolve();
    });
  });
}

/**
 * Seed sample data (idempotent)
 */
async function seedData() {
  try {
    // Check if data already exists
    const userCount = await getOne('SELECT COUNT(*) as count FROM users');
    if (userCount.count > 0) {
      console.log('Database already seeded, skipping seed data');
      return;
    }

    console.log('Seeding database with sample data...');

    // Seed users (employees and technicians) - password: demo123
    const passwordHash = '$2b$10$jylY.YF8KGHdyhcw6EWYfu6x.cgoNs8PlMMQ9xfws2NL8YpWZ1zXC';
    const users = [
      { name: 'Tejas Modi', email: 'tejas@example.com', password_hash: passwordHash },
      { name: 'Mitchell Admin', email: 'mitchell@example.com', password_hash: passwordHash },
      { name: 'Marc Demo', email: 'marc@example.com', password_hash: passwordHash },
      { name: 'Bhaumik P', email: 'bhaumik@example.com', password_hash: passwordHash },
      { name: 'Abigail Peters', email: 'abigail@example.com', password_hash: passwordHash },
      { name: 'John Doe', email: 'john@example.com', password_hash: passwordHash }
    ];

    for (const user of users) {
      await runQuery(
        'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
        [user.name, user.email, user.password_hash]
      );
    }
    console.log('✓ Seeded 6 users');

    // Seed work centers FIRST (before equipment, due to foreign key)
    const workCenters = [
      { name: 'Assembly Line 1', code: 'AL-001', tag: 'High Priority', alternative_workcenters: 'AL-002, AL-003', cost_per_hour: 150.50, capacity: 100, time_efficiency: 85.5, oee_target: 90.0 },
      { name: 'Drilling Station', code: 'DS-001', tag: 'Critical', alternative_workcenters: 'DS-002', cost_per_hour: 120.00, capacity: 50, time_efficiency: 78.3, oee_target: 85.0 },
      { name: 'Packaging', code: 'PKG-001', tag: 'Standard', alternative_workcenters: 'PKG-002', cost_per_hour: 75.00, capacity: 200, time_efficiency: 92.1, oee_target: 95.0 },
      { name: 'Testing Lab', code: 'TST-001', tag: 'Quality', alternative_workcenters: 'None', cost_per_hour: 200.00, capacity: 30, time_efficiency: 88.5, oee_target: 92.0 }
    ];

    for (const wc of workCenters) {
      await runQuery(
        `INSERT INTO work_centers (name, code, tag, alternative_workcenters, cost_per_hour, capacity, time_efficiency, oee_target) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [wc.name, wc.code, wc.tag, wc.alternative_workcenters, wc.cost_per_hour, wc.capacity, wc.time_efficiency, wc.oee_target]
      );
    }
    console.log('✓ Seeded 4 work centers');

    // Seed equipment with full details (after work centers)
    const equipment = [
      { name: 'Samsung Monitor 15"', type: 'computer', category: 'Monitors', owner_department: 'Admin', owner_employee_id: 1, technician_id: 2, location: 'Office A', serial_no: 'MT/125/22778837', vendor: 'Samsung', company: 'My Company (San Francisco)', work_center_id: 1, assigned_date: '2025-01-15', health_percent: 95 },
      { name: 'Acer Laptop', type: 'computer', category: 'Computers', owner_department: 'Technician', owner_employee_id: 4, technician_id: 3, location: 'Workshop', serial_no: 'MT/122/11112222', vendor: 'Acer', company: 'My Company (San Francisco)', work_center_id: null, assigned_date: '2025-02-20', health_percent: 85 },
      { name: 'Drill Machine', type: 'machine', category: 'Power Tools', owner_department: 'Production', owner_employee_id: 3, technician_id: 5, location: 'Factory Floor', serial_no: 'DRL/001/2024', vendor: 'Bosch', company: 'My Company (San Francisco)', work_center_id: 2, assigned_date: '2024-12-01', health_percent: 78 },
      { name: 'Forklift', type: 'vehicle', category: 'Vehicles', owner_department: 'Warehouse', owner_employee_id: 6, technician_id: 2, location: 'Warehouse', serial_no: 'FRK/001/2023', vendor: 'Toyota', company: 'My Company (San Francisco)', work_center_id: 3, assigned_date: '2024-06-15', health_percent: 92 }
    ];

    for (const item of equipment) {
      await runQuery(
        `INSERT INTO equipment (name, type, category, owner_department, owner_employee_id, technician_id, location, serial_no, vendor, company, work_center_id, assigned_date, health_percent) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [item.name, item.type, item.category, item.owner_department, item.owner_employee_id, item.technician_id, item.location, item.serial_no, item.vendor, item.company, item.work_center_id, item.assigned_date, item.health_percent]
      );
    }
    console.log('✓ Seeded 4 equipment items');

    // Seed maintenance requests with varied statuses
    const requests = [
      { subject: 'Monitor Display Issue', description: 'Screen flickering intermittently', maintenance_for: 'equipment', equipment_id: 1, requester_employee_id: 1, assigned_team_id: null, assigned_technician_id: 2, priority: 'high', status: 'in-progress', maintenance_type: 'corrective', category: 'Electronics', request_date: '2025-12-20', scheduled_date: '2025-12-25T10:00:00', duration: 2.0, company: 'My Company (San Francisco)', notes: 'Issue started after power surge' },
      { subject: 'Assembly Line 1 Maintenance', description: 'Routine preventive maintenance scheduled', maintenance_for: 'work_center', work_center_id: 1, requester_employee_id: 3, assigned_team_id: null, assigned_technician_id: 3, priority: 'medium', status: 'pending', maintenance_type: 'preventive', category: 'Mechanical', request_date: '2025-12-24', scheduled_date: '2025-12-30T08:00:00', duration: 4.0, company: 'My Company (San Francisco)', notes: 'Regular oil change and inspection' },
      { subject: 'Laptop Battery Replacement', description: 'Battery not holding charge', maintenance_for: 'equipment', equipment_id: 2, requester_employee_id: 4, assigned_team_id: null, assigned_technician_id: 2, priority: 'medium', status: 'resolved', maintenance_type: 'corrective', category: 'Electronics', request_date: '2025-12-15', scheduled_date: '2025-12-18T14:00:00', duration: 1.5, company: 'My Company (San Francisco)', notes: 'Battery replaced successfully' },
      { subject: 'Drilling Station Calibration', description: 'Equipment needs recalibration due to drift', maintenance_for: 'work_center', work_center_id: 2, requester_employee_id: 3, assigned_team_id: null, assigned_technician_id: 3, priority: 'critical', status: 'in-progress', maintenance_type: 'preventive', category: 'Precision', request_date: '2025-12-22', scheduled_date: '2025-12-26T09:00:00', duration: 3.0, company: 'My Company (San Francisco)', notes: 'Spindle bearings need attention - overdue' }
    ];

    for (const req of requests) {
      await runQuery(
        `INSERT INTO maintenance_requests (subject, description, maintenance_for, equipment_id, work_center_id, requester_employee_id, assigned_team_id, assigned_technician_id, priority, status, maintenance_type, category, request_date, scheduled_date, duration, company, notes) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.subject, req.description, req.maintenance_for, req.equipment_id, req.work_center_id, req.requester_employee_id, req.assigned_team_id, req.assigned_technician_id, req.priority, req.status, req.maintenance_type, req.category, req.request_date, req.scheduled_date, req.duration, req.company, req.notes]
      );
    }
    console.log('✓ Seeded 4 maintenance requests');

    console.log('✓ Database seeding complete');
  } catch (error) {
    console.error('Seed data error:', error);
  }
}

module.exports = {
  initDatabase,
  getDatabase,
  closeDatabase,
  runQuery,
  getOne,
  getAll,
  seedData
};
