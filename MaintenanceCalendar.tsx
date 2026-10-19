import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventClickArg, DatesSetArg } from '@fullcalendar/core';
import { motion } from 'framer-motion';
import { Calendar, RefreshCw } from 'lucide-react';
import { NeoButton } from '@/components/ui/neo-button';
import { requestsService, type ScheduledRequest } from '@/services/requestsService';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: {
    status: string;
    priority: string;
    maintenance_for: string;
    equipment_name?: string;
    work_center_name?: string;
    technician_name?: string;
  };
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical':
      return { bg: '#FEE2E2', border: '#EF4444', text: '#991B1B' };
    case 'high':
      return { bg: '#FED7AA', border: '#F97316', text: '#9A3412' };
    case 'medium':
      return { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' };
    case 'low':
    default:
      return { bg: '#DCFCE7', border: '#22C55E', text: '#166534' };
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return '⏳';
    case 'in-progress':
      return '🔧';
    case 'resolved':
      return '✅';
    case 'closed':
      return '📁';
    default:
      return '';
  }
};

export const MaintenanceCalendar: React.FC = () => {
  const navigate = useNavigate();
  const calendarRef = useRef<FullCalendar>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentRange, setCurrentRange] = useState<{ start: string; end: string } | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const formatDateForApi = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const transformRequestsToEvents = (requests: ScheduledRequest[]): CalendarEvent[] => {
    return requests.map((request) => {
      const colors = getPriorityColor(request.priority);
      const startDate = new Date(request.scheduled_date);
      const durationHours = request.duration || 1;
      const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);

      return {
        id: String(request.id),
        title: `${getStatusBadge(request.status)} ${request.subject}`,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        backgroundColor: colors.bg,
        borderColor: colors.border,
        textColor: colors.text,
        extendedProps: {
          status: request.status,
          priority: request.priority,
          maintenance_for: request.maintenance_for,
          equipment_name: request.equipment_name,
          work_center_name: request.work_center_name,
          technician_name: request.technician_name,
        },
      };
    });
  };

  const fetchScheduledRequests = useCallback(async (start: string, end: string) => {
    try {
      setLoading(true);
      setError(null);
      const requests = await requestsService.getScheduledRequests(start, end);
      const calendarEvents = transformRequestsToEvents(requests);
      setEvents(calendarEvents);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to load scheduled requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle date range changes when navigating calendar
  const handleDatesSet = useCallback((dateInfo: DatesSetArg) => {
    const start = formatDateForApi(dateInfo.start);
    const end = formatDateForApi(dateInfo.end);
    setCurrentRange({ start, end });
    fetchScheduledRequests(start, end);
  }, [fetchScheduledRequests]);

  // Polling for real-time updates (every 10 seconds)
  useEffect(() => {
    if (!currentRange) return;

    const pollInterval = setInterval(() => {
      fetchScheduledRequests(currentRange.start, currentRange.end);
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(pollInterval);
  }, [currentRange, fetchScheduledRequests]);

  // Handle event click - navigate to request details
  const handleEventClick = (clickInfo: EventClickArg) => {
    const requestId = clickInfo.event.id;
    navigate(`/requests/${requestId}`);
  };

  // Manual refresh button
  const handleRefresh = () => {
    if (currentRange) {
      fetchScheduledRequests(currentRange.start, currentRange.end);
    }
  };

  // Custom event content renderer
  const renderEventContent = (eventInfo: { event: { title: string; extendedProps: CalendarEvent['extendedProps'] }; timeText: string }) => {
    const { extendedProps } = eventInfo.event;
    const targetName = extendedProps.maintenance_for === 'equipment'
      ? extendedProps.equipment_name
      : extendedProps.work_center_name;

    return (
      <div className="p-1 overflow-hidden cursor-pointer">
        <div className="font-semibold text-xs truncate">{eventInfo.event.title}</div>
        {targetName && (
          <div className="text-xs opacity-80 truncate">{targetName}</div>
        )}
        {eventInfo.timeText && (
          <div className="text-xs opacity-70">{eventInfo.timeText}</div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl border-2 border-black flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Maintenance Calendar</h1>
                <p className="text-sm text-gray-500">
                  View and manage scheduled maintenance requests
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-xs text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <NeoButton
                onClick={handleRefresh}
                variant="white"
                size="sm"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </NeoButton>
              <NeoButton
                onClick={() => navigate('/requests/new')}
                variant="default"
                size="sm"
              >
                + New Request
              </NeoButton>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex flex-wrap gap-4 text-sm"
        >
          <span className="text-gray-600 font-medium">Priority:</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#EF4444' }} />
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#F97316' }} />
            <span>High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#F59E0B' }} />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#22C55E' }} />
            <span>Low</span>
          </div>
          <span className="ml-4 text-gray-400">|</span>
          <span className="text-gray-600">⏳ Pending</span>
          <span className="text-gray-600">🔧 In Progress</span>
          <span className="text-gray-600">✅ Resolved</span>
          <span className="text-gray-600">📁 Closed</span>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600"
          >
            {error}
          </motion.div>
        )}

        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border-2 border-gray-200 p-4 shadow-sm"
        >
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={events}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            datesSet={handleDatesSet}
            height="auto"
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            allDaySlot={false}
            weekends={true}
            nowIndicator={true}
            slotDuration="00:30:00"
            eventDisplay="block"
            dayMaxEvents={3}
            moreLinkClick="popover"
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5],
              startTime: '08:00',
              endTime: '18:00',
            }}
          />
        </motion.div>

        {/* Info text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-sm text-gray-500 text-center"
        >
          Click on any event to view request details. Calendar auto-refreshes every 10 seconds.
        </motion.p>
      </div>
    </div>
  );
};

export default MaintenanceCalendar;
