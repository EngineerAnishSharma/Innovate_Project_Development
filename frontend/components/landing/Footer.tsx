import { Facebook, Twitter, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-emerald-50 dark:bg-black py-8 border-t border-emerald-200 dark:border-emerald-500/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-emerald-600 dark:text-emerald-400 mb-4 md:mb-0">&copy; 2025 TruthLens. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors">
              <Facebook />
            </a>
            <a href="#" className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors">
              <Twitter />
            </a>
            <a href="#" className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors">
              <Instagram />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

