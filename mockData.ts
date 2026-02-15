
import { DashboardData } from './types';

export const INITIAL_DATA: DashboardData = {
  summary: {
    passRate: 94.2,
    codeCoverage: 82.5,
    automationRate: 78.4,
    openBugs: 14,
    avgLatency: 245,
  },
  bugTrends: [
    { date: 'Mon', open: 12, resolved: 8 },
    { date: 'Tue', open: 15, resolved: 10 },
    { date: 'Wed', open: 18, resolved: 12 },
    { date: 'Thu', open: 14, resolved: 15 },
    { date: 'Fri', open: 13, resolved: 14 },
    { date: 'Sat', open: 11, resolved: 6 },
    { date: 'Sun', open: 14, resolved: 5 },
  ],
  detailedBugs: [
    { id: 'BUG-101', title: 'Login timeout on mobile devices', status: 'In Progress', priority: 'High', type: 'Performance', reporter: 'Alice Smith', assignedTo: 'John Doe', createdAt: '2024-05-10' },
    { id: 'BUG-102', title: 'Checkout button unresponsive in Safari', status: 'Open', priority: 'Critical', type: 'UI/UX', reporter: 'Bob Johnson', assignedTo: 'Sarah Connor', createdAt: '2024-05-11' },
    { id: 'BUG-103', title: 'Search filters not resetting correctly', status: 'Resolved', priority: 'Low', type: 'Functional', reporter: 'Charlie Davis', assignedTo: 'Mike Ross', createdAt: '2024-05-09' },
    { id: 'BUG-104', title: 'Broken images in user profiles', status: 'Open', priority: 'Medium', type: 'Assets', reporter: 'Diana Prince', assignedTo: 'Bruce Wayne', createdAt: '2024-05-12' },
    { id: 'BUG-105', title: 'API returning 500 on large payloads', status: 'In Progress', priority: 'Critical', type: 'Backend', reporter: 'Peter Parker', assignedTo: 'Tony Stark', createdAt: '2024-05-12' },
  ],
  performance: [
    { timestamp: '00:00', latency: 210, errorRate: 0.1 },
    { timestamp: '04:00', latency: 190, errorRate: 0.05 },
    { timestamp: '08:00', latency: 250, errorRate: 0.2 },
    { timestamp: '12:00', latency: 320, errorRate: 0.8 },
    { timestamp: '16:00', latency: 280, errorRate: 0.4 },
    { timestamp: '20:00', latency: 230, errorRate: 0.1 },
  ],
  testSuites: [
    { name: 'Unit Tests', passed: 450, failed: 5, skipped: 10 },
    { name: 'Integration', passed: 120, failed: 8, skipped: 2 },
    { name: 'E2E Web', passed: 45, failed: 12, skipped: 3 },
    { name: 'API Security', passed: 85, failed: 0, skipped: 5 },
  ],
  testHistory: [
    { id: 'RUN-501', suite: 'Regression Pack', environment: 'Production', duration: '12m 4s', timestamp: '2024-05-12 14:30', status: 'Passed' },
    { id: 'RUN-502', suite: 'Sanity Check', environment: 'Staging', duration: '2m 15s', timestamp: '2024-05-12 12:15', status: 'Passed' },
    { id: 'RUN-503', suite: 'Performance Load', environment: 'QA', duration: '45m 0s', timestamp: '2024-05-12 10:00', status: 'Partial' },
    { id: 'RUN-504', suite: 'API Security Scan', environment: 'Dev', duration: '5m 50s', timestamp: '2024-05-11 16:45', status: 'Failed' },
  ],
  moduleCoverage: [
    { module: 'Authentication', coverage: 92, trend: 1.2 },
    { module: 'Payment Gateway', coverage: 88, trend: 0.5 },
    { module: 'User Profile', coverage: 76, trend: -2.1 },
    { module: 'Core Engine', coverage: 95, trend: 0.0 },
    { module: 'Search Index', coverage: 62, trend: 4.5 },
  ],
  pendingActions: [
    { id: 'ACT-001', title: 'Verify BUG-103 Resolution', type: 'Review', status: 'Action Required', dueDate: '2024-05-15', priority: 'Medium' },
    { id: 'ACT-002', title: 'Execute Post-Patch Regression', type: 'Testing', status: 'Pending', dueDate: '2024-05-16', priority: 'High' },
    { id: 'ACT-003', title: 'Security Audit for v2.5', type: 'Review', status: 'Pending', dueDate: '2024-05-20', priority: 'Low' },
    { id: 'ACT-004', title: 'Hotfix Deployment for BUG-105', type: 'Deployment', status: 'Action Required', dueDate: '2024-05-14', priority: 'High' },
  ]
};
