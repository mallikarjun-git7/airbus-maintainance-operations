# GearGuard - The Ultimate Maintenance Tracker 🔧

A comprehensive full-stack maintenance management system for tracking company assets, managing maintenance requests, and coordinating repair teams. Built with React, TypeScript, Node.js, and SQLite.

## ✨ Key Features

### 🎯 **Kanban Board**
- Drag-and-drop interface for maintenance requests
- Four workflow stages: New → In Progress → Repaired → Scrap
- Visual indicators for overdue requests and priority levels
- Real-time status updates

### 🔧 **Smart Equipment Management**
- Track machines, vehicles, and computers
- Maintenance button showing related requests with badge counter
- Health percentage monitoring
- Automatic scrapping when equipment becomes unusable
- Department and employee assignment

### 📋 **Maintenance Requests**
- Corrective (breakdown) and preventive (routine) maintenance types
- Priority levels: Critical, High, Medium, Low
- Full lifecycle tracking with status updates
- Duration and scheduling support

### 📅 **Calendar View**
- Visual scheduling for preventive maintenance
- See all scheduled maintenance at a glance
- Create requests directly from calendar

### 👥 **Work Centers (Teams)**
- Organize technicians into specialized teams
- Assign equipment to work centers
- Team-based request routing

### 🔐 **Authentication & Security**
- JWT-based authentication
- Protected routes and API endpoints
- User registration and login

## Project Structure

```
Company management tracker/
├── backend/          # Node.js + Express + SQLite API
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth & error handling
│   │   ├── db/            # Database & migrations
│   │   └── utils/         # Validators
│   ├── data/              # SQLite database (auto-created)
│   ├── server.js
│   └── package.json
│
└── frontend/         # React + Vite + TypeScript
    ├── src/
    │   ├── components/
    │   │   ├── auth/          # Login, register
    │   │   ├── dashboard/     # Main dashboard
    │   │   ├── requests/      # Kanban, list, forms
    │   │   ├── equipment/     # Equipment management
    │   │   ├── workcenters/   # Team management
    │   │   ├── calendar/      # Maintenance calendar
    │   │   └── ui/           # Reusable UI components
    │   ├── services/         # API services
    │   └── lib/             # Utilities
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Backend Setup

```bash
cd backend
npm install

# Initialize database with sample data
node src/db/runSeed.js

# Start development server
npm run dev
```

Backend will run on **http://localhost:5000**

### 2. Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm run dev
```

Frontend will run on **http://localhost:5173**

### 3. Login

Use the default credentials:
- **Email**: `admin@gearguard.com`
- **Password**: `password123`

## 📖 Documentation

- **[IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md)** - Feature completion status
- **[QUICK_START.md](QUICK_START.md)** - Visual guide to new features
- **[API_ROUTES.md](API_ROUTES.md)** - Complete API documentation
- **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Detailed implementation notes

## 🎯 Core Capabilities

### Equipment Management
- ✅ Track all company assets (machines, vehicles, computers)
- ✅ Monitor equipment health percentage
- ✅ Assign equipment to departments and employees
- ✅ View maintenance history for each equipment
- ✅ **NEW**: Smart maintenance button with request counter
- ✅ **NEW**: Automatic scrapping when equipment becomes unusable

### Maintenance Requests
- ✅ Create corrective (breakdown) and preventive (routine) requests
- ✅ Priority levels: Critical, High, Medium, Low
- ✅ Status tracking: Pending → In Progress → Resolved → Closed
- ✅ **NEW**: Interactive Kanban board with drag-and-drop
- ✅ Duration and hours tracking
- ✅ Calendar view for scheduled maintenance

### Work Centers (Teams)
- ✅ Create and manage maintenance teams
- ✅ Assign equipment to work centers
- ✅ Team-based request routing

### User Management
- ✅ User authentication (Register/Login/Logout)
- ✅ JWT-based session management
- ✅ Password hashing with bcrypt
- ✅ Protected routes and API endpoints

### Dashboard & Analytics
- ✅ Real-time KPI cards
- ✅ Critical equipment monitoring
- ✅ Open requests tracking
- ✅ Search and filtering across all modules

## 🔌 API Endpoints

### Authentication
- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login user
- **GET** `/api/auth/me` - Get current user (protected)

### Equipment
- **GET** `/api/equipment` - Get all equipment (with filters)
- **GET** `/api/equipment/:id` - Get equipment by ID
- **POST** `/api/equipment` - Create new equipment
- **PUT** `/api/equipment/:id` - Update equipment
- **DELETE** `/api/equipment/:id` - Delete equipment
- **GET** `/api/equipment/stats` - Get equipment statistics
- **POST** `/api/equipment/:id/scrap` - **NEW**: Mark equipment as scrapped

