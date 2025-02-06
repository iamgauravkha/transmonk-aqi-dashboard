const Navbar = ({ location }) => {
  return (
    <nav className="min-h-[70px] flex  items-center sm:items-start justify-between flex-col sm:flex-row gap-5 sm:gap-0 pt-5 sm:p-0">
      <img
        src="/logo.png"
        className="w-[160px] aspect-auto self-start sm:self-center"
        alt="logo"
      />
    </nav>
  );
};

export default Navbar;
