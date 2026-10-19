import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import { NeoButton } from '@/components/ui/neo-button';
import { NeoCard } from '@/components/ui/neo-card';
import { Input } from '@/components/ui/input';
import { workCentersService } from '@/services/workCentersService';

interface WorkCenterForm {
  name: string;
  code: string;
  tag: string;
  alternative_workcenters: string;
  cost_per_hour: number;
  capacity: number;
  time_efficiency: number;
  oee_target: number;
}

export const WorkCenterForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [formData, setFormData] = useState<WorkCenterForm>({
    name: '',
    code: '',
    tag: '',
    alternative_workcenters: '',
    cost_per_hour: 0,
    capacity: 0,
    time_efficiency: 0,
    oee_target: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      loadWorkCenter(parseInt(id));
    }
  }, [isEditing, id]);

  const loadWorkCenter = async (workCenterId: number) => {
    try {
      setLoading(true);
      const data = await workCentersService.getWorkCenterById(workCenterId);
      setFormData({
        name: data.name,
        code: data.code,
        tag: data.tag || '',
        alternative_workcenters: data.alternative_workcenters || '',
        cost_per_hour: data.cost_per_hour,
        capacity: data.capacity,
        time_efficiency: data.time_efficiency,
        oee_target: data.oee_target,
      });
    } catch (err) {
      setError('Failed to load work center');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing && id) {
        await workCentersService.updateWorkCenter(parseInt(id), formData);
        setSuccess(true);
        setTimeout(() => navigate('/work-centers'), 1500);
      } else {
        await workCentersService.createWorkCenter(formData);
        setSuccess(true);
        setTimeout(() => navigate('/work-centers'), 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save work center');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/work-centers')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="h-6 w-6 text-gray-900" />
            </button>
            <h1 className="text-3xl font-black text-gray-900">
              {isEditing ? 'Edit Work Center' : 'New Work Center'}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border-2 border-green-400 text-green-700 px-4 py-3 rounded-xl mb-6">
            {isEditing ? 'Work center updated successfully!' : 'Work center created successfully!'}
          </div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Basic Info Card */}
          <NeoCard variant="yellow">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Work Center Name *
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Assembly Line 1"
                  required
                  className="border-2 border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Code *
                </label>
                <Input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g., AL-001"
                  required
                  className="border-2 border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tag
                </label>
                <Input
                  type="text"
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  placeholder="e.g., High Priority"
                  className="border-2 border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Alternative Work Centers
                </label>
                <Input
                  type="text"
                  name="alternative_workcenters"
                  value={formData.alternative_workcenters}
                  onChange={handleChange}
                  placeholder="e.g., AL-002, AL-003"
                  className="border-2 border-black"
                />
              </div>
            </div>
          </NeoCard>

          {/* Financial & Capacity Card */}
          <NeoCard variant="pink">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Financial & Capacity</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Cost per Hour (₹)
                </label>
                <Input
                  type="number"
                  name="cost_per_hour"
                  value={formData.cost_per_hour}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="border-2 border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Capacity
                </label>
                <Input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  placeholder="0.0"
                  className="border-2 border-black"
                />
              </div>
            </div>
          </NeoCard>

          {/* Performance Card */}
          <NeoCard variant="blue">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Performance Metrics</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Time Efficiency (%)
                </label>
                <Input
                  type="number"
                  name="time_efficiency"
                  value={formData.time_efficiency}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="0.0"
                  className="border-2 border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  OEE Target (%)
                </label>
                <Input
                  type="number"
                  name="oee_target"
                  value={formData.oee_target}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="0.0"
                  className="border-2 border-black"
                />
              </div>
            </div>
          </NeoCard>

          {/* Submit Button */}
          <div className="flex gap-4">
            <NeoButton
              type="submit"
              disabled={loading}
              className="gap-2 flex-1"
              size="lg"
            >
              <Save className="h-5 w-5" />
              {loading ? 'Saving...' : isEditing ? 'Update Work Center' : 'Create Work Center'}
            </NeoButton>
            <NeoButton
              type="button"
              onClick={() => navigate('/work-centers')}
              variant="white"
              className="flex-1"
              size="lg"
            >
              Cancel
            </NeoButton>
          </div>
        </motion.form>
      </div>
    </div>
  );
};
