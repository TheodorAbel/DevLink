import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ArrowLeft,
  MapPin, 
  DollarSign, 
  Calendar,
  Clock,
  Building2,
  MessageSquare,
  CheckCircle,
  FileText,
  User
} from 'lucide-react';
import { AnimatedBackground } from './AnimatedBackground';
import { supabase } from '@/lib/supabaseClient';
// (avatars not used in this component)
import { toast } from 'sonner';

interface ApplicationDetailProps {
  onBack: () => void;
  jobId: string;
  showMessages?: boolean;
}

type LoadedApp = {
  id: string;
  status: string;
  created_at: string;
  coverLetter?: string | null;
  resumeUrl?: string | null;
}

type LoadedJob = {
  title: string;
  company: string;
  location: string | null;
  salary?: string;
  type?: string;
}

export function ApplicationDetail({ onBack, jobId, showMessages = false }: ApplicationDetailProps) {
  const [app, setApp] = useState<LoadedApp | null>(null);
  const [job, setJob] = useState<LoadedJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        if (!token) throw new Error('Unauthorized');
        const res = await fetch(`/api/applications?jobId=${encodeURIComponent(jobId)}`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error('Failed to load application');
        const j = await res.json();
        const loaded: LoadedApp = {
          id: j.id,
          status: j.status,
          created_at: j.created_at || new Date().toISOString(),
          coverLetter: j.coverLetter,
          resumeUrl: j.resumeUrl,
        };
        if (mounted) setApp(loaded);
        // Load job info
        const { data: jobRow } = await supabase
          .from('jobs')
          .select('title, job_type, salary_type, salary_min, salary_max, salary_fixed, salary_currency, custom_salary_message, location, companies:company_id ( company_name )')
          .eq('id', jobId)
          .maybeSingle();
        if (mounted) {
          let salary = 'Competitive';
          if (jobRow?.salary_type === 'range' && jobRow?.salary_min && jobRow?.salary_max) {
            salary = `${jobRow.salary_currency || 'ETB'} ${jobRow.salary_min} - ${jobRow.salary_max}`;
          } else if (jobRow?.salary_type === 'fixed' && jobRow?.salary_fixed) {
            salary = `${jobRow.salary_currency || 'ETB'} ${jobRow.salary_fixed}`;
          } else if (jobRow?.custom_salary_message) {
            salary = jobRow.custom_salary_message;
          }
          const typeMap: Record<string, string> = { full_time: 'Full-time', part_time: 'Part-time', contract: 'Contract', internship: 'Internship' };
          setJob({
            title: jobRow?.title || 'Job',
            company: (jobRow && typeof jobRow === 'object' && 'companies' in jobRow && (jobRow as { companies?: { company_name?: string } | null }).companies?.company_name) || 'Company',
            location: jobRow?.location || '—',
            salary,
            type: typeMap[jobRow?.job_type || ''] || jobRow?.job_type || 'Full-time',
          });
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed to load application';
        if (mounted) setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, [jobId]);

  const getStatusColor = (status: string, completed: boolean, current: boolean) => {
    if (current) return 'text-blue-600 bg-blue-100 border-blue-300';
    if (completed) return 'text-green-600 bg-green-100 border-green-300';
    return 'text-gray-400 bg-gray-100 border-gray-300';
  };

  const getStatusIcon = (status: string, completed: boolean, current: boolean) => {
    if (completed || current) {
      return <CheckCircle className="w-6 h-6" />;
    }
    return <Clock className="w-6 h-6" />;
  };

  // Quick action handlers removed (unused)

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <AnimatedBackground variant="gradient" />
        <div className="relative z-10 p-6 max-w-6xl mx-auto">
          <div className="h-10 w-40 bg-gray-100 animate-pulse rounded mb-4" />
          <div className="h-32 w-full bg-gray-100 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (error || !app || !job) {
    return (
      <div className="min-h-screen relative">
        <AnimatedBackground variant="gradient" />
        <div className="relative z-10 p-6 max-w-6xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="mb-4">Back</Button>
          <Card><CardContent className="p-6 text-red-600">{error || 'Application not found'}</CardContent></Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground variant="gradient" />
      
      <div className="relative z-10 p-6 max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="hover:bg-white/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Button>
        </motion.div>

        {/* Application Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/40" />
            
            <CardContent className="p-6 relative">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                  
                  <div className="flex-1">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {job.title}
                    </h1>
                    <p className="text-lg text-blue-600 font-medium mb-4">{job.company}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        {job.salary}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Applied {new Date(app.created_at).toDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <Badge 
                    variant="outline" 
                    className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2"
                  >
                    Status: {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Application Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      { status: 'submitted', label: 'Application Submitted', date: new Date(app.created_at).toDateString(), time: '', completed: true, description: 'Your application was submitted.' },
                      { status: app.status, label: 'Current Status', date: '', time: '', completed: true, description: `Status is ${app.status}.` },
                    ].map((step, index) => (
                      <motion.div
                        key={step.status}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="relative flex items-start gap-4"
                      >
                        {/* Timeline line */}
                        {index < 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200" />
                        )}
                        
                        {/* Status icon */}
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${getStatusColor(step.status, step.completed as boolean, false)}`}
                        >
                          {getStatusIcon(step.status, step.completed as boolean, false)}
                        </motion.div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                              {step.label}
                            </h4>
                            {step.date && (
                              <span className="text-sm text-muted-foreground">
                                {step.date} {step.time}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Messages (optional, default hidden; messaging has its own page) */}
            {showMessages && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" /> Messages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">No messages yet.</div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-yellow-50/30" />
                <CardHeader className="relative">
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => toast.success('Opening messaging...')}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => toast.success('Withdrawing application...')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Withdraw Application
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => toast.success('Updating application...')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Update Application
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}