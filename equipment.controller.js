const { getOne, runQuery, getAll } = require('../db/database');

/**
 * Get all equipment with filters
 */
async function getAllEquipment(req, res) {
  try {
    const { type, search, health_threshold } = req.query;
    
    let query = `
      SELECT 
        e.*,
        u.name as owner_name,
        u.email as owner_email,
        t.name as technician_name,
        w.name as work_center_name
      FROM equipment e
      LEFT JOIN users u ON e.owner_employee_id = u.id
      LEFT JOIN users t ON e.technician_id = t.id
      LEFT JOIN work_centers w ON e.work_center_id = w.id
      WHERE 1=1
    `;
    const params = [];

    if (type) {
      query += ' AND e.type = ?';
      params.push(type);
    }

    if (health_threshold) {
      query += ' AND e.health_percent < ?';
      params.push(parseInt(health_threshold));
    }

    if (search) {
      query += ' AND (e.name LIKE ? OR e.serial_no LIKE ? OR e.location LIKE ? OR u.name LIKE ? OR e.category LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY e.health_percent ASC, e.name ASC';

    const equipment = await getAll(query, params);

    res.json({
      success: true,
      data: equipment
    });
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch equipment'
    });
  }
}

/**
 * Get single equipment by ID
 */
async function getEquipmentById(req, res) {
  try {
    const { id } = req.params;

    const equipment = await getOne(`
      SELECT 
        e.*,
        u.name as owner_name,
        u.email as owner_email,
        t.name as technician_name,
        w.name as work_center_name
      FROM equipment e
      LEFT JOIN users u ON e.owner_employee_id = u.id
      LEFT JOIN users t ON e.technician_id = t.id
      LEFT JOIN work_centers w ON e.work_center_id = w.id
      WHERE e.id = ?
    `, [id]);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    res.json({
      success: true,
      data: equipment
    });
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch equipment'
    });
  }
}

/**
 * Create new equipment
 */
