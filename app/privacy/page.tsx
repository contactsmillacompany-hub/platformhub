import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
        
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            We collect information you provide directly to us, such as when you create an account, 
            add projects, or contact us for support. This may include your email address and any 
            project data you choose to store.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            We use the information we collect to provide, maintain, and improve our services, 
            to communicate with you, and to protect our users.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">3. Data Security</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            We take reasonable measures to help protect your personal information from loss, 
            theft, misuse, and unauthorized access. Your data is stored securely using 
            industry-standard encryption.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">4. Your Rights</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            You may access, update, or delete your account information at any time through 
            your dashboard. If you wish to delete your account entirely, please contact us.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">5. Contact Us</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:support@example.com" className="text-violet-600 hover:underline">
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
