import ClientLogo from "@/components/brand/client";
import BrandLogo from "@/components/brand/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Coluna esquerda */}
      <div className="hidden lg:flex items-center justify-center p-10 relative overflow-hidden bg-[var(--color-surface)]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 500px at 30% 20%, rgba(0,195,173,0.20), transparent 60%), radial-gradient(900px 500px at 70% 40%, rgba(0,195,173,0.10), transparent 60%)",
          }}
        />

        <div className="relative z-10 text-center max-w-md">
          <div className="flex justify-center">
            <ClientLogo variant="symbol" />
          </div>

          <div className="flex justify-center mt-2">
            <BrandLogo />
          </div>

          <h2 className="mt-8 text-3xl font-black text-[var(--color-ink)]">
            Gestão moderna de campanhas SMS & Email
          </h2>

          <p className="mt-3 text-sm text-[var(--color-muted)]">
            Organiza contactos, cria campanhas segmentadas e acompanha resultados com clareza.
          </p>
        </div>
      </div>

      {/* Coluna direita */}
      <div className="flex items-center justify-center p-6 bg-[var(--color-bg)]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-6 flex justify-center">
            <BrandLogo />
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
