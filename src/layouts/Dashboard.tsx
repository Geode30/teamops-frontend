type DashboardLayoutProps = {
    sidebar: React.ReactNode;
    header: React.ReactNode;
    children: React.ReactNode;
};

export default function DashboardLayout({
    sidebar,
    header,
    children,
}: DashboardLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-[#121212] text-white">

            {/* HEADER - full width */}
            <header className="w-full border-b border-white/25">
                {header}
            </header>

            {/* BODY - sidebar + main */}
            <div className="flex flex-1">

                {/* SIDEBAR */}
                <aside className="w-64 border-r border-white/25 p-4">
                    {sidebar}
                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 p-6">
                    {children}
                </main>

            </div>
        </div>
    );
}