import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { equipmentService } from '@/services/equipmentService';
import { workCentersService } from '@/services/workCentersService';
import { requestsService } from '@/services/requestsService';
import { NeoCard } from '@/components/ui/neo-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, AlertCircle, CheckCircle, Wrench } from 'lucide-react';

interface WorkCenter {
  id: number;
  name: string;
  code: string;
}

export default function EquipmentForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    type: 'other' as const,
    owner_department: '',
    owner_employee_id: '',
    technician_id: '',
    location: '',
    serial_no: '',
    vendor: '',
    warranty_start: '',
    warranty_end: '',
    assigned_date: '',
    work_center_id: '',
    company: '',
    health_percent: 100,
  });

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [workCenters, setWorkCenters] = useState<WorkCenter[]>([]);
  const [relatedRequests, setRelatedRequests] = useState<any[]>([]);
  const [showRequests, setShowRequests] = useState(false);

  useEffect(() => {
    loadWorkCenters();
    if (isEdit) {
      loadEquipment();
      loadRelatedRequests();
    }
  }, [id]);

  async function loadWorkCenters() {
    try {
      const data = await workCentersService.getAllWorkCenters();
      setWorkCenters(data);
    } catch (err) {
      console.error('Failed to load work centers:', err);
    }
  }

  async function loadRelatedRequests() {
    if (!id) return;
    try {
      const allRequests = await requestsService.getAllRequests();
      const filtered = allRequests.filter(
        (req: any) => req.equipment_id === parseInt(id)
      );
      setRelatedRequests(filtered);
    } catch (err) {
      console.error('Failed to load related requests:', err);
    }
  }

  async function loadEquipment() {
    try {
      if (!id) return;
      const data = await equipmentService.getEquipmentById(parseInt(id));
      setFormData({
        name: data.name || '',
        category: data.category || '',
        type: (data.type as any) || 'other',
        owner_department: data.owner_department || '',
        owner_employee_id: data.owner_employee_id?.toString() || '',
        technician_id: data.technician_id?.toString() || '',
        location: data.location || '',
        serial_no: data.serial_no || '',
        vendor: data.vendor || '',
        warranty_start: data.warranty_start || '',
        warranty_end: data.warranty_end || '',
        assigned_date: data.assigned_date || '',
        work_center_id: data.work_center_id?.toString() || '',
        company: data.company || '',
        health_percent: data.health_percent || 100,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load equipment');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: string, value: string | number) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleInputChange(field: string) {
    return (e: ChangeEvent<HTMLInputElement>) => handleChange(field, e.target.value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim()) {
      setError('Equipment name is required');
      return;
    }

    try {
      setSubmitting(true);

      // Prepare data for submission
      const submitData = {
        ...formData,
        owner_employee_id: formData.owner_employee_id ? parseInt(formData.owner_employee_id) : undefined,
        technician_id: formData.technician_id ? parseInt(formData.technician_id) : undefined,
        work_center_id: formData.work_center_id ? parseInt(formData.work_center_id) : undefined,
      };

      if (isEdit && id) {
        await equipmentService.updateEquipment(parseInt(id), submitData);
        setSuccess('Equipment updated successfully!');
      } else {
        await equipmentService.createEquipment(submitData);
        setSuccess('Equipment created successfully!');
      }

      // Redirect after success
      setTimeout(() => navigate('/equipment'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save equipment');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <NeoCard variant="white" className="text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </NeoCard>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/equipment')}
            className="p-2 hover:bg-gray-200 rounded-lg border-2 border-black transition"
            title="Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-4xl font-bold">{isEdit ? 'Edit Equipment' : 'New Equipment'}</h1>
            <p className="text-gray-600 mt-1">
              {isEdit ? 'Update equipment details' : 'Create a new equipment item'}
            </p>
          </div>
        </div>

        {/* Maintenance Button (only in edit mode) */}
        {isEdit && (
          <button
            onClick={() => setShowRequests(!showRequests)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-300 border-4 border-black rounded-lg hover:shadow-brutal font-bold transition-all hover:-translate-y-1"
          >
            <Wrench size={20} />
            Maintenance
            {relatedRequests.length > 0 && (
              <Badge className="bg-red-500 text-white border-2 border-black">
                {relatedRequests.length}
              </Badge>
            )}
          </button>
        )}
      </div>

      {/* Related Requests Panel */}
      {showRequests && isEdit && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <NeoCard variant="blue">
            <h3 className="text-xl font-bold mb-4">Maintenance Requests for this Equipment</h3>
            {relatedRequests.length === 0 ? (
              <p className="text-gray-500 mb-4">No maintenance requests found for this equipment</p>
            ) : (
              <div className="space-y-2 mb-4">
                {relatedRequests.map((req: any) => (
                  <div
                    key={req.id}
                    onClick={() => navigate(`/requests/${req.id}`)}
                    className="p-3 bg-white border-2 border-black rounded-lg cursor-pointer hover:shadow-brutal transition-all hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <p className="font-bold">{req.subject}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Status: <span className="font-semibold">{req.status}</span>
                          {req.scheduled_date && (
                            <> • Scheduled: {new Date(req.scheduled_date).toLocaleDateString()}</>
                          )}
                        </p>
                      </div>
                      <Badge className={
                        req.priority === 'critical' ? 'bg-red-200' :
                        req.priority === 'high' ? 'bg-orange-200' :
                        req.priority === 'medium' ? 'bg-yellow-200' :
                        'bg-green-200'
                      }>
                        {req.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button
              onClick={() => navigate('/requests/new')}
              className="w-full bg-green-300 border-4 border-black hover:shadow-brutal font-bold"
            >
              + Create New Maintenance Request
            </Button>
          </NeoCard>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <NeoCard variant="red">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          </NeoCard>
        </motion.div>
      )}

      {/* Success Message */}
      {success && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <NeoCard variant="green">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle size={20} />
              <span>{success}</span>
            </div>
          </NeoCard>
        </motion.div>
      )}

      {/* Form */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Main Form */}
        <div className="col-span-2 space-y-6">
          {/* Basic Information */}
          <NeoCard variant="yellow">
            <h3 className="text-xl font-bold mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Equipment Name *</label>
                <Input
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  placeholder="e.g., Samsung Monitor 15 inch"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Category</label>
                  <Input
                    value={formData.category}
                    onChange={handleInputChange('category')}
                    placeholder="e.g., Electronics, Mechanical"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Type</label>
                  <Select value={formData.type} onValueChange={(val) => handleChange('type', val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="machine">Machine</SelectItem>
                      <SelectItem value="vehicle">Vehicle</SelectItem>
                      <SelectItem value="computer">Computer</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Company</label>
                <Input
                  value={formData.company}
                  onChange={handleInputChange('company')}
                  placeholder="e.g., My Company (San Francisco)"
                />
              </div>
            </div>
          </NeoCard>

          {/* Technical Details */}
          <NeoCard variant="blue">
            <h3 className="text-xl font-bold mb-4">Technical Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Serial Number</label>
                  <Input
                    value={formData.serial_no}
                    onChange={handleInputChange('serial_no')}
                    placeholder="e.g., AT/125/22778837"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Vendor</label>
                  <Input
                    value={formData.vendor}
                    onChange={handleInputChange('vendor')}
                    placeholder="e.g., Samsung, Bosch"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Warranty Start</label>
                  <Input
                    type="date"
                    value={formData.warranty_start}
                    onChange={handleInputChange('warranty_start')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Warranty End</label>
                  <Input
                    type="date"
                    value={formData.warranty_end}
                    onChange={handleInputChange('warranty_end')}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Location</label>
                <Input
                  value={formData.location}
                  onChange={handleInputChange('location')}
                  placeholder="e.g., Office A, Workshop, Factory Floor"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Health Percent</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.health_percent}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('health_percent', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </NeoCard>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Used By */}
          <NeoCard variant="green">
            <h3 className="text-lg font-bold mb-3">Used By</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Employee</label>
                <Input
                  type="text"
                  value={formData.owner_employee_id}
                  onChange={handleInputChange('owner_employee_id')}
                  placeholder="Employee ID"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Department</label>
                <Input
                  value={formData.owner_department}
                  onChange={handleInputChange('owner_department')}
                  placeholder="Department"
                />
              </div>
            </div>
          </NeoCard>

          {/* Maintenance */}
          <NeoCard variant="pink">
            <h3 className="text-lg font-bold mb-3">Maintenance</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Technician</label>
                <Input
                  type="text"
                  value={formData.technician_id}
                  onChange={handleInputChange('technician_id')}
                  placeholder="Technician ID"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Assigned Date</label>
                <Input
                  type="date"
                  value={formData.assigned_date}
                  onChange={handleInputChange('assigned_date')}
                />
              </div>
            </div>
          </NeoCard>

          {/* Work Center */}
          <NeoCard variant="yellow">
            <h3 className="text-lg font-bold mb-3">Work Center</h3>
            <Select
              value={formData.work_center_id}
              onValueChange={(val) => handleChange('work_center_id', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select work center" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {workCenters.map((wc) => (
                  <SelectItem key={wc.id} value={wc.id.toString()}>
                    {wc.name} ({wc.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </NeoCard>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={handleSubmit}
              disabled={submitting || !formData.name.trim()}
              className="w-full bg-blue-300 border-4 border-black hover:shadow-brutal text-black font-bold py-3"
            >
              {submitting ? 'Saving...' : isEdit ? 'Update Equipment' : 'Create Equipment'}
            </Button>
            <Button
              onClick={() => navigate('/equipment')}
              variant="outline"
              className="w-full border-4 border-black"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
