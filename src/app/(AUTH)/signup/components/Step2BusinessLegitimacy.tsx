import { EnhancedInput } from './EnhancedInput';
import { FloatingSelect } from './FloatingSelect';
import { FileUpload } from './FileUpload';
import { CreditCard, FileText, MapPin, Phone, Building2 } from 'lucide-react';

interface Step2Data {
  tinNumber: string;
  licenseNumber: string;
  businessLicense: File | null;
  region: string;
  cityAddress: string;
  specificAddress: string;
  phoneNumber: string;
}

interface Step2BusinessLegitimacyProps {
  data: Step2Data;
  onChange: (data: Step2Data) => void;
}

const ethiopianRegions = [
  { value: 'addis-ababa', label: 'Addis Ababa' },
  { value: 'oromia', label: 'Oromia' },
  { value: 'amhara', label: 'Amhara' },
  { value: 'tigray', label: 'Tigray' },
  { value: 'snnp', label: 'Southern Nations, Nationalities, and Peoples' },
  { value: 'somali', label: 'Somali' },
  { value: 'afar', label: 'Afar' },
  { value: 'benishangul-gumuz', label: 'Benishangul-Gumuz' },
  { value: 'gambela', label: 'Gambela' },
  { value: 'harari', label: 'Harari' },
  { value: 'dire-dawa', label: 'Dire Dawa' },
];

const validateTIN = (value: string) => {
  const isValid = /^\d{10}$/.test(value);
  return {
    isValid,
    message: isValid ? undefined : 'TIN number must be exactly 10 digits'
  };
};

const validateLicense = (value: string) => {
  const isValid = value.length >= 5;
  return {
    isValid,
    message: isValid ? undefined : 'License number must be at least 5 characters'
  };
};

const validatePhone = (value: string) => {
  const isValid = /^(\+251|0)[79]\d{8}$/.test(value);
  return {
    isValid,
    message: isValid ? undefined : 'Please enter a valid Ethiopian phone number'
  };
};

export function Step2BusinessLegitimacy({ data, onChange }: Step2BusinessLegitimacyProps) {
  const updateField = (field: keyof Step2Data, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">
          Business Verification
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Help us verify your business legitimacy with official documents and contact information.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-6">
        <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-amber-900">Required Documents</h3>
              <p className="text-sm text-amber-700">
                All fields in this section are mandatory for account verification
              </p>
            </div>
          </div>
        </div>

        <EnhancedInput
          label="TIN Number"
          icon={<CreditCard className="w-5 h-5" />}
          value={data.tinNumber}
          onChange={(value) => updateField('tinNumber', value)}
          required
          validation={validateTIN}
        />

        <EnhancedInput
          label="License Number"
          icon={<FileText className="w-5 h-5" />}
          value={data.licenseNumber}
          onChange={(value) => updateField('licenseNumber', value)}
          required
          placeholder="Enter your business license number"
          validation={validateLicense}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Business License Document
            <span className="text-red-500 ml-1">*</span>
          </label>
          <p className="text-sm text-gray-500 mb-3">
            Upload a clear copy of your business license (PDF or JPG format)
          </p>
          <FileUpload
            selectedFile={data.businessLicense}
            onFileSelect={(file) => updateField('businessLicense', file)}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-600" />
            Business Address
          </h3>
          
          <FloatingSelect
            label="Region"
            value={data.region}
            onChange={(value) => updateField('region', value)}
            options={ethiopianRegions}
            required
          />

          <EnhancedInput
            label="City / Sub-city / Woreda"
            icon={<Building2 className="w-5 h-5" />}
            value={data.cityAddress}
            onChange={(value) => updateField('cityAddress', value)}
            required
            placeholder="e.g., Bole Sub-city, Woreda 03"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Specific Address / Landmark
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              value={data.specificAddress}
              onChange={(e) => updateField('specificAddress', e.target.value)}
              rows={3}
              className="w-full px-4 py-4 bg-white/60 backdrop-blur-sm border-2 border-gray-200 rounded-2xl
                       transition-all duration-300 ease-out resize-none
                       focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400
                       hover:border-gray-300 hover:shadow-lg hover:bg-white/70"
              placeholder="Street address, building name, floor number, nearby landmarks..."
              required
            />
          </div>
        </div>

        <EnhancedInput
          label="Phone Number"
          icon={<Phone className="w-5 h-5" />}
          type="tel"
          value={data.phoneNumber}
          onChange={(value) => updateField('phoneNumber', value)}
          required
          placeholder="+251 9XX XXX XXX"
          validation={validatePhone}
        />
      </div>
    </div>
  );
}