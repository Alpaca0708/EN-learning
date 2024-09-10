import Link from 'next/link';

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen ">
      <header className="bg-[#fefae0] px-1 lg:px-2 h-14 flex items-center justify-between">
        {/* header 內容 */}
        <Link className="flex items-center justify-center h-20 w-20" href="/">
          <img src="/logo2.svg" alt='Logo' />
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 px-1">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/leaderboard">
            Leaderboard
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/video">
            Video
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/about">
            About
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/contact">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-[#faedcd] flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        {/* footer 內容 */}
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 All rights reserved.</p>
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
  )
}
export default Layout;