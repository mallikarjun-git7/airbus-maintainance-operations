# 🚀 Quick Start Guide - GearGuard New Features

## 1️⃣ Kanban Board

### Access
- **Dashboard** → Click "Kanban Board" tab
- **Requests List** → Click "Kanban Board" button
- **Direct URL**: `http://localhost:5173/requests/kanban`

### Usage
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│    NEW      │ IN PROGRESS │  REPAIRED   │    SCRAP    │
│   (Blue)    │  (Yellow)   │   (Green)   │    (Red)    │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ [Request 1] │             │             │             │
│ [Request 2] │ [Request 3] │ [Request 4] │             │
│             │             │             │ [Request 5] │
└─────────────┴─────────────┴─────────────┴─────────────┘

🎯 Drag & Drop: Move requests between columns
🔴 Red Dot: Indicates overdue requests
📅 Date: Shows scheduled maintenance date
⏱️ Duration: Hours logged for the task
```

### Features
- **Priority Badges**: Critical (Red), High (Orange), Medium (Yellow), Low (Green)
- **Type Indicators**: 🔧 Breakdown (Corrective) | 🔄 Routine (Preventive)
- **Auto-Save**: Status updates immediately on drop
- **Auto-Scrap**: Moving to "Scrap" marks equipment as unusable

---

## 2️⃣ Equipment Maintenance Button

### Access
1. Navigate to **Equipment** list
2. Click on any equipment to open details
3. Look for **"Maintenance"** button (top-right)

### Visual
```
┌───────────────────────────────────────────────────┐
│  ← Equipment Details          [Maintenance (3)]   │ ← Click here
├───────────────────────────────────────────────────┤
│                                                   │
│  [Collapsed Panel with Related Requests]         │
│  ┌─────────────────────────────────────────────┐ │
│  │ 🔧 Leaking Oil - Status: In Progress  [HIGH]│ │
│  │ 🔄 Routine Check - Status: Pending    [MED] │ │
│  │ 🔧 Motor Failure - Status: Resolved   [CRIT]│ │
│  └─────────────────────────────────────────────┘ │
│  [+ Create New Maintenance Request]              │
│                                                   │
└───────────────────────────────────────────────────┘
```

### Features
- **Badge Counter**: Shows number of open requests (red background)
- **Quick View**: All requests for this equipment in one place
- **One-Click Create**: Button to create new request for equipment
- **Status Overview**: See request status, priority, scheduled date

---

## 3️⃣ Equipment Scrap Workflow

### Automatic Scrapping
When you move a request to the **"Scrap"** column:

```
┌─────────────────────────────────────────────┐
│ 1. Drag request to "Scrap" column          │
│    ↓                                        │
│ 2. Request status → "closed"               │
│    ↓                                        │
│ 3. Equipment automatically marked:          │
│    • is_scrapped = true                    │
│    • scrapped_date = now                   │
│    • scrapped_reason = "Request #X: ..."   │
│    • health_percent = 0                    │
└─────────────────────────────────────────────┘
```

### Manual Scrapping (API)
```bash
POST /api/equipment/:id/scrap
{
  "reason": "Equipment beyond repair"
}
```

---

## 4️⃣ Navigation Flow

```
Dashboard
    │
    ├─► Maintenance Requests (List View)
    │       ├─► Kanban Board View  ◄──┐
    │       └─► Create New Request     │
    │                                  │
    ├─► Equipment                      │
    │       ├─► View Equipment         │
    │       └─► [Maintenance Button]   │ (Shows related requests)
    │                                  │
    ├─► Work Centers (Teams)           │
    │                                  │
    └─► Calendar (Preventive Maint.)   │
            └─────────────────────────►┘
```

---

## 🎨 Color Coding

### Priority Levels
- 🔴 **Critical**: Immediate attention required
- 🟠 **High**: Urgent, within 24 hours
- 🟡 **Medium**: Standard priority
- 🟢 **Low**: Can wait

### Stage Colors
- 🔵 **New**: Pending assignment
- 🟡 **In Progress**: Actively being worked on
- 🟢 **Repaired**: Fixed and operational
- 🔴 **Scrap**: Equipment unusable

---

## 📝 Sample Workflows

### Workflow 1: Corrective Maintenance (Breakdown)
```
1. Employee notices machine leaking oil
2. Creates maintenance request → "Corrective" type
3. System auto-assigns team based on equipment
4. Request appears in "New" column
5. Technician drags to "In Progress"
6. Technician logs hours spent
7. Drags to "Repaired" when done
```

### Workflow 2: Preventive Maintenance
```
1. Manager creates request → "Preventive" type
2. Sets scheduled date (e.g., next month)
3. Request appears in Calendar view
4. On scheduled date, appears in Kanban "New"
5. Technician performs routine checkup
6. Drags through workflow stages
```

### Workflow 3: Equipment Scrapping
```
1. Request for broken equipment
2. After inspection, equipment is beyond repair
3. Technician drags request to "Scrap"
4. Equipment automatically marked as scrapped
5. Equipment shows health_percent = 0
6. Equipment flagged as unusable in system
```

---

## 🔧 Troubleshooting

### Kanban not showing requests?
- Check if backend is running (`npm start` in backend/)
- Verify authentication token is valid
- Check browser console for errors

### Drag-and-drop not working?
- Clear browser cache
- Ensure `@hello-pangea/dnd` is installed
- Check for JavaScript errors in console

### Maintenance button showing wrong count?
- Refresh the page
- Verify equipment ID matches requests
- Check database for orphaned records

---

## 📞 Need Help?

1. **Check logs**: Browser Console (F12) & Backend Terminal
2. **Verify database**: Run `node src/db/migrate.js` from backend/
3. **Restart services**: Stop and restart both frontend and backend
4. **Check documentation**: See `IMPLEMENTATION_GUIDE.md` for details

---

**Happy Tracking! 🎉**
