import { Link, useNavigate } from "react-router";
import { PlusIcon, UserCircleIcon } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  // get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-between">
          {/* App name */}
          <h1 className="text-3xl font-bold text-primary font-mono tracking-tight">
            Secure Notes 
          </h1>

          <div className="flex items-center gap-4">
            {/* New Note button (existing) */}
            <Link to={"/create"} className="btn btn-primary">
              <PlusIcon className="size-5" />
              <span>New Note</span>
            </Link>

            {/* User info (NEW) */}
            {user && (
              <div className="flex items-center gap-2">
                <UserCircleIcon className="size-7 text-primary" />
                <span className="font-medium">{user.username}</span>
                <button
                  onClick={handleLogout}
                  className="btn btn-ghost btn-sm text-error"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
