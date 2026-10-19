const { getOne, runQuery, getAll } = require('../db/database');

/**
 * Get all work centers
 */
async function getAllWorkCenters(req, res) {
  try {
    const { search } = req.query;
    
    let query = `SELECT * FROM work_centers WHERE 1=1`;
    const params = [];

    if (search) {
      query += ` AND (name LIKE ? OR code LIKE ? OR tag LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY name ASC`;

    const workcenters = await getAll(query, params);

    res.json({
      success: true,
      data: workcenters
    });
  } catch (error) {
    console.error('Get work centers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch work centers'
    });
  }
}

/**
 * Get single work center by ID
 */
async function getWorkCenterById(req, res) {
  try {
    const { id } = req.params;

    const workcenter = await getOne(
      'SELECT * FROM work_centers WHERE id = ?',
      [id]
    );

    if (!workcenter) {
      return res.status(404).json({
        success: false,
        message: 'Work center not found'
      });
    }

    res.json({
      success: true,
      data: workcenter
    });
  } catch (error) {
    console.error('Get work center error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch work center'
    });
  }
}

/**
 * Create new work center
 */
async function createWorkCenter(req, res) {
  try {
    const {
      name,
      code,
      tag,
      alternative_workcenters,
      cost_per_hour,
      capacity,
      time_efficiency,
      oee_target
    } = req.body;

    // Validate required fields
    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: 'Name and code are required'
      });
    }

    // Check for duplicate code
    const existing = await getOne('SELECT id FROM work_centers WHERE code = ?', [code]);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Code already exists'
      });
    }

    const result = await runQuery(`
      INSERT INTO work_centers (
        name, code, tag, alternative_workcenters,
        cost_per_hour, capacity, time_efficiency, oee_target
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name,
      code,
      tag || null,
      alternative_workcenters || null,
      cost_per_hour || 0,
      capacity || 0,
      time_efficiency || 0,
      oee_target || 0
    ]);

    const newWorkCenter = await getOne(
      'SELECT * FROM work_centers WHERE id = ?',
      [result.lastID]
    );

    res.status(201).json({
      success: true,
      message: 'Work center created successfully',
      data: newWorkCenter
    });
  } catch (error) {
    console.error('Create work center error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create work center'
    });
  }
}

/**
 * Update work center
 */
async function updateWorkCenter(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      code,
      tag,
      alternative_workcenters,
      cost_per_hour,
      capacity,
      time_efficiency,
      oee_target
    } = req.body;

    // Check if work center exists
    const existing = await getOne('SELECT id FROM work_centers WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Work center not found'
      });
    }

    // Check for duplicate code if changing it
    if (code) {
      const duplicate = await getOne(
        'SELECT id FROM work_centers WHERE code = ? AND id != ?',
        [code, id]
      );
      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: 'Code already exists'
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
    if (code !== undefined) {
      updates.push('code = ?');
      params.push(code);
    }
    if (tag !== undefined) {
      updates.push('tag = ?');
      params.push(tag);
    }
    if (alternative_workcenters !== undefined) {
      updates.push('alternative_workcenters = ?');
      params.push(alternative_workcenters);
    }
    if (cost_per_hour !== undefined) {
      updates.push('cost_per_hour = ?');
      params.push(cost_per_hour);
    }
    if (capacity !== undefined) {
      updates.push('capacity = ?');
      params.push(capacity);
    }
    if (time_efficiency !== undefined) {
      updates.push('time_efficiency = ?');
      params.push(time_efficiency);
    }
    if (oee_target !== undefined) {
      updates.push('oee_target = ?');
      params.push(oee_target);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    await runQuery(
      `UPDATE work_centers SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    const updated = await getOne('SELECT * FROM work_centers WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Work center updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Update work center error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update work center'
    });
  }
}

/**
 * Delete work center
 */
async function deleteWorkCenter(req, res) {
  try {
    const { id } = req.params;

    const existing = await getOne('SELECT id FROM work_centers WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Work center not found'
      });
    }

    await runQuery('DELETE FROM work_centers WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Work center deleted successfully'
    });
  } catch (error) {
    console.error('Delete work center error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete work center'
    });
  }
}

module.exports = {
  getAllWorkCenters,
  getWorkCenterById,
  createWorkCenter,
  updateWorkCenter,
  deleteWorkCenter
};
