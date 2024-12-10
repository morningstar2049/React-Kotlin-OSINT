import { Link, Outlet, useLocation } from "react-router";
import ViteLogo from "../../public/vite.svg";
import { useState } from "react";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Scan History", path: "/scan-history" },
];

function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { pathname } = useLocation();

  return (
    <>
      <nav className="bg-gray-800 text-gray-200 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-5">
            <div className="flex items-center gap-4">
              <img src={ViteLogo} alt="logo" />
              <div className="text-lg font-bold text-indigo-300">
                OSINT Web App
              </div>
            </div>

            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <Link
                  to={item.path}
                  key={item.path}
                  className={`hover:text-purple-300 ${
                    pathname === item.path ? "text-purple-500" : "text-gray-200"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="md:hidden text-gray-200 hover:text-gray-400 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden mt-5 py-3 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  to={item.path}
                  key={item.path}
                  className={`hover:text-purple-300 ${
                    pathname === item.path ? "text-purple-500" : "text-gray-200"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
      <main className="mt-16 px-10">
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;
