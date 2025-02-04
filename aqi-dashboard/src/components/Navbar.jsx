const Navbar = ({ location }) => {
  return (
    <nav className="h-[70px] flex items-start justify-between ">
      <img
        src="/logo.png"
        className="w-[160px] aspect-auto  self-center"
        alt="logo"
      />
      <div className="text-xl text-gray-800 w-[250px] rounded-b-2xl p-2 flex items-center justify-center bg-white font-m">
        {location}
      </div>
    </nav>
  );
};

export default Navbar;
