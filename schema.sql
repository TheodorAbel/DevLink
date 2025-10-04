-- ============================================================================
-- DevLink Job Marketplace - Complete Database Schema
-- Optimized for your authentication flow and dashboard requirements
-- ============================================================================

-- ============================================================================
-- 1. USER ROLE ENUM (Required for authentication)
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('admin', 'employer', 'seeker');
  END IF;
END $$;

-- ============================================================================
-- 2. CORE USERS TABLE (Optimized for authentication)
-- ============================================================================
-- Contains only essential fields for authentication and basic user management
-- Profile data moved to separate tables for better organization

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role public.user_role NOT NULL DEFAULT 'seeker',

  -- Single-company-per-user mapping (FK added after companies table is created)
  company_id UUID,

  -- Email verification
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMPTZ,

  -- Basic user status
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,

  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Essential indexes for authentication and queries
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_created_at ON public.users(created_at);
CREATE INDEX idx_users_company_id ON public.users(company_id);

-- ============================================================================
-- 3. SEEKER PROFILE TABLES (Normalized profile data)
-- ============================================================================

-- Main seeker profile (personal info exactly as in ProfileEdit UI)
CREATE TABLE public.seeker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  -- Personal information (ProfileEdit personal tab)
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(50),
  location VARCHAR(255),
  bio TEXT,
  website_url TEXT,
  linkedin_url TEXT,

  -- Profile completion (used for progress indicator if needed)
  profile_completion_percentage INTEGER DEFAULT 0,

  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_seeker_profiles_user_id ON public.seeker_profiles(user_id);
CREATE INDEX idx_seeker_profiles_location ON public.seeker_profiles(location);

-- Skills table (simple tags list as in UI)
CREATE TABLE public.seeker_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_profile_id UUID NOT NULL REFERENCES public.seeker_profiles(id) ON DELETE CASCADE,
  skill_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(seeker_profile_id, skill_name)
);

CREATE INDEX idx_seeker_skills_profile ON public.seeker_skills(seeker_profile_id);
CREATE INDEX idx_seeker_skills_name ON public.seeker_skills(skill_name);

-- Experience table (matches ProfileEdit experience form)
CREATE TABLE public.seeker_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_profile_id UUID NOT NULL REFERENCES public.seeker_profiles(id) ON DELETE CASCADE,
  job_title VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_seeker_experience_profile ON public.seeker_experience(seeker_profile_id);
CREATE INDEX idx_seeker_experience_dates ON public.seeker_experience(start_date, end_date);

-- Education table (matches ProfileEdit education form)
CREATE TABLE public.seeker_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_profile_id UUID NOT NULL REFERENCES public.seeker_profiles(id) ON DELETE CASCADE,
  degree VARCHAR(255) NOT NULL,
  school VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  gpa VARCHAR(50),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_seeker_education_profile ON public.seeker_education(seeker_profile_id);

