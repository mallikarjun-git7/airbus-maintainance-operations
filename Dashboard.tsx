import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  AlertTriangle, 
  Users, 
  ClipboardList,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NeoCard, NeoCardIcon, NeoCardTitle, NeoCardDescription } from '@/components/ui/neo-card';
import { NeoButton } from '@/components/ui/neo-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { NewRequestModal } from '@/components/dashboard/NewRequestModal';
import { mockAuthService } from '@/services/mockAuth';
import { equipmentService } from '@/services/equipmentService';
import { requestsService } from '@/services/requestsService';
import { useNavigate } from 'react-router-dom';

// Mock data interface
interface MaintenanceRequest {
  id: string;
  subject: string;
  employee: string;
  technician: string;
  category: string;
  stage: string;
  company: string;
}

const STORAGE_KEY = 'gearguard_maintenance_requests';

// Initial mock data
const initialMockData: MaintenanceRequest[] = [
  {
    id: '1',
    subject: 'Test activity',
    employee: 'Mitdal Adeu',
    technician: 'Ava Foster',
    category: 'computer',
    stage: 'My company',
    company: 'My company'
  }
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [criticalEquipmentCount, setCriticalEquipmentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get current user
        const user = mockAuthService.getCurrentUser();
        setCurrentUser(user);

        // Fetch equipment stats for critical equipment KPI
        const stats = await equipmentService.getEquipmentStats();
        setCriticalEquipmentCount(stats.critical);

        // Fetch maintenance requests
        const fetchedRequests = await requestsService.getAllRequests();
        setRequests(fetchedRequests as any);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Fallback to localStorage for requests
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            setRequests(JSON.parse(stored));
          } catch {
            setRequests(initialMockData);
          }
        } else {
          setRequests(initialMockData);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage whenever it changes (backup)
  useEffect(() => {
    if (requests.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    }
  }, [requests]);

  // Filter requests based on search query
  const filteredRequests = requests.filter(request =>
    Object.values(request).some(value =>
      value != null && String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Calculate KPIs
  const technicianUtilization = 85;
  const openRequests = filteredRequests.filter(r => r.stage !== 'closed' && r.stage !== 'resolved').length;
  const overdueRequests = 3;

  const handleNewRequest = (request: Omit<MaintenanceRequest, 'id'>) => {
    const newRequest: MaintenanceRequest = {
      ...request,
      id: Date.now().toString()
    };
    setRequests([...requests, newRequest]);
    setIsNewRequestOpen(false);
  };

  const handleLogout = () => {
    mockAuthService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Top Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-9 h-9 bg-green-400 rounded-xl border-2 border-black flex items-center justify-center">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">GearGuard</span>
            </motion.div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
              {currentUser && (
                <span className="text-sm text-gray-600">
                  Welcome, <span className="font-semibold">{currentUser.name}</span>
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {/* Tabs Navigation */}
        <div className="mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start bg-white border border-gray-200">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="requests" onClick={() => navigate('/requests')}>Maintenance Requests</TabsTrigger>
              <TabsTrigger value="kanban" onClick={() => navigate('/requests/kanban')}>Kanban Board</TabsTrigger>
              <TabsTrigger value="work-centers" onClick={() => navigate('/work-centers')}>Work Centers</TabsTrigger>
              <TabsTrigger value="equipment" onClick={() => navigate('/equipment')}>Equipment</TabsTrigger>
              <TabsTrigger value="calendar" onClick={() => navigate('/calendar')}>Calendar</TabsTrigger>
              <TabsTrigger value="reporting">Reporting</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <NeoButton
            onClick={() => setIsNewRequestOpen(true)}
            variant="default"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            New Request
          </NeoButton>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-2 border-gray-300 rounded-xl"
            />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Critical Equipment Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <NeoCard variant="red">
              <NeoCardIcon>
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </NeoCardIcon>
              <NeoCardTitle>Critical Equipment</NeoCardTitle>
              <div className="text-4xl font-black text-gray-900 mb-2">
                {loading ? '...' : `${criticalEquipmentCount} Units`}
              </div>
              <NeoCardDescription>Health &lt; 30%</NeoCardDescription>
            </NeoCard>
          </motion.div>

          {/* Technician Load Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <NeoCard variant="blue">
              <NeoCardIcon>
                <Users className="h-6 w-6 text-blue-600" />
              </NeoCardIcon>
              <NeoCardTitle>Technician Load</NeoCardTitle>
              <div className="text-4xl font-black text-gray-900 mb-2">{technicianUtilization}%</div>
              <NeoCardDescription>Utilized - Assign Carefully</NeoCardDescription>
            </NeoCard>
          </motion.div>

          {/* Open Requests Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <NeoCard variant="green">
              <NeoCardIcon>
                <ClipboardList className="h-6 w-6 text-green-600" />
              </NeoCardIcon>
              <NeoCardTitle>Open Requests</NeoCardTitle>
              <div className="text-4xl font-black text-gray-900 mb-2">{openRequests}</div>
              <NeoCardDescription className="text-red-600 font-bold">{overdueRequests} Overdue</NeoCardDescription>
            </NeoCard>
          </motion.div>
        </div>

        {/* Data Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Maintenance Requests</CardTitle>
              <CardDescription>Track and manage all maintenance activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-900">Subject</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-900">Employee</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-900">Technician</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-900">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-900">Stage</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-gray-900">Company</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">
                          No maintenance requests found
                        </td>
                      </tr>
                    ) : (
                      filteredRequests.map((request) => (
                        <tr
                          key={request.id}
                          className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => console.log('Request clicked:', request.id)}
                        >
                          <td className="py-3 px-4 text-sm text-gray-900">{request.subject}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{request.employee}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{request.technician}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="capitalize">
                              {request.category}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{request.stage}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{request.company}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* New Request Modal */}
      <NewRequestModal
        isOpen={isNewRequestOpen}
        onClose={() => setIsNewRequestOpen(false)}
        onSubmit={handleNewRequest}
      />
    </div>
  );
};

export default Dashboard;
