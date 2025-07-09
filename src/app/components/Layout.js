import Link from "next/link";

function Layout({ children }) {
  return (
    <div>
      <header className="bg-[#382929] px-1 lg:px-2 h-14 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
        {/* header 內容 */}
        <Link className="flex items-center justify-center h-20 w-20" href="/">
          <img src="/logo2.svg" alt="Logo" className="w-12 h-12" />
        </Link>
        <nav className="mr-auto flex gap-4 sm:gap-6 px-1">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/leaderboard"
          >
            Home
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/series"
          >
            Series
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/about"
          >
            Movies
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/contact"
          >
            MyList
          </Link>
        </nav>
        <div className="ml-auto pr-5">Avatar</div>
      </header>
      <main className="pt-14 pb-24">{children}</main>
      <footer className="bg-[#faedcd] flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t fixed bottom-0 left-0 right-0 z-50">
        {/* footer 內容 */}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
export default Layout;
