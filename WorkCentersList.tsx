import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Edit } from 'lucide-react';
import { NeoButton } from '@/components/ui/neo-button';
import { NeoCard } from '@/components/ui/neo-card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { workCentersService } from '@/services/workCentersService';
import { useNavigate } from 'react-router-dom';

interface WorkCenter {
  id: number;
  name: string;
  code: string;
  tag?: string;
  alternative_workcenters?: string;
  cost_per_hour: number;
  capacity: number;
  time_efficiency: number;
  oee_target: number;
  created_at: string;
  updated_at: string;
}

export const WorkCentersList: React.FC = () => {
  const navigate = useNavigate();
  const [workcenters, setWorkcenters] = useState<WorkCenter[]>([]);
  const [filteredData, setFilteredData] = useState<WorkCenter[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWorkCenters();
  }, []);

  const loadWorkCenters = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workCentersService.getAllWorkCenters();
      setWorkcenters(data);
      setFilteredData(data);
    } catch (err) {
      setError('Failed to load work centers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = workcenters.filter(wc =>
      wc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (wc.tag && wc.tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredData(filtered);
  }, [searchQuery, workcenters]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this work center?')) {
      try {
        await workCentersService.deleteWorkCenter(id);
        setWorkcenters(workcenters.filter(wc => wc.id !== id));
      } catch (err) {
        setError('Failed to delete work center');
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-black text-gray-900">Work Centers</h1>
            <NeoButton
              onClick={() => navigate('/work-centers/new')}
              className="gap-2"
              size="lg"
            >
              <Plus className="h-5 w-5" />
              New Work Center
            </NeoButton>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, code, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-2 border-gray-300 rounded-xl"
            />
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
            <p className="text-gray-600">Loading work centers...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No work centers found. Create one to get started!</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 gap-6"
          >
            {/* Table View */}
            <NeoCard variant="yellow">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-black">
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Work Center</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Code</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Tag</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Cost/Hour</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Capacity</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-900">Time Eff.</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-900">OEE Target</th>
                      <th className="text-center py-3 px-4 font-bold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((wc) => (
                      <motion.tr
                        key={wc.id}
                        className="border-b border-gray-200 hover:bg-yellow-100 transition"
                      >
                        <td className="py-3 px-4 font-semibold text-gray-900">{wc.name}</td>
                        <td className="py-3 px-4 text-gray-700">
                          <Badge variant="outline">{wc.code}</Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {wc.tag ? <Badge>{wc.tag}</Badge> : '-'}
                        </td>
                        <td className="py-3 px-4 text-gray-700 font-mono">₹{wc.cost_per_hour.toFixed(2)}</td>
                        <td className="py-3 px-4 text-gray-700">{wc.capacity.toFixed(1)}</td>
                        <td className="py-3 px-4 text-gray-700">{wc.time_efficiency.toFixed(1)}%</td>
                        <td className="py-3 px-4 text-gray-700">{wc.oee_target.toFixed(1)}%</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => navigate(`/work-centers/${wc.id}`)}
                              className="p-2 hover:bg-yellow-200 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(wc.id)}
                              className="p-2 hover:bg-red-200 rounded-lg transition"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </NeoCard>
          </motion.div>
        )}
      </div>
    </div>
  );
};