async function createEquipment(req, res) {
  try {
    const {
      name,
      category,
      type,
      owner_department,
      owner_employee_id,
      technician_id,
      location,
      serial_no,
      vendor,
      warranty_start,
      warranty_end,
      assigned_date,
      work_center_id,
      company,
      health_percent,
      attachments_metadata
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Equipment name is required'
      });
    }

    // Check for duplicate serial number if provided
    if (serial_no) {
      const existing = await getOne('SELECT id FROM equipment WHERE serial_no = ?', [serial_no]);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'Serial number already exists'
        });
      }
    }

    const result = await runQuery(`
      INSERT INTO equipment (
        name, category, type, owner_department, owner_employee_id, technician_id, location,
        serial_no, vendor, warranty_start, warranty_end, assigned_date, work_center_id,
        company, health_percent, attachments_metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name,
      category || null,
      type || 'other',
      owner_department || null,
      owner_employee_id || null,
      technician_id || null,
      location || null,
      serial_no || null,
      vendor || null,
      warranty_start || null,
      warranty_end || null,
      assigned_date || null,
      work_center_id || null,
      company || null,
      health_percent !== undefined ? health_percent : 100,
      attachments_metadata || null
    ]);

    const newEquipment = await getOne(
      `SELECT e.*, u.name as owner_name, u.email as owner_email, t.name as technician_name, w.name as work_center_name
       FROM equipment e
       LEFT JOIN users u ON e.owner_employee_id = u.id
       LEFT JOIN users t ON e.technician_id = t.id
       LEFT JOIN work_centers w ON e.work_center_id = w.id
       WHERE e.id = ?`,
      [result.lastID]
    );

    res.status(201).json({
      success: true,
      message: 'Equipment created successfully',
      data: newEquipment
    });
  } catch (error) {
    console.error('Create equipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create equipment'
    });
  }
}

/**
 * Update equipment
 */
async function updateEquipment(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      type,
      owner_department,
      owner_employee_id,
      technician_id,
      location,
      serial_no,
      vendor,
      warranty_start,
      warranty_end,
      assigned_date,
      work_center_id,
      company,
      health_percent,
      attachments_metadata
    } = req.body;

    // Check if equipment exists
    const existing = await getOne('SELECT id FROM equipment WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    // Check for duplicate serial number if updating
    if (serial_no) {
      const duplicate = await getOne(
        'SELECT id FROM equipment WHERE serial_no = ? AND id != ?',
        [serial_no, id]
      );
      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: 'Serial number already exists'
        });
      }
    }

    // Build update query dynamically
    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (category !== undefined) {
      updates.push('category = ?');
      params.push(category);
    }
    if (type !== undefined) {
      updates.push('type = ?');
      params.push(type);
    }
    if (owner_department !== undefined) {
      updates.push('owner_department = ?');
      params.push(owner_department);
    }
    if (owner_employee_id !== undefined) {
      updates.push('owner_employee_id = ?');
      params.push(owner_employee_id);
    }
    if (technician_id !== undefined) {
      updates.push('technician_id = ?');
      params.push(technician_id);
    }
    if (location !== undefined) {
      updates.push('location = ?');
      params.push(location);
    }
    if (serial_no !== undefined) {
      updates.push('serial_no = ?');
      params.push(serial_no);
    }
    if (vendor !== undefined) {
      updates.push('vendor = ?');
      params.push(vendor);
    }
    if (warranty_start !== undefined) {
      updates.push('warranty_start = ?');
      params.push(warranty_start);
    }
    if (warranty_end !== undefined) {
      updates.push('warranty_end = ?');
      params.push(warranty_end);
    }
    if (assigned_date !== undefined) {
      updates.push('assigned_date = ?');
      params.push(assigned_date);
    }
    if (work_center_id !== undefined) {
      updates.push('work_center_id = ?');
      params.push(work_center_id);
    }
    if (company !== undefined) {
      updates.push('company = ?');
      params.push(company);
    }
    if (health_percent !== undefined) {
      updates.push('health_percent = ?');
      params.push(health_percent);
    }
    if (attachments_metadata !== undefined) {
      updates.push('attachments_metadata = ?');
      params.push(attachments_metadata);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    await runQuery(
      `UPDATE equipment SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    const updated = await getOne(
      `SELECT e.*, u.name as owner_name, u.email as owner_email, t.name as technician_name, w.name as work_center_name
       FROM equipment e
       LEFT JOIN users u ON e.owner_employee_id = u.id
       LEFT JOIN users t ON e.technician_id = t.id
       LEFT JOIN work_centers w ON e.work_center_id = w.id
       WHERE e.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Equipment updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Update equipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update equipment'
    });
  }
}

/**
 * Delete equipment
 */
async function deleteEquipment(req, res) {
  try {
    const { id } = req.params;

    const existing = await getOne('SELECT id FROM equipment WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    await runQuery('DELETE FROM equipment WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Equipment deleted successfully'
    });
  } catch (error) {
    console.error('Delete equipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete equipment'
    });
  }
}

/**
 * Get equipment statistics
 */
async function getEquipmentStats(req, res) {
  try {
    const criticalCount = await getOne(
      'SELECT COUNT(*) as count FROM equipment WHERE health_percent < 30'
    );

    const totalCount = await getOne('SELECT COUNT(*) as count FROM equipment');

    const byType = await getAll(`
      SELECT type, COUNT(*) as count 
      FROM equipment 
      GROUP BY type
    `);

    res.json({
      success: true,
      data: {
        total: totalCount.count,
        critical: criticalCount.count,
        byType: byType
      }
    });
  } catch (error) {
    console.error('Get equipment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch equipment statistics'
    });
  }
}

/**
 * Scrap equipment (mark as unusable)
 */
async function scrapEquipment(req, res) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Check if equipment exists
    const equipment = await getOne('SELECT * FROM equipment WHERE id = ?', [id]);
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    // Mark equipment as scrapped
    await runQuery(
      `UPDATE equipment 
       SET is_scrapped = 1, 
           scrapped_date = CURRENT_TIMESTAMP, 
           scrapped_reason = ?,
           health_percent = 0,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [reason || 'Equipment scrapped due to maintenance request', id]
    );

    res.json({
      success: true,
      message: 'Equipment marked as scrapped successfully'
    });
  } catch (error) {
    console.error('Scrap equipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to scrap equipment'
    });
  }
}

module.exports = {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getEquipmentStats,
  scrapEquipment
};
