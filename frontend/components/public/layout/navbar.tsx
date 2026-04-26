"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X, ShoppingBag, UserRound, LogIn, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/cart/use-cart";

export function Navbar() {
  const { totalItems } = useCart();
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Beranda", href: "/" },
    { name: "Produk", href: "/products" },
    { name: "Kategori", href: "/categories" },
    { name: "Jual Akun", href: "/login" },
  ];

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    const previous = scrollYProgress.getPrevious() ?? 0;
    const direction = current - previous;

    if (current < 0.03) {
      setVisible(true);
    } else {
      setVisible(direction < 0);
      if (direction > 0) setIsOpen(false);
    }
  });

  return (
    <AnimatePresence>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{
          y: visible ? 0 : -80,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.25 }}
        className="fixed left-1/2 top-5 z-50 w-[92%] max-w-6xl -translate-x-1/2"
      >
        <nav className="rounded-full border border-white/10 bg-[#070b1f]/75 px-5 py-3 text-white shadow-2xl shadow-orange-500/10 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/15 text-orange-400">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold">MLBB Market</p>
                <p className="hidden text-xs text-white/50 sm:block">
                  Premium Account
                </p>
              </div>
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/cart"
                className="relative inline-flex items-center justify-center rounded-full border border-white/10 p-2 text-white/80 hover:bg-white/10"
              >
                <ShoppingCart className="h-5 w-5" />

                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 rounded-full bg-orange-500 px-1.5 text-[10px] font-bold text-black">
                    {totalItems}
                  </span>
                )}
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600"
              >
                <UserRound className="h-4 w-4" />
                Daftar Seller
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="rounded-full border border-white/10 p-2 text-white md:hidden"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="mt-3 rounded-3xl border border-white/10 bg-[#070b1f]/95 p-3 text-white shadow-2xl backdrop-blur-xl md:hidden"
            >
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="rounded-2xl px-4 py-3 text-sm text-white/75 hover:bg-white/10 hover:text-white"
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Link
                    href="/cart"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-white/75 hover:bg-white/10 hover:text-white"
                  >
                    <span>Keranjang</span>

                    {totalItems > 0 && (
                      <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-black">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="rounded-2xl border border-white/10 px-4 py-3 text-center text-sm text-white/80"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="rounded-2xl bg-orange-500 px-4 py-3 text-center text-sm font-semibold text-white"
                  >
                    Daftar
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </AnimatePresence>
  );
}