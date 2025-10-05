"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Step1BasicInfo } from '../signup/components/Step1BasicInfo';
import { Step2BusinessLegitimacy } from '../signup/components/Step2BusinessLegitimacy';
import { Step3AboutCompany } from '../signup/components/Step3AboutCompany';
import { ExtravagantWaitingPage } from '../signup/components/ExtravagantWaitingPage';
import { ProgressBar } from '../signup/components/ProgressBar';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';

type Step1Data = {
  companyName: string;
  logo: File | null;
  website: string;
  industry: string;
  companySize: string;
};

// Align with Step2BusinessLegitimacy props
type Step2Data = {
  tinNumber: string;
  licenseNumber: string;
  businessLicense: File | null;
  region: string;
  cityAddress: string;
  specificAddress: string;
  phoneNumber: string;
};

// Align with ../signup/components/Step3AboutCompany
type Step3Data = {
  description: string;
  yearFounded: string;
  linkedinUrl: string;
  facebookUrl: string;
  departments: string[];
};

export default function EmployerSignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [step1Data, setStep1Data] = useState<Step1Data>({
    companyName: '',
    logo: null,
    website: '',
    industry: '',
    companySize: '',
  });

  const [step2Data, setStep2Data] = useState<Step2Data>({
    tinNumber: '',
    licenseNumber: '',
    businessLicense: null,
    region: '',
    cityAddress: '',
    specificAddress: '',
    phoneNumber: '',
  });

  const [step3Data, setStep3Data] = useState<Step3Data>({
    description: '',
    yearFounded: '',
    linkedinUrl: '',
    facebookUrl: '',
    departments: [],
  });

  const totalSteps = 3;

  const validateStep1 = () => {
    if (!step1Data.companyName.trim()) {
      toast.error('Company name is required');
      return false;
    }
    if (!step1Data.industry) {
      toast.error('Please select an industry');
      return false;
    }
    if (!step1Data.companySize) {
      toast.error('Please select company size');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!step2Data.licenseNumber.trim()) {
      toast.error('License number is required');
      return false;
    }
    if (!step2Data.tinNumber.trim()) {
      toast.error('TIN number is required');
      return false;
    }
    if (!step2Data.businessLicense) {
      toast.error('Business license document is required');
      return false;
    }
    if (!step2Data.region.trim()) {
      toast.error('Region is required');
      return false;
    }
    if (!step2Data.cityAddress.trim()) {
      toast.error('City / Sub-city / Woreda is required');
      return false;
    }
    if (!step2Data.specificAddress.trim()) {
      toast.error('Specific address / landmark is required');
      return false;
    }
    if (!step2Data.phoneNumber.trim()) {
      toast.error('Phone number is required');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!step3Data.description.trim()) {
      toast.error('Company description is required');
      return false;
    }
    if (step3Data.description.trim().length < 300) {
      toast.error('Description must be at least 300 characters');
      return false;
    }
    if (!step3Data.yearFounded) {
      toast.error('Year founded is required');
      return false;
    }
    if (!step3Data.linkedinUrl.trim()) {
      toast.error('LinkedIn company URL is required');
      return false;
    }
    if (step3Data.departments.length === 0) {
      toast.error('Select at least one hiring department');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      default:
        isValid = true;
    }

    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/signup');
    }
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        toast.error('You must be logged in to submit');
        return;
      }

      // Map wizard data -> API payload
      const payload = {
        company_name: step1Data.companyName,
        website_url: step1Data.website || null,
        industry: step1Data.industry,
        company_size: step1Data.companySize,
        founded_year: step3Data.yearFounded ? Number(step3Data.yearFounded) || null : null,
        registration_number: step2Data.licenseNumber || null,
        tax_id: step2Data.tinNumber || null,
        // Location: using Ethiopia-specific fields from step 2
        country: 'Ethiopia',
        city: step2Data.cityAddress || '',
        address: step2Data.specificAddress || null,
        contact_phone: step2Data.phoneNumber || null,
        description: step3Data.description,
        linkedin_url: step3Data.linkedinUrl || null,
        facebook_url: step3Data.facebookUrl || null,
        // Defaults for display toggles
        show_employees: true,
        show_culture: true,
        show_media: true,
        show_leadership: true,
        show_hiring: true,
        show_contacts: true,
        show_socials: true,
      } as const;

      const res = await fetch('/api/company/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const out = await res.json().catch(() => ({} as Record<string, unknown>));
      console.log('Employer signup save response:', res.status, out);
      if (!res.ok) {
        if (res.status === 409) {
          toast.error(out?.details || 'Company name already exists. Please choose a different name.');
          setCurrentStep(1);
          return;
        }
        toast.error(out?.details || out?.error || 'Failed to save company');
        return;
      }

      const companyId = out?.company_id;

      // Update user metadata with company_id for client-side access
      if (companyId) {
        try {
          await supabase.auth.updateUser({
            data: { company_id: companyId, role: 'employer' }
          });
        } catch (e) {
          console.error('Failed to update user metadata:', e);
        }
      }

      // Ensure the user role is employer in DB before redirecting
      try {
        const userId = session?.user?.id;
        if (userId) {
          const { error: roleErr } = await supabase
            .from('users')
            .update({ role: 'employer' })
            .eq('id', userId);
          if (roleErr) {
            console.error('Failed to set employer role:', roleErr);
          }
        }
      } catch (e) {
        console.error('Unexpected error setting employer role:', e);
      }

      toast.success('Company profile saved. Redirecting to dashboard...');
      router.push('/employer/dashboard');
    } catch (e: unknown) {
      console.error('Error submitting application:', e);
      const message = e instanceof Error ? e.message : 'Failed to submit application. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <ExtravagantWaitingPage
        status="pending"
        onEdit={() => setIsSubmitted(false)}
        onBack={() => router.push('/login')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        </div>

        {/* Form Steps */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Step1BasicInfo data={step1Data} onChange={setStep1Data} />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Step2BusinessLegitimacy data={step2Data} onChange={setStep2Data} />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Step3AboutCompany data={step3Data} onChange={setStep3Data} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12 pt-8 border-t">
            <button
              onClick={handleBack}
              className="px-6 py-3 text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Submit Application
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
