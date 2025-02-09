import { MdOutlineShareLocation } from "react-icons/md";

const Navbar = ({ location }) => {
  return (
    <nav className="min-h-[70px] flex  items-center sm:items-start justify-between flex-col sm:flex-row gap-5 sm:gap-0 pt-5 sm:p-0">
      <img
        src="/logo.png"
        className="w-[160px] aspect-auto self-start sm:self-center"
        alt="logo"
      />
      <div className="text-xl text-gray-800 w-[250px] rounded-b-2xl p-2 flex items-center gap-5 justify-center bg-white font-m">
        <MdOutlineShareLocation className="text-blue-500 text-2xl" />
        {location ? (
          location
        ) : (
          <span className="text-sm">Fetching location...</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
