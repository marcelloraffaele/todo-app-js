import { Link, useLocation } from 'react-router-dom';

export const NavBar = () => {
  const location = useLocation();

  return (
    <nav className="bg-blue-500 p-4 mb-8">
      <div className="container mx-auto max-w-2xl">
        <div className="flex items-center justify-center space-x-8">
          <span className="text-2xl font-bold text-white">Todo App</span>
          <Link 
            to="/" 
            className={`text-white hover:text-blue-100 font-medium px-3 py-1 rounded-md transition-colors duration-200 ${
              location.pathname === '/' ? 'bg-blue-600' : 'hover:bg-blue-600'
            }`}
          >
            Todos
          </Link>
          <Link 
            to="/about" 
            className={`text-white hover:text-blue-100 font-medium px-3 py-1 rounded-md transition-colors duration-200 ${
              location.pathname === '/about' ? 'bg-blue-600' : 'hover:bg-blue-600'
            }`}
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
};