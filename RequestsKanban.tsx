import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { requestsService, type MaintenanceRequest } from '@/services/requestsService';
import { equipmentService } from '@/services/equipmentService';
import { NeoCard } from '@/components/ui/neo-card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, List } from 'lucide-react';

const STAGES = {
  pending: { title: 'New', color: 'bg-blue-100' },
  'in-progress': { title: 'In Progress', color: 'bg-yellow-100' },
  resolved: { title: 'Repaired', color: 'bg-green-100' },
  closed: { title: 'Scrap', color: 'bg-red-100' },
};

export const RequestsKanban = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
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
    } catch (err) {
      console.error('Failed to load requests:', err);
      setError('Failed to load maintenance requests');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const requestId = parseInt(draggableId);
    const newStatus = destination.droppableId as MaintenanceRequest['status'];

    try {
      await requestsService.updateRequest(requestId, { status: newStatus });
      
      // Update local state
      setRequests(prev =>
        prev.map(req =>
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );

      // If moved to "Scrap" (closed), mark equipment as unusable
      if (newStatus === 'closed') {
        const request = requests.find(r => r.id === requestId);
        if (request?.equipment_id) {
          try {
            await equipmentService.scrapEquipment(
              request.equipment_id,
              `Request #${requestId}: ${request.subject}`
            );
            console.log(`Equipment ${request.equipment_id} marked as scrapped`);
          } catch (scrapError) {
            console.error('Failed to scrap equipment:', scrapError);
            // Continue even if scrap fails - the status update was successful
          }
        }
      }
    } catch (error) {
      console.error('Failed to update request status:', error);
      setError('Failed to update request status');
      // Reload requests to revert UI
      loadRequests();
    }
  };

  const getRequestsByStatus = (status: string) => {
    return requests.filter(req => req.status === status);
  };

  const isOverdue = (request: MaintenanceRequest) => {
    if (!request.scheduled_date) return false;
    const scheduledDate = new Date(request.scheduled_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return scheduledDate < today && request.status !== 'resolved' && request.status !== 'closed';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading maintenance requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 p-6 flex items-center justify-center">
        <NeoCard variant="white" className="max-w-md">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadRequests}
              className="px-4 py-2 bg-blue-300 border-4 border-black rounded-lg hover:shadow-brutal font-bold"
            >
              Retry
            </button>
          </div>
        </NeoCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/requests')}
            className="p-2 hover:bg-gray-200 rounded-lg border-2 border-black transition"
            title="Back to List View"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-4xl font-bold">Maintenance Kanban</h1>
            <p className="text-gray-600 mt-1">Drag requests between stages to update their status</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/requests')}
          className="flex items-center gap-2 px-4 py-2 bg-white border-4 border-black rounded-lg hover:shadow-brutal font-bold transition-all hover:-translate-y-1"
        >
          <List size={20} />
          List View
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(STAGES).map(([status, config]) => (
            <div key={status} className="flex flex-col">
              <div className={`${config.color} border-4 border-black rounded-lg p-4 mb-3 shadow-brutal`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">{config.title}</h3>
                  <Badge className="bg-white border-2 border-black">
                    {getRequestsByStatus(status).length}
                  </Badge>
                </div>
              </div>

              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[500px] rounded-lg p-2 transition-colors ${
                      snapshot.isDraggingOver ? 'bg-amber-100 border-2 border-dashed border-black' : 'bg-transparent'
                    }`}
                  >
                    <div className="space-y-3">
                      {getRequestsByStatus(status).map((request, index) => (
                        <Draggable
                          key={request.id}
                          draggableId={request.id.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => navigate(`/requests/${request.id}`)}
                              className={`${snapshot.isDragging ? 'opacity-50 rotate-2' : ''}`}
                            >
                              <NeoCard 
                                variant="white" 
                                className="cursor-pointer hover:shadow-brutal transition-all hover:-translate-y-1"
                              >
                                <div className="space-y-3">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className="font-bold text-sm flex-1">{request.subject}</p>
                                    {isOverdue(request) && (
                                      <div 
                                        className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0 animate-pulse" 
                                        title="Overdue"
                                      />
                                    )}
                                  </div>

                                  {(request.equipment_name || request.work_center_name) && (
                                    <div className="text-xs text-gray-600 flex items-center gap-1">
                                      <span className="font-semibold">
                                        {request.equipment_name ? '🔧' : '🏭'}
                                      </span>
                                      <span className="truncate">
                                        {request.equipment_name || request.work_center_name}
                                      </span>
                                    </div>
                                  )}

                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge className={
                                      request.priority === 'critical' ? 'bg-red-200 text-red-900' :
                                      request.priority === 'high' ? 'bg-orange-200 text-orange-900' :
                                      request.priority === 'medium' ? 'bg-yellow-200 text-yellow-900' :
                                      'bg-green-200 text-green-900'
                                    }>
                                      {request.priority?.toUpperCase()}
                                    </Badge>

                                    {request.maintenance_type && (
                                      <Badge variant="outline" className="text-xs border-2 border-black">
                                        {request.maintenance_type === 'corrective' ? '🔧 Breakdown' : '🔄 Routine'}
                                      </Badge>
                                    )}
                                  </div>

                                  {request.scheduled_date && (
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                      <span>📅</span>
                                      <span>{new Date(request.scheduled_date).toLocaleDateString()}</span>
                                    </div>
                                  )}

                                  {request.duration && request.duration > 0 && (
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                      <span>⏱️</span>
                                      <span>{request.duration}h logged</span>
                                    </div>
                                  )}
                                </div>
                              </NeoCard>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                    {provided.placeholder}
                    
                    {getRequestsByStatus(status).length === 0 && (
                      <div className="text-center text-gray-400 mt-8 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                        <p className="text-sm">No requests in this stage</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <div className="mt-8 text-center">
        <button
          onClick={() => navigate('/requests/new')}
          className="px-6 py-3 bg-green-300 border-4 border-black rounded-lg hover:shadow-brutal font-bold transition-all hover:-translate-y-1"
        >
          + Create New Request
        </button>
      </div>
    </div>
  );
};

export default RequestsKanban;
