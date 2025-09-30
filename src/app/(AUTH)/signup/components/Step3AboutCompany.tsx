import { EnhancedInput } from './EnhancedInput';
import { FloatingTextarea } from './FloatingTextarea';
import { FloatingSelect } from './FloatingSelect';
import { Users, Calendar, Linkedin, Facebook } from 'lucide-react';

interface Step3Data {
  description: string;
  yearFounded: string;
  linkedinUrl: string;
  facebookUrl: string;
  departments: string[];
}

interface Step3AboutCompanyProps {
  data: Step3Data;
  onChange: (data: Step3Data) => void;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => {
  const year = currentYear - i;
  return { value: year.toString(), label: year.toString() };
});

const departments = [
  { 
    id: 'tech', 
    label: 'Technology & Engineering',
    description: 'Software development, IT infrastructure, data science'
  },
  { 
    id: 'sales', 
    label: 'Sales & Business Development',
    description: 'Account management, lead generation, partnerships'
  },
  { 
    id: 'marketing', 
    label: 'Marketing & Communications',
    description: 'Digital marketing, content creation, brand management'
  },
  { 
    id: 'operations', 
    label: 'Operations & Logistics',
    description: 'Supply chain, process optimization, project management'
  },
  { 
    id: 'finance', 
    label: 'Finance & Accounting',
    description: 'Financial planning, accounting, treasury management'
  },
  { 
    id: 'hr', 
    label: 'Human Resources',
    description: 'Talent acquisition, employee relations, organizational development'
  },
  { 
    id: 'design', 
    label: 'Design & Creative',
    description: 'UI/UX design, graphic design, creative direction'
  },
  { 
    id: 'customer', 
    label: 'Customer Success',
    description: 'Customer support, success management, user experience'
  },
  { 
    id: 'other', 
    label: 'Other Departments',
    description: 'Legal, compliance, research, and specialized roles'
  },
];

const validateLinkedIn = (value: string) => {
  if (!value) return { isValid: false, message: 'LinkedIn URL is required' };
  const isValid = /^https?:\/\/(www\.)?linkedin\.com\/company\/.+/.test(value);
  return {
    isValid,
    message: isValid ? undefined : 'Please enter a valid LinkedIn company URL'
  };
};

const validateFacebook = (value: string) => {
  if (!value) return { isValid: true }; // Optional field
  const isValid = /^https?:\/\/(www\.)?facebook\.com\/.+/.test(value);
  return {
    isValid,
    message: isValid ? undefined : 'Please enter a valid Facebook page URL'
  };
};

export function Step3AboutCompany({ data, onChange }: Step3AboutCompanyProps) {
  const updateField = (field: keyof Step3Data, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const toggleDepartment = (departmentId: string) => {
    const newDepartments = data.departments.includes(departmentId)
      ? data.departments.filter(d => d !== departmentId)
      : [...data.departments, departmentId];
    
    updateField('departments', newDepartments);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">
          Tell us about your company
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Share more details about your company culture, history, and what makes you unique.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-8">
        <FloatingTextarea
          label="Company Description / Mission"
          value={data.description}
          onChange={(value) => updateField('description', value)}
          required
          minLength={300}
          maxLength={500}
          rows={5}
        />

        <FloatingSelect
          label="Year Founded"
          value={data.yearFounded}
          onChange={(value) => updateField('yearFounded', value)}
          options={years}
          required
        />

        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Linkedin className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Social Media Presence</h3>
              <p className="text-sm text-gray-600">
                Help candidates learn more about your company culture
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-700">LinkedIn Company URL</span>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Required</span>
              </div>
              <EnhancedInput
                label="LinkedIn Company URL"
                icon={<Linkedin className="w-5 h-5" />}
                type="url"
                value={data.linkedinUrl}
                onChange={(value) => updateField('linkedinUrl', value)}
                placeholder="https://linkedin.com/company/yourcompany"
                required
                validation={validateLinkedIn}
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-700">Facebook Page URL</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Optional</span>
              </div>
              <EnhancedInput
                label="Facebook Page URL"
                icon={<Facebook className="w-5 h-5" />}
                type="url"
                value={data.facebookUrl}
                onChange={(value) => updateField('facebookUrl', value)}
                placeholder="https://facebook.com/yourcompany"
                validation={validateFacebook}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                Departments Currently Hiring
                <span className="text-red-500 ml-1">*</span>
              </h3>
              <p className="text-sm text-gray-600">
                Select all departments that are actively recruiting talent
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {departments.map((dept) => (
              <label
                key={dept.id}
                className={`
                  flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
                  border bg-white/50 backdrop-blur-sm hover:shadow-md
                  ${data.departments.includes(dept.id)
                    ? 'border-blue-400 bg-blue-50/50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <input
                  type="checkbox"
                  checked={data.departments.includes(dept.id)}
                  onChange={() => toggleDepartment(dept.id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors mt-0.5 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-900 block">
                    {dept.label}
                  </span>
                  <p className="text-xs text-gray-500 mt-1 leading-tight">
                    {dept.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}