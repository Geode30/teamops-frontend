type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] px-4">
      <h2 className="text-white text-4xl font-semibold mb-[30px]">
        Team Ops
      </h2>
      {children}
    </div>
  );
}