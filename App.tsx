
import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Activity, 
  Bug, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle, 
  Zap, 
  RefreshCw,
  Search,
  Bell,
  Settings,
  ChevronRight,
  Sparkles,
  Filter,
  Download,
  Clock,
  ExternalLink,
  Globe,
  Database,
  User,
  ShieldAlert,
  Server,
  Cpu,
  Layers,
  History,
  X,
  Plus,
  Info,
  Play,
  ArrowRight,
  LogOut,
  Mail,
  Shield,
  BellRing,
  Smartphone,
  Check
} from 'lucide-react';
import { MetricCard } from './components/MetricCard';
import { INITIAL_DATA } from './mockData';
import { DashboardData, AIInsight, TabType, BugDetail, HistoryAction, TestHistoryEntry } from './types';
import { getQAInsights } from './services/geminiService';

const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

interface Notification {
  id: string;
  text: string;
  time: string;
  type: 'alert' | 'info' | 'success';
  targetTab?: TabType;
  details?: string;
}

const App: React.FC = () => {
  const [data, setData] = useState<DashboardData>(INITIAL_DATA);
  const [bugs, setBugs] = useState<BugDetail[]>(INITIAL_DATA.detailedBugs);
  const [testHistory, setTestHistory] = useState<TestHistoryEntry[]>(INITIAL_DATA.testHistory);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Header States
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', text: 'Critical: API Latency exceeded 300ms', time: '5m ago', type: 'alert', targetTab: 'performance', details: 'The endpoint /api/v1/checkout showed a spike of 450ms across 20% of users.' },
    { id: '2', text: 'New report DEF-106 created', time: '12m ago', type: 'info', targetTab: 'bugs', details: 'A new UI consistency bug was reported by Alice Smith regarding the mobile login screen.' },
    { id: '3', text: 'Regression pack passed successfully', time: '1h ago', type: 'success', targetTab: 'tests', details: 'Build #920 passed all 152 regression tests in the Staging environment.' },
  ]);

  // Settings State
  const [userPrefs, setUserPrefs] = useState({
    emailNotifications: true,
    browserNotifications: true,
    automationAlerts: true,
    criticalBugsOnly: false
  });

  // Bug Reporting Modal State
  const [isReportBugModalOpen, setIsReportBugModalOpen] = useState(false);
  const [newBug, setNewBug] = useState({
    title: '',
    description: '',
    type: 'Functional',
    priority: 'Medium' as BugDetail['priority']
  });

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchInsights = async () => {
    setLoadingInsights(true);
    const result = await getQAInsights(data);
    setInsights(result);
    setLoadingInsights(false);
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleAddBug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBug.title.trim()) return;

    const bugToAdd: BugDetail = {
      id: `DEF-${100 + bugs.length + 1}`,
      title: newBug.title,
      description: newBug.description,
      status: 'Open',
      priority: newBug.priority,
      type: newBug.type,
      reporter: 'Current User',
      assignedTo: 'Triage Queue',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setBugs([bugToAdd, ...bugs]);
    setNotifications(prev => [{ 
      id: Date.now().toString(), 
      text: `New report ${bugToAdd.id} added`, 
      time: 'Just now', 
      type: 'info', 
      targetTab: 'bugs',
      details: `Title: ${bugToAdd.title}. Priority: ${bugToAdd.priority}.` 
    }, ...prev]);
    setIsReportBugModalOpen(false);
    setNewBug({ title: '', description: '', type: 'Functional', priority: 'Medium' });
  };

  const handleRunNewSuite = () => {
    const suites = ['Sanity Check', 'Regression Pack', 'Performance Load', 'API Security Scan', 'UI Automation'];
    const envs = ['Production', 'Staging', 'QA', 'Dev'];
    const statuses: ('Passed' | 'Failed' | 'Partial')[] = ['Passed', 'Failed', 'Partial'];
    
    const newEntry: TestHistoryEntry = {
      id: `RUN-${500 + testHistory.length + 1}`,
      suite: suites[Math.floor(Math.random() * suites.length)],
      environment: envs[Math.floor(Math.random() * envs.length)],
      duration: `${Math.floor(Math.random() * 20) + 1}m ${Math.floor(Math.random() * 60)}s`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: statuses[Math.floor(Math.random() * statuses.length)]
    };
    
    setTestHistory([newEntry, ...testHistory]);
    setNotifications(prev => [{ 
      id: Date.now().toString(), 
      text: `${newEntry.suite} completed with status: ${newEntry.status}`, 
      time: 'Just now', 
      type: newEntry.status === 'Passed' ? 'success' : (newEntry.status === 'Failed' ? 'alert' : 'info'),
      targetTab: 'tests'
    }, ...prev]);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.targetTab) {
      setActiveTab(notification.targetTab);
    }
    setIsNotificationOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      window.location.reload();
    }
  };

  // Filtered lists for search
  const filteredBugs = bugs.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTests = testHistory.filter(t => 
    t.suite.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.environment.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredActions = data.pendingActions.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <MetricCard label="Pass Rate" value={`${data.summary.passRate}%`} trend={2.4} icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />} color="bg-emerald-50" />
        <MetricCard label="Automation" value={`${data.summary.automationRate}%`} trend={5.1} icon={<Cpu className="w-5 h-5 text-indigo-600" />} color="bg-indigo-50" />
        <MetricCard label="Coverage" value={`${data.summary.codeCoverage}%`} trend={-0.5} icon={<ShieldCheck className="w-5 h-5 text-blue-600" />} color="bg-blue-50" />
        <MetricCard label="Active Defects" value={bugs.filter(b => b.status !== 'Resolved' && b.status !== 'Closed').length} trend={-12.0} icon={<Bug className="w-5 h-5 text-rose-600" />} color="bg-rose-50" />
        <MetricCard label="API Latency" value={`${data.summary.avgLatency}ms`} trend={4.2} icon={<Zap className="w-5 h-5 text-amber-600" />} color="bg-amber-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900">Module Coverage Breakdown</h3>
            </div>
          </div>
          <div className="space-y-5">
            {data.moduleCoverage.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">{item.module}</span>
                  <span className="font-bold text-slate-900">{item.coverage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${item.coverage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900">Automation Health</h3>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center relative">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{ name: 'Automated', value: data.summary.automationRate }, { name: 'Manual', value: 100 - data.summary.automationRate }]}
                    cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                  >
                    <Cell fill="#6366f1" /><Cell fill="#e2e8f0" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <p className="text-2xl font-black text-slate-900">{data.summary.automationRate}%</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rate</p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDefects = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-900">Active Defect Repository</h3>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 font-medium hover:bg-slate-50 transition-colors">
            <Filter size={16} /> Filter
          </button>
          <button onClick={() => setIsReportBugModalOpen(true)} className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-all active:scale-95">
            <Plus size={16} /> Add New Report
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Issue Title</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBugs.length > 0 ? filteredBugs.map((bug) => (
                <tr key={bug.id} className="hover:bg-slate-50/50 cursor-pointer group transition-colors">
                  <td className="px-6 py-4 font-bold text-indigo-600 text-sm">{bug.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{bug.title}</p>
                    <p className="text-xs text-slate-500 font-medium">Assignee: {bug.assignedTo}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{bug.type}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      bug.priority === 'Critical' ? 'bg-rose-100 text-rose-700' :
                      bug.priority === 'High' ? 'bg-orange-100 text-orange-700' : 
                      bug.priority === 'Medium' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                    }`}>{bug.priority}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${bug.status === 'Resolved' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                      {bug.status}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">No reports found matching your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTests = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Test Execution Logs</h3>
          <p className="text-sm text-slate-500 mt-1">Detailed history of automated and manual test runs.</p>
        </div>
        <button 
          onClick={handleRunNewSuite}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 shadow-sm transition-all active:scale-95"
        >
          <Play size={16} fill="white" /> Run New Suite
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Run ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Suite Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Environment</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTests.length > 0 ? filteredTests.map(run => (
                <tr key={run.id} className="text-sm hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-indigo-600">{run.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{run.suite}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded w-fit">
                      <Globe size={12} className="text-slate-400" /> {run.environment}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      run.status === 'Passed' ? 'bg-emerald-100 text-emerald-700' : 
                      run.status === 'Failed' ? 'bg-rose-100 text-rose-700' : 
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {run.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 flex items-center gap-2">
                    <Clock size={14} className="text-slate-300" /> {run.duration}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                    {run.timestamp}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="p-12 text-center text-slate-500 font-medium italic">No test runs found matching your current filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-900">Pending Actions</h3>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {filteredActions.length > 0 ? filteredActions.map((action: HistoryAction) => (
          <div key={action.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${action.type === 'Bug Fix' ? 'bg-rose-50 text-rose-500' : 'bg-indigo-50 text-indigo-500'}`}>{action.type === 'Bug Fix' ? <Bug size={20} /> : <Activity size={20} />}</div>
              <div>
                <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{action.title}</h4>
                <div className="text-xs text-slate-500 mt-1 flex gap-3"><span className="flex items-center gap-1"><Clock size={12} /> {action.dueDate}</span><span>{action.id}</span></div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${action.status === 'Action Required' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{action.status}</span>
          </div>
        )) : (
          <div className="p-12 text-center text-slate-500 font-medium">No pending actions found.</div>
        )}
      </div>
    </div>
  );

  function renderSettings() {
    return (
      <div className="max-w-5xl space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Account & Preferences</h3>
            <p className="text-slate-500 text-sm">Manage your profile, security, and application settings.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Navigation Sidebar-style for Settings */}
          <div className="space-y-2">
            {[
              { id: 'profile', label: 'Personal Information', icon: User },
              { id: 'security', label: 'Security & Access', icon: Shield },
              { id: 'notifications', label: 'Notification Settings', icon: BellRing },
              { id: 'gates', label: 'Quality Standards', icon: ShieldCheck },
            ].map(item => (
              <button 
                key={item.id}
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl transition-all shadow-sm group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                    <item.icon size={18} className="text-slate-500 group-hover:text-indigo-600" />
                  </div>
                  <span className="font-bold text-slate-700 text-sm">{item.label}</span>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>

          {/* Right Column: Content Cards */}
          <div className="lg:col-span-2 space-y-8">
            {/* User Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <User size={18} className="text-indigo-600" />
                  User Profile
                </h4>
                <button className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Edit Profile</button>
              </div>
              <div className="p-8 space-y-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-black ring-4 ring-indigo-50 shadow-lg">
                      QA
                    </div>
                    <button className="absolute bottom-0 right-0 p-1.5 bg-white border border-slate-100 rounded-full shadow-md text-slate-600 hover:text-indigo-600 transition-colors">
                      <RefreshCw size={14} />
                    </button>
                  </div>
                  <div className="text-center sm:text-left space-y-1">
                    <h5 className="text-xl font-bold text-slate-900">System Administrator</h5>
                    <p className="text-sm text-slate-500 font-medium">Senior QA Lead @ Pulse Engineering</p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Active</span>
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded uppercase">Admin Role</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                    <div className="flex items-center gap-2 text-sm text-slate-800 font-bold bg-slate-50 p-3 rounded-xl border border-slate-100">
                      QA Admin Pulse
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                    <div className="flex items-center gap-2 text-sm text-slate-800 font-bold bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <Mail size={14} className="text-slate-400" />
                      admin@qapulse.io
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Workstation</label>
                    <div className="flex items-center gap-2 text-sm text-slate-800 font-bold bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <Smartphone size={14} className="text-slate-400" />
                      MacBook Pro (Dev-04)
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reports To</label>
                    <div className="flex items-center gap-2 text-sm text-slate-800 font-bold bg-slate-50 p-3 rounded-xl border border-slate-100">
                      Director of Engineering
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications Preferences */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <BellRing size={18} className="text-indigo-600" />
                  Notification Preferences
                </h4>
              </div>
              <div className="p-6 divide-y divide-slate-50">
                {[
                  { id: 'emailNotifications', label: 'Email Alerts', sub: 'Receive daily quality summaries via email.' },
                  { id: 'browserNotifications', label: 'Browser Push', sub: 'Instant desktop alerts for pipeline failures.' },
                  { id: 'automationAlerts', label: 'Automation Sync', sub: 'Notify when automation suites complete runs.' },
                  { id: 'criticalBugsOnly', label: 'Urgent Only', sub: 'Mute everything except Critical defect alerts.' },
                ].map(pref => (
                  <div key={pref.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{pref.label}</p>
                      <p className="text-xs text-slate-500 font-medium">{pref.sub}</p>
                    </div>
                    <button 
                      onClick={() => setUserPrefs(prev => ({...prev, [pref.id]: !prev[pref.id as keyof typeof userPrefs]}))}
                      className={`w-12 h-6 rounded-full transition-all relative flex items-center px-1 ${userPrefs[pref.id as keyof typeof userPrefs] ? 'bg-indigo-600' : 'bg-slate-200'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${userPrefs[pref.id as keyof typeof userPrefs] ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Logout Section */}
            <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm text-rose-500">
                  <LogOut size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Sign Out</h4>
                  <p className="text-xs text-slate-500 font-medium">Terminate your current session securely.</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="px-6 py-2.5 bg-white border border-rose-200 text-rose-600 text-sm font-black rounded-xl hover:bg-rose-600 hover:text-white transition-all active:scale-95 uppercase tracking-widest shadow-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 z-20">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-indigo-500 p-2 rounded-lg"><ShieldCheck className="w-6 h-6 text-white" /></div>
            <h1 className="text-xl font-bold tracking-tight">QA Pulse</h1>
          </div>
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Activity },
              { id: 'bugs', label: 'Defects', icon: Bug },
              { id: 'tests', label: 'Test Executions', icon: CheckCircle2 },
              { id: 'performance', label: 'Performance', icon: Zap },
              { id: 'history', label: 'History', icon: History },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id as TabType); setSearchQuery(''); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <tab.icon className="w-5 h-5" /> {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-screen relative">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 sticky top-0 bg-slate-50/80 backdrop-blur-md z-30 py-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 capitalize">{activeTab === 'bugs' ? 'Defects' : activeTab.replace('-', ' ')}</h2>
            <p className="text-slate-500 font-medium">Monitoring quality metrics and project health.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={`Search in ${activeTab}...`} 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 w-64 transition-all placeholder-slate-400 font-medium" 
              />
            </div>
            
            {/* Notification Dropdown */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => { setIsNotificationOpen(!isNotificationOpen); setIsProfileOpen(false); }}
                className={`p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm relative transition-all z-40 ${isNotificationOpen ? 'ring-2 ring-indigo-500 bg-indigo-50 shadow-indigo-100/50' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <Bell className={`w-5 h-5 transition-colors ${isNotificationOpen ? 'text-indigo-600' : 'text-slate-600'}`} />
                {notifications.length > 0 && !isNotificationOpen && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>}
                {notifications.length > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>}
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <span className="font-bold text-slate-900 text-sm">Recent Alerts</span>
                    <button onClick={() => setNotifications([])} className="text-[10px] font-black text-indigo-600 uppercase tracking-wider hover:text-indigo-800 transition-colors">Clear All</button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => handleNotificationClick(n)}
                        className="p-4 border-b border-slate-50 last:border-0 hover:bg-indigo-50/40 cursor-pointer transition-all flex gap-3 group"
                      >
                        <div className={`mt-1 p-2 rounded-xl flex-shrink-0 transition-transform group-hover:scale-110 ${n.type === 'alert' ? 'bg-rose-100 text-rose-600' : n.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                          {n.type === 'alert' ? <AlertTriangle size={14} /> : n.type === 'success' ? <CheckCircle2 size={14} /> : <Info size={14} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-800 font-bold leading-snug group-hover:text-indigo-700 transition-colors">{n.text}</p>
                          <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-tight flex items-center justify-between">
                            {n.time}
                            <span className="text-indigo-500 group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100"><ArrowRight size={10} /></span>
                          </p>
                        </div>
                      </div>
                    )) : (
                      <div className="p-10 text-center text-slate-400">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3"><Bell size={20} className="text-slate-300" /></div>
                        <p className="text-xs italic font-medium">No new notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationOpen(false); }}
                className={`flex items-center gap-2.5 p-1.5 pr-3 bg-white border border-slate-200 rounded-xl shadow-sm transition-all hover:bg-slate-50 group ${isProfileOpen ? 'ring-2 ring-indigo-500' : ''}`}
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-md group-hover:scale-105 transition-transform">
                  QA
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">Admin</p>
                  <p className="text-[9px] font-bold text-slate-400">online</p>
                </div>
                <ChevronRight size={14} className={`text-slate-300 transition-transform ${isProfileOpen ? 'rotate-90' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
                  <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900">QA Administrator</p>
                    <p className="text-[10px] text-slate-500 font-medium">admin@qapulse.io</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <button 
                      onClick={() => { setActiveTab('settings'); setIsProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors group"
                    >
                      <User size={16} className="text-slate-400 group-hover:text-indigo-500" />
                      View Profile
                    </button>
                    <button 
                      onClick={() => { setActiveTab('settings'); setIsProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors group"
                    >
                      <Settings size={16} className="text-slate-400 group-hover:text-indigo-500" />
                      Settings
                    </button>
                    <div className="h-px bg-slate-50 my-2 mx-2"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-lg transition-colors group"
                    >
                      <LogOut size={16} className="text-rose-400 group-hover:text-rose-600" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'bugs' && renderDefects()}
          {activeTab === 'tests' && renderTests()}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900">System Telemetry</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm"><h4 className="font-bold text-slate-800 mb-4">Latency (ms)</h4><div className="h-72"><ResponsiveContainer><AreaChart data={data.performance}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="timestamp" /><YAxis /><Tooltip /><Area type="monotone" dataKey="latency" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} /></AreaChart></ResponsiveContainer></div></div>
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm"><h4 className="font-bold text-slate-800 mb-4">Errors (%)</h4><div className="h-72"><ResponsiveContainer><BarChart data={data.performance}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="timestamp" /><YAxis /><Tooltip /><Bar dataKey="errorRate" fill="#ef4444" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
              </div>
            </div>
          )}
          {activeTab === 'history' && renderHistory()}
          {activeTab === 'settings' && renderSettings()}
        </div>

        {/* Global Search Results Overlay */}
        {searchQuery && (activeTab === 'dashboard' || activeTab === 'settings' || activeTab === 'performance') && (
          <div className="mt-8 p-6 bg-white rounded-2xl border border-indigo-100 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
            <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">Quick Results for "{searchQuery}"</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredBugs.slice(0, 3).map(b => (
                <div key={b.id} onClick={() => { setActiveTab('bugs'); }} className="text-xs p-3 bg-slate-50 rounded-xl text-slate-800 font-bold border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all cursor-pointer flex items-center gap-3">
                  <div className="p-1.5 bg-rose-100 text-rose-600 rounded-lg"><Bug size={14} /></div>
                  <div><span className="text-indigo-600">{b.id}</span> - {b.title}</div>
                </div>
              ))}
              {filteredTests.slice(0, 3).map(t => (
                <div key={t.id} onClick={() => { setActiveTab('tests'); }} className="text-xs p-3 bg-slate-50 rounded-xl text-slate-800 font-bold border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all cursor-pointer flex items-center gap-3">
                  <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg"><Check size={14} /></div>
                  <div><span className="text-indigo-600">{t.id}</span> - {t.suite}</div>
                </div>
              ))}
              {(!filteredBugs.length && !filteredTests.length) && <div className="text-xs text-slate-400 italic p-4 col-span-2 text-center">No precise matches found.</div>}
            </div>
          </div>
        )}
      </main>

      {/* Report Bug Modal */}
      {isReportBugModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[100] p-4 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-600">
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Bug size={20} />
                New Defect Report
              </h4>
              <button onClick={() => setIsReportBugModalOpen(false)} className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddBug} className="p-8 space-y-5">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase mb-2 tracking-wider">Defect Title</label>
                <input 
                  required 
                  autoFocus
                  value={newBug.title} 
                  onChange={e => setNewBug({...newBug, title: e.target.value})} 
                  type="text" 
                  placeholder="e.g., Login fails on iOS 17 with Safari" 
                  className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-sm text-slate-900 font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder-slate-300" 
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase mb-2 tracking-wider">Issue Category</label>
                  <select 
                    value={newBug.type} 
                    onChange={e => setNewBug({...newBug, type: e.target.value})} 
                    className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-sm text-slate-900 font-bold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                  >
                    <option>Functional</option>
                    <option>UI/UX</option>
                    <option>Security</option>
                    <option>Performance</option>
                    <option>Logic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase mb-2 tracking-wider">Urgency Level</label>
                  <select 
                    value={newBug.priority} 
                    onChange={e => setNewBug({...newBug, priority: e.target.value as any})} 
                    className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-sm text-slate-900 font-bold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase mb-2 tracking-wider">Detailed Description</label>
                <textarea 
                  value={newBug.description} 
                  onChange={e => setNewBug({...newBug, description: e.target.value})} 
                  rows={4} 
                  placeholder="Provide steps to reproduce and observed behavior..." 
                  className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-sm text-slate-900 font-bold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none placeholder-slate-300" 
                />
              </div>
              <div className="pt-4 flex justify-end gap-4">
                <button type="button" onClick={() => setIsReportBugModalOpen(false)} className="px-5 py-3 text-sm font-black text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-widest">Discard</button>
                <button type="submit" className="px-8 py-3 bg-indigo-600 text-white text-sm font-black rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all active:scale-95 uppercase tracking-widest">File Report</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
