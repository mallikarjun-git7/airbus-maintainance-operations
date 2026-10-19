# GearGuard API Routes & Frontend Routes

## 🌐 Frontend Routes

### Public Routes
```
GET  /                    Landing page
GET  /login              Login page
GET  /register           Registration page
GET  /forgot-password    Password recovery
```

### Protected Routes (Require Authentication)

#### Dashboard
```
GET  /dashboard          Main dashboard with KPIs and overview
```

#### Maintenance Requests
```
GET  /requests           List view of all maintenance requests
GET  /requests/kanban    🆕 Kanban board view (drag-and-drop)
GET  /requests/new       Create new maintenance request form
GET  /requests/:id       Edit/view maintenance request details
```

#### Equipment
```
GET  /equipment          List view of all equipment
GET  /equipment/new      Create new equipment form
GET  /equipment/:id      Edit equipment (with 🆕 Maintenance button)
```

#### Work Centers (Teams)
```
GET  /work-centers       List view of work centers/teams
GET  /work-centers/new   Create new work center form
GET  /work-centers/:id   Edit work center details
```

#### Calendar
```
GET  /calendar           Calendar view for preventive maintenance
```

---

## 🔌 Backend API Routes

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

### Equipment Endpoints

All equipment routes require `Authorization: Bearer <token>` header.

#### Get All Equipment
```http
GET /api/equipment
Query Params:
  - type?: string (machine|vehicle|computer|other)
  - search?: string
  - health_threshold?: number

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "CNC Machine #1",
      "type": "machine",
      "health_percent": 85,
      "owner_name": "John Doe",
      ...
    }
  ]
}
```

#### Get Equipment by ID
```http
GET /api/equipment/:id

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "name": "CNC Machine #1",
    "serial_no": "CNC-001",
    ...
  }
}
```

#### Create Equipment
```http
POST /api/equipment
Content-Type: application/json

{
  "name": "New Machine",
  "type": "machine",
  "location": "Factory Floor A",
  "health_percent": 100,
  ...
}

Response:
{
  "success": true,
  "message": "Equipment created successfully",
  "data": { "id": 5 }
}
```

#### Update Equipment
```http
PUT /api/equipment/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "health_percent": 75,
  ...
}

Response:
{
  "success": true,
  "message": "Equipment updated successfully"
}
```

#### 🆕 Scrap Equipment
```http
POST /api/equipment/:id/scrap
Content-Type: application/json

{
  "reason": "Equipment beyond repair - Request #123"
}

Response:
{
  "success": true,
  "message": "Equipment marked as scrapped successfully"
}

Database Changes:
- is_scrapped = 1
- scrapped_date = CURRENT_TIMESTAMP
- scrapped_reason = "Equipment beyond repair..."
- health_percent = 0
```

#### Delete Equipment
```http
DELETE /api/equipment/:id

Response:
{
  "success": true,
  "message": "Equipment deleted successfully"
}
```

#### Get Equipment Stats
```http
GET /api/equipment/stats

Response:
{
  "success": true,
  "data": {
    "total": 50,
    "critical": 5,
    "byType": [
      { "type": "machine", "count": 25 },
      { "type": "vehicle", "count": 15 },
      { "type": "computer", "count": 10 }
    ]
  }
}
```

---

### Maintenance Requests Endpoints

#### Get All Requests
```http
GET /api/requests
Query Params:
  - status?: string (pending|in-progress|resolved|closed)
  - priority?: string (low|medium|high|critical)
  - maintenance_type?: string (corrective|preventive)

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "subject": "Leaking Oil",
      "status": "in-progress",
      "priority": "high",
      "equipment_id": 5,
      "equipment_name": "CNC Machine #1",
      ...
    }
  ]
}
```

#### Get Request by ID
```http
GET /api/requests/:id

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "subject": "Leaking Oil",
    "description": "Machine is leaking oil...",
    ...
  }
}
```

#### Create Request
```http
POST /api/requests
Content-Type: application/json

{
  "subject": "Motor Failure",
  "description": "Motor not starting",
  "maintenance_for": "equipment",
  "equipment_id": 5,
  "maintenance_type": "corrective",
  "priority": "critical",
  "status": "pending"
}

Response:
{
  "success": true,
  "message": "Maintenance request created successfully",
  "data": { "id": 10 }
}
```

#### Update Request
```http
PUT /api/requests/:id
Content-Type: application/json

{
  "status": "resolved",
  "duration": 2.5
}

Response:
{
  "success": true,
  "message": "Maintenance request updated successfully"
}
```

#### Delete Request
```http
DELETE /api/requests/:id

Response:
{
  "success": true,
  "message": "Maintenance request deleted successfully"
}
```

---

### Work Centers Endpoints

#### Get All Work Centers
```http
GET /api/work-centers

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Mechanical Team",
      "code": "MECH-01",
      "description": "Handles mechanical repairs",
      ...
    }
  ]
}
```

#### Get Work Center by ID
```http
GET /api/work-centers/:id

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Mechanical Team",
    ...
  }
}
```

#### Create Work Center
```http
POST /api/work-centers
Content-Type: application/json

{
  "name": "Electrical Team",
  "code": "ELEC-01",
  "description": "Handles electrical repairs"
}

Response:
{
  "success": true,
  "message": "Work center created successfully",
  "data": { "id": 3 }
}
```

#### Update Work Center
```http
PUT /api/work-centers/:id
Content-Type: application/json

{
  "name": "Updated Name"
}

Response:
{
  "success": true,
  "message": "Work center updated successfully"
}
```

#### Delete Work Center
```http
DELETE /api/work-centers/:id

Response:
{
  "success": true,
  "message": "Work center deleted successfully"
}
```

---

## 🔒 Authentication

All protected routes require the `Authorization` header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token is stored in `localStorage` as `access_token` after successful login.

---

## 🚨 Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `500` - Internal Server Error

---

## 📊 Request/Response Examples

### Example: Move Request to Scrap (Kanban)

```http
PUT /api/requests/5
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "closed"
}
```

This will:
1. Update request status to "closed"
2. If request has equipment_id, automatically call:
   ```http
   POST /api/equipment/:equipment_id/scrap
   {
     "reason": "Request #5: Motor Failure"
   }
   ```
3. Equipment marked as scrapped in database

---

## 🔄 Complete Workflow Example

### Create Corrective Maintenance Request

```bash
# 1. Login
POST /api/auth/login
{
  "email": "tech@example.com",
  "password": "password"
}

# Save token from response

# 2. Get equipment list
GET /api/equipment?search=CNC

# 3. Create maintenance request
POST /api/requests
{
  "subject": "Motor Failure",
  "equipment_id": 5,
  "maintenance_type": "corrective",
  "priority": "critical",
  "status": "pending"
}

# 4. Update status (in Kanban)
PUT /api/requests/10
{
  "status": "in-progress"
}

# 5. Log hours and complete
PUT /api/requests/10
{
  "status": "resolved",
  "duration": 3.5
}
```

---

**Last Updated**: December 27, 2025  
**API Version**: 2.0.0
