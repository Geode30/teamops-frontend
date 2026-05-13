"use client";

import { useState } from "react";

type DashboardLayoutProps = {
    sidebar: React.ReactNode;
    header: (props: {
        openMobileMenu: () => void;
    }) => React.ReactNode;
    children: React.ReactNode;
};

export default function DashboardLayout({
    sidebar,
    header,
    children,
}: DashboardLayoutProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="h-screen flex flex-col bg-[#121212] text-white overflow-hidden">

            {/* DESKTOP HEADER */}
            <header className="w-full shrink-0 border-b border-white/25">
                {header({
                    openMobileMenu: () => setMobileMenuOpen(true),
                })}

            </header>

            {/* BODY */}
            <div className="flex flex-1 min-h-0">

                {/* DESKTOP SIDEBAR */}
                <aside className="hidden md:block w-64 border-r border-white/25 p-4 shrink-0">
                    {sidebar}
                </aside>

                {/* MOBILE SIDEBAR OVERLAY */}
                {mobileMenuOpen && (
                    <>
                        {/* BACKDROP */}
                        <div
                            className="fixed inset-0 bg-black/50 z-40 md:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        {/* DRAWER */}
                        <aside className="fixed top-0 left-0 h-full w-64 bg-[#121212] border-r border-white/25 p-4 z-50 md:hidden">
                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-xl"
                                >
                                    ✕
                                </button>
                            </div>

                            {sidebar}
                        </aside>
                    </>
                )}

                {/* MAIN CONTENT */}
                <main className="flex-1 p-4 md:p-6 min-h-0 overflow-auto">
                    {children}
                </main>

            </div>
        </div>
    );
}