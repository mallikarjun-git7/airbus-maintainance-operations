const { runQuery } = require('./database');

async function seedDatabase() {
  console.log('Starting database seed...');

  try {
    // Seed some equipment data
    const equipmentData = [
      {
        name: 'CNC Milling Machine #1',
        type: 'machine',
        owner_department: 'Manufacturing',
        location: 'Factory Floor - Zone A',
        serial_no: 'CNC-2024-001',
        vendor: 'Haas Automation',
        warranty_start: '2024-01-15',
        warranty_end: '2026-01-15',
        health_percent: 25
      },
      {
        name: 'Delivery Van - Fleet #5',
        type: 'vehicle',
        owner_department: 'Logistics',
        location: 'Parking Lot B',
        serial_no: 'VAN-2023-005',
        vendor: 'Ford Motors',
        warranty_start: '2023-06-01',
        warranty_end: '2025-06-01',
        health_percent: 20
      },
      {
        name: 'Industrial 3D Printer',
        type: 'machine',
        owner_department: 'R&D',
        location: 'Lab 3',
        serial_no: '3DP-2024-012',
        vendor: 'Stratasys',
        warranty_start: '2024-03-10',
        warranty_end: '2027-03-10',
        health_percent: 85
      },
      {
        name: 'Workstation PC - IT-042',
        type: 'computer',
        owner_department: 'IT',
        location: 'Office 2B',
        serial_no: 'WS-IT-042',
        vendor: 'Dell',
        warranty_start: '2023-11-01',
        warranty_end: '2026-11-01',
        health_percent: 92
      },
      {
        name: 'Hydraulic Press #3',
        type: 'machine',
        owner_department: 'Manufacturing',
        location: 'Factory Floor - Zone C',
        serial_no: 'HYD-2022-003',
        vendor: 'Schuler Group',
        warranty_start: '2022-08-20',
        warranty_end: '2024-08-20',
        health_percent: 15
      },
      {
        name: 'Forklift - Yellow-7',
        type: 'vehicle',
        owner_department: 'Warehouse',
        location: 'Warehouse Sector 4',
        serial_no: 'FLT-2023-007',
        vendor: 'Toyota Material Handling',
        warranty_start: '2023-04-15',
        warranty_end: '2025-04-15',
        health_percent: 68
      }
    ];

    for (const equipment of equipmentData) {
      await runQuery(`
        INSERT INTO equipment (
          name, type, owner_department, location, serial_no, 
          vendor, warranty_start, warranty_end, health_percent
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        equipment.name,
        equipment.type,
        equipment.owner_department,
        equipment.location,
        equipment.serial_no,
        equipment.vendor,
        equipment.warranty_start,
        equipment.warranty_end,
        equipment.health_percent
      ]);
    }

    console.log(`✅ Seeded ${equipmentData.length} equipment records`);
    console.log('Database seed completed!');
  } catch (error) {
    console.error('Seed error:', error);
  }
}

module.exports = { seedDatabase };
