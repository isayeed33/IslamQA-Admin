const Footer = () => {
  return (
    <footer className="footer h-16 flex items-center px-6 bg-white shadow dark:bg-gray-800">
      <div className="flex md:justify-between justify-center w-full gap-4">
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          {new Date().getFullYear()} &copy; <span className="text-primary font-medium">IslamQA</span> Admin Dashboard
        </div>
        <div className="md:flex hidden gap-4 items-center md:justify-end">
          <a href="https://islamqa.info" target="_blank" rel="noreferrer" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">Main Site</a>
          <span className="border-e border-gray-300 dark:border-gray-700 h-4"></span>
          <a href="#" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
