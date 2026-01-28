const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Copyright */}
          <div className="mb-6 md:mb-0">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Portfolio
            </div>
            <p className="text-gray-400">
              © {currentYear} John Doe. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-6 md:mb-0">
            <a
              href="#home"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              Home
            </a>
            <a
              href="#skills"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              Skills
            </a>
            <a
              href="#projects"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              Projects
            </a>
            <a
              href="#experience"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              Experience
            </a>
            <a
              href="#contact"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              Contact
            </a>
          </div>

          {/* Back to Top */}
          <a
            href="#home"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Back to Top ↑
          </a>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>
            Built with Next.js, Tailwind CSS, and Material Design principles.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
