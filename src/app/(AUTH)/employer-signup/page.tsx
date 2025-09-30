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

type Step1Data = {
  companyName: string;
  logo: File | null;
  website: string;
  industry: string;
  companySize: string;
};

type Step2Data = {
  registrationNumber: string;
  taxId: string;
  registrationDocument: File | null;
  businessLicense: File | null;
  country: string;
  city: string;
  address: string;
};

type Step3Data = {
  description: string;
  foundedYear: string;
  headquarters: string;
  specialties: string[];
  benefits: string[];
  culture: string;
  socialLinks: {
    linkedin: string;
    twitter: string;
    facebook: string;
  };
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
    registrationNumber: '',
    taxId: '',
    registrationDocument: null,
    businessLicense: null,
    country: '',
    city: '',
    address: '',
  });

  const [step3Data, setStep3Data] = useState<Step3Data>({
    description: '',
    foundedYear: '',
    headquarters: '',
    specialties: [],
    benefits: [],
    culture: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      facebook: '',
    },
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
    if (!step2Data.registrationNumber.trim()) {
      toast.error('Registration number is required');
      return false;
    }
    if (!step2Data.country.trim()) {
      toast.error('Country is required');
      return false;
    }
    if (!step2Data.city.trim()) {
      toast.error('City is required');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!step3Data.description.trim()) {
      toast.error('Company description is required');
      return false;
    }
    if (step3Data.description.trim().length < 50) {
      toast.error('Description must be at least 50 characters');
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
      // TODO: Send data to your backend/Supabase
      const formData = new FormData();
      
      // Step 1 data
      formData.append('companyName', step1Data.companyName);
      formData.append('website', step1Data.website);
      formData.append('industry', step1Data.industry);
      formData.append('companySize', step1Data.companySize);
      if (step1Data.logo) formData.append('logo', step1Data.logo);

      // Step 2 data
      formData.append('registrationNumber', step2Data.registrationNumber);
      formData.append('taxId', step2Data.taxId);
      formData.append('country', step2Data.country);
      formData.append('city', step2Data.city);
      formData.append('address', step2Data.address);
      if (step2Data.registrationDocument) formData.append('registrationDocument', step2Data.registrationDocument);
      if (step2Data.businessLicense) formData.append('businessLicense', step2Data.businessLicense);

      // Step 3 data
      formData.append('description', step3Data.description);
      formData.append('foundedYear', step3Data.foundedYear);
      formData.append('headquarters', step3Data.headquarters);
      formData.append('specialties', JSON.stringify(step3Data.specialties));
      formData.append('benefits', JSON.stringify(step3Data.benefits));
      formData.append('culture', step3Data.culture);
      formData.append('socialLinks', JSON.stringify(step3Data.socialLinks));

      // TODO: Replace with your actual API endpoint
      // const response = await fetch('/api/employer-profile', {
      //   method: 'POST',
      //   body: formData,
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success('Application submitted successfully!');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <ExtravagantWaitingPage
        status="pending"
        companyName={step1Data.companyName}
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
