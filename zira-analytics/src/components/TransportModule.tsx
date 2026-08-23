import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Users, 
  Wrench, 
  TrendingUp, 
  Search, 
  Plus, 
  Trash, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Eye, 
  Sliders, 
  ChevronRight, 
  Phone, 
  ShieldCheck, 
  DollarSign, 
  Share2, 
  Gauge, 
  Activity, 
  Calendar, 
  Map,
  RefreshCw,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';
import { useCurrency } from '../contexts/CurrencyContext.tsx';

interface Student {
  id: string;
  name: string;
  classSection?: string;
  usesTransport?: string;
}

interface TransportModuleProps {
  students: Student[];
}

export function TransportModule({ students }: TransportModuleProps) {
  const { currency } = useCurrency();

  // --- STATE DECLARATIONS ---
  const [activeSubTab, setActiveSubTab] = useState<'telemetry' | 'routes' | 'riders' | 'maintenance' | 'crew'>('telemetry');

  // 1. Vehicle Fleet Registry (Rich states)
  const [vehicles, setVehicles] = useState([
    { id: 'v1', plate: 'KBA 920X', brand: 'Isuzu Bus', capacity: 52, status: 'Active', fuel: '68%', nextService: '12 days', odometer: '48,290 km', emissions: '2.4t CO₂', model: '2022 FSR', tirePressure: 'Normal', lastCheckCode: 'QA-PASSED' },
    { id: 'v2', plate: 'KCB 402Y', brand: 'Toyota Minibus', capacity: 33, status: 'Active', fuel: '45%', nextService: '24 days', odometer: '21,450 km', emissions: '1.2t CO₂', model: '2023 Coaster', tirePressure: 'Normal', lastCheckCode: 'QA-PASSED' },
    { id: 'v3', plate: 'KCC 012A', brand: 'Nissan Shuttle', capacity: 14, status: 'Maintenance', fuel: '12%', nextService: 'Immediate', odometer: '9,810 km', emissions: '0.8t CO₂', model: '2024 NV350', tirePressure: 'Low Rear Left', lastCheckCode: 'QA-WARNING' },
    { id: 'v4', plate: 'KCD 711P', brand: 'Fuso Executive Coach', capacity: 45, status: 'Active', fuel: '82%', nextService: '38 days', odometer: '15,640 km', emissions: '1.9t CO₂', model: '2025 Aero', tirePressure: 'Normal', lastCheckCode: 'QA-PASSED' }
  ]);

  // 2. Logistics Routes
  const [routesList, setRoutesList] = useState([
    { 
      id: 'r1', 
      route: 'Route A - Nairobi Central Town', 
      driver: 'Douglas Kamau', 
      vehicle: 'KBA 920X', 
      price: 4500, 
      activeStudents: 15, 
      stops: ['Nairobi Central Terminal', 'Ngara', 'Muthaiga Crossing', 'Rongai Hub', 'Karega High Campus'], 
      schedule: '06:15 AM - 07:30 AM',
      color: 'border-pink-500/30 text-pink-400 bg-pink-500/5'
    },
    { 
      id: 'r2', 
      route: 'Route B - Ngong / Karen Ring', 
      driver: 'Silas Kiprono', 
      vehicle: 'KCB 402Y', 
      price: 6000, 
      activeStudents: 11, 
      stops: ['Ngong Town', 'Karen Triangle', 'Bypass Crossing', 'Langata Mall', 'Karega High Campus'], 
      schedule: '06:30 AM - 07:45 AM',
      color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
    },
    { 
      id: 'r3', 
      route: 'Route C - Thika Road Expressway', 
      driver: 'William Mwangangi', 
      vehicle: 'KCC 012A', 
      price: 7500, 
      activeStudents: 4, 
      stops: ['Thika Town Interchange', 'Ruiru Junction', 'Kasarani Safehouse', 'Karega High Campus'], 
      schedule: '06:00 AM - 07:15 AM',
      color: 'border-amber-500/30 text-amber-400 bg-amber-500/5'
    }
  ]);

  // 3. Student Rider Ledger Assignments
  const [transportAssignments, setTransportAssignments] = useState([
    { id: 'ta1', studentName: 'Douglas Omari', studentId: 'ADM-2020-001', route: 'Route B - Ngong / Karen Ring', chargedAmount: 6000, status: 'Billed to Finance', dateAssigned: '2026-05-15' },
    { id: 'ta2', studentName: 'Emily Wanjala', studentId: 'ADM-2023-002', route: 'Route A - Nairobi Central Town', chargedAmount: 4500, status: 'Billed to Finance', dateAssigned: '2026-05-18' },
    { id: 'ta3', studentName: 'Kevin Kiprop', studentId: 'ADM-2024-004', route: 'Route A - Nairobi Central Town', chargedAmount: 4500, status: 'Billed to Finance', dateAssigned: '2026-05-19' },
    { id: 'ta4', studentName: 'Joy Kamene', studentId: 'ADM-2025-018', route: 'Route C - Thika Road Expressway', chargedAmount: 7500, status: 'Billed to Finance', dateAssigned: '2026-05-20' }
  ]);

  // 4. Repairs & Maintenance Register
  const [maintenanceLogs, setMaintenanceLogs] = useState([
    { id: 'ml1', vehiclePlate: 'KCC 012A', serviceType: 'Full Brake Replacement', cost: 18500, date: '2026-06-02', status: 'In Progress', personnel: 'Karega Auto Garage', priority: 'High' },
    { id: 'ml2', vehiclePlate: 'KBA 920X', serviceType: 'Engine Oil & Filter Change', cost: 8400, date: '2026-05-28', status: 'Completed', personnel: 'Pioneer Mechanicals', priority: 'Medium' },
    { id: 'ml3', vehiclePlate: 'KCB 402Y', serviceType: 'Wheel Alignment & Balancing', cost: 4200, date: '2026-05-15', status: 'Completed', personnel: 'Pioneer Mechanicals', priority: 'Low' }
  ]);

  // 5. Driver & Crew Directory
  const [drivers, setDrivers] = useState([
    { id: 'd1', name: 'Douglas Kamau', license: 'DL-A19502', phone: '+254 722 001 122', experience: '8 yrs', rating: '4.9', status: 'On Route', safetyCleared: true, bloodGroup: 'O+', incidentLogs: 'None' },
    { id: 'd2', name: 'Silas Kiprono', license: 'DL-B84920', phone: '+254 733 445 566', experience: '5 yrs', rating: '4.8', status: 'Available', safetyCleared: true, bloodGroup: 'A+', incidentLogs: 'None' },
    { id: 'd3', name: 'William Mwangangi', license: 'DL-C12201', phone: '+254 711 223 344', experience: '11 yrs', rating: '4.7', status: 'Available', safetyCleared: true, bloodGroup: 'B-', incidentLogs: '1 minor delay' }
  ]);

  // Search & Filters inputs state
  const [riderSearch, setRiderSearch] = useState('');
  const [riderRouteFilter, setRiderRouteFilter] = useState('All');
  const [telemetrySimuStatus, setTelemetrySimuStatus] = useState<string>('System online. Fleet transmitting signals normally.');

  // Form states
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [vPlate, setVPlate] = useState('');
  const [vBrand, setVBrand] = useState('Isuzu Bus');
  const [vCapacity, setVCapacity] = useState(52);
  const [vModel, setVModel] = useState('');

  const [showAddRouteModal, setShowAddRouteModal] = useState(false);
  const [newRouteName, setNewRouteName] = useState('');
  const [newRouteDriver, setNewRouteDriver] = useState('Douglas Kamau');
  const [newRouteVehicle, setNewRouteVehicle] = useState('KBA 920X');
  const [newRoutePrice, setNewRoutePrice] = useState(5000);
  const [newRouteStops, setNewRouteStops] = useState('');
  const [newRouteSchedule, setNewRouteSchedule] = useState('06:30 AM - 07:30 AM');

  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [driverName, setDriverName] = useState('');
  const [driverDL, setDriverDL] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [driverExperience, setDriverExperience] = useState('3 yrs');

  const [showMaintModal, setShowMaintModal] = useState(false);
  const [maintPlate, setMaintPlate] = useState('KCC 012A');
  const [maintType, setMaintType] = useState('Engine Overhaul');
  const [maintCost, setMaintCost] = useState(12000);
  const [maintPersonnel, setMaintPersonnel] = useState('Karega Auto Garage');
  const [maintPriority, setMaintPriority] = useState('Medium');

  // Trigger simulated ping test
  const triggerTelemetryPing = () => {
    setTelemetrySimuStatus('Pinging logistics beacons... Re-authenticating GPS sensors...');
    setTimeout(() => {
      setTelemetrySimuStatus('SUCCESS! 4 Operational beacons synchronized. Ping response: 24ms.');
      toast.success('Live Fleet Beacons pinged successfully.');
    }, 1200);
  };

  return (
    <div className="space-y-6 text-slate-800 text-lg font-semibold animate-fade-in">
      
      {/* 🚀 Segmented Tab Controls (World Class Visual Tab Menu) */}
      <div className="flex flex-wrap bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl p-2 gap-1.5 shadow-sm">
        <button
          onClick={() => setActiveSubTab('telemetry')}
          className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-base font-bold uppercase tracking-wide transition-all cursor-pointer ${
            activeSubTab === 'telemetry'
              ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md shadow-slate-900/10 scale-[1.02]'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-4 h-4" /> Fleet Telemetry
        </button>
        <button
          onClick={() => setActiveSubTab('routes')}
          className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-base font-bold uppercase tracking-wide transition-all cursor-pointer ${
            activeSubTab === 'routes'
              ? 'bg-gradient-to-r from-indigo-700 to-indigo-800 text-white shadow-md shadow-indigo-900/10 scale-[1.02]'
              : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/40'
          }`}
        >
          <Map className="w-4 h-4" /> Route Planner
        </button>
        <button
          onClick={() => setActiveSubTab('riders')}
          className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-base font-bold uppercase tracking-wide transition-all cursor-pointer ${
            activeSubTab === 'riders'
              ? 'bg-gradient-to-r from-pink-600 to-pink-700 text-white shadow-md shadow-pink-900/10 scale-[1.02]'
              : 'text-slate-500 hover:text-pink-600 hover:bg-pink-50/40'
          }`}
        >
          <Users className="w-4 h-4" /> Rider Ledgers
        </button>
        <button
          onClick={() => setActiveSubTab('maintenance')}
          className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-base font-bold uppercase tracking-wide transition-all cursor-pointer ${
            activeSubTab === 'maintenance'
              ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md shadow-rose-900/10 scale-[1.02]'
              : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50/40'
          }`}
        >
          <Wrench className="w-4 h-4" /> Mechanical Register
        </button>
        <button
          onClick={() => setActiveSubTab('crew')}
          className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-base font-bold uppercase tracking-wide transition-all cursor-pointer ${
            activeSubTab === 'crew'
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-900/10 scale-[1.02]'
              : 'text-slate-500 hover:text-amber-600 hover:bg-amber-50/40'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Crew & Drivers
        </button>
      </div>

      {/* --- RENDER SUB MODULES (ANIMATED FOR LUXURIOUS UX) --- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="space-y-6"
        >
          
          {/* ========================================================= */}
          {/* SUBTAB 1: FLEET TELEMETRY & OPERATIONS CONTROLLER */}
          {/* ========================================================= */}
          {activeSubTab === 'telemetry' && (
            <div className="space-y-6">
              {/* Telemetry Metric Widgets */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs relative overflow-hidden group select-none transition hover:shadow-md">
                  <span className="text-[13px] text-slate-400 font-bold uppercase tracking-wide block tabular-nums">Fleet Active Density</span>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-3xl font-bold tabular-nums text-slate-950">
                      {vehicles.filter(v => v.status === 'Active').length} <span className="text-lg text-slate-400 font-sans font-bold">/ {vehicles.length}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[13px] font-bold border border-emerald-200/55 tabular-nums">ONLINE</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1 rounded-full mt-4 overflow-hidden">
                    <div className="bg-slate-900 h-full rounded-full" style={{ width: `${(vehicles.filter(v => v.status === 'Active').length / vehicles.length) * 100}%` }} />
                  </div>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs relative overflow-hidden group select-none transition hover:shadow-md">
                  <span className="text-[13px] text-indigo-500 font-bold uppercase tracking-wide block tabular-nums">Total Carrying Capacity</span>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-3xl font-bold tabular-nums text-slate-950">
                      {vehicles.reduce((acc, v) => acc + v.capacity, 0)} <span className="text-lg text-slate-400 font-sans font-bold">Riders</span>
                    </span>
                  </div>
                  <div className="w-full bg-indigo-50 h-1 rounded-full mt-4 overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs relative overflow-hidden group select-none transition hover:shadow-md">
                  <span className="text-[13px] text-pink-500 font-bold uppercase tracking-wide block tabular-nums">Total Monthly Logistics Receipts</span>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-2xl font-bold tabular-nums text-emerald-600">
                      {currency} {transportAssignments.reduce((acc, r) => acc + r.chargedAmount, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-pink-50 h-1 rounded-full mt-4 overflow-hidden">
                    <div className="bg-[#C20F47] h-full rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs relative overflow-hidden group select-none transition hover:shadow-md">
                  <span className="text-[13px] text-amber-500 font-bold uppercase tracking-wide block tabular-nums">System Signal Transmissions</span>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-[17px] font-bold text-emerald-600 flex items-center gap-1.5">
                      <Gauge className="w-4.5 h-4.5 animate-spin text-emerald-500" style={{ animationDuration: '4s' }} /> Beacons Locked
                    </span>
                  </div>
                  <button 
                    onClick={triggerTelemetryPing}
                    className="mt-2.5 w-full text-center text-xs py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition block tabular-nums font-bold cursor-pointer"
                  >
                    ⚡ Ping Operational Beacons
                  </button>
                </div>
              </div>

              {/* Grid of fleet vehicle details (Visual Cards layout replacing boring lists) */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
                      Live Vehicle Fleet Telemetry
                    </h3>
                    <p className="text-[15px] font-bold text-slate-450 uppercase tracking-wide">
                      Real-time fleet tracker, tire diagnostic metrics & eco emissions ledger
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setVPlate('');
                      setVBrand('Isuzu Bus');
                      setVCapacity(52);
                      setVModel('2024');
                      setShowAddVehicleModal(true);
                    }}
                    className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-850 transition rounded-xl text-base font-bold flex items-center gap-1.5 shadow-sm shadow-slate-900/10 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-amber-400 stroke-[3]" /> Add Fleet Vehicle
                  </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {vehicles.map((v) => (
                    <div 
                      key={v.id} 
                      className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md relative overflow-hidden transition-all duration-300"
                    >
                      {/* Vehicle Status Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider block border ${
                          v.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-250' 
                            : 'bg-rose-50 text-rose-700 border-rose-250'
                        }`}>
                          {v.status}
                        </span>
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 text-xl mb-4 border border-slate-200">
                        🚍
                      </div>

                      <h4 className="text-xl font-bold text-slate-900">{v.plate}</h4>
                      <span className="text-[14px] text-slate-400 font-bold block uppercase tracking-wide mt-0.5">{v.brand} ({v.model})</span>

                      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
                        <div>
                          <span className="text-[12px] text-slate-400 block tabular-nums uppercase tracking-wider">Odometer</span>
                          <span className="text-base text-slate-800 font-bold block mt-0.5">{v.odometer}</span>
                        </div>
                        <div>
                          <span className="text-[12px] text-slate-400 block tabular-nums uppercase tracking-wider">Fuel Gauge</span>
                          <span className={`text-base font-bold block mt-0.5 ${parseInt(v.fuel) < 20 ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {v.fuel}
                          </span>
                        </div>
                        <div>
                          <span className="text-[12px] text-slate-400 block tabular-nums uppercase tracking-wider">Capacity</span>
                          <span className="text-base text-indigo-600 font-bold block mt-0.5">{v.capacity} Seats</span>
                        </div>
                        <div>
                          <span className="text-[12px] text-slate-400 block tabular-nums uppercase tracking-wider">Diagnostics</span>
                          <span className={`text-[12.5px] tabular-nums tracking-tighter uppercase font-bold block mt-0.5 ${v.lastCheckCode.includes('PASSED') ? 'text-emerald-600' : 'text-amber-500'}`}>
                            {v.lastCheckCode}
                          </span>
                        </div>
                      </div>

                      {/* Carbon Emission info & service alerts */}
                      <div className="mt-4 p-2.5 bg-slate-50 border border-slate-150 rounded-xl text-xs flex justify-between items-center text-slate-500">
                        <span className="flex items-center gap-1">
                          <Activity className="w-3.5 h-3.5 text-slate-400" /> Service: {v.nextService}
                        </span>
                        <span className="tabular-nums text-emerald-800 font-bold bg-emerald-100/40 px-1.5 py-0.5 rounded cursor-help" title="CO2 footprint metrics">
                          🌿 {v.emissions}
                        </span>
                      </div>

                      {/* Diagnostic trigger actions */}
                      <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2.5">
                        <button
                          onClick={() => {
                            // Toggle status of vehicle
                            setVehicles(prev => prev.map(item => item.id === v.id ? { ...item, status: item.status === 'Active' ? 'Maintenance' : 'Active' } : item));
                            toast.success(`Vehicle status updated for ${v.plate}.`);
                          }}
                          className="flex-1 py-1 px-2.5 bg-slate-50 border border-slate-250 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition text-center cursor-pointer"
                        >
                          Toggle Status
                        </button>
                        <button
                          onClick={() => {
                            toast.success(`Requested diagnostic systems update on vehicle ${v.plate}... OK`);
                          }}
                          className="p-1 px-2.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition text-center cursor-pointer"
                        >
                          Diagnose
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Verify: Decommission this fleet vehicle permanently?')) {
                              setVehicles(prev => prev.filter(item => item.id !== v.id));
                              toast.success(`Fleet vehicle ${v.plate} decommissioned.`);
                            }
                          }}
                          className="p-1 hover:bg-rose-50 text-rose-500 hover:text-rose-700 rounded-lg transition cursor-pointer"
                          title="Decommission vehicle"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SUBTAB 2: INTUITIVE ROUTE PLANNER & MAPS PIPELINE */}
          {/* ========================================================= */}
          {activeSubTab === 'routes' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Route List and Details */}
              <div className="lg:col-span-2 space-y-5">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 uppercase">Interactive Transit Routes</h3>
                      <p className="text-[15px] font-bold text-slate-450 uppercase mt-0.5">Route stops, timetables, assigned assets, and pricing</p>
                    </div>
                    <button
                      onClick={() => {
                        setNewRouteName('');
                        setNewRouteStops('');
                        setNewRoutePrice(5000);
                        setShowAddRouteModal(true);
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 transition rounded-xl text-base font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-600/15 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-white stroke-[3]" /> Add Service Route
                    </button>
                  </div>

                  {/* Route Grid */}
                  <div className="space-y-4">
                    {routesList.map((route) => (
                      <div 
                        key={route.id} 
                        className="bg-slate-50 border border-slate-150 rounded-2xl p-5 hover:border-indigo-400 transition-all duration-300"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-200/70">
                          <div>
                            <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 tabular-nums text-[13px] font-bold mr-2">
                              R-{route.id}
                            </span>
                            <span className="text-lg font-bold text-slate-900">{route.route}</span>
                          </div>
                          <span className="text-lg tabular-nums font-bold text-emerald-600 bg-emerald-50 border border-emerald-150 px-2.5 py-0.5 rounded-lg">
                            {currency} {route.price.toLocaleString()}/term
                          </span>
                        </div>

                        {/* Stations Map stops */}
                        <div className="my-4">
                          <span className="text-[13px] text-slate-400 block uppercase tabular-nums tracking-wider font-bold mb-2.5">
                            🛣️ Station Waypoints Loop
                          </span>
                          <div className="flex flex-wrap items-center gap-1 bg-white p-3.5 border border-slate-150 rounded-xl shadow-inner-xs text-[14.5px] text-slate-700 font-bold">
                            {route.stops.map((stop, sIdx) => (
                              <React.Fragment key={stop}>
                                <div className="flex items-center gap-1">
                                  <MapPin className={`w-4 h-4 ${sIdx === route.stops.length - 1 ? 'text-emerald-500 fill-emerald-500/10' : 'text-slate-400'}`} />
                                  <span>{stop}</span>
                                </div>
                                {sIdx < route.stops.length - 1 && (
                                  <ChevronRight className="w-4 h-4 text-slate-350 shrink-0 mx-1" />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>

                        {/* Logistics specifications info */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white/70 border border-slate-150/80 p-3.5 rounded-xl text-[14px]">
                          <div>
                            <span className="text-slate-450 uppercase block tabular-nums text-xs">Assigned Driver</span>
                            <span className="font-bold text-slate-800 block mt-0.5">👤 {route.driver}</span>
                          </div>
                          <div>
                            <span className="text-slate-455 uppercase block tabular-nums text-xs">Vessel Assignment</span>
                            <span className="font-bold text-indigo-600 block mt-0.5">🚍 {route.vehicle}</span>
                          </div>
                          <div>
                            <span className="text-slate-455 uppercase block tabular-nums text-xs">Schedule Window</span>
                            <span className="font-bold text-slate-800 block mt-0.5">⏰ {route.schedule}</span>
                          </div>
                          <div>
                            <span className="text-slate-455 uppercase block tabular-nums text-xs">Active Roster</span>
                            <span className="font-bold text-slate-800 block mt-0.5">🎒 {route.activeStudents} Assigned</span>
                          </div>
                        </div>

                        {/* Route Actions */}
                        <div className="mt-4 flex items-center justify-end gap-3">
                          <button
                            onClick={() => {
                              toast.success(`Dispatched simulated routing SMS notification checklist to all parents on ${route.route}.`);
                            }}
                            className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                          >
                            Broadcast Alerts
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Verify: Permanently delete this service logistics route: ${route.route}?`)) {
                                setRoutesList(prev => prev.filter(r => r.id !== route.id));
                                toast.success('Route record removed from list.');
                              }
                            }}
                            className="px-2 py-1.5 hover:bg-rose-50 text-rose-500 hover:text-rose-700 border border-transparent hover:border-rose-200 rounded-lg transition cursor-pointer"
                            title="Remove Route"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              </div>

              {/* Graphical Route Directions Map Representation */}
              <div className="lg:col-span-1 space-y-5">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden self-start">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                  <h3 className="text-lg font-bold tracking-tight text-white uppercase flex items-center gap-2">
                    <MapPin className="text-indigo-400 w-5 h-5 fill-indigo-400/10" /> Karega Logistics Map Telemetry
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Visual telemetry depicting school coordinate transit pathways. Simulated active route tracking index.
                  </p>

                  <div className="my-5 aspect-square rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
                    {/* Retro Grid background */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-30" />
                    
                    {/* Visual GPS Pipeline drawings */}
                    <svg className="w-full h-full text-indigo-500 stroke-current relative z-10" viewBox="0 0 200 200" fill="none">
                      {/* Grid routes lines */}
                      <path d="M20 50 Q 80 20 180 80 T 150 160 Q 100 130 50 170 Z" strokeWidth="2.5" strokeLinecap="round" className="stroke-indigo-500/25 animate-pulse" />
                      <path d="M50 20 L 150 180" strokeWidth="1.5" strokeDasharray="3 3" className="stroke-slate-700" />
                      <path d="M10 100 Q 100 120 190 100" strokeWidth="2" strokeDasharray="5 5" className="stroke-[#FF5D8F]/30" />
                      
                      {/* Interactive hubs markers */}
                      <circle cx="100" cy="110" r="8" className="fill-[#FF5D8F] stroke-white animate-ping" style={{ animationDuration: '3s' }} />
                      <circle cx="100" cy="110" r="5" className="fill-[#FF5D8F] stroke-white" />
                      <text x="110" y="113" fill="#FFF" fontSize="8" fontWeight="bold" fontFamily="monospace">SCHOOL HEADQUARTERS</text>

                      <circle cx="50" cy="170" r="4" className="fill-emerald-400 stroke-white" />
                      <text x="12" y="165" fill="#A1A1AA" fontSize="7" fontWeight="bold">Ngong Point</text>

                      <circle cx="180" cy="80" r="4" className="fill-amber-400 stroke-white" />
                      <text x="135" y="75" fill="#A1A1AA" fontSize="7" fontWeight="bold">Nairobi Terminal</text>

                      <circle cx="20" cy="50" r="4" className="fill-sky-400 stroke-white" />
                      <text x="15" y="44" fill="#A1A1AA" fontSize="7" fontWeight="bold">Ruiru Depot</text>
                    </svg>

                    <div className="absolute bottom-3 left-3 bg-slate-900/95 backdrop-blur-md border border-slate-800 p-2.5 rounded-lg text-[10.5px] tabular-nums leading-normal text-slate-300">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" /> CORE ENGINE LOCKED
                      </div>
                      GPS Synchronized: 3 Vehicles On-Grid<br />
                      Signals Accuracy Factor: 99.4%
                    </div>
                  </div>

                  <div className="space-y-3 bg-slate-950/80 p-4 border border-slate-800 rounded-2xl text-[13.5px]">
                    <div className="flex justify-between text-slate-300">
                      <span>Total Registered Routes</span>
                      <span className="font-bold text-white">{routesList.length} Units</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Average Standard Rate</span>
                      <span className="font-bold text-white">{currency} 6,000 / term</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Live Active Bus Dispatch</span>
                      <span className="font-semibold text-emerald-400">100% On Schedule</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* SUBTAB 3: RIDER LEDGER & FEE INVOICING ACCOUNTING LINK */}
          {/* ========================================================= */}
          {activeSubTab === 'riders' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Form to Assign & Post Transport Billing directly to student ledger */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4 self-start">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 uppercase">Enroll Transit Rider</h3>
                    <p className="text-[15px] font-bold text-slate-450 uppercase mt-0.5">
                      Assign student to routes & post double-entry charges directly to fees accounts
                    </p>
                  </div>

                  <div className="space-y-4 pt-3 border-t border-slate-100">
                    <div>
                      <label className="block text-[13.5px] text-slate-450 uppercase tabular-nums tracking-wider font-bold mb-1.5">
                        Select Candidate Roster
                      </label>
                      <select 
                        id="rider-student-assign" 
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-sans cursor-pointer focus:outline-none"
                      >
                        {students.map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[13.5px] text-slate-450 uppercase tabular-nums tracking-wider font-bold mb-1.5">
                        Select Logistics Route
                      </label>
                      <select 
                        id="rider-route-assign" 
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-sans cursor-pointer focus:outline-none"
                      >
                        {routesList.map(r => (
                          <option key={r.id} value={`${r.route}|${r.price}`}>{r.route} ({currency} {r.price.toLocaleString()})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[13.5px] text-slate-450 uppercase tabular-nums tracking-wider font-bold mb-1.5">
                        Billing Accounting Category
                      </label>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        <div>
                          <span className="text-[13px] tabular-nums text-slate-500 uppercase block font-bold">Chart Account Ledger Code</span>
                          <span className="text-sm font-bold text-slate-900">4050 - Transport System Subscriptions</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const studEl = document.getElementById('rider-student-assign') as HTMLSelectElement;
                        const routeEl = document.getElementById('rider-route-assign') as HTMLSelectElement;
                        if (studEl && routeEl) {
                          const studId = studEl.value;
                          const studentObj = students.find(s => s.id === studId);
                          const [routeText, routeVal] = routeEl.value.split('|');
                          
                          if (!studentObj) {
                            toast.error('Please select a valid candidate.');
                            return;
                          }

                          // Check if student already assigned
                          if (transportAssignments.some(item => item.studentId === studId)) {
                            toast.error(`${studentObj.name} is already assigned to a route.`);
                            return;
                          }

                          const costValue = parseInt(routeVal);
                          const newAssignment = {
                            id: 'ta-' + Date.now(),
                            studentName: studentObj.name,
                            studentId: studId,
                            route: routeText,
                            chargedAmount: costValue,
                            status: 'Billed to Finance',
                            dateAssigned: new Date().toISOString().split('T')[0]
                          };

                          setTransportAssignments([newAssignment, ...transportAssignments]);
                          toast.success(`Successfully enrolled ${studentObj.name} and posted ${currency} ${costValue.toLocaleString()} charge to general ledger.`);
                        }
                      }}
                      className="w-full py-3 bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-white rounded-xl uppercase font-bold text-sm tracking-wider transition shadow-md shadow-[var(--color-secondary)]/10 cursor-pointer text-center"
                    >
                      Post Route Billing to Ledger
                    </button>
                  </div>
                </div>
              </div>

              {/* Assignments Ledgers Lists & Search filter */}
              <div className="lg:col-span-2">
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                  
                  {/* Ledger Header */}
                  <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 uppercase">Transit Rider Ledgers</h3>
                      <p className="text-[15px] font-bold text-slate-450 uppercase mt-0.5">Audit student route invoices and transport credentials status</p>
                    </div>
                  </div>

                  {/* Dynamic Filters panel */}
                  <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative w-full sm:w-80">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input 
                        type="text" 
                        placeholder="Search student or ADM number..." 
                        value={riderSearch}
                        onChange={e => setRiderSearch(e.target.value)}
                        className="w-full pl-9.5 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-base font-semibold text-slate-800"
                      />
                    </div>
                    <div className="w-full sm:w-auto flex items-center gap-2">
                      <span className="text-slate-400 text-xs tabular-nums uppercase font-bold tracking-wider whitespace-nowrap">Route Group</span>
                      <select 
                        value={riderRouteFilter}
                        onChange={e => setRiderRouteFilter(e.target.value)}
                        className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[14.5px] font-bold focus:outline-none text-slate-700 cursor-pointer"
                      >
                        <option value="All">All Routes</option>
                        {routesList.map(r => (
                          <option key={r.id} value={r.route}>{r.route}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Ledger Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans text-lg border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[13.5px] uppercase tracking-wide tabular-nums">
                          <th className="px-5 py-3">Candidate Info</th>
                          <th className="px-5 py-3">Assigned Route</th>
                          <th className="px-5 py-3 text-right">Invoiced Rate</th>
                          <th className="px-5 py-3 text-right">Accounting State</th>
                          <th className="px-5 py-3 text-center">Revoke</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                        {transportAssignments
                          .filter(t => {
                            const matchText = t.studentName.toLowerCase().includes(riderSearch.toLowerCase()) || t.studentId.toLowerCase().includes(riderSearch.toLowerCase());
                            const matchRoute = riderRouteFilter === 'All' || t.route === riderRouteFilter;
                            return matchText && matchRoute;
                          })
                          .length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-12 text-center text-slate-400 font-bold text-base">
                                No registered student riders match the filters.
                              </td>
                            </tr>
                          ) : (
                            transportAssignments
                              .filter(t => {
                                const matchText = t.studentName.toLowerCase().includes(riderSearch.toLowerCase()) || t.studentId.toLowerCase().includes(riderSearch.toLowerCase());
                                const matchRoute = riderRouteFilter === 'All' || t.route === riderRouteFilter;
                                return matchText && matchRoute;
                              })
                              .map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                                  <td className="px-5 py-3.5">
                                    <span className="font-bold text-slate-900 block leading-snug">{item.studentName}</span>
                                    <span className="text-[13px] tabular-nums font-bold text-indigo-600 block mt-0.5">{item.studentId}</span>
                                  </td>
                                  <td className="px-5 py-3.5">
                                    <span className="text-[14.5px] text-slate-700 block font-bold leading-tight">{item.route}</span>
                                    <span className="text-[11px] text-slate-400 inline-block tabular-nums tracking-tight mt-0.5">Enrolled: {item.dateAssigned}</span>
                                  </td>
                                  <td className="px-5 py-3.5 text-right tabular-nums text-emerald-600">
                                    {currency} {item.chargedAmount.toLocaleString()}
                                  </td>
                                  <td className="px-5 py-3.5 text-right">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/50 rounded-full text-xs tabular-nums font-bold uppercase tracking-wide">
                                      <CheckCircle className="w-3 h-3 text-emerald-500 fill-emerald-500/10" /> Billed
                                    </span>
                                  </td>
                                  <td className="px-5 py-3.5 text-center">
                                    <button
                                      onClick={() => {
                                        if (confirm(`Revoke route details & credit ${currency} ${item.chargedAmount.toLocaleString()} back to ${item.studentName}?`)) {
                                          setTransportAssignments(prev => prev.filter(a => a.id !== item.id));
                                          toast.success(`Revoked transport enrolment for ${item.studentName}. Credit invoice noted.`);
                                        }
                                      }}
                                      className="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                                    >
                                      <Trash className="w-4 h-4 inline" />
                                    </button>
                                  </td>
                                </tr>
                              ))
                          )}
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* SUBTAB 4: REPAIR & MAINTENANCE REGISTER */}
          {/* ========================================================= */}
          {activeSubTab === 'maintenance' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 uppercase">Mechanical Log & Spare Parts Inventory</h3>
                    <p className="text-[15px] font-bold text-slate-450 uppercase mt-0.5">Trace fleet diagnostics, scheduled inspections & garage logs</p>
                  </div>
                  <button
                    onClick={() => {
                      setMaintPlate('KCC 012A');
                      setMaintType('');
                      setMaintCost(15000);
                      setMaintPersonnel('Karega Auto Garage');
                      setMaintPriority('Medium');
                      setShowMaintModal(true);
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-base font-bold flex items-center gap-1.5 cursor-pointer shadow-sm shadow-rose-600/10"
                  >
                    <Wrench className="w-4 h-4 text-white stroke-[2.5]" /> Log Mechanical Service
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                  {/* Status checklist metrics */}
                  <div className="p-4 bg-orange-50/50 border border-orange-250/50 rounded-2xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 stroke-[2.5] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[14px] text-orange-800 font-bold uppercase block font-sans">Active Maintenance Alerts</span>
                      <span className="text-2xl font-bold tabular-nums text-slate-900 block mt-1">1 Fleet Warning</span>
                      <p className="text-xs text-orange-700 font-semibold mt-1">
                        Nissan Shuttle KCC 012A is currently in workshop for Brake Replacement.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50/50 border border-emerald-250/50 rounded-2xl flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 stroke-[2.5] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[14px] text-emerald-800 font-bold uppercase block font-sans">Last Service Quality Check</span>
                      <span className="text-2xl font-bold tabular-nums text-slate-900 block mt-1">98.5% SCORE</span>
                      <p className="text-xs text-emerald-700 font-semibold mt-1">
                        All major buses passed safety inspection including emission ratings, tire alignment.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50/50 border border-indigo-250/50 rounded-2xl flex items-start gap-3">
                    <Activity className="w-5 h-5 text-indigo-600 stroke-[2.5] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[14px] text-indigo-800 font-bold uppercase block font-sans">Mechanical Budget Utilized</span>
                      <span className="text-2xl font-bold tabular-nums text-indigo-900 block mt-1">
                        {currency} {maintenanceLogs.reduce((acc, ml) => acc + ml.cost, 0).toLocaleString()}
                      </span>
                      <p className="text-xs text-indigo-700 font-semibold mt-1">
                        Aggregated garage repair and spare parts acquisition expenditure ledger.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Table list */}
                <div className="overflow-x-auto border border-slate-150 rounded-2xl">
                  <table className="w-full text-left font-sans text-lg border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[13.5px] uppercase tracking-wider tabular-nums">
                        <th className="px-5 py-3.5">Vehicle License</th>
                        <th className="px-5 py-3.5">Service Operations Type</th>
                        <th className="px-5 py-3.5">Work Garage / Crew</th>
                        <th className="px-5 py-3.5 text-right">Invoiced Cost</th>
                        <th className="px-5 py-3.5">Criticality</th>
                        <th className="px-4 py-3.5 text-center">Execution State</th>
                        <th className="px-4 py-3.5 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                      {maintenanceLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/40">
                          <td className="px-5 py-4">
                            <span className="font-bold text-slate-900 tabular-nums block">{log.vehiclePlate}</span>
                            <span className="text-[11px] text-slate-400 block tabular-nums mt-0.5">Recorded: {log.date}</span>
                          </td>
                          <td className="px-5 py-4 font-sans font-bold text-slate-800">{log.serviceType}</td>
                          <td className="px-5 py-4 text-slate-600">{log.personnel}</td>
                          <td className="px-5 py-4 text-right tabular-nums text-indigo-700">{currency} {log.cost.toLocaleString()}</td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-0.5 rounded text-[12.5px] font-bold uppercase ${
                              log.priority === 'High' 
                                ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                                : log.priority === 'Medium'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {log.priority}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs tabular-nums font-bold uppercase tracking-wider ${
                              log.status === 'Completed' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : 'bg-orange-50 text-orange-700 border border-orange-200 animate-pulse'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {log.status !== 'Completed' && (
                                <button
                                  onClick={() => {
                                    setMaintenanceLogs(prev => prev.map(m => m.id === log.id ? { ...m, status: 'Completed' } : m));
                                    toast.success(`Mechanical work order ${log.id} marked COMPLETED.`);
                                  }}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition cursor-pointer"
                                >
                                  Complete
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  if (confirm('Delete this maintenance record permanently?')) {
                                    setMaintenanceLogs(prev => prev.filter(m => m.id !== log.id));
                                    toast.success('Service log destroyed.');
                                  }
                                }}
                                className="text-slate-400 hover:text-rose-600 p-1.5 transition cursor-pointer"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SUBTAB 5: CREW & DRIVERS ONBOARDING DIRECTORY */}
          {/* ========================================================= */}
          {activeSubTab === 'crew' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 uppercase font-sans">Authorized Fleet Crew & Drivers</h3>
                    <p className="text-[15px] font-bold text-slate-450 uppercase mt-0.5">Manage licenses, background safety clearances & current duty status</p>
                  </div>
                  <button
                    onClick={() => {
                      setDriverName('');
                      setDriverDL('');
                      setDriverPhone('');
                      setShowAddDriverModal(true);
                    }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-base font-bold flex items-center gap-1.5 cursor-pointer shadow-sm shadow-amber-600/10"
                  >
                    <Plus className="w-4 h-4 text-white stroke-[3]" /> Register Driver / Staff
                  </button>
                </div>

                {/* Driver roster list cards (High tactile design) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {drivers.map((drv) => (
                    <div 
                      key={drv.id} 
                      className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 hover:bg-white hover:border-amber-400 transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="absolute top-4 right-4">
                        <span className={`px-2 py-0.5 rounded text-xs tabular-nums font-bold uppercase ${
                          drv.status === 'On Route' 
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {drv.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-3.5 mb-4">
                        <div className="w-12 h-12 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 text-xl font-bold">
                          👨‍✈️
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-950 leading-tight">{drv.name}</h4>
                          <span className="text-xs text-amber-600 tabular-nums font-bold tracking-widest block uppercase mt-0.5">Exp: {drv.experience}</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-slate-650 bg-white p-3.5 rounded-xl border border-slate-150">
                        <div className="flex justify-between">
                          <span className="tabular-nums text-xs uppercase text-slate-400">License Document</span>
                          <span className="font-bold text-slate-900 tabular-nums">{drv.license}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="tabular-nums text-xs uppercase text-slate-400">Telephone Contact</span>
                          <span className="font-bold text-slate-900">{drv.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="tabular-nums text-xs uppercase text-slate-400">NTSA/Police Clearance</span>
                          <span className="font-bold text-emerald-600 flex items-center gap-1">
                            🌿 VERIFIED PASSED
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="tabular-nums text-xs uppercase text-slate-400">Incident Flags</span>
                          <span className="font-semibold text-slate-800">{drv.incidentLogs}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3.5 border-t border-slate-200/60 flex items-center justify-between gap-2 text-xs font-bold">
                        <button
                          onClick={() => {
                            setDrivers(prev => prev.map(d => d.id === drv.id ? { ...d, status: d.status === 'On Route' ? 'Available' : 'On Route' } : d));
                            toast.success(`Dispatched status toggle toggled for crew member ${drv.name}.`);
                          }}
                          className="flex-1 py-1.5 bg-white border border-slate-250 hover:bg-slate-100 rounded-lg text-center font-bold text-slate-800 transition cursor-pointer"
                        >
                          Toggle Status
                        </button>
                        <a 
                          href={`tel:${drv.phone.replace(/\s+/g, '')}`} 
                          className="p-1.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 rounded-lg transition text-center flex items-center justify-center cursor-pointer"
                          title="Call driver"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => {
                            if (confirm(`Remove driver ${drv.name} from the school roster directory?`)) {
                              setDrivers(prev => prev.filter(d => d.id !== drv.id));
                              toast.success(`Staff driver account decommissioned.`);
                            }
                          }}
                          className="p-1 py-1.5 bg-rose-50 border border-rose-150 hover:bg-rose-100 rounded-lg text-rose-600 transition cursor-pointer"
                          title="Delete staff account"
                        >
                          Remove
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* --- POPUP WINDOW MODALS (BEAUTIFULLY STYLED CARDS WITH OVERLAYS) --- */}

      {/* 1. Add Vehicle Modal */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
            <h3 className="text-xl font-bold text-slate-950 uppercase border-b border-slate-200 pb-3">
              🚚 Add Fleet Vessel
            </h3>
            
            <div className="space-y-4 my-4">
              <div>
                <label className="block text-xs uppercase tracking-wider tabular-nums text-slate-500 mb-1">Registration Plate</label>
                <input 
                  type="text" 
                  value={vPlate} 
                  onChange={e => setVPlate(e.target.value)} 
                  placeholder="e.g. KCD 445Z" 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none text-base font-bold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider tabular-nums text-slate-500 mb-1">Vehicle Type/Brand</label>
                  <select 
                    value={vBrand} 
                    onChange={e => setVBrand(e.target.value)} 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl font-semibold focus:outline-none"
                  >
                    <option value="Isuzu Bus">Isuzu Bus</option>
                    <option value="Toyota Minibus">Toyota Minibus</option>
                    <option value="Nissan Shuttle">Nissan Shuttle</option>
                    <option value="Scania Luxury Coach">Scania Coach</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider tabular-nums text-slate-500 mb-1">Seating Capacity</label>
                  <input 
                    type="number" 
                    value={vCapacity} 
                    onChange={e => setVCapacity(parseInt(e.target.value) || 14)} 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-slate-900/10 outline-none font-bold text-base text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider tabular-nums text-slate-500 mb-1">Model / Specs Year</label>
                <input 
                  type="text" 
                  value={vModel} 
                  onChange={e => setVModel(e.target.value)} 
                  placeholder="e.g. 2024" 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-slate-900/10 outline-none text-base font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAddVehicleModal(false)}
                className="px-4 py-2 border border-slate-250 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!vPlate) {
                    toast.error('Registration plate code is required.');
                    return;
                  }
                  const newV = {
                    id: 'v-' + Date.now(),
                    plate: vPlate,
                    brand: vBrand,
                    capacity: vCapacity,
                    status: 'Active',
                    fuel: '100%',
                    nextService: '45 days',
                    odometer: '1,200 km',
                    emissions: '0.0t CO2 (New)',
                    model: vModel || '2024 Model',
                    tirePressure: 'Normal',
                    lastCheckCode: 'QA-NEW'
                  };
                  setVehicles([...vehicles, newV]);
                  toast.success(`Fleet vehicle ${vPlate} added successfully.`);
                  setShowAddVehicleModal(false);
                }}
                className="px-4.5 py-2 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-sm font-bold transition cursor-pointer"
              >
                Register Vehicle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Add Route Modal */}
      {showAddRouteModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-slate-950 uppercase border-b border-slate-200 pb-3">
              🗺️ Add Service Logistics Route
            </h3>

            <div className="space-y-4 my-4">
              <div>
                <label className="block text-xs uppercase tracking-wider tabular-nums text-slate-500 mb-1">Route Descriptor Name</label>
                <input 
                  type="text" 
                  value={newRouteName} 
                  onChange={e => setNewRouteName(e.target.value)} 
                  placeholder="e.g. Route D - Rongai Expressway Corridor" 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-slate-900/10 outline-none text-base font-bold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider tabular-nums text-slate-500 mb-1">Driver In charge</label>
                  <select 
                    value={newRouteDriver} 
                    onChange={e => setNewRouteDriver(e.target.value)} 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl font-semibold focus:outline-none"
                  >
                    {drivers.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider tabular-nums text-slate-500 mb-1">Termly Route Cost</label>
                  <input 
                    type="number" 
                    value={newRoutePrice} 
                    onChange={e => setNewRoutePrice(parseInt(e.target.value) || 4000)} 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-slate-900/10 outline-none font-bold text-base text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider tabular-nums text-slate-500 mb-1">Route Stops Stations (Comma separated)</label>
                <input 
                  type="text" 
                  value={newRouteStops} 
                  onChange={e => setNewRouteStops(e.target.value)} 
                  placeholder="Terminus A, Rongai East, Bypass Gate" 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-slate-900/10 outline-none text-base font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider tabular-nums text-slate-500 mb-1">Vessel Assigned</label>
                <select 
                  value={newRouteVehicle} 
                  onChange={e => setNewRouteVehicle(e.target.value)} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl font-semibold focus:outline-none"
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.plate}>{v.brand} ({v.plate})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAddRouteModal(false)}
                className="px-4 py-2 border border-slate-250 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newRouteName) {
                    toast.error('Route descriptor is required.');
                    return;
                  }
                  const stList = newRouteStops 
                    ? newRouteStops.split(',').map(item => item.trim()) 
                    : ['Main Terminal Depot', 'Karega Corporate Campus'];

                  const finalStops = [...stList, 'Karega High Campus'];

                  const nr = {
                    id: 'r' + (routesList.length + 1),
                    route: newRouteName,
                    driver: newRouteDriver,
                    vehicle: newRouteVehicle,
                    price: newRoutePrice,
                    activeStudents: 0,
                    stops: finalStops,
                    schedule: newRouteSchedule,
                    color: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5'
                  };
                  setRoutesList([...routesList, nr]);
                  toast.success(`Logistics route ${newRouteName} deployed.`);
                  setShowAddRouteModal(false);
                }}
                className="px-4.5 py-2 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-sm font-bold transition cursor-pointer"
              >
                Deploy Route
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Add Driver Modal */}
      {showAddDriverModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-slate-950 uppercase border-b border-slate-200 pb-3">
              👨‍✈️ Register Driver / Mechanic Crew
            </h3>

            <div className="space-y-4 my-4">
              <div>
                <label className="block text-xs uppercase tracking-wider tabular-nums text-slate-500 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={driverName} 
                  onChange={e => setDriverName(e.target.value)} 
                  placeholder="e.g. Dennis Musyoka" 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-slate-900/10 outline-none text-base font-bold text-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider tabular-nums text-slate-500 mb-1">DL License Code</label>
                  <input 
                    type="text" 
                    value={driverDL} 
                    onChange={e => setDriverDL(e.target.value)} 
                    placeholder="DL-S52011" 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-slate-900/10 outline-none text-base font-bold text-slate-800 tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider tabular-nums text-slate-500 mb-1">Phone Contact</label>
                  <input 
                    type="text" 
                    value={driverPhone} 
                    onChange={e => setDriverPhone(e.target.value)} 
                    placeholder="+254 700 000 000" 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-slate-900/10 outline-none text-base font-bold text-slate-800"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider tabular-nums text-slate-500 mb-1">Active Experience</label>
                <select 
                  value={driverExperience} 
                  onChange={e => setDriverExperience(e.target.value)} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl font-semibold focus:outline-none"
                >
                  <option value="1 yr">1 Year</option>
                  <option value="3 yrs">3 Years</option>
                  <option value="5 yrs">5 Years</option>
                  <option value="8 yrs">8 Years</option>
                  <option value="10+ yrs">10+ Years</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAddDriverModal(false)}
                className="px-4 py-2 border border-slate-250 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!driverName || !driverPhone) {
                    toast.error('Driver name and phone contact are required.');
                    return;
                  }
                  const ndr = {
                    id: 'd' + (drivers.length + 1),
                    name: driverName,
                    license: driverDL || 'DL-PENDING',
                    phone: driverPhone,
                    experience: driverExperience,
                    rating: '5.0',
                    status: 'Available',
                    safetyCleared: true,
                    bloodGroup: 'B+',
                    incidentLogs: 'None'
                  };
                  setDrivers([...drivers, ndr]);
                  toast.success(`Registered driver staff: ${driverName}. Background check cleared.`);
                  setShowAddDriverModal(false);
                }}
                className="px-4.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold transition cursor-pointer"
              >
                Onboard Driver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Add Maintenance Log Modal */}
      {showMaintModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-slate-950 uppercase border-b border-slate-200 pb-3">
              🔧 Log Mechanical Service Record
            </h3>

            <div className="space-y-4 my-4">
              <div>
                <label className="block text-xs uppercase tracking-wider tabular-nums text-slate-500 mb-1">Select Fleet Vessel</label>
                <select 
                  value={maintPlate} 
                  onChange={e => setMaintPlate(e.target.value)} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl font-semibold focus:outline-none"
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.plate}>{v.plate} ({v.brand})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider tabular-nums text-slate-500 mb-1">Service Operation Type</label>
                <input 
                  type="text" 
                  value={maintType} 
                  onChange={e => setMaintType(e.target.value)} 
                  placeholder="e.g. Oil Change, Gearbox Overhaul" 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-slate-900/10 outline-none text-base font-bold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider tabular-nums text-slate-500 mb-1">Estimated Cost / Price</label>
                  <input 
                    type="number" 
                    value={maintCost} 
                    onChange={e => setMaintCost(parseInt(e.target.value) || 1000)} 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-slate-900/10 outline-none text-base font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider tabular-nums text-slate-500 mb-1">Work Priority</label>
                  <select 
                    value={maintPriority} 
                    onChange={e => setMaintPriority(e.target.value)} 
                    className="w-full px-3 py-2 bg-slate-50 border border-[#CBD5E1] rounded-xl font-semibold focus:outline-none"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High (Immediate)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider tabular-nums text-slate-500 mb-1">Garage / Mechanics Enterprise Name</label>
                <input 
                  type="text" 
                  value={maintPersonnel} 
                  onChange={e => setMaintPersonnel(e.target.value)} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-slate-900/10 outline-none text-base font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowMaintModal(false)}
                className="px-4 py-2 border border-slate-250 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!maintType || !maintPersonnel) {
                    toast.error('Service type and workshop/personnel are required.');
                    return;
                  }
                  const nm = {
                    id: 'ml-' + Date.now(),
                    vehiclePlate: maintPlate,
                    serviceType: maintType,
                    cost: maintCost,
                    date: new Date().toISOString().split('T')[0],
                    status: 'In Progress',
                    personnel: maintPersonnel,
                    priority: maintPriority
                  };
                  setMaintenanceLogs([nm, ...maintenanceLogs]);
                  toast.success(`Mechanical work order dispatched for ${maintPlate}.`);
                  setShowMaintModal(false);
                }}
                className="px-4.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold transition cursor-pointer"
              >
                Dispatch Work Order
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
