import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Equipment } from '@/services/equipmentService';
import { equipmentService } from '@/services/equipmentService';
import { NeoCard } from '@/components/ui/neo-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, AlertCircle, Pencil } from 'lucide-react';

export default function EquipmentList() {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [filteredData, setFilteredData] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadEquipment();
  }, []);

  useEffect(() => {
    const filtered = equipment.filter((item) => {
      const searchLower = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchLower) ||
        item.serial_no?.toLowerCase().includes(searchLower) ||
        item.owner_name?.toLowerCase().includes(searchLower) ||
        item.category?.toLowerCase().includes(searchLower) ||
        item.owner_department?.toLowerCase().includes(searchLower) ||
        item.company?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredData(filtered);
  }, [search, equipment]);

  async function loadEquipment() {
    try {
      setLoading(true);
      setError('');
      const data = await equipmentService.getAllEquipment();
      setEquipment(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load equipment');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (deleteId !== id) {
      setDeleteId(id);
      return;
    }

    try {
      setDeleting(true);
      await equipmentService.deleteEquipment(id);
      setEquipment(equipment.filter((item) => item.id !== id));
      setDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete equipment');
    } finally {
      setDeleting(false);
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Equipment</h1>
          <p className="text-gray-600 mt-2">Manage your equipment inventory</p>
        </div>
        <Button
          onClick={() => navigate('/equipment/new')}
          className="bg-green-300 border-4 border-black hover:shadow-brutal text-black font-bold"
        >
          + New Equipment
        </Button>
      </div>

      {/* Search */}
      <NeoCard variant="white">
        <Input
          type="text"
          placeholder="Search by name, serial number, employee, category, or company..."
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className="w-full"
        />
      </NeoCard>

      {/* Error Message */}
      {error && (
        <NeoCard variant="red">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        </NeoCard>
      )}

      {/* Table */}
      {loading ? (
        <NeoCard variant="white" className="text-center py-12">
          <p className="text-gray-500">Loading equipment...</p>
        </NeoCard>
      ) : filteredData.length === 0 ? (
        <NeoCard variant="white" className="text-center py-12">
          <p className="text-gray-500">
            {equipment.length === 0 ? 'No equipment found' : 'No results match your search'}
          </p>
        </NeoCard>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show">
          <div className="overflow-x-auto">
            <NeoCard variant="white">
              <table className="w-full">
                <thead>
                  <tr className="border-b-4 border-black">
                    <th className="text-left p-4 font-bold">Equipment Name</th>
                    <th className="text-left p-4 font-bold">Employee</th>
                    <th className="text-left p-4 font-bold">Department</th>
                    <th className="text-left p-4 font-bold">Serial Number</th>
                    <th className="text-left p-4 font-bold">Technician</th>
                    <th className="text-left p-4 font-bold">Category</th>
                    <th className="text-left p-4 font-bold">Company</th>
                    <th className="text-center p-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, idx) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => navigate(`/equipment/${item.id}`)}
                      className={`cursor-pointer hover:bg-yellow-50 transition-colors ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                    >
                      <td className="p-4 border-b border-gray-200">
                        <span className="text-black font-semibold">
                          {item.name}
                        </span>
                      </td>
                      <td className="p-4 border-b border-gray-200 text-gray-700">
                        {item.owner_name || '-'}
                      </td>
                      <td className="p-4 border-b border-gray-200 text-gray-700">
                        {item.owner_department || '-'}
                      </td>
                      <td className="p-4 border-b border-gray-200 text-gray-600 text-sm font-mono">
                        {item.serial_no || '-'}
                      </td>
                      <td className="p-4 border-b border-gray-200 text-gray-700">
                        {item.technician_name || '-'}
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        {item.category ? (
                          <span className="inline-block bg-blue-300 border-2 border-black px-3 py-1 text-sm font-semibold rounded-lg">
                            {item.category}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="p-4 border-b border-gray-200 text-gray-700 text-sm">
                        {item.company || '-'}
                      </td>
                      <td className="p-4 border-b border-gray-200" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => navigate(`/equipment/${item.id}`)}
                            className="p-2 hover:bg-yellow-200 rounded-lg border-2 border-black transition"
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deleting}
                            className={`p-2 rounded-lg border-2 border-black transition ${
                              deleteId === item.id
                                ? 'bg-red-300 hover:bg-red-400'
                                : 'hover:bg-red-200'
                            }`}
                            title={deleteId === item.id ? 'Click again to confirm delete' : 'Delete'}
                          >
                            <Trash2 size={18} className="text-red-700" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </NeoCard>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredData.length} of {equipment.length} equipment items
          </div>
        </motion.div>
      )}
    </div>
  );
}
