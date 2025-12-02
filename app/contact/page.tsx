import Link from "next/link";
import { ArrowLeft, Mail, Send, MessageCircle } from "lucide-react";

const EMAIL = "contact.smillacompany@gmail.com";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
        
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Contact Us</h1>
            <p className="text-zinc-500">We'd love to hear from you</p>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Email Card */}
          <a 
            href={`mailto:${EMAIL}?subject=PlatformHub Inquiry`}
            className="block p-6 bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950/30 dark:to-blue-950/30 rounded-xl border border-violet-100 dark:border-violet-900/50 hover:border-violet-300 dark:hover:border-violet-700 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Send className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Send us an email</h3>
                <p className="text-violet-600 dark:text-violet-400">{EMAIL}</p>
              </div>
            </div>
          </a>
          
          {/* Info */}
          <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="h-5 w-5 text-zinc-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">What to include</h3>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                  <li>• Your name and how we can help</li>
                  <li>• Any relevant details about your inquiry</li>
                  <li>• Screenshots if reporting an issue</li>
                </ul>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-zinc-500 text-center">
            We typically respond within 24-48 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
