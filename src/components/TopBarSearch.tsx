import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TopBarSearch = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form className="flex-1 max-w-xs hidden md:flex" onSubmit={handleSearch}>
      <div className="relative w-full">
        <span className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <i className="mgc_search_line text-gray-400 text-lg"></i>
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full ps-9 pe-4 py-1.5 text-sm border border-gray-200 rounded-full bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Search everything..."
        />
      </div>
    </form>
  );
};

export default TopBarSearch;
