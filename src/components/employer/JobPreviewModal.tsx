import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { JobFormData } from "./PostJobForm";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  MapPin, 
  DollarSign, 
  Clock,
  Users,
  Building2,
  CheckCircle,
  X
} from "lucide-react";
import { motion } from "framer-motion";

interface JobPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobData: JobFormData;
  companyName?: string;
  companyLogo?: string;
}

export function JobPreviewModal({ 
  isOpen, 
  onClose, 
  jobData, 
  companyName = "Your Company",
}: JobPreviewModalProps) {
  
  const formatSalary = () => {
    if (jobData.salaryType === 'fixed' && jobData.salary) {
      return `${jobData.currency} ${parseFloat(jobData.salary).toLocaleString()}`;
    }
    if (jobData.salaryType === 'range' && jobData.salaryMin && jobData.salaryMax) {
      return `${jobData.currency} ${parseFloat(jobData.salaryMin).toLocaleString()} - ${parseFloat(jobData.salaryMax).toLocaleString()}`;
    }
    if (jobData.salaryType === 'custom') {
      return jobData.customSalaryMessage;
    }
    return 'Competitive salary';
  };
  
  const formatJobType = () => {
    const typeMap: Record<string, string> = {
      'full-time': 'Full-time',
      'part-time': 'Part-time',
      'contract': 'Contract',
      'freelance': 'Freelance',
      'internship': 'Internship',
    };
    return typeMap[jobData.jobType || ''] || jobData.jobType || 'Full-time';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] md:max-w-[90vw] lg:max-w-6xl max-h-[95vh] overflow-hidden p-0">
        <DialogTitle className="sr-only">Job Preview</DialogTitle>
        <DialogDescription className="sr-only">
          This is how job seekers will see your job posting
        </DialogDescription>
        
        <div className="flex flex-col h-full max-h-[95vh]">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 md:px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold truncate">Job Preview</h2>
              <p className="text-sm text-muted-foreground hidden sm:block">This is how job seekers will see your posting</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="flex-shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-6 py-6">
            {/* Job Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/40" />
                
                <CardContent className="p-4 md:p-6 relative">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 md:gap-6">
                    <div className="flex gap-3 md:gap-4 min-w-0">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 break-words">
                          {jobData.title || 'Job Title'}
                        </h1>
                        <p className="text-base md:text-lg text-blue-600 font-medium mb-3 md:mb-4 break-words">
                          {companyName}
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {jobData.location || 'Not specified'}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            {formatSalary()}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {formatJobType()}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            Preview mode
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                      <Button
                        disabled
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8"
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-4 md:space-y-6 min-w-0">
                {/* Job Description */}
                {jobData.description && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>About the Role</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap break-words">{jobData.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Requirements */}
                {jobData.requirements.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Requirements</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {jobData.requirements.map((requirement, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.05 * index }}
                              className="flex items-start gap-2 text-muted-foreground"
                            >
                              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                              {requirement}
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Skills */}
                {jobData.skills.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Required Skills</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {jobData.skills.map((skill, index) => (
                            <motion.div
                              key={skill}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.05 * index }}
                            >
                              <Badge 
                                variant="secondary" 
                                className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200"
                              >
                                {skill}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-4 md:space-y-6 min-w-0">
                {/* Company Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-blue-50/30" />
                    <CardHeader className="relative">
                      <CardTitle>About {companyName}</CardTitle>
                    </CardHeader>
                    <CardContent className="relative space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">{companyName}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{jobData.location || 'Remote'}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Company information will be displayed here</p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Application CTA */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/40" />
                    <CardContent className="p-6 relative text-center">
                      <h3 className="font-semibold mb-2">Ready to Apply?</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Job seekers will see this call-to-action
                      </p>
                      <Button
                        disabled
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Apply for this Position
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 z-10 bg-background/95 backdrop-blur border-t px-4 md:px-6 py-3 md:py-4 flex justify-end flex-shrink-0">
            <Button onClick={onClose}>Close Preview</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
