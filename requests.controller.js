const { getOne, runQuery, getAll } = require('../db/database');

/**
 * Get all maintenance requests with filters
 */
async function getAllRequests(req, res) {
  try {
    const { status, priority, search, maintenance_for } = req.query;
    
    let query = `
      SELECT 
        mr.*,
        u.name as requester_name,
        u.email as requester_email,
        e.name as equipment_name,
        w.name as work_center_name
      FROM maintenance_requests mr
      LEFT JOIN users u ON mr.requester_employee_id = u.id
      LEFT JOIN equipment e ON mr.equipment_id = e.id
      LEFT JOIN work_centers w ON mr.work_center_id = w.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND mr.status = ?';
      params.push(status);
    }

    if (priority) {
      query += ' AND mr.priority = ?';
      params.push(priority);
    }

    if (maintenance_for) {
      query += ' AND mr.maintenance_for = ?';
      params.push(maintenance_for);
    }

    if (search) {
      query += ' AND (mr.subject LIKE ? OR mr.description LIKE ? OR e.name LIKE ? OR w.name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY mr.created_at DESC';

    const requests = await getAll(query, params);

    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch requests'
    });
  }
}

/**
 * Get single maintenance request by ID
 */
async function getRequestById(req, res) {
  try {
    const { id } = req.params;

    const request = await getOne(`
      SELECT 
        mr.*,
        u.name as requester_name,
        u.email as requester_email,
        e.name as equipment_name,
        w.name as work_center_name
      FROM maintenance_requests mr
      LEFT JOIN users u ON mr.requester_employee_id = u.id
      LEFT JOIN equipment e ON mr.equipment_id = e.id
      LEFT JOIN work_centers w ON mr.work_center_id = w.id
      WHERE mr.id = ?
    `, [id]);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch request'
    });
  }
}

/**
 * Create new maintenance request
 */
async function createRequest(req, res) {
  try {
    const {
      subject,
      description,
      maintenance_for,
      equipment_id,
      work_center_id,
      assigned_team_id,
      assigned_technician_id,
      priority,
      maintenance_type,
      category,
      request_date,
      scheduled_date,
      duration,
      company,
      due_date,
      notes,
      instructions
    } = req.body;

    // Validate required fields
    if (!subject || !maintenance_for) {
      return res.status(400).json({
        success: false,
        message: 'Subject and maintenance_for are required'
      });
    }

    // Validate maintenance_for type
    if (!['equipment', 'work_center'].includes(maintenance_for)) {
      return res.status(400).json({
        success: false,
        message: 'maintenance_for must be either "equipment" or "work_center"'
      });
    }

    // Validate conditional fields
    if (maintenance_for === 'equipment' && !equipment_id) {
      return res.status(400).json({
        success: false,
        message: 'equipment_id is required when maintenance_for is "equipment"'
      });
    }

    if (maintenance_for === 'work_center' && !work_center_id) {
      return res.status(400).json({
        success: false,
        message: 'work_center_id is required when maintenance_for is "work_center"'
      });
    }

    // Ensure only one is set
    if (maintenance_for === 'equipment' && work_center_id) {
      return res.status(400).json({
        success: false,
        message: 'work_center_id must be null when maintenance_for is "equipment"'
      });
    }

    if (maintenance_for === 'work_center' && equipment_id) {
      return res.status(400).json({
        success: false,
        message: 'equipment_id must be null when maintenance_for is "work_center"'
      });
    }

    // requester is the current logged-in user
    const requester_employee_id = req.user.id;

    const result = await runQuery(`
      INSERT INTO maintenance_requests (
        subject, description, maintenance_for, equipment_id, work_center_id,
        requester_employee_id, assigned_team_id, assigned_technician_id,
        priority, maintenance_type, category, request_date, scheduled_date,
        duration, company, due_date, notes, instructions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      subject,
      description || null,
      maintenance_for,
      equipment_id || null,
      work_center_id || null,
      requester_employee_id,
      assigned_team_id || null,
      assigned_technician_id || null,
      priority || 'medium',
      maintenance_type || 'corrective',
      category || null,
      request_date || null,
      scheduled_date || null,
      duration || 0,
      company || null,
      due_date || null,
      notes || null,
      instructions || null
    ]);

    const newRequest = await getOne(
      'SELECT * FROM maintenance_requests WHERE id = ?',
      [result.lastID]
    );

    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      data: newRequest
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create request'
    });
  }
}

