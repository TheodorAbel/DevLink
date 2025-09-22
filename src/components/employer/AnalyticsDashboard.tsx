import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  LabelList
} from 'recharts';
import { 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Users, 
  Briefcase,
  FileText,
  Calendar
} from "lucide-react";

// Mock data for charts
const profileViewsData = [
  { month: 'Jan', views: 450 },
  { month: 'Feb', views: 520 },
  { month: 'Mar', views: 680 },
  { month: 'Apr', views: 590 },
  { month: 'May', views: 750 },
  { month: 'Jun', views: 820 }
];

const jobViewsData = [
  { month: 'Jan', views: 1200 },
  { month: 'Feb', views: 1450 },
  { month: 'Mar', views: 1680 },
  { month: 'Apr', views: 1590 },
  { month: 'May', views: 1850 },
  { month: 'Jun', views: 2020 }
];

const applicationsPerJobData = [
  { job: 'Frontend Developer', applications: 45 },
  { job: 'Product Manager', applications: 78 },
  { job: 'UX Designer', applications: 23 },
  { job: 'Backend Engineer', applications: 56 },
  { job: 'Data Scientist', applications: 34 }
];

const sourceBreakdownData = [
  { name: 'Direct Applications', value: 35, color: '#8b5cf6' },
  { name: 'LinkedIn', value: 28, color: '#06b6d4' },
  { name: 'Indeed', value: 20, color: '#10b981' },
  { name: 'Company Website', value: 12, color: '#f59e0b' },
  { name: 'Referrals', value: 5, color: '#ef4444' }
];

const conversionFunnelData = [
  { name: 'Job Views', value: 2500, fill: '#8b5cf6' },
  { name: 'Applications', value: 236, fill: '#06b6d4' },
  { name: 'Interviews', value: 47, fill: '#10b981' },
  { name: 'Offers', value: 12, fill: '#f59e0b' },
  { name: 'Hires', value: 8, fill: '#ef4444' }
];

const statsCards = [
  {
    title: 'Total Profile Views',
    value: '4,820',
    change: 12.5,
    trend: 'up' as const,
    icon: Eye,
    period: 'this month'
  },
  {
    title: 'Job Applications',
    value: '236',
    change: 8.2,
    trend: 'up' as const,
    icon: FileText,
    period: 'this month'
  },
  {
    title: 'Active Jobs',
    value: '12',
    change: -2.1,
    trend: 'down' as const,
    icon: Briefcase,
    period: 'currently'
  },
  {
    title: 'Interviews Scheduled',
    value: '47',
    change: 15.3,
    trend: 'up' as const,
    icon: Calendar,
    period: 'this month'
  }
];

export function AnalyticsDashboard() {
  const getTrendIcon = (trend: 'up' | 'down') => {
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getTrendColor = (trend: 'up' | 'down') => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Company recruitment insights</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select defaultValue="30">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <Badge variant="outline" className="text-xs">
                    {stat.period}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  
                  <div className={`flex items-center gap-1 text-sm ${getTrendColor(stat.trend)}`}>
                    {getTrendIcon(stat.trend)}
                    <span>
                      {stat.change > 0 ? '+' : ''}{stat.change}%
                    </span>
                    <span className="text-muted-foreground text-xs">vs last period</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Company Profile Views</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={profileViewsData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Job Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Job Posting Views</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={jobViewsData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications per Job */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Applications per Job</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={applicationsPerJobData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis type="number" />
                <YAxis dataKey="job" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="applications" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Source Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Application Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sourceBreakdownData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={(props: unknown) => {
                      const p = props as { name?: string; percent?: number };
                      const name = p.name ?? '';
                      const percent = typeof p.percent === 'number' ? p.percent : 0;
                      return `${name} ${(percent * 100).toFixed(0)}%`;
                    }}
                    labelLine={false}
                  >
                    {sourceBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 space-y-2">
              {sourceBreakdownData.map((source, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: source.color }}
                    />
                    <span>{source.name}</span>
                  </div>
                  <span className="font-medium">{source.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recruitment Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={conversionFunnelData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6">
                <LabelList dataKey="value" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            {conversionFunnelData.map((stage, index) => {
              const nextStage = conversionFunnelData[index + 1];
              const conversionRate = nextStage 
                ? ((nextStage.value / stage.value) * 100).toFixed(1)
                : null;
              
              return (
                <div key={stage.name} className="space-y-1">
                  <div className="text-sm font-medium">{stage.name}</div>
                  <div className="text-2xl font-bold">{stage.value.toLocaleString()}</div>
                  {conversionRate && (
                    <div className="text-xs text-muted-foreground">
                      {conversionRate}% conversion
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Key Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Strong Performance</span>
              </div>
              <p className="text-sm text-green-700">
                Your Product Manager position has the highest application rate with 78 applications, 
                indicating strong market demand for this role.
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">High Visibility</span>
              </div>
              <p className="text-sm text-blue-700">
                Company profile views increased by 12.5% this month, suggesting improved 
                brand visibility in the job market.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Optimization Opportunity</span>
              </div>
              <p className="text-sm text-yellow-700">
                UX Designer role has fewer applications (23). Consider reviewing the job 
                description or expanding promotion channels.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-purple-800">Conversion Rate</span>
              </div>
              <p className="text-sm text-purple-700">
                Your overall conversion rate from application to hire (3.4%) is above 
                industry average, indicating effective screening processes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}