-- Resume files table (matches Resume tab upload UI)
CREATE TABLE public.seeker_resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_profile_id UUID NOT NULL REFERENCES public.seeker_profiles(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type VARCHAR(50),
  is_primary BOOLEAN DEFAULT false,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_seeker_resumes_profile ON public.seeker_resumes(seeker_profile_id);

-- ============================================================================
-- 4. COMPANY/EMPLOYER TABLES
-- ============================================================================

-- Companies table (for employers)
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic company information
  company_name VARCHAR(255) UNIQUE NOT NULL,
  logo_url TEXT,
  cover_image_url TEXT,
  website_url TEXT,

  -- Company details
  industry VARCHAR(255) NOT NULL,
  company_size VARCHAR(50) NOT NULL, -- startup, small, medium, large, enterprise
  founded_year INTEGER,
  headquarters VARCHAR(255),

  -- Legal information
  registration_number VARCHAR(255),
  tax_id VARCHAR(255),

  -- Location
  country VARCHAR(100) NOT NULL,
  city VARCHAR(255) NOT NULL,
  address TEXT,

  -- Company culture and info
  tagline TEXT,
  description TEXT NOT NULL,
  culture TEXT,
  specialties TEXT[],
  benefits TEXT[],

  -- Verification and status
  verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,

  -- Business information
  registration_document_url TEXT,
  business_license_url TEXT,
  remote_policy VARCHAR(50), -- 'remote_first', 'hybrid', 'office_first'

  -- Social links
  linkedin_url TEXT,
  twitter_url TEXT,
  facebook_url TEXT,
  github_url TEXT,
  youtube_url TEXT,

  -- Contact information
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  -- Display controls (public profile toggles)
  show_employees BOOLEAN DEFAULT true,
  show_culture BOOLEAN DEFAULT true,
  show_media BOOLEAN DEFAULT true,
  show_leadership BOOLEAN DEFAULT true,
  show_hiring BOOLEAN DEFAULT true,
  show_contacts BOOLEAN DEFAULT true,
  show_socials BOOLEAN DEFAULT true,

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Profile completion
  profile_completion_percentage INTEGER DEFAULT 0,

  -- Admin/manual verification workflow
  verification_submission_at TIMESTAMPTZ,
  verification_reviewed_by UUID REFERENCES public.users(id),
  verification_review_notes TEXT,

  -- Public hiring process text (CompanyProfile.hiringProcess)
  hiring_process TEXT,

  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_companies_name ON public.companies(company_name);
CREATE INDEX idx_companies_industry ON public.companies(industry);
CREATE INDEX idx_companies_verification_status ON public.companies(verification_status);

-- Link users to companies now that companies exists
ALTER TABLE public.users
  ADD CONSTRAINT fk_users_company
  FOREIGN KEY (company_id)
  REFERENCES public.companies(id)
  ON DELETE SET NULL;

-- Company culture values (for CompanyProfile.cultureValues)
CREATE TABLE public.company_culture_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_company_culture_company ON public.company_culture_values(company_id);

-- Company leadership team (for CompanyProfile.leaders)
CREATE TABLE public.company_leaders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  photo_url TEXT,
  linkedin_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_company_leaders_company ON public.company_leaders(company_id);

-- Company media gallery (images/videos for profile)
CREATE TABLE public.company_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  media_type VARCHAR(20) NOT NULL, -- image, video
  url TEXT NOT NULL,
  title VARCHAR(255),
  thumbnail_url TEXT,
  file_size INTEGER,
  duration_seconds INTEGER,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_company_media_company ON public.company_media(company_id);

-- Job posting defaults per company (EmployerSettings.jobDefaults)
CREATE TABLE public.company_job_defaults (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID UNIQUE NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  salary_type VARCHAR(50), -- fixed, range
  remote_work VARCHAR(50), -- on-site, hybrid, remote
  currency VARCHAR(10) DEFAULT 'ETB',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company billing/payment setup (for dashboard progress step)
CREATE TABLE public.company_billing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID UNIQUE NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  billing_email VARCHAR(255),
  plan VARCHAR(50), -- free, pro, enterprise
  status VARCHAR(50) DEFAULT 'inactive', -- inactive, active, past_due, canceled
  payment_method_status VARCHAR(50), -- none, set, failed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company message templates (EmployerSettings.templates)
CREATE TABLE public.company_message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_company_templates_company ON public.company_message_templates(company_id);

-- Company verification submissions (signup/manual verification flow)
CREATE TABLE public.company_verification_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  submitted_by_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  submission_data JSONB, -- snapshot of provided company details
  document_urls TEXT[], -- additional docs beyond companies.* URLs
  notes TEXT,
  reviewed_by UUID REFERENCES public.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_company_verif_company ON public.company_verification_submissions(company_id);

-- ============================================================================
-- 5. JOB MANAGEMENT TABLES
-- ============================================================================

-- Jobs table (main job postings)
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  posted_by_user_id UUID NOT NULL REFERENCES public.users(id),

  -- Job details
  title VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  job_type VARCHAR(50) NOT NULL, -- full_time, part_time, contract, internship
  is_remote BOOLEAN DEFAULT false,
  remote_policy VARCHAR(50),

  -- Salary information
  salary_type VARCHAR(50), -- fixed, range, competitive
  salary_min INTEGER,
  salary_max INTEGER,
  salary_fixed INTEGER,
  salary_currency VARCHAR(10) DEFAULT 'ETB',
  custom_salary_message TEXT,

  -- Job content
  description TEXT NOT NULL,
  requirements TEXT[],
  responsibilities TEXT[],
  skills_required TEXT[],

  -- Application settings
  application_deadline DATE,
  application_method VARCHAR(50) NOT NULL, -- 'internal', 'external', 'email'
  application_url TEXT,
  application_email VARCHAR(255),

  -- Job status and analytics
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'closed', 'expired')),
  is_featured BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,

  -- Timestamps
  published_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_jobs_company ON public.jobs(company_id);
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_published_at ON public.jobs(published_at DESC);
CREATE INDEX idx_jobs_location ON public.jobs(location);
CREATE INDEX idx_jobs_job_type ON public.jobs(job_type);

