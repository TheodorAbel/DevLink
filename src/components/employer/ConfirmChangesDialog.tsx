import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CheckCircle2, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmChangesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  changes: string[];
  isLoading?: boolean;
}

export function ConfirmChangesDialog({
  isOpen,
  onClose,
  onConfirm,
  changes,
  isLoading = false,
}: ConfirmChangesDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-2xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
        <AlertDialogHeader className="sr-only">
          <AlertDialogTitle>Confirm Your Changes</AlertDialogTitle>
        </AlertDialogHeader>
        {/* Header with gradient - Fixed at top */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Confirm Your Changes</h2>
              <p className="text-white/90 text-sm">
                Review the modifications before saving
              </p>
            </div>
          </div>
        </div>

        {/* Changes List - Scrollable area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
          <div className="flex items-center justify-between flex-shrink-0">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Summary of Changes
            </h3>
            <Badge variant="secondary" className="bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200">
              {changes.length} {changes.length === 1 ? 'Change' : 'Changes'}
            </Badge>
          </div>

          {/* Animated Changes List */}
          <div className="space-y-2">
            {changes.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <p className="text-sm">No changes detected. The job will be updated with current values.</p>
              </div>
            ) : (
            <AnimatePresence>
              {changes.map((change, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative"
                >
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-transparent hover:border-amber-300 dark:hover:border-amber-800">
                    <div className="h-6 w-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-900 dark:text-amber-200" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-relaxed break-words">
                        {change.includes('→') ? (
                          <span className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium">{change.split('→')[0].trim()}</span>
                            <ArrowRight className="h-3 w-3 text-amber-700 dark:text-amber-300 flex-shrink-0" />
                            <span className="text-orange-700 dark:text-orange-300 font-medium">
                              {change.split('→')[1].trim()}
                            </span>
                          </span>
                        ) : (
                          <span className="font-medium text-foreground">{change}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            )}
          </div>

          {/* Warning Message */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 rounded-lg">
            <AlertCircle className="h-5 w-5 text-amber-700 dark:text-amber-300 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                This action will update the live job posting
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-200 mt-1">
                Changes will be visible to all job seekers immediately after confirmation.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions - Fixed at bottom */}
        <div className="bg-muted/30 px-6 py-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 sm:justify-between border-t flex-shrink-0">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="hover:bg-background order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg shadow-orange-600/30 font-semibold order-1 sm:order-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirm & Save Changes
              </>
            )}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
