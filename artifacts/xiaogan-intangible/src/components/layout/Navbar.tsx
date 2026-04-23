import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";

const navItems = [
  { path: "/", label: "首页" },
  { path: "/museum", label: "数字馆" },
  { path: "/culture", label: "孝文化" },
  { path: "/artisans", label: "传承人" },
  { path: "/market", label: "文创市集" },
  { path: "/ai-studio", label: "AI工坊" },
  { path: "/quiz", label: "互动闯关" },
  { path: "/activities", label: "活动" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 flex items-center justify-center bg-primary rounded-lg overflow-hidden group-hover:shadow-lg transition-all duration-300">
              <span className="text-primary-foreground font-serif font-bold text-xl relative z-10">孝</span>
              <div className="absolute inset-0 bg-accent/20 rotate-45 group-hover:rotate-90 transition-transform duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl text-primary tracking-widest">孝感非遗</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Xiaogan Heritage</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <NavItem key={item.path} {...item} />
            ))}
          </nav>

          <button 
            className="md:hidden p-2 text-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        className="md:hidden overflow-hidden bg-background border-b border-primary/10"
      >
        <div className="px-4 py-6 flex flex-col gap-4">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 font-medium text-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </motion.div>
    </header>
  );
}

function NavItem({ path, label }: { path: string; label: string }) {
  const [isActive] = useRoute(path);
  
  return (
    <Link 
      href={path} 
      className={clsx(
        "relative font-medium text-sm transition-colors py-2",
        isActive ? "text-primary font-bold" : "text-foreground hover:text-primary"
      )}
    >
      {label}
      {isActive && (
        <motion.div 
          layoutId="navbar-indicator"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </Link>
  );
}
