import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { NeoButton } from '@/components/ui/neo-button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: {
    subject: string;
    employee: string;
    technician: string;
    category: string;
    stage: string;
    company: string;
  }) => void;
}

export const NewRequestModal: React.FC<NewRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    subject: '',
    employee: '',
    technician: '',
    category: 'computer',
    stage: 'Pending',
    company: 'My company'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.subject || !formData.employee || !formData.technician) {
      alert('Please fill in all required fields');
      return;
    }

    onSubmit(formData);
    
    // Reset form
    setFormData({
      subject: '',
      employee: '',
      technician: '',
      category: 'computer',
      stage: 'Pending',
      company: 'My company'
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New Maintenance Request</DialogTitle>
            <DialogDescription>
              Create a new maintenance request. Fill in the details below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Subject */}
            <div className="grid gap-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject <span className="text-red-500">*</span>
              </label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                placeholder="Enter request subject"
                required
              />
            </div>

            {/* Employee */}
            <div className="grid gap-2">
              <label htmlFor="employee" className="text-sm font-medium">
                Employee <span className="text-red-500">*</span>
              </label>
              <Input
                id="employee"
                value={formData.employee}
                onChange={(e) => handleChange('employee', e.target.value)}
                placeholder="Employee name"
                required
              />
            </div>

            {/* Technician */}
            <div className="grid gap-2">
              <label htmlFor="technician" className="text-sm font-medium">
                Technician <span className="text-red-500">*</span>
              </label>
              <Input
                id="technician"
                value={formData.technician}
                onChange={(e) => handleChange('technician', e.target.value)}
                placeholder="Assigned technician"
                required
              />
            </div>

            {/* Category */}
            <div className="grid gap-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="computer">Computer</SelectItem>
                  <SelectItem value="machinery">Machinery</SelectItem>
                  <SelectItem value="vehicle">Vehicle</SelectItem>
                  <SelectItem value="facility">Facility</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stage */}
            <div className="grid gap-2">
              <label htmlFor="stage" className="text-sm font-medium">
                Stage
              </label>
              <Select
                value={formData.stage}
                onValueChange={(value) => handleChange('stage', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Company */}
            <div className="grid gap-2">
              <label htmlFor="company" className="text-sm font-medium">
                Company
              </label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="Company name"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <NeoButton
              type="submit"
              variant="default"
            >
              Create Request
            </NeoButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
