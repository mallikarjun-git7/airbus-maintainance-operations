import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import { NeoButton } from '@/components/ui/neo-button';
import { NeoCard } from '@/components/ui/neo-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusStepper } from './StatusStepper';
import { requestsService } from '@/services/requestsService';
import { equipmentService } from '@/services/equipmentService';
import { workCentersService } from '@/services/workCentersService';
import { mockAuthService } from '@/services/mockAuth';

interface Equipment {
  id: number;
  name: string;
  type: string;
  health_percent: number;
}

interface WorkCenter {
  id: number;
  name: string;
  code: string;
}

interface RequestFormData {
  subject: string;
  description: string;
  maintenance_for: 'equipment' | 'work_center';
  equipment_id?: number;
  work_center_id?: number;
  category: string;
  request_date: string;
  maintenance_type: 'corrective' | 'preventive';
  assigned_team_id?: number;
  assigned_technician_id?: number;
  scheduled_date: string;
  duration: number;
  company: string;
  notes: string;
  instructions: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export const RequestForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [formData, setFormData] = useState<RequestFormData>({
    subject: '',
    description: '',
    maintenance_for: 'equipment',
    equipment_id: undefined,
    work_center_id: undefined,
    category: '',
    request_date: new Date().toISOString().split('T')[0],
    maintenance_type: 'corrective',
    assigned_team_id: undefined,
    assigned_technician_id: undefined,
    scheduled_date: '',
    duration: 0,
    company: '',
    notes: '',
    instructions: '',
    status: 'pending',
    priority: 'medium',
  });

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [workcenters, setWorkcenters] = useState<WorkCenter[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isEditing && id) {
      loadRequest(parseInt(id));
    }
  }, [isEditing, id]);

  const loadData = async () => {
    try {
      const user = mockAuthService.getCurrentUser();
      setCurrentUser(user);

      const [equip, wc] = await Promise.all([
        equipmentService.getAllEquipment(),
        workCentersService.getAllWorkCenters(),
      ]);
      setEquipment(equip as any);
      setWorkcenters(wc);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const loadRequest = async (requestId: number) => {
    try {
      setLoading(true);
      const data = await requestsService.getRequestById(requestId);
      setFormData({
        subject: data.subject,
        description: data.description || '',
        maintenance_for: data.maintenance_for,
        equipment_id: data.equipment_id,
        work_center_id: data.work_center_id,
        category: data.category || '',
        request_date: data.request_date || new Date().toISOString().split('T')[0],
        maintenance_type: data.maintenance_type || 'corrective',
        assigned_team_id: data.assigned_team_id,
        assigned_technician_id: data.assigned_technician_id,
        scheduled_date: data.scheduled_date || '',
        duration: data.duration || 0,
        company: data.company || '',
        notes: data.notes || '',
        instructions: data.instructions || '',
        status: data.status,
        priority: data.priority,
      });
    } catch (err) {
      setError('Failed to load request');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
    setError(null);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'equipment_id' || name === 'work_center_id' ? 
        (value ? parseInt(value) : undefined) : 
        (name === 'maintenance_for' ? value : value),
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData: any = {
        ...formData,
        equipment_id: formData.maintenance_for === 'equipment' ? formData.equipment_id : null,
        work_center_id: formData.maintenance_for === 'work_center' ? formData.work_center_id : null,
      };

      if (isEditing && id) {
        await requestsService.updateRequest(parseInt(id), submitData);
        setSuccess(true);
        setTimeout(() => navigate('/requests'), 1500);
      } else {
        await requestsService.createRequest(submitData);
        setSuccess(true);
        setTimeout(() => navigate('/requests'), 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save request');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="min-h-screen bg-amber-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/requests')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="h-6 w-6 text-gray-900" />
            </button>
            <h1 className="text-3xl font-black text-gray-900">
              {isEditing ? 'Edit Maintenance Request' : 'New Maintenance Request'}
            </h1>
          </div>

          {/* Status Stepper */}
          {isEditing && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs font-bold text-gray-600 mb-3">REQUEST STATUS</p>
              <StatusStepper
                currentStatus={formData.status}
                onStatusChange={(status) => setFormData(prev => ({ ...prev, status }))}
              />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border-2 border-green-400 text-green-700 px-4 py-3 rounded-xl mb-6">
            {isEditing ? 'Request updated successfully!' : 'Request created successfully!'}
          </div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subject & Type Card */}
            <NeoCard variant="yellow">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Request Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Subject *
                  </label>
                  <Input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g., Machine needs urgent repair"
                    required
                    className="border-2 border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Detailed description of the issue"
                    rows={3}
                    className="w-full border-2 border-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Maintenance For *
                    </label>
                    <Select
                      value={formData.maintenance_for}
                      onValueChange={(val) => handleSelectChange('maintenance_for', val)}
                    >
                      <SelectTrigger className="border-2 border-black">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="work_center">Work Center</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.maintenance_for === 'equipment' ? (
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Equipment *
                      </label>
                      <Select
                        value={formData.equipment_id?.toString() || ''}
                        onValueChange={(val) => handleSelectChange('equipment_id', val)}
                      >
                        <SelectTrigger className="border-2 border-black">
                          <SelectValue placeholder="Select equipment" />
                        </SelectTrigger>
                        <SelectContent>
                          {equipment.map(eq => (
                            <SelectItem key={eq.id} value={eq.id.toString()}>
                              {eq.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Work Center *
                      </label>
                      <Select
                        value={formData.work_center_id?.toString() || ''}
                        onValueChange={(val) => handleSelectChange('work_center_id', val)}
                      >
                        <SelectTrigger className="border-2 border-black">
                          <SelectValue placeholder="Select work center" />
                        </SelectTrigger>
                        <SelectContent>
                          {workcenters.map(wc => (
                            <SelectItem key={wc.id} value={wc.id.toString()}>
                              {wc.name} ({wc.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Category
                    </label>
                    <Input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="e.g., Mechanical"
                      className="border-2 border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Request Date
                    </label>
                    <Input
                      type="date"
                      name="request_date"
                      value={formData.request_date}
                      onChange={handleChange}
                      className="border-2 border-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Maintenance Type
                    </label>
                    <Select
                      value={formData.maintenance_type}
                      onValueChange={(val) => handleSelectChange('maintenance_type', val)}
                    >
                      <SelectTrigger className="border-2 border-black">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corrective">Corrective (Breakdown)</SelectItem>
                        <SelectItem value="preventive">Preventive (Routine)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Priority
                    </label>
                    <Select
                      value={formData.priority}
                      onValueChange={(val) => handleSelectChange('priority', val)}
                    >
                      <SelectTrigger className="border-2 border-black">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </NeoCard>

            {/* Notes & Instructions */}
            <NeoCard variant="pink">
              <Tabs defaultValue="notes" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="instructions">Instructions</TabsTrigger>
                </TabsList>

                <TabsContent value="notes" className="mt-4">
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any additional notes..."
                    rows={4}
                    className="w-full border-2 border-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </TabsContent>

                <TabsContent value="instructions" className="mt-4">
                  <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    placeholder="Step-by-step instructions..."
                    rows={4}
                    className="w-full border-2 border-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </TabsContent>
              </Tabs>
            </NeoCard>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Requester Card */}
            <NeoCard variant="green">
              <h2 className="text-sm font-bold mb-4 text-gray-900">REQUESTER</h2>
              <div className="text-sm">
                <p className="font-semibold text-gray-900">{currentUser?.name || 'Loading...'}</p>
                <p className="text-gray-600">{currentUser?.email}</p>
              </div>
            </NeoCard>

            {/* Assignment Card */}
            <NeoCard variant="blue">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Assignment</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Team
                  </label>
                  <Input
                    type="text"
                    value={formData.assigned_team_id?.toString() || ''}
                    placeholder="Team ID"
                    onChange={(e) => handleSelectChange('assigned_team_id', e.target.value)}
                    className="border-2 border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Technician
                  </label>
                  <Input
                    type="text"
                    value={formData.assigned_technician_id?.toString() || ''}
                    placeholder="Technician ID"
                    onChange={(e) => handleSelectChange('assigned_technician_id', e.target.value)}
                    className="border-2 border-black"
                  />
                </div>
              </div>
            </NeoCard>

            {/* Scheduling Card */}
            <NeoCard variant="yellow">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Scheduling</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Scheduled Date
                  </label>
                  <Input
                    type="datetime-local"
                    name="scheduled_date"
                    value={formData.scheduled_date}
                    onChange={handleChange}
                    className="border-2 border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Duration (Hours)
                  </label>
                  <Input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    step="0.5"
                    min="0"
                    className="border-2 border-black"
                  />
                </div>
              </div>
            </NeoCard>

            {/* Company Card */}
            <NeoCard variant="pink">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Company</h2>
              <Input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company name"
                className="border-2 border-black"
              />
            </NeoCard>
          </div>
        </motion.form>

        {/* Submit Buttons */}
        <div className="flex gap-4 mt-8 lg:col-span-2">
          <NeoButton
            onClick={handleSubmit}
            disabled={loading}
            className="gap-2 flex-1"
            size="lg"
          >
            <Save className="h-5 w-5" />
            {loading ? 'Saving...' : isEditing ? 'Update Request' : 'Create Request'}
          </NeoButton>
          <NeoButton
            onClick={() => navigate('/requests')}
            variant="white"
            className="flex-1"
            size="lg"
          >
            Cancel
          </NeoButton>
        </div>
      </div>
    </div>
  );
};
