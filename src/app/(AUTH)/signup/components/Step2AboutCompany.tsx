import { FloatingInput } from './FloatingInput';
import { FloatingTextarea } from './FloatingTextarea';
import { FloatingSelect } from './FloatingSelect';

interface Step2Data {
  description: string;
  yearFounded: string;
  linkedinUrl: string;
  twitterUrl: string;
  facebookUrl: string;
  departments: string[];
}

interface Step2AboutCompanyProps {
  data: Step2Data;
  onChange: (data: Step2Data) => void;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => {
  const year = currentYear - i;
  return { value: year.toString(), label: year.toString() };
});

const departments = [
  { id: 'tech', label: 'Technology' },
  { id: 'sales', label: 'Sales' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'operations', label: 'Operations' },
  { id: 'finance', label: 'Finance' },
  { id: 'hr', label: 'Human Resources' },
  { id: 'design', label: 'Design' },
  { id: 'other', label: 'Other' },
];

export function Step2AboutCompany({ data, onChange }: Step2AboutCompanyProps) {
  const updateField = (field: keyof Step2Data, value: Step2Data[keyof Step2Data]) => {
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
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">
          Tell us about your company
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Share more details about your company culture, history, and what makes you unique.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-6">
        <FloatingTextarea
          label="Company Description"
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

        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Social Media Links</h3>
          <p className="text-sm text-gray-600 mb-4">
            Help candidates learn more about your company culture
          </p>
          
          <FloatingInput
            label="LinkedIn URL"
            type="url"
            value={data.linkedinUrl}
            onChange={(value) => updateField('linkedinUrl', value)}
            placeholder="https://linkedin.com/company/yourcompany"
          />

          <FloatingInput
            label="Twitter/X URL"
            type="url"
            value={data.twitterUrl}
            onChange={(value) => updateField('twitterUrl', value)}
            placeholder="https://twitter.com/yourcompany"
          />

          <FloatingInput
            label="Facebook URL"
            type="url"
            value={data.facebookUrl}
            onChange={(value) => updateField('facebookUrl', value)}
            placeholder="https://facebook.com/yourcompany"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">
            Departments Currently Hiring
            <span className="text-red-500 ml-1">*</span>
          </h3>
          <p className="text-sm text-gray-600">
            Select all departments that are actively recruiting
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {departments.map((dept) => (
              <label
                key={dept.id}
                className={`
                  flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200
                  border-2 bg-white/50 backdrop-blur-sm
                  ${data.departments.includes(dept.id)
                    ? 'border-blue-400 bg-blue-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <input
                  type="checkbox"
                  checked={data.departments.includes(dept.id)}
                  onChange={() => toggleDepartment(dept.id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-900">
                  {dept.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}