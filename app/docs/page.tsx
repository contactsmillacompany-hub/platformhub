import Link from "next/link";
import { ArrowLeft, BookOpen, Rocket, FolderPlus, Link as LinkIcon, Eye, Settings } from "lucide-react";

const sections = [
  {
    icon: Rocket,
    title: "Getting Started",
    content: "Sign up for a free account to start organizing your project links. Once logged in, you'll be taken to your dashboard where you can create projects and add links."
  },
  {
    icon: FolderPlus,
    title: "Creating Projects",
    content: "Projects are containers for your links. Create a project for each of your work projects, clients, or personal endeavors. Click the '+' button in the sidebar to create a new project."
  },
  {
    icon: LinkIcon,
    title: "Adding Links",
    content: "Within each project, you can add links to various platforms like GitHub, Figma, Notion, and more. Each link can have a platform name, URL, and private notes."
  },
  {
    icon: Eye,
    title: "Private Notes",
    content: "Notes are hidden by default for privacy. You can store sensitive information like passwords or API keys. Click 'Show note' to reveal the content when needed."
  },
  {
    icon: Settings,
    title: "Managing Your Data",
    content: "Edit or delete projects and links anytime using the menu options. Your selected project is remembered, so you'll always return to where you left off."
  }
];

export default function Documentation() {
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
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Documentation</h1>
            <p className="text-zinc-500">Learn how to use PlatformHub</p>
          </div>
        </div>
        
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={index} className="flex gap-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-900/30 dark:to-blue-900/30 flex items-center justify-center flex-shrink-0">
                <section.icon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {section.content}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 flex gap-4">
          <Link 
            href="/signup"
            className="flex-1 text-center px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-lg font-medium hover:from-violet-700 hover:to-blue-700 transition-all"
          >
            Get Started Free
          </Link>
          <Link 
            href="/help"
            className="flex-1 text-center px-6 py-3 border border-zinc-200 dark:border-zinc-700 rounded-lg font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
          >
            View FAQs
          </Link>
        </div>
      </div>
    </div>
  );
}
