import Link from "next/link";
import { ArrowLeft, HelpCircle, FolderOpen, Link as LinkIcon, Shield, Zap } from "lucide-react";

const faqs = [
  {
    icon: FolderOpen,
    question: "How do I create a project?",
    answer: "Click the '+' button in the sidebar on your dashboard to create a new project. Give it a name and optional description, then start adding links."
  },
  {
    icon: LinkIcon,
    question: "How do I add links to a project?",
    answer: "Select a project from the sidebar, then click 'Add Link'. Enter the platform name, URL, and optionally add private notes."
  },
  {
    icon: Shield,
    question: "Are my notes private?",
    answer: "Yes! Notes are hidden by default and only visible when you click 'Show note'. They're stored securely and only accessible to you."
  },
  {
    icon: Zap,
    question: "Can I access my links from anywhere?",
    answer: "Yes! Your data is synced to the cloud. Log in from any device to access all your projects and links."
  }
];

export default function Help() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
        
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
            <HelpCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Help Center</h1>
            <p className="text-zinc-500">Frequently asked questions</p>
          </div>
        </div>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                  <faq.icon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 p-6 bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950/30 dark:to-blue-950/30 rounded-xl border border-violet-100 dark:border-violet-900/50 text-center">
          <h3 className="font-semibold mb-2">Still need help?</h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Can't find what you're looking for? Get in touch with us.
          </p>
          <Link 
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-lg font-medium hover:from-violet-700 hover:to-blue-700 transition-all"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
