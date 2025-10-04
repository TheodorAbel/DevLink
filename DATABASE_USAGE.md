# DevLink Job Marketplace - Database Usage Guide

## 🚀 **Quick Setup**

```sql
-- Run this single file to set up your entire database:
\i schema.sql
```

---

## 📊 **Core Tables Overview**

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `users` | User accounts | `id`, `email`, `name`, `role`, `verification_status` |
| `seeker_profiles` | Seeker profile data | `user_id`, `bio`, `location`, `skills[]`, `experience[]` |
| `companies` | Employer companies | `owner_user_id`, `company_name`, `verification_status` |
| `jobs` | Job postings | `company_id`, `title`, `salary_min`, `status` |
| `applications` | Job applications | `job_id`, `seeker_user_id`, `status` |

---

## 🔐 **Authentication Flow (Preserved)**

### **User Registration Process:**
1. User signs up → Entry in `auth.users` table
2. User verifies email → `auth.users.email_confirmed_at` set
3. **Trigger fires** → User added to `public.users` with `verification_status = 'verified'`

### **Verification Status Logic:**
```sql
-- Email verification (automatic)
UPDATE users SET verification_status = 'verified', email_verified_at = NOW()
WHERE id = $user_id;

-- Manual verification (admin approval for employers)
UPDATE users SET manual_verification_status = 'verified'
WHERE id = $employer_id AND role = 'employer';
```

---

## 👤 **Seeker Profile Management**

### **Create/Update Profile:**
```sql
-- Insert or update seeker profile
INSERT INTO seeker_profiles (
  user_id, bio, location, headline, website_url, linkedin_url,
  job_types, preferred_locations, remote_preference, willing_to_relocate,
  expected_salary_min, expected_salary_max, salary_currency
) VALUES (
  $user_id, $bio, $location, $headline, $website, $linkedin,
  $job_types_array, $locations_array, $remote_pref, $relocate,
  $min_salary, $max_salary, $currency
)
ON CONFLICT (user_id) DO UPDATE SET
  bio = EXCLUDED.bio,
  location = EXCLUDED.location,
  -- ... update other fields
  updated_at = NOW();
```

### **Add Skills:**
```sql
-- Add skills to profile
INSERT INTO seeker_skills (seeker_profile_id, skill_name, proficiency_level)
SELECT sp.id, unnest($skills_array), $proficiency_level
FROM seeker_profiles sp WHERE sp.user_id = $user_id;
```

### **Add Experience:**
```sql
-- Add work experience
INSERT INTO seeker_experience (
  seeker_profile_id, job_title, company_name, location,
  employment_type, start_date, end_date, is_current, description
) VALUES (
  $profile_id, $job_title, $company, $location,
  $employment_type, $start_date, $end_date, $is_current, $description
);
```

---

## 🏢 **Employer/Company Management**

### **Create Company:**
```sql
-- Insert company record
INSERT INTO companies (
  owner_user_id, company_name, industry, company_size,
  headquarters, country, city, description, website_url
) VALUES (
  $owner_id, $company_name, $industry, $size,
  $headquarters, $country, $city, $description, $website
);
```

### **Create Job Posting:**
```sql
-- Insert job posting
INSERT INTO jobs (
  company_id, posted_by_user_id, title, location, job_type,
  salary_min, salary_max, salary_currency, description,
  requirements, responsibilities, skills_required
) VALUES (
  $company_id, $posted_by_id, $title, $location, $job_type,
  $min_salary, $max_salary, $currency, $description,
  $requirements_array, $responsibilities_array, $skills_array
);
```

---

## 💼 **Job Applications**

### **Apply for Job:**
```sql
-- Create application
INSERT INTO applications (
  job_id, seeker_user_id, cover_letter, resume_url
) VALUES (
  $job_id, $seeker_id, $cover_letter, $resume_url
);
```

### **Update Application Status:**
```sql
-- Update application status
UPDATE applications
SET status = $new_status, status_updated_at = NOW()
WHERE id = $application_id;
```

---

## 🔔 **Notifications**

### **Send Notification:**
```sql
-- Create notification
INSERT INTO notifications (
  user_id, title, message, notification_type, priority, action_url
) VALUES (
  $user_id, $title, $message, $type, $priority, $action_url
);
```

### **Mark as Read:**
```sql
-- Mark notification as read
UPDATE notifications
SET status = 'read', read_at = NOW()
WHERE id = $notification_id AND user_id = $user_id;
```

---

## 🔒 **Security & Permissions**

### **Row Level Security (RLS) Policies:**
- ✅ Users can only access their own data
- ✅ Employers can manage their company's jobs
- ✅ Seekers can view their own applications
- ✅ Proper access control for all operations

### **Storage Policies:**
- ✅ Resume uploads: Seekers can upload, employers can view for their jobs
- ✅ Company logos: Company owners/team can upload, public can view

---

## 📈 **Query Examples**

### **Get User's Complete Profile:**
```sql
-- Get user with profile data
SELECT
  u.id, u.name, u.email, u.role,
  sp.bio, sp.location, sp.headline,
  ARRAY_AGG(DISTINCT sk.skill_name) as skills,
  ARRAY_AGG(DISTINCT exp.job_title) as job_titles
FROM users u
LEFT JOIN seeker_profiles sp ON sp.user_id = u.id
LEFT JOIN seeker_skills sk ON sk.seeker_profile_id = sp.id
LEFT JOIN seeker_experience exp ON exp.seeker_profile_id = sp.id
WHERE u.id = $user_id
GROUP BY u.id, sp.id;
```

### **Get Jobs with Company Info:**
```sql
-- Get active jobs with company details
SELECT
  j.id, j.title, j.location, j.salary_min, j.salary_max,
  c.company_name, c.logo_url, c.industry
FROM jobs j
JOIN companies c ON c.id = j.company_id
WHERE j.status = 'active'
ORDER BY j.created_at DESC;
```

### **Get User's Applications:**
```sql
-- Get user's job applications with job details
SELECT
  a.id, a.status, a.applied_at,
  j.title, j.location, j.salary_min, j.salary_max,
  c.company_name
FROM applications a
JOIN jobs j ON j.id = a.job_id
JOIN companies c ON c.id = j.company_id
WHERE a.seeker_user_id = $user_id
ORDER BY a.applied_at DESC;
```

---

## 🎯 **Next Steps**

1. **✅ Database Setup Complete** - Run `schema.sql`
2. **🔄 Update Your API Calls** - Use the new table structure
3. **📝 Update Components** - Modify profile editing to use new tables
4. **🧪 Test Everything** - Verify authentication and profile management work

---

## 💡 **Key Benefits**

- **✅ Optimized Performance** - Normalized tables reduce redundancy
- **✅ Better Organization** - Profile data separated from core user data
- **✅ Scalable Design** - Easy to add new profile fields
- **✅ Maintained Security** - RLS policies protect all data
- **✅ Preserved Authentication** - Your verification system intact

Your database is now **production-ready** and **optimized** for your job marketplace! 🚀
