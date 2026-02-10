"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/lib/auth.store";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast("error", "Preencha todos os campos");
      return;
    }
    setLoading(true);
    try {
      const { access_token } = await authService.login({
        username: formData.username,
        password: formData.password,
      });
      // Fetch user profile
      localStorage.setItem("simbu_token", access_token);
      const user = await authService.me();
      if (user.activo !== 1) {
        localStorage.removeItem("simbu_token");
        toast("error", "A sua conta esta desactivada. Contacte o administrador.");
        return;
      }
      setAuth(user, access_token);
      toast("success", "Login efectuado com sucesso!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
        || "Utilizador ou senha incorrectos";
      toast("error", typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface rounded-2xl shadow-xl p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-ink mb-2">Bem-vindo</h1>
        <p className="text-muted">Entre na sua conta para continuar</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-semibold text-ink mb-1.5">
            Nome de utilizador
          </label>
          <input
            id="username"
            type="text"
            required
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full px-4 py-3 border border-black/10 dark:border-white/10 rounded-xl bg-surface text-ink focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
            placeholder="Nome de utilizador"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-ink mb-1.5">
            Senha
          </label>
          <input
            id="password"
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 border border-black/10 dark:border-white/10 rounded-xl bg-surface text-ink focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
            placeholder="........"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-black/20 dark:border-white/20 text-brand-500 focus:ring-brand-500 mr-2" />
            <span className="text-sm text-muted">Lembrar-me</span>
          </label>
          <Link href="#" className="text-sm text-brand-600 hover:underline">
            Esqueceu a senha?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-500 text-white py-3 rounded-xl hover:bg-brand-600 transition font-semibold disabled:opacity-50"
        >
          {loading ? "A entrar..." : "Entrar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Nao tem uma conta?{" "}
        <Link href="/register" className="text-brand-600 hover:underline font-semibold">
          Criar conta
        </Link>
      </p>
    </div>
  );
}