-- Screening questions for applications
CREATE TABLE public.screening_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) NOT NULL, -- text, multiple_choice, yes_no
  options TEXT[], -- For multiple choice questions
  is_required BOOLEAN DEFAULT false,
  auto_filter BOOLEAN DEFAULT false,
  expected_answer TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_screening_questions_job ON public.screening_questions(job_id);

-- ============================================================================
-- 6. APPLICATION MANAGEMENT TABLES
-- ============================================================================

-- Job applications
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  seeker_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  -- Application content
  cover_letter TEXT,
  resume_url TEXT,
  portfolio_url TEXT,

  -- Application status and tracking
  status VARCHAR(50) DEFAULT 'applied' CHECK (status IN (
    'pending',
    'applied',
    'viewed',
    'shortlisted',
    'interview',
    'interview_scheduled',
    'accepted',
    'rejected',
    'withdrawn'
  )),
  rejection_reason TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  employer_notes TEXT,

  -- Application metadata
  is_starred BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  viewed_at TIMESTAMPTZ,
  status_updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(job_id, seeker_user_id)
);

CREATE INDEX idx_applications_job ON public.applications(job_id);
CREATE INDEX idx_applications_seeker ON public.applications(seeker_user_id);
CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_applications_applied_at ON public.applications(applied_at DESC);

-- Application screening answers
CREATE TABLE public.application_screening_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  screening_question_id UUID NOT NULL REFERENCES public.screening_questions(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL,
  selected_options TEXT[],
  passed_auto_filter BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(application_id, screening_question_id)
);

CREATE INDEX idx_screening_answers_application ON public.application_screening_answers(application_id);

-- Application timeline (status changes)
CREATE TABLE public.application_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  previous_status VARCHAR(50),
  changed_by_user_id UUID REFERENCES public.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_application_timeline_application ON public.application_timeline(application_id);

-- ============================================================================
-- 7. MESSAGING SYSTEM TABLES
-- ============================================================================

-- Conversations between users (for job-related communication)
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  participant_2_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,

  -- Conversation management
  is_archived_by_participant_1 BOOLEAN DEFAULT false,
  is_archived_by_participant_2 BOOLEAN DEFAULT false,
  last_message_at TIMESTAMPTZ,

  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(participant_1_id, participant_2_id, job_id)
);

CREATE INDEX idx_conversations_participant_1 ON public.conversations(participant_1_id);
CREATE INDEX idx_conversations_participant_2 ON public.conversations(participant_2_id);
CREATE INDEX idx_conversations_last_message ON public.conversations(last_message_at DESC);

