import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Smart City Glass & Grid Design System - Weather Navbar
 */
function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: "/", label: "Air Quality", icon: "🌬️" },
    { path: "/weather", label: "Weather", icon: "☀️" },
  ];

  const featureItems = [
    { path: "/wards", label: "Wards", icon: "🏙️" },
    { path: "/policy-simulator", label: "Policy Sim", icon: "🎛️" },
    { path: "/dispatch", label: "Dispatch", icon: "🚨" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white shadow-card border-b border-mist'
            : 'bg-white/80 backdrop-blur-md border-b border-mist/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm"
              >
                <span className="text-white text-lg">🌿</span>
              </motion.div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-ink">UdyanSaathi</span>
                <span className="block text-[10px] text-metal font-medium -mt-1">
                  Environmental Intelligence
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                      isActive(item.path)
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-metal hover:text-ink hover:bg-canvas'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              ))}

              <div className="w-px h-6 bg-mist mx-2" />

              {featureItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                      isActive(item.path)
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-metal hover:text-ink hover:bg-canvas'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-canvas transition-colors text-metal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-mist"
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item) => (
                  <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                    <div className={`px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-colors ${
                      isActive(item.path)
                        ? 'bg-primary text-white'
                        : 'text-ink hover:bg-canvas'
                    }`}>
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  </Link>
                ))}

                <div className="border-t border-mist my-3 pt-3">
                  {featureItems.map((item) => (
                    <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                      <div className={`px-4 py-3 rounded-xl font-medium flex items-center gap-3 mb-2 transition-colors ${
                        isActive(item.path)
                          ? 'bg-primary text-white'
                          : 'text-ink hover:bg-canvas'
                      }`}>
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}

export default Navbar;
