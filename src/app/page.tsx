import Link from 'next/link'
import { Sparkles, Rocket, Users, ShieldCheck, Briefcase, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-800 to-indigo-900" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-900/30" />
      </div>

      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="relative z-10 px-6 py-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">
              DevLink
            </span>
          </Link>
        </header>

        {/* Hero */}
        <main className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-300 via-cyan-200 to-white bg-clip-text text-transparent">
                Connect developers and companies in one powerful platform
              </h1>
              <p className="text-slate-300 text-lg">
                Discover jobs, manage candidates, and grow your team faster with a modern job marketplace designed for velocity and clarity.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all group"
                >
                  Get started free
                  <Rocket className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-6 py-4 rounded-xl border border-indigo-500/40 text-indigo-200 hover:text-cyan-200 hover:border-cyan-400/50 backdrop-blur bg-slate-900/40 transition-all"
                >
                  Log in
                </Link>
              </div>

              <div className="flex items-center gap-3 text-slate-400 pt-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <span>No credit card required</span>
                <span className="opacity-50">•</span>
                <span>Cancel anytime</span>
              </div>
            </div>

            {/* Right visual card */}
            <div>
              <div className="relative backdrop-blur-xl bg-slate-900/60 rounded-2xl shadow-2xl border border-indigo-500/30 p-6 lg:p-8">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 blur-xl" />
                <div className="relative grid grid-cols-2 gap-4">
                  {[
                    { icon: Briefcase, title: 'Curated jobs', desc: 'High-quality listings from vetted companies.' },
                    { icon: Users, title: 'Smart matching', desc: 'Connect seekers to roles with precision.' },
                    { icon: Zap, title: 'Fast workflow', desc: 'Save, share, and apply in seconds.' },
                    { icon: ShieldCheck, title: 'Secure by design', desc: 'Privacy-first authentication & data.' },
                  ].map((f) => (
                    <div
                      key={f.title}
                      className="rounded-xl border border-indigo-500/20 bg-slate-900/40 p-4"
                    >
                      <f.icon className="w-6 h-6 text-cyan-300 mb-2" />
                      <div className="text-slate-200 font-semibold">{f.title}</div>
                      <div className="text-slate-400 text-sm">{f.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Social proof */}
        <section className="px-6 pb-12">
          <p className="text-center text-sm text-slate-500">
            Trusted by 10,000+ job seekers and companies
          </p>
        </section>

        {/* Footer */}
        <footer className="relative z-10 px-6 py-6">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-slate-500">
            <Link href="/terms" className="hover:text-indigo-400 transition-colors">
              Terms of Service
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/privacy" className="hover:text-indigo-400 transition-colors">
              Privacy Policy
            </Link>
            <span className="hidden sm:inline">•</span>
            <span>© 2025 DevLink. All rights reserved.</span>
          </div>
        </footer>
      </div>
    </>
  )
}