import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AnimatedBackground } from './AnimatedBackground';
import { FileText, Search, Filter, Calendar, Building2, ChevronRight } from 'lucide-react';
import { useApplications, type ApplicationItem as AppItem } from '@/hooks/useApplications';

export type ApplicationItem = AppItem;

interface SeekerApplicationsProps {
  onOpenApplication: (applicationId: string) => void;
}

function statusBadge(status: ApplicationItem['status']) {
  switch (status) {
    case 'interview':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'accepted':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'rejected':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'viewed':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

export function SeekerApplications({ onOpenApplication }: SeekerApplicationsProps) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [tab, setTab] = useState<'list' | 'board'>('list');
  const { data: items = [], isLoading, error } = useApplications();

  // data is provided by hook

  const filtered = useMemo(() => {
    return items.filter((a) => {
      const text = `${a.jobTitle} ${a.company} ${a.location}`.toLowerCase();
      const matchesQ = text.includes(query.toLowerCase());
      const matchesS = status === 'all' || a.status === (status as ApplicationItem['status']);
      return matchesQ && matchesS;
    });
  }, [items, query, status]);

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground variant="gradient" />
      <div className="relative z-10 p-6 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Applications
          </h1>
          <p className="text-muted-foreground">Track the status of your job applications</p>
        </motion.div>

        <Card className="mb-6">
          <CardContent className="p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search company, role, location" className="pl-9" />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="viewed">Viewed</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> Filters</Button>
          </CardContent>
        </Card>

        <Tabs value={tab} onValueChange={(v) => setTab(v as 'list' | 'board')} className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="board">Board</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <div className="grid grid-cols-1 gap-4">
              <AnimatePresence>
                {filtered.map((app, i) => (
                  <motion.div key={app.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <Card className="relative overflow-hidden hover:shadow-lg transition cursor-pointer" onClick={() => onOpenApplication(app.jobId)}>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/10" />
                      <CardContent className="relative p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{app.jobTitle}</h3>
                            <p className="text-sm text-muted-foreground">{app.company} • {app.location}</p>
                            <div className="mt-1 text-xs text-muted-foreground flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5" /> Applied {app.appliedDate}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={statusBadge(app.status)}> {app.status} </Badge>
                          <Button variant="ghost" size="icon"><ChevronRight className="h-4 w-4" /></Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">Loading applications…</CardContent>
                </Card>
              )}
              {error && (
                <Card>
                  <CardContent className="p-8 text-center text-red-600">{String(error)}</CardContent>
                </Card>
              )}
              {!isLoading && filtered.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">No applications found</CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="board">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {(['applied','viewed','interview','accepted','rejected'] as ApplicationItem['status'][]).map((col) => (
                <Card key={col} className="min-h-[200px]">
                  <CardHeader>
                    <CardTitle className="capitalize">{col}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {filtered.filter(a => a.status === col).map(a => (
                      <Button key={a.id} variant="outline" className="w-full justify-between" onClick={() => onOpenApplication(a.jobId)}>
                        <span className="truncate text-left">{a.jobTitle}</span>
                        <FileText className="h-4 w-4" />
                      </Button>
                    ))}
                    {filtered.filter(a => a.status === col).length === 0 && (
                      <div className="text-xs text-muted-foreground">No items</div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
