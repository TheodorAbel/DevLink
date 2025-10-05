/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Mail, 
  Edit, 
  ArrowLeft, 
  FileCheck,
  Users,
  RefreshCw
} from 'lucide-react';

type ReviewStatus = 'pending' | 'in-review' | 'action-required' | 'approved' | 'rejected';

interface StatusConfig {
  title: string;
  subtitle: string;
  statusText: string;
  statusColor: string;
  pillColor: string;
  icon: React.ComponentType<{ className?: string }>;
  progress: number;
}

interface ExtravagantWaitingPageProps {
  status?: ReviewStatus;
  onEdit?: () => void;
  onBack?: () => void;
}

export function ExtravagantWaitingPage({ 
  status = 'pending', 
  onEdit,
  onBack 
}: ExtravagantWaitingPageProps) {
  const estimatedTime = '1h 12m';
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Progress animation UI removed to simplify and avoid unused state

  const getStatusConfig = (): StatusConfig => {
    switch (status) {
      case 'pending':
        return {
          title: 'Your company profile is under review',
          subtitle: 'Thanks — we\'ve received your submission. Our team reviews each application manually to protect job seekers from fraud.',
          statusText: 'Pending Review',
          statusColor: 'bg-blue-500',
          pillColor: 'bg-blue-100 text-blue-700',
          icon: Clock,
          progress: 25
        };
      case 'in-review':
        return {
          title: 'Review in progress',
          subtitle: 'Our verification team is currently reviewing your documents and company information.',
          statusText: 'In Review',
          statusColor: 'bg-yellow-500',
          pillColor: 'bg-yellow-100 text-yellow-700',
          icon: RefreshCw,
          progress: 50
        };
      case 'action-required':
        return {
          title: 'Action required',
          subtitle: 'We need additional information to complete your verification. Please check your email or edit your submission.',
          statusText: 'Action Required',
          statusColor: 'bg-orange-500',
          pillColor: 'bg-orange-100 text-orange-700',
          icon: AlertTriangle,
          progress: 75
        };
      case 'approved':
        return {
          title: 'Welcome aboard!',
          subtitle: 'Your company has been verified and approved. You can now post jobs and start recruiting top talent.',
          statusText: 'Approved',
          statusColor: 'bg-green-500',
          pillColor: 'bg-green-100 text-green-700',
          icon: CheckCircle,
          progress: 100
        };
      case 'rejected':
        return {
          title: 'Application requires review',
          subtitle: 'Unfortunately, we couldn\'t verify your company information. Please contact support for assistance.',
          statusText: 'Needs Review',
          statusColor: 'bg-red-500',
          pillColor: 'bg-red-100 text-red-700',
          icon: XCircle,
          progress: 0
        };
      default:
        return {
          title: 'Your company profile is under review',
          subtitle: 'Thanks — we\'ve received your submission.',
          statusText: 'Pending Review',
          statusColor: 'bg-blue-500',
          pillColor: 'bg-blue-100 text-blue-700',
          icon: Clock,
          progress: 25
        };
    }
  };

  const config: StatusConfig = getStatusConfig();
  const IconComponent = config.icon;

  if (isMobile) {
    return <MobileLayout config={config} status={status} estimatedTime={estimatedTime} onEdit={onEdit} onBack={onBack} IconComponent={IconComponent} />;
  }

  return <DesktopLayout config={config} status={status} estimatedTime={estimatedTime} onEdit={onEdit} onBack={onBack} IconComponent={IconComponent} />;
}

