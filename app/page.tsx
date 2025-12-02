import Link from "next/link";
import { ArrowRight, Link as LinkIcon, FolderOpen, Zap, Layers, Search, Shield, Sparkles, Check } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        {/* Colorful background gradients */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-violet-200/60 via-purple-100/40 to-transparent dark:from-violet-900/20 dark:via-purple-900/10 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-gradient-to-bl from-blue-200/50 via-cyan-100/30 to-transparent dark:from-blue-900/20 dark:via-cyan-900/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-rose-100/40 via-orange-50/20 to-transparent dark:from-rose-900/10 dark:via-orange-900/5 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-100 to-blue-100 dark:from-violet-900/40 dark:to-blue-900/40 text-violet-700 dark:text-violet-300 text-sm mb-8 border border-violet-200/50 dark:border-violet-700/50">
            <Sparkles className="h-3.5 w-3.5 text-violet-500" />
            <span>Simple. Organized. Powerful.</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight leading-[1.1]">
            All your project links
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 dark:from-violet-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">in one place</span>
          </h1>
          
          <p className="mt-6 md:mt-8 text-base sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed px-4">
            Stop searching through bookmarks and notes. PlatformHub keeps all your project resources organized, accessible, and beautiful.
          </p>
          
          <div className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-violet-500/25 cursor-pointer"
            >
              Get started free
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium transition-colors border border-zinc-200 dark:border-zinc-700 rounded-xl hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-white/50 dark:hover:bg-zinc-800/50 backdrop-blur-sm cursor-pointer"
            >
              Sign in to your account
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 md:mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span>Setup in seconds</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 md:py-28 overflow-hidden">
        {/* Subtle background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-violet-50/30 to-white dark:from-zinc-950 dark:via-violet-950/10 dark:to-zinc-950" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium uppercase tracking-wider mb-4">
              Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-100">
              Everything you need to stay organized
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Simple, powerful tools designed to help you manage your projects effortlessly
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group p-6 rounded-2xl bg-white dark:bg-zinc-900/80 border border-violet-100 dark:border-violet-900/30 hover:border-violet-200 dark:hover:border-violet-800/50 transition-all hover:shadow-xl hover:shadow-violet-100/50 dark:hover:shadow-violet-900/20">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-violet-500/30">
                <FolderOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Project Organization
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Create projects and organize all related links, resources, and notes in one place.
              </p>
            </div>
            
            <div className="group p-6 rounded-2xl bg-white dark:bg-zinc-900/80 border border-blue-100 dark:border-blue-900/30 hover:border-blue-200 dark:hover:border-blue-800/50 transition-all hover:shadow-xl hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                <LinkIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Smart Links
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Automatic platform detection for GitHub, Figma, Notion, and 30+ more services.
              </p>
            </div>
            
            <div className="group p-6 rounded-2xl bg-white dark:bg-zinc-900/80 border border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-200 dark:hover:border-emerald-800/50 transition-all hover:shadow-xl hover:shadow-emerald-100/50 dark:hover:shadow-emerald-900/20">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/30">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Quick Search
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Find any project or link instantly with powerful search functionality.
              </p>
            </div>
            
            <div className="group p-6 rounded-2xl bg-white dark:bg-zinc-900/80 border border-orange-100 dark:border-orange-900/30 hover:border-orange-200 dark:hover:border-orange-800/50 transition-all hover:shadow-xl hover:shadow-orange-100/50 dark:hover:shadow-orange-900/20">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/30">
                <Layers className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Clean Design
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Minimal, distraction-free interface that helps you focus on what matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="relative rounded-3xl bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-600 p-8 sm:p-12 md:p-16 text-center overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            </div>
            
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-4">
                Ready to get organized?
              </h2>
              <p className="text-white/80 mb-8 max-w-lg mx-auto">
                Join thousands of developers and designers who use PlatformHub to manage their projects.
              </p>
              <a
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-zinc-100 text-violet-700 rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-black/10 cursor-pointer relative z-20"
              >
                Start for free
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-200/50 dark:border-zinc-800/50 bg-gradient-to-b from-zinc-50 to-zinc-100/50 dark:from-zinc-900/50 dark:to-zinc-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main footer content */}
          <div className="py-12 md:py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">PlatformHub</span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Keep all your project links organized and accessible in one beautiful place.
              </p>
            </div>
            
            {/* Product */}
            <div>
              <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-4">Product</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/signup" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Features */}
            <div>
              <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-4">Features</h4>
              <ul className="space-y-3">
                <li className="text-sm text-zinc-500 dark:text-zinc-400">Project Management</li>
                <li className="text-sm text-zinc-500 dark:text-zinc-400">Link Organization</li>
                <li className="text-sm text-zinc-500 dark:text-zinc-400">Quick Search</li>
                <li className="text-sm text-zinc-500 dark:text-zinc-400">Platform Detection</li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-4">Support</h4>
              <ul className="space-y-3">
                <li className="text-sm text-zinc-500 dark:text-zinc-400">Documentation</li>
                <li className="text-sm text-zinc-500 dark:text-zinc-400">Help Center</li>
                <li className="text-sm text-zinc-500 dark:text-zinc-400">Contact Us</li>
                <li className="text-sm text-zinc-500 dark:text-zinc-400">Privacy Policy</li>
              </ul>
            </div>
          </div>
          
          {/* Bottom bar */}
          <div className="py-6 border-t border-zinc-200/50 dark:border-zinc-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-400">
              © {new Date().getFullYear()} PlatformHub. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