/**
 * Update maintenance request
 */
async function updateRequest(req, res) {
  try {
    const { id } = req.params;
    const {
      subject,
      description,
      status,
      priority,
      maintenance_type,
      category,
      request_date,
      scheduled_date,
      duration,
      company,
      due_date,
      assigned_team_id,
      assigned_technician_id,
      notes,
      instructions
    } = req.body;

    // Check if request exists
    const existing = await getOne('SELECT id FROM maintenance_requests WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Build update query dynamically
    const updates = [];
    const params = [];

    if (subject !== undefined) {
      updates.push('subject = ?');
      params.push(subject);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (priority !== undefined) {
      updates.push('priority = ?');
      params.push(priority);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    if (maintenance_type !== undefined) {
      updates.push('maintenance_type = ?');
      params.push(maintenance_type);
    }
    if (category !== undefined) {
      updates.push('category = ?');
      params.push(category);
    }
    if (request_date !== undefined) {
      updates.push('request_date = ?');
      params.push(request_date);
    }
    if (scheduled_date !== undefined) {
      updates.push('scheduled_date = ?');
      params.push(scheduled_date);
    }
    if (duration !== undefined) {
      updates.push('duration = ?');
      params.push(duration);
    }
    if (company !== undefined) {
      updates.push('company = ?');
      params.push(company);
    }
    if (due_date !== undefined) {
      updates.push('due_date = ?');
      params.push(due_date);
    }
    if (assigned_team_id !== undefined) {
      updates.push('assigned_team_id = ?');
      params.push(assigned_team_id);
    }
    if (assigned_technician_id !== undefined) {
      updates.push('assigned_technician_id = ?');
      params.push(assigned_technician_id);
    }
    if (notes !== undefined) {
      updates.push('notes = ?');
      params.push(notes);
    }
    if (instructions !== undefined) {
      updates.push('instructions = ?');
      params.push(instructions);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    await runQuery(
      `UPDATE maintenance_requests SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    const updated = await getOne(
      `SELECT mr.*,
        u.name as requester_name,
        e.name as equipment_name,
        w.name as work_center_name
      FROM maintenance_requests mr
      LEFT JOIN users u ON mr.requester_employee_id = u.id
      LEFT JOIN equipment e ON mr.equipment_id = e.id
      LEFT JOIN work_centers w ON mr.work_center_id = w.id
      WHERE mr.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Request updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update request'
    });
  }
}

/**
 * Delete maintenance request
 */
async function deleteRequest(req, res) {
  try {
    const { id } = req.params;

    const existing = await getOne('SELECT id FROM maintenance_requests WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    await runQuery('DELETE FROM maintenance_requests WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete request'
    });
  }
}

/**
 * Get scheduled maintenance requests for calendar view
 * Returns requests with scheduled_date within the given date range
 */
async function getScheduledRequests(req, res) {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({
        success: false,
        message: 'Start and end dates are required'
      });
    }

    const query = `
      SELECT 
        mr.id,
        mr.subject,
        mr.scheduled_date,
        mr.duration,
        mr.status,
        mr.priority,
        mr.maintenance_for,
        mr.maintenance_type,
        e.name as equipment_name,
        w.name as work_center_name,
        tech.name as technician_name
      FROM maintenance_requests mr
      LEFT JOIN equipment e ON mr.equipment_id = e.id
      LEFT JOIN work_centers w ON mr.work_center_id = w.id
      LEFT JOIN users tech ON mr.assigned_technician_id = tech.id
      WHERE mr.scheduled_date IS NOT NULL
        AND DATE(mr.scheduled_date) >= DATE(?)
        AND DATE(mr.scheduled_date) <= DATE(?)
      ORDER BY mr.scheduled_date ASC
    `;

    const requests = await getAll(query, [start, end]);

    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Get scheduled requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scheduled requests'
    });
  }
}

module.exports = {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
  getScheduledRequests
};