### Maintenance Requests
- **GET** `/api/requests` - Get all requests (with filters)
- **GET** `/api/requests/:id` - Get request by ID
- **POST** `/api/requests` - Create new request
- **PUT** `/api/requests/:id` - Update request
- **DELETE** `/api/requests/:id` - Delete request

### Work Centers
- **GET** `/api/work-centers` - Get all work centers
- **GET** `/api/work-centers/:id` - Get work center by ID
- **POST** `/api/work-centers` - Create new work center
- **PUT** `/api/work-centers/:id` - Update work center
- **DELETE** `/api/work-centers/:id` - Delete work center

See **[API_ROUTES.md](API_ROUTES.md)** for detailed API documentation with examples.

## Environment Variables

### Backend (.env)
```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
DATABASE_PATH=./data/app.db
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000
```

## Password Requirements

- Minimum 9 characters
- At least 1 lowercase letter
- At least 1 uppercase letter
- At least 1 special character

## 💻 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite3** - Lightweight database
- **JWT (jsonwebtoken)** - Authentication
- **bcrypt** - Password hashing
- **dotenv** - Environment configuration
- **cors** - Cross-origin resource sharing

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations
- **React Router** - Navigation
- **@hello-pangea/dnd** - **NEW**: Drag-and-drop for Kanban
- **Radix UI Components** - Accessible UI primitives
- **Lucide Icons** - Icon library

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev  # Runs with nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm run dev  # Runs with Vite hot reload
```

### Database Migrations

If you've updated the database schema:

```bash
cd backend
node src/db/migrate.js  # Apply migrations to existing database
```

Or start fresh:

```bash
cd backend
node src/db/runSeed.js  # Recreate database with sample data
```

### Production Build

#### Backend
```bash
cd backend
npm start
```

#### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 🎨 UI/UX Features

- **Neobrutalism Design** - Bold borders, vibrant colors, strong shadows
- **Responsive Layout** - Mobile-friendly design
- **Smooth Animations** - Framer Motion transitions
- **Accessible Components** - Radix UI primitives
- **Dark Mode Ready** - Design system supports theming

## 🗄️ Database Schema

The SQLite database is automatically created at `backend/data/app.db` on first run.

### Tables

#### Users
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

#### Equipment
```sql
CREATE TABLE equipment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT,
  type TEXT CHECK(type IN ('machine', 'vehicle', 'computer', 'other')),
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
  health_percent INTEGER DEFAULT 100,
  is_scrapped BOOLEAN DEFAULT 0,        -- NEW
  scrapped_date DATE,                   -- NEW
  scrapped_reason TEXT,                 -- NEW
  attachments_metadata TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_employee_id) REFERENCES users(id),
  FOREIGN KEY (technician_id) REFERENCES users(id),
  FOREIGN KEY (work_center_id) REFERENCES work_centers(id)
)
```

#### Maintenance Requests
```sql
CREATE TABLE maintenance_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject TEXT NOT NULL,
  description TEXT,
  maintenance_for TEXT CHECK(maintenance_for IN ('equipment', 'work_center')),
  equipment_id INTEGER,
  work_center_id INTEGER,
  maintenance_type TEXT CHECK(maintenance_type IN ('corrective', 'preventive')),
  priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in-progress', 'resolved', 'closed')),
  scheduled_date DATE,
  duration REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (equipment_id) REFERENCES equipment(id),
  FOREIGN KEY (work_center_id) REFERENCES work_centers(id)
)
```

#### Work Centers
```sql
CREATE TABLE work_centers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication
- Protected API routes
- CORS enabled
- Input validation
- SQL injection prevention via parameterized queries

## 🚨 Error Handling

The API returns consistent error messages:
- **401** - "Account not exist" (login with non-existent email)
- **401** - "Invalid Password" (login with wrong password)
- **409** - "Email already exists" (registration with duplicate email)
- **400** - Validation errors with specific messages

## 🎉 What's New in v2.0

### Kanban Board
- Interactive drag-and-drop interface for managing maintenance requests
- Four workflow stages with visual indicators
- Automatic equipment scrapping when requests reach "Scrap" stage

### Smart Equipment Maintenance
- Maintenance button on equipment detail pages
- Badge showing count of related requests
- Quick access to create new requests for equipment

### Enhanced Database
- Equipment scrapping fields (`is_scrapped`, `scrapped_date`, `scrapped_reason`)
- Automatic health percentage updates
- Migration script for existing databases

See **[IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md)** for full details.

## 📸 Screenshots

### Dashboard
Modern dashboard with KPIs, navigation tabs, and quick actions.

### Kanban Board (NEW!)
Drag-and-drop interface for managing maintenance workflow stages.

### Equipment Management (ENHANCED!)
Smart maintenance button showing all related requests with badge counter.

### Calendar View
Visual scheduling for preventive maintenance tasks.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Built with ❤️ using React, TypeScript, Node.js, and SQLite**
