import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  BarChart3,
  TrendingUp,
  Eye,
  FileText,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Star,
  Award,
  Lightbulb,
  Download
} from 'lucide-react';

import { AnimatedBackground } from './AnimatedBackground';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';

import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner';

interface AnalyticsProps {
  onBack?: () => void;
}

// Mock analytics data
const profileViewsData = [
  { name: 'Jan', views: 45, applications: 8 },
  { name: 'Feb', views: 62, applications: 12 },
  { name: 'Mar', views: 38, applications: 6 },
  { name: 'Apr', views: 71, applications: 15 },
  { name: 'May', views: 89, applications: 18 },
  { name: 'Jun', views: 95, applications: 21 },
  { name: 'Jul', views: 127, applications: 23 }
];

const applicationStatusData = [
  { name: 'Applied', value: 45, color: '#3B82F6' },
  { name: 'Interview', value: 12, color: '#10B981' },
  { name: 'Offer', value: 3, color: '#F59E0B' },
  { name: 'Rejected', value: 18, color: '#EF4444' }
];

const skillDemandData = [
  { skill: 'React', demand: 95 },
  { skill: 'TypeScript', demand: 87 },
  { skill: 'Node.js', demand: 78 },
  { skill: 'Python', demand: 82 },
  { skill: 'AWS', demand: 71 },
  { skill: 'GraphQL', demand: 64 }
];

const jobReachData = [
  { name: 'Mon', views: 12 },
  { name: 'Tue', views: 19 },
  { name: 'Wed', views: 8 },
  { name: 'Thu', views: 25 },
  { name: 'Fri', views: 22 },
  { name: 'Sat', views: 6 },
  { name: 'Sun', views: 4 }
];

const careerRecommendations = [
  {
    id: '1',
    type: 'skill',
    title: 'Learn Artificial Intelligence',
    description: 'AI skills are in high demand. Based on your background, focusing on machine learning could increase your opportunities by 40%.',
    priority: 'high',
    estimatedImpact: '+40% more opportunities',
    timeToComplete: '3-6 months'
  },
  {
    id: '2',
    type: 'certification',
    title: 'Get AWS Certified',
    description: 'Cloud certifications are valued by 89% of employers in your field. AWS certification could boost your salary potential.',
    priority: 'medium',
    estimatedImpact: '+15% salary increase',
    timeToComplete: '2-3 months'
  },
  {
    id: '3',
    type: 'networking',
    title: 'Expand Your Network',
    description: 'Professionals with 500+ LinkedIn connections get 3x more opportunities. Consider attending tech meetups.',
    priority: 'medium',
    estimatedImpact: '+200% more recruiter views',
    timeToComplete: 'Ongoing'
  },
  {
    id: '4',
    type: 'portfolio',
    title: 'Update Portfolio Projects',
    description: 'Your portfolio hasn\'t been updated in 6 months. Fresh projects could improve your profile engagement.',
    priority: 'low',
    estimatedImpact: '+25% profile views',
    timeToComplete: '2-4 weeks'
  }
];

export function Analytics({ onBack: _onBack }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState('6months');
  // reference to satisfy lint without changing UI
  void _onBack;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'skill': return <Target className="h-5 w-5" />;
      case 'certification': return <Award className="h-5 w-5" />;
      case 'networking': return <Users className="h-5 w-5" />;
      case 'portfolio': return <FileText className="h-5 w-5" />;
      default: return <Lightbulb className="h-5 w-5" />;
    }
  };

  const exportReport = () => {
    toast.success('Analytics report exported to downloads');
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground variant="particles" />
      
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Analytics & Insights
              </h1>
              <p className="text-muted-foreground mt-2">
                Track your job search performance and get personalized recommendations
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportReport} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-blue-100/30" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Profile Views</p>
                    <p className="text-2xl font-bold text-blue-600">127</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">+23%</span>
                    </div>
                  </div>
                  <Eye className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-green-100/30" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Applications</p>
                    <p className="text-2xl font-bold text-green-600">23</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">+12%</span>
                    </div>
                  </div>
                  <FileText className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-purple-100/30" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Response Rate</p>
                    <p className="text-2xl font-bold text-purple-600">34%</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-600">-5%</span>
                    </div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-orange-100/30" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Interviews</p>
                    <p className="text-2xl font-bold text-orange-600">8</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">+33%</span>
                    </div>
                  </div>
                  <Users className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Profile Views Over Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Profile Views & Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={profileViewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="views" 
                      stackId="1"
                      stroke="#3B82F6" 
                      fill="#3B82F6" 
                      fillOpacity={0.3}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="applications" 
                      stackId="2"
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Application Status Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Application Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={applicationStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {applicationStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {applicationStatusData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Job Reach This Week */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Daily Profile Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={jobReachData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Skill Demand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Your Skills vs Market Demand
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skillDemandData.map((skill, index) => (
                    <motion.div
                      key={skill.skill}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{skill.skill}</span>
                        <span>{skill.demand}% demand</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.demand}%` }}
                          transition={{ duration: 1, delay: 0.2 * index }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Career Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                AI-Powered Career Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {careerRecommendations.map((recommendation, index) => (
                  <motion.div
                    key={recommendation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="border rounded-lg p-6 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-blue-600">
                        {getRecommendationIcon(recommendation.type)}
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold">{recommendation.title}</h4>
                          <Badge 
                            variant="outline" 
                            className={getPriorityColor(recommendation.priority)}
                          >
                            {recommendation.priority} priority
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {recommendation.description}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="font-medium text-green-600">Impact:</span>
                            <p>{recommendation.estimatedImpact}</p>
                          </div>
                          <div>
                            <span className="font-medium text-blue-600">Time:</span>
                            <p>{recommendation.timeToComplete}</p>
                          </div>
                        </div>
                        
                        <Button size="sm" className="w-full">
                          Get Started
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}