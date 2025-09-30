import { EnhancedInput } from './EnhancedInput';
import { FloatingSelect } from './FloatingSelect';
import { FileUpload } from './FileUpload';
import { Building2, Globe, Upload } from 'lucide-react';

interface Step1Data {
  companyName: string;
  logo: File | null;
  website: string;
  industry: string;
  companySize: string;
}

interface Step1BasicInfoProps {
  data: Step1Data;
  onChange: (data: Step1Data) => void;
}

const industries = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
  { value: 'retail', label: 'Retail' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'media', label: 'Media & Entertainment' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'other', label: 'Other' },
];

const companySizes = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '200+', label: '200+ employees' },
];

const validateWebsite = (value: string) => {
  if (!value) return { isValid: true }; // Optional field
  const isValid = /^https?:\/\/.+\..+/.test(value);
  return {
    isValid,
    message: isValid ? undefined : 'Website must start with http:// or https://'
  };
};

export function Step1BasicInfo({ data, onChange }: Step1BasicInfoProps) {
  const updateField = (field: keyof Step1Data, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">
          Let's start with the basics
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Tell us about your company so we can create the perfect profile for attracting top talent.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-6">
        <EnhancedInput
          label="Company Name"
          icon={<Building2 className="w-5 h-5" />}
          value={data.companyName}
          onChange={(value) => updateField('companyName', value)}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Company Logo
          </label>
          <FileUpload
            selectedFile={data.logo}
            onFileSelect={(file) => updateField('logo', file)}
          />
        </div>

        <EnhancedInput
          label="Website URL"
          icon={<Globe className="w-5 h-5" />}
          type="url"
          value={data.website}
          onChange={(value) => updateField('website', value)}
          placeholder="https://www.yourcompany.com"
          validation={validateWebsite}
        />

        <FloatingSelect
          label="Industry / Sector"
          value={data.industry}
          onChange={(value) => updateField('industry', value)}
          options={industries}
          required
        />

        <FloatingSelect
          label="Company Size"
          value={data.companySize}
          onChange={(value) => updateField('companySize', value)}
          options={companySizes}
          required
        />
      </div>
    </div>
  );
}