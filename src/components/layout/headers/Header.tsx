import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/atom-examples"
            className={`text-base font-medium ${
              isActive("/atom-examples")
                ? "text-primary"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Atom 예제
          </Link>
          <Link
            to="/async-atom-examples"
            className={`text-base font-medium ${
              isActive("/async-atom-examples")
                ? "text-primary"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Async Atom 예제
          </Link>
          <Link
            to="/derived-atom-examples"
            className={`text-base font-medium ${
              isActive("/derived-atom-examples")
                ? "text-primary"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Derived Atom 예제
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