-- Individual messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  message_content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text',
  attachment_url TEXT,
  attachment_name VARCHAR(255),
  attachment_size INTEGER,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender ON public.messages(sender_user_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

-- ============================================================================
-- 8. NOTIFICATION SYSTEM TABLES
-- ============================================================================

-- User notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR(50) NOT NULL,
  priority VARCHAR(50) DEFAULT 'medium',
  status VARCHAR(50) DEFAULT 'unread',

  -- Additional metadata
  metadata JSONB,
  action_url TEXT,
  group_id UUID,
  organization_id UUID REFERENCES public.companies(id),

  -- Expiration and cleanup
  expires_at TIMESTAMPTZ,

  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_type ON public.notifications(notification_type);
CREATE INDEX idx_notifications_status ON public.notifications(status);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- Notification preferences for users
CREATE TABLE public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  -- Category-based settings
  category_settings JSONB NOT NULL DEFAULT '{
    "job_update": {"enabled": true, "inApp": true, "email": true, "push": false},
    "application_status": {"enabled": true, "inApp": true, "email": true, "push": true},
    "system_alert": {"enabled": true, "inApp": true, "email": true, "push": false},
    "message": {"enabled": true, "inApp": true, "email": false, "push": true},
    "security": {"enabled": true, "inApp": true, "email": true, "push": true},
    "billing": {"enabled": true, "inApp": true, "email": true, "push": false},
    "feature_update": {"enabled": true, "inApp": true, "email": false, "push": false}
  }'::JSONB,

  -- Do not disturb settings
  do_not_disturb BOOLEAN DEFAULT false,
  quiet_hours_enabled BOOLEAN DEFAULT false,
  quiet_hours_start TIME,
  quiet_hours_end TIME,

  -- Notification management
  group_similar_notifications BOOLEAN DEFAULT true,
  max_daily_emails INTEGER DEFAULT 10,

  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notification_preferences_user ON public.notification_preferences(user_id);

-- ============================================================================
-- 9. SAVED JOBS (Bookmark functionality)
-- ============================================================================

CREATE TABLE public.saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  notes TEXT,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

CREATE INDEX idx_saved_jobs_user ON public.saved_jobs(user_id);
CREATE INDEX idx_saved_jobs_job ON public.saved_jobs(job_id);

-- ============================================================================
-- 10. INTERVIEW SCHEDULING
-- ============================================================================

CREATE TABLE public.interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  interview_type VARCHAR(50), -- phone, video, in_person, technical
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  location TEXT,
  meeting_link TEXT,
  interviewer_user_ids UUID[],
  status VARCHAR(50) DEFAULT 'scheduled',
  feedback TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_interviews_application ON public.interviews(application_id);
CREATE INDEX idx_interviews_scheduled_at ON public.interviews(scheduled_at);

-- ============================================================================
-- 11. ROW LEVEL SECURITY (RLS) - CRITICAL FOR SECURITY
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seeker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seeker_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seeker_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seeker_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seeker_resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_culture_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_leaders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_job_defaults ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_verification_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screening_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_screening_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 12. RLS POLICIES (Security Rules)
-- ============================================================================

-- Users can view/edit their own data
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can create own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
-- Allow Supabase Auth (service_role) to upsert users when auth.users updates (e.g., on sign-in)
CREATE POLICY "Service role can insert users" ON public.users FOR INSERT
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update users" ON public.users FOR UPDATE
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Users can manage their seeker profiles
CREATE POLICY "Users can manage own seeker profile" ON public.seeker_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view seeker profiles" ON public.seeker_profiles FOR SELECT USING (true);

-- Users can manage their skills
CREATE POLICY "Users can manage own skills" ON public.seeker_skills FOR ALL
USING (seeker_profile_id IN (SELECT id FROM public.seeker_profiles WHERE user_id = auth.uid()));

-- Users can manage their experience
CREATE POLICY "Users can manage own experience" ON public.seeker_experience FOR ALL
USING (seeker_profile_id IN (SELECT id FROM public.seeker_profiles WHERE user_id = auth.uid()));

