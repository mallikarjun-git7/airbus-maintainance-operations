import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Eye, LayoutGrid } from 'lucide-react';
import { NeoButton } from '@/components/ui/neo-button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { MaintenanceRequest } from '@/services/requestsService';
import { requestsService } from '@/services/requestsService';
import { useNavigate } from 'react-router-dom';

export const RequestsList: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [filteredData, setFilteredData] = useState<MaintenanceRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [maintenanceForFilter, setMaintenanceForFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await requestsService.getAllRequests();
      setRequests(data);
      setFilteredData(data);
    } catch (err) {
      setError('Failed to load requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = requests;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(r =>
        r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.equipment_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.work_center_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    // Maintenance For filter
    if (maintenanceForFilter !== 'all') {
      filtered = filtered.filter(r => r.maintenance_for === maintenanceForFilter);
    }

    setFilteredData(filtered);
  }, [searchQuery, statusFilter, maintenanceForFilter, requests]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await requestsService.deleteRequest(id);
        setRequests(requests.filter(r => r.id !== id));
      } catch (err) {
        setError('Failed to delete request');
        console.error(err);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-200 text-blue-900';
      case 'in-progress':
        return 'bg-yellow-200 text-yellow-900';
      case 'resolved':
        return 'bg-green-200 text-green-900';
      case 'closed':
        return 'bg-red-200 text-red-900';
      default:
        return 'bg-gray-200 text-gray-900';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-black text-gray-900">Maintenance Requests</h1>
            <div className="flex gap-3">
              <NeoButton
                onClick={() => navigate('/requests/kanban')}
                variant="outline"
                className="gap-2"
                size="lg"
              >
                <LayoutGrid className="h-5 w-5" />
                Kanban Board
              </NeoButton>
              <NeoButton
                onClick={() => navigate('/requests/new')}
                className="gap-2"
                size="lg"
              >
                <Plus className="h-5 w-5" />
                New Request
              </NeoButton>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by subject, description, equipment or work center..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-2 border-gray-300 rounded-xl"
              />
            </div>

            <div className="flex gap-4 flex-wrap">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border-2 border-black rounded-lg font-semibold hover:shadow-brutal"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              <select
                value={maintenanceForFilter}
                onChange={(e) => setMaintenanceForFilter(e.target.value)}
                className="px-4 py-2 border-2 border-black rounded-lg font-semibold hover:shadow-brutal"
              >
                <option value="all">All Types</option>
                <option value="equipment">Equipment</option>
                <option value="work_center">Work Center</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading requests...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No requests found. Create one to get started!</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {filteredData.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-4 border-black rounded-3xl p-4 hover:shadow-brutal transition"
              >
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                  {/* Subject */}
                  <div className="lg:col-span-2">
                    <p className="text-xs text-gray-500 font-bold">SUBJECT</p>
                    <p className="font-black text-gray-900">{request.subject}</p>
                  </div>

                  {/* Maintenance For */}
                  <div>
                    <p className="text-xs text-gray-500 font-bold">FOR</p>
                    {request.maintenance_for === 'equipment' ? (
                      <p className="font-semibold text-gray-900">{request.equipment_name || 'Equipment'}</p>
                    ) : (
                      <p className="font-semibold text-gray-900">{request.work_center_name || 'Work Center'}</p>
                    )}
                  </div>

                  {/* Type Badge */}
                  <div>
                    <p className="text-xs text-gray-500 font-bold">TYPE</p>
                    <Badge className={request.maintenance_type === 'corrective' ? 'bg-red-300' : 'bg-blue-300'}>
                      {request.maintenance_type === 'corrective' ? 'Breakdown' : 'Routine'}
                    </Badge>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-xs text-gray-500 font-bold">STATUS</p>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>

                  {/* Priority & Actions */}
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <p className="text-xs text-gray-500 font-bold">PRIORITY</p>
                      <Badge className={getPriorityColor(request.priority)}>
                        {request.priority}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/requests/${request.id}`)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition"
                        title="View/Edit"
                      >
                        <Eye className="h-4 w-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(request.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Description Preview */}
                {request.description && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600 line-clamp-2">{request.description}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};