function MobileLayout({ config, status, estimatedTime, onEdit, onBack, IconComponent }: {
  config: StatusConfig;
  status: ReviewStatus;
  estimatedTime: string;
  onEdit?: () => void;
  onBack?: () => void;
  IconComponent: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-purple-500/15 to-blue-500/15 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 right-10 w-48 h-48 bg-gradient-to-r from-teal-500/15 to-cyan-500/15 rounded-full blur-3xl"
          animate={{
            x: [0, -25, 0],
            y: [0, 15, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          <div className="text-xs text-white/50">
            Company submission → Under review
          </div>
        </div>

        {/* 3D Animation Banner */}
        <motion.div 
          className="w-full h-48 mb-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <ThreeDCenterpiece size="mobile" />
        </motion.div>

        {/* Status Card */}
        <motion.div
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="text-center mb-6">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-4 ${config.pillColor}`}>
              <IconComponent className="w-4 h-4" />
              {config.statusText}
            </div>
            
            <h1 className="text-2xl font-semibold text-white mb-3">
              {config.title}
            </h1>
            
            <p className="text-white/70 text-sm leading-relaxed">
              {config.subtitle}
            </p>
          </div>

          {/* Progress Ring */}
          <div className="flex justify-center mb-6">
            <DonutProgress progress={config.progress} estimatedTime={estimatedTime} />
          </div>

          {/* Status Details */}
          <div className="space-y-3 text-sm">
            <motion.div 
              className="flex items-center gap-3 text-white/60 group cursor-pointer"
              whileHover={{ scale: 1.02, x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center group-hover:from-blue-500/40 group-hover:to-purple-600/40 transition-all duration-300"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <FileCheck className="w-4 h-4" />
              </motion.div>
              <div className="flex-1">
                <motion.span 
                  className="font-medium text-white/80 group-hover:text-white transition-colors"
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Manual verification of registration documents
                </motion.span>
                <div className="text-xs text-white/40 mt-1">
                  Our experts review every document for authenticity
                </div>
              </div>
              <motion.div
                className="w-2 h-2 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-3 text-white/60 group cursor-pointer"
              whileHover={{ scale: 1.02, x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-lg flex items-center justify-center group-hover:from-emerald-500/40 group-hover:to-teal-600/40 transition-all duration-300"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Users className="w-4 h-4" />
              </motion.div>
              <div className="flex-1">
                <motion.span 
                  className="font-medium text-white/80 group-hover:text-white transition-colors"
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                >
                  Quality checks to protect applicants
                </motion.span>
                <div className="text-xs text-white/40 mt-1">
                  Ensuring safe and legitimate job opportunities
                </div>
              </div>
              <motion.div
                className="w-2 h-2 bg-blue-400 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </motion.div>
          </div>

          {/* Fancy Email Notification */}
          <motion.div
            className="mt-6 p-4 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl backdrop-blur-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg"
                animate={{ 
                  boxShadow: [
                    "0 4px 14px 0 rgba(245, 158, 11, 0.2)",
                    "0 8px 25px 0 rgba(245, 158, 11, 0.4)", 
                    "0 4px 14px 0 rgba(245, 158, 11, 0.2)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Mail className="w-5 h-5 text-white" />
              </motion.div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white text-sm">
                    📧 Instant Email Notification
                  </span>
                  <motion.div
                    className="px-2 py-1 bg-yellow-400/20 text-yellow-200 text-xs rounded-full border border-yellow-400/30"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Premium
                  </motion.div>
                </div>
                <p className="text-xs text-white/60 mt-1">
                  You'll receive a beautifully crafted email the moment your company is approved
                </p>
              </div>
            </div>
          </motion.div>

          {/* Bottom Sheet Actions */}
          <motion.div
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="space-y-4">
              {status === 'approved' ? (
                <motion.button 
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-medium shadow-lg shadow-green-500/25"
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(34, 197, 94, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Go to Dashboard
                </motion.button>
              ) : (
                <motion.div className="relative overflow-hidden">
                  <motion.button 
                    className="w-full py-4 bg-gradient-to-r from-slate-700/40 to-slate-600/40 border border-white/10 text-white/70 rounded-2xl font-medium cursor-not-allowed relative backdrop-blur-sm"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <div className="relative flex items-center justify-center gap-2">
                      <motion.div
                        className="w-4 h-4 border-2 border-white/30 border-t-white/70 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                      <span>Return to Dashboard</span>
                      <motion.div
                        className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full border border-orange-500/30"
                        animate={{ 
                          scale: [1, 1.05, 1],
                          boxShadow: [
                            "0 0 0 rgba(251, 146, 60, 0)",
                            "0 0 20px rgba(251, 146, 60, 0.3)",
                            "0 0 0 rgba(251, 146, 60, 0)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Limited Access
                      </motion.div>
                    </div>
                  </motion.button>
                </motion.div>
              )}
              
              <button 
                onClick={onEdit}
                className="w-full py-4 bg-white/20 text-white rounded-2xl font-medium hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit submission
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-white/50">
                <Mail className="w-4 h-4" />
                <span>Questions? </span>
                <a href="mailto:support@yourapp.com" className="text-white hover:underline">
                  Contact support
                </a>
              </div>
            </div>
          </motion.div>

          {/* Timeline */}
          <div className="mt-6 px-2">
            <TimelineMobile />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function DesktopLayout({ config, status, estimatedTime, onEdit, onBack, IconComponent }: {
  config: StatusConfig;
  status: ReviewStatus;
  estimatedTime: string;
  onEdit?: () => void;
  onBack?: () => void;
  IconComponent: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-40 left-40 w-96 h-96 bg-gradient-to-r from-purple-500/15 to-blue-500/15 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-40 right-40 w-80 h-80 bg-gradient-to-r from-teal-500/15 to-cyan-500/15 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 25, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="text-sm text-white/50">
            Company submission → Under review
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
          {/* Left Column - 3D Animation */}
          <div className="lg:col-span-2">
            <motion.div
              className="h-96 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 flex items-center justify-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <ThreeDCenterpiece size="desktop" />
            </motion.div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-3 space-y-8 mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${config.pillColor}`}>
                <IconComponent className="w-4 h-4" />
                {config.statusText}
              </div>
              
              <h1 className="text-4xl font-semibold text-white mb-4">
                {config.title}
              </h1>
              
              <p className="text-white/70 leading-relaxed mb-8">
                {config.subtitle}
                <br /><br />
                <span className="text-sm">
                  Typical review time during business hours: 25 minutes — 3 hours (Mon–Fri).
                </span>
              </p>

              {/* Progress Ring */}
              <div className="mb-8">
                <DonutProgress progress={config.progress} estimatedTime={estimatedTime} size="lg" />
              </div>

              {/* Status Details */}
              <div className="space-y-4 mb-8 mx-auto">
                <motion.div 
                  className="flex items-center justify-center gap-3 text-white/60 group cursor-pointer"
                  whileHover={{ scale: 1.02, x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center group-hover:from-blue-500/40 group-hover:to-purple-600/40 transition-all duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <FileCheck className="w-4 h-4" />
                  </motion.div>
                  <div className="flex-1">
                    <motion.span 
                      className="font-medium text-white/80 group-hover:text-white transition-colors"
                      initial={{ opacity: 0.6 }}
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      Manual verification of registration documents
                    </motion.span>
                    <div className="text-xs text-white/40 mt-1">
                      Our experts review every document for authenticity
                    </div>
                  </div>
                  <motion.div
                    className="w-2 h-2 bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                
                <motion.div 
                  className="flex items-center justify-center gap-3 text-white/60 group cursor-pointer"
                  whileHover={{ scale: 1.02, x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-lg flex items-center justify-center group-hover:from-emerald-500/40 group-hover:to-teal-600/40 transition-all duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Users className="w-4 h-4" />
                  </motion.div>
                  <div className="flex-1">
                    <motion.span 
                      className="font-medium text-white/80 group-hover:text-white transition-colors"
                      initial={{ opacity: 0.6 }}
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 3.5, repeat: Infinity }}
                    >
                      Quality checks to protect applicants
                    </motion.span>
                    <div className="text-xs text-white/40 mt-1">
                      Ensuring safe and legitimate job opportunities
                    </div>
                  </div>
                  <motion.div
                    className="w-2 h-2 bg-blue-400 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                </motion.div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 mx-auto">
                {status === 'approved' ? (
                  <motion.button 
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-medium text-lg shadow-lg shadow-green-500/25"
                    whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(34, 197, 94, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Go to Dashboard
                  </motion.button>
                ) : (
                  <motion.div className="relative overflow-hidden">
                    <motion.button 
                      className="w-full py-4 bg-gradient-to-r from-slate-700/40 to-slate-600/40 border border-white/10 text-white/70 rounded-2xl font-medium cursor-not-allowed relative backdrop-blur-sm"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <div className="relative flex items-center justify-center gap-2">
                        <motion.div
                          className="w-4 h-4 border-2 border-white/30 border-t-white/70 rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Return to Dashboard</span>
                        <motion.div
                          className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full border border-orange-500/30"
                          animate={{ 
                            scale: [1, 1.05, 1],
                            boxShadow: [
                              "0 0 0 rgba(251, 146, 60, 0)",
                              "0 0 20px rgba(251, 146, 60, 0.3)",
                              "0 0 0 rgba(251, 146, 60, 0)"
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          Limited Access
                        </motion.div>
                      </div>
                    </motion.button>
                  </motion.div>
                )}
                
                <button 
                  onClick={onEdit}
                  className="w-full py-4 bg-white/20 text-white rounded-2xl font-medium hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-5 h-5" />
                  Edit submission
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-white/50">
                  <Mail className="w-4 h-4" />
                  <span>Questions? Email </span>
                  <a href="mailto:support@yourapp.com" className="text-white hover:underline">
                    support@yourapp.com
                  </a>
                  <span> — we typically respond within 1 business day.</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Timeline Desktop */}
        <div className="mt-16">
          <TimelineDesktop />
        </div>
      </div>
    </div>
  );
}

function ThreeDCenterpiece({ size }: { size: 'mobile' | 'desktop' }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const scale = size === 'mobile' ? 0.8 : 1.2;
  
  return (
    <div className="relative">
      <motion.div
        className="relative cursor-pointer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setShowExplanation(!showExplanation)}
        animate={{
          rotateY: isHovered ? [0, 15, 0] : [0, 360],
        }}
        transition={{
          duration: isHovered ? 2 : 20,
          repeat: isHovered ? 1 : Infinity,
          ease: isHovered ? "easeInOut" : "linear",
        }}
        whileHover={{ scale: scale * 1.1 }}
        whileTap={{ scale: scale * 0.95 }}
      >
        {/* Document */}
        <motion.div
          className="w-24 h-32 bg-gradient-to-br from-white/20 to-white/10 rounded-lg backdrop-blur-sm border border-white/20 relative overflow-hidden"
          style={{ transform: `scale(${scale})` }}
        >
          <div className="absolute inset-2 space-y-2">
            <motion.div 
              className="h-2 bg-white/30 rounded"
              animate={isHovered ? { width: ["75%", "100%", "75%"] } : {}}
              transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
            />
            <motion.div 
              className="h-2 bg-white/20 rounded"
              animate={isHovered ? { width: ["60%", "90%", "60%"] } : {}}
              transition={{ duration: 1.2, repeat: isHovered ? Infinity : 0 }}
            />
            <motion.div 
              className="h-2 bg-white/20 rounded w-3/4"
              animate={isHovered ? { width: ["50%", "75%", "50%"] } : {}}
              transition={{ duration: 0.8, repeat: isHovered ? Infinity : 0 }}
            />
          </div>
          
          {/* Scanning line effect */}
          {isHovered && (
            <motion.div
              className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"
              animate={{
                y: [-4, 128, -4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </motion.div>

        {/* Shield with interactive glow */}
        <motion.div
          className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-blue-500/40 to-purple-600/40 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center"
          style={{ transform: `scale(${scale})` }}
          animate={{
            scale: isHovered ? [scale, scale * 1.3, scale] : [scale, scale * 1.1, scale],
            boxShadow: isHovered ? 
              ["0 0 0 rgba(59, 130, 246, 0)", "0 0 30px rgba(59, 130, 246, 0.6)", "0 0 0 rgba(59, 130, 246, 0)"] :
              ["0 0 0 rgba(59, 130, 246, 0)", "0 0 15px rgba(59, 130, 246, 0.3)", "0 0 0 rgba(59, 130, 246, 0)"]
          }}
          transition={{
            duration: isHovered ? 1.5 : 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Shield className="w-6 h-6 text-white" />
        </motion.div>

        {/* Verification checkmarks */}
        {isHovered && (
          <>
            <motion.div
              className="absolute -left-6 top-4 w-6 h-6 bg-green-500/80 rounded-full flex items-center justify-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <CheckCircle className="w-4 h-4 text-white" />
            </motion.div>
            
            <motion.div
              className="absolute -right-8 bottom-4 w-6 h-6 bg-green-500/80 rounded-full flex items-center justify-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <CheckCircle className="w-4 h-4 text-white" />
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Floating particles with more interaction */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/40 rounded-full"
          style={{
            top: `${15 + i * 10}%`,
            left: `${5 + i * 11}%`,
          }}
          animate={{
            y: isHovered ? [-20, 20, -20] : [-10, 10, -10],
            opacity: isHovered ? [0.1, 1, 0.1] : [0.2, 0.8, 0.2],
            scale: isHovered ? [0.5, 1.5, 0.5] : [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2 + i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Interactive explanation overlay */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            className="absolute -top-32 left-1/2 transform -translate-x-1/2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-2xl z-10"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Why We Verify Companies</h4>
              <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                <p>
                  🛡️ <strong>Manual verification</strong> protects job seekers from fake companies and ensures only legitimate employers can post jobs.
                </p>
                <p>
                  📋 Our experts review every document for <strong>authenticity</strong> and compliance with local regulations.
                </p>
                <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-blue-900">Email Updates</span>
                  </div>
                  <p className="text-xs text-blue-800">
                    You'll receive instant email notifications for:
                    <br />• Approval confirmation with dashboard access
                    <br />• Additional document requests if needed
                    <br />• Status updates throughout the review process
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="w-3 h-3 bg-white/95 rotate-45 border-r border-b border-white/30"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Click hint */}
      {!showExplanation && (
        <motion.div
          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="relative bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 border border-white/40 shadow-lg cursor-pointer group"
            whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowExplanation(!showExplanation)}
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 bg-blue-500 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-xs font-medium text-gray-700 group-hover:text-blue-700 transition-colors">
                ✨ Learn about our process
              </span>
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="text-xs">👆</span>
              </motion.div>
            </div>
            
            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function DonutProgress({ progress, estimatedTime, size = 'md' }: { progress: number; estimatedTime: string; size?: 'md' | 'lg' }) {
  const radius = size === 'lg' ? 52 : 45;
  const stroke = size === 'lg' ? 10 : 8;
  const box = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`;

  const px = size === 'lg' ? 160 : 128; // wrapper pixel size
  const percentClass = size === 'lg' ? 'text-3xl' : 'text-2xl';
  const etaClass = size === 'lg' ? 'text-sm' : 'text-xs';

  return (
    <div className="relative mx-auto" style={{ width: px, height: px }}>
      <svg className="transform -rotate-90" width={px} height={px} viewBox={`0 0 ${box} ${box}`}>
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={stroke}
          fill="none"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6D5DF6" />
            <stop offset="100%" stopColor="#58C6FF" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className={`${percentClass} font-semibold text-white`}>{progress}%</div>
        <div className={`${etaClass} text-white/60`}>ETA: ~{estimatedTime}</div>
      </div>
    </div>
  );
}

function TimelineMobile() {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <h3 className="text-white font-medium mb-4">Review Process</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-3 h-3 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-white">Submitted</div>
            <div className="text-xs text-white/50">Today, 2:34 PM</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <RefreshCw className="w-3 h-3 text-white animate-spin" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-white">Under Review</div>
            <div className="text-xs text-white/50">In progress</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-xs text-white/50">3</span>
          </div>
          <div className="flex-1">
            <div className="text-sm text-white/50">Approved</div>
            <div className="text-xs text-white/30">Pending</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineDesktop() {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
      <h3 className="text-white font-medium mb-6 text-center">Review Timeline</h3>
      <div className="flex items-center justify-center gap-12 max-w-2xl mx-auto">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div className="text-sm text-white text-center">Submitted</div>
          <div className="text-xs text-white/50">Today, 2:34 PM</div>
        </div>
        
        <div className="flex-1 h-px bg-gradient-to-r from-green-500 to-blue-500"></div>
        
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3">
            <RefreshCw className="w-6 h-6 text-white animate-spin" />
          </div>
          <div className="text-sm text-white text-center">Under Review</div>
          <div className="text-xs text-white/50">In progress</div>
        </div>
        
        <div className="flex-1 h-px bg-white/20"></div>
        
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
            <span className="text-white/50">3</span>
          </div>
          <div className="text-sm text-white/50 text-center">Approved</div>
          <div className="text-xs text-white/30">Pending</div>
        </div>
      </div>
    </div>
  );
}