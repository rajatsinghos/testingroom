
export interface BugMetric {
  date: string;
  open: number;
  resolved: number;
}

export interface BugDetail {
  id: string;
  title: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  type: string;
  description?: string;
  reporter: string;
  assignedTo: string;
  createdAt: string;
}

export interface PerformanceMetric {
  timestamp: string;
  latency: number;
  errorRate: number;
}

export interface TestResult {
  name: string;
  passed: number;
  failed: number;
  skipped: number;
}

export interface TestHistoryEntry {
  id: string;
  suite: string;
  environment: string;
  duration: string;
  timestamp: string;
  status: 'Passed' | 'Failed' | 'Partial';
}

export interface ModuleCoverage {
  module: string;
  coverage: number;
  trend: number;
}

export interface HistoryAction {
  id: string;
  type: 'Testing' | 'Bug Fix' | 'Review' | 'Deployment';
  title: string;
  status: 'Pending' | 'Action Required' | 'Delayed';
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface DashboardData {
  summary: {
    passRate: number;
    codeCoverage: number;
    automationRate: number;
    openBugs: number;
    avgLatency: number;
  };
  bugTrends: BugMetric[];
  performance: PerformanceMetric[];
  testSuites: TestResult[];
  detailedBugs: BugDetail[];
  testHistory: TestHistoryEntry[];
  moduleCoverage: ModuleCoverage[];
  pendingActions: HistoryAction[];
}

export interface AIInsight {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
}

export type TabType = 'dashboard' | 'bugs' | 'tests' | 'performance' | 'history' | 'settings';