-- Users can manage their education
CREATE POLICY "Users can manage own education" ON public.seeker_education FOR ALL
USING (seeker_profile_id IN (SELECT id FROM public.seeker_profiles WHERE user_id = auth.uid()));

-- Users can manage their resumes
CREATE POLICY "Users can manage own resumes" ON public.seeker_resumes FOR ALL
USING (seeker_profile_id IN (SELECT id FROM public.seeker_profiles WHERE user_id = auth.uid()));

-- Companies - owners and team members can manage
CREATE POLICY "User can manage their company (single-company model)" ON public.companies FOR ALL
USING (
  id = (SELECT company_id FROM public.users WHERE id = auth.uid())
);

CREATE POLICY "Anyone can view companies" ON public.companies FOR SELECT USING (is_active = true);

-- Company sub-entities (single-company model): allow manage where company_id = users.company_id
CREATE POLICY "Manage own company culture values" ON public.company_culture_values FOR ALL
USING (company_id = (SELECT company_id FROM public.users WHERE id = auth.uid()))
WITH CHECK (company_id = (SELECT company_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Manage own company leaders" ON public.company_leaders FOR ALL
USING (company_id = (SELECT company_id FROM public.users WHERE id = auth.uid()))
WITH CHECK (company_id = (SELECT company_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Manage own company media" ON public.company_media FOR ALL
USING (company_id = (SELECT company_id FROM public.users WHERE id = auth.uid()))
WITH CHECK (company_id = (SELECT company_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Manage own company job defaults" ON public.company_job_defaults FOR ALL
USING (company_id = (SELECT company_id FROM public.users WHERE id = auth.uid()))
WITH CHECK (company_id = (SELECT company_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Manage own company billing" ON public.company_billing FOR ALL
USING (company_id = (SELECT company_id FROM public.users WHERE id = auth.uid()))
WITH CHECK (company_id = (SELECT company_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Manage own company message templates" ON public.company_message_templates FOR ALL
USING (company_id = (SELECT company_id FROM public.users WHERE id = auth.uid()))
WITH CHECK (company_id = (SELECT company_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Manage own company verification submissions" ON public.company_verification_submissions FOR ALL
USING (company_id = (SELECT company_id FROM public.users WHERE id = auth.uid()))
WITH CHECK (company_id = (SELECT company_id FROM public.users WHERE id = auth.uid()));

-- Jobs - anyone can view active jobs, authorized users can manage
CREATE POLICY "Anyone can view active jobs" ON public.jobs FOR SELECT USING (status = 'active');
CREATE POLICY "Company can manage own jobs (single-company model)" ON public.jobs FOR ALL
USING (
  company_id = (SELECT company_id FROM public.users WHERE id = auth.uid())
);

-- Applications - seekers can view their own, employers can view applications to their jobs
CREATE POLICY "Seekers can view own applications" ON public.applications FOR SELECT USING (seeker_user_id = auth.uid());
CREATE POLICY "Employers can view job applications (single-company model)" ON public.applications FOR SELECT
USING (
  job_id IN (
    SELECT id FROM public.jobs WHERE company_id = (SELECT company_id FROM public.users WHERE id = auth.uid())
  )
);

-- Saved jobs - users can manage their own
CREATE POLICY "Users can manage own saved jobs" ON public.saved_jobs FOR ALL USING (user_id = auth.uid());

-- Notifications - users can view their own
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());

-- Conversations and messages (for job-related communication)
CREATE POLICY "Users can access own conversations" ON public.conversations FOR SELECT
USING (participant_1_id = auth.uid() OR participant_2_id = auth.uid());

CREATE POLICY "Users can send messages in own conversations" ON public.messages FOR INSERT
USING (
  sender_user_id = auth.uid() AND
  conversation_id IN (
    SELECT id FROM public.conversations WHERE participant_1_id = auth.uid() OR participant_2_id = auth.uid()
  )
);

-- ============================================================================
-- 13. STORAGE POLICIES (Supabase Storage Buckets)
-- ============================================================================

-- Resume files bucket
CREATE POLICY "Seeker can upload resume" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'resumes' AND
  right(name, 4) = '.pdf' AND
  auth.uid()::text = split_part(name, '_', 2)
);

CREATE POLICY "Seeker can read own resume" ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'resumes' AND
  auth.uid()::text = split_part(name, '_', 2)
);

DROP POLICY IF EXISTS "Employers can view resumes for their jobs" ON storage.objects;

CREATE POLICY "Employers can view resumes for their jobs (single-company model)" ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'resumes' AND
  EXISTS (
    SELECT 1 FROM public.applications a
    JOIN public.jobs j ON j.id = a.job_id
    WHERE j.company_id = (SELECT company_id FROM public.users WHERE id = auth.uid())
      AND a.resume_url = name
  )
);

-- Company logos and media bucket
CREATE POLICY "Company can upload logo (single-company model)" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'company-media' AND
  (right(name, 4) = '.png' OR right(name, 4) = '.jpg' OR right(name, 5) = '.jpeg' OR right(name, 4) = '.svg') AND
  name LIKE (
    (SELECT company_id::text FROM public.users WHERE id = auth.uid()) || '_%'
  )
);

CREATE POLICY "Anyone can view company media" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'company-media');

-- ============================================================================
-- 14. YOUR AUTHENTICATION TRIGGER (Preserved)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.sync_email_verification()
RETURNS TRIGGER AS $$
DECLARE
  role_text TEXT;
  name_text TEXT;
BEGIN
  -- Always sync a row into public.users on any auth.users insert/update.
  role_text := LOWER(NEW.raw_user_meta_data ->> 'role');
  name_text := NEW.raw_user_meta_data ->> 'name';

  -- Default values
  IF name_text IS NULL OR name_text = '' THEN
    name_text := 'User';
  END IF;

  INSERT INTO public.users (
    id, name, email, role,
    email_verified, email_verified_at, is_active, created_at
  )
  VALUES (
    NEW.id,
    name_text,
    NEW.email,
    COALESCE(
      CASE
        WHEN role_text IN ('admin', 'employer', 'seeker')
        THEN role_text::public.user_role
        ELSE 'seeker'::public.user_role
      END,
      'seeker'::public.user_role
    ),
    (NEW.email_confirmed_at IS NOT NULL),
    NEW.email_confirmed_at,
    true,
    COALESCE(NEW.created_at, NOW())
  )
  ON CONFLICT (id) DO UPDATE
  SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    email_verified = (NEW.email_confirmed_at IS NOT NULL),
    email_verified_at = NEW.email_confirmed_at,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 15. CREATE AUTHENTICATION TRIGGER
-- ============================================================================

CREATE TRIGGER on_auth_user_email_verified
AFTER INSERT OR UPDATE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.sync_email_verification();

-- ============================================================================
-- 16. AUTO-UPDATE TIMESTAMPS FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 17. CREATE UPDATE TRIGGERS FOR TIMESTAMPS
-- ============================================================================

-- Users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seeker profiles
CREATE TRIGGER update_seeker_profiles_updated_at BEFORE UPDATE ON public.seeker_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Experience
CREATE TRIGGER update_seeker_experience_updated_at BEFORE UPDATE ON public.seeker_experience
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Education
CREATE TRIGGER update_seeker_education_updated_at BEFORE UPDATE ON public.seeker_education
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Companies
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- Jobs
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Applications
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================
-- Your database now has:
-- ✅ Optimized users table (essential fields only)
-- ✅ Normalized profile tables (skills, experience, education, resumes)
-- ✅ Complete job marketplace functionality
-- ✅ Your authentication and verification system preserved
-- ✅ Proper security with RLS policies
-- ============================================================================
