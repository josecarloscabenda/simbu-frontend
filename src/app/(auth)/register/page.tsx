"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/lib/auth.store";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    empresa: "",
    email: "",
    telefone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast("error", "As senhas nao coincidem");
      return;
    }
    if (formData.password.length < 6) {
      toast("error", "A senha deve ter pelo menos 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      await authService.register({
        utilizador: formData.email.split("@")[0],
        email: formData.email,
        password: formData.password,
        nome_completo: formData.nome,
        telefone: formData.telefone,
        empresa: formData.empresa,
      });
      // Login after registration (username = part before @ in email)
      const { access_token } = await authService.login({
        username: formData.email.split("@")[0],
        password: formData.password,
      });
      localStorage.setItem("simbu_token", access_token);
      const user = await authService.me();
      setAuth(user, access_token);
      toast("success", "Conta criada com sucesso!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
        || "Erro ao criar conta. Verifique os dados.";
      toast("error", typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 border border-black/10 dark:border-white/10 rounded-xl bg-surface text-ink focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition";

  return (
    <div className="bg-surface rounded-2xl shadow-xl p-8 w-full max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-ink mb-2">Criar Conta</h1>
        <p className="text-muted">Comece a usar a plataforma hoje mesmo</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nome" className="block text-sm font-semibold text-ink mb-1.5">Nome Completo</label>
            <input id="nome" type="text" required value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} className={inputClass} placeholder="Joao Silva" />
          </div>
          <div>
            <label htmlFor="empresa" className="block text-sm font-semibold text-ink mb-1.5">Empresa</label>
            <input id="empresa" type="text" required value={formData.empresa} onChange={(e) => setFormData({ ...formData, empresa: e.target.value })} className={inputClass} placeholder="Minha Empresa Lda" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-ink mb-1.5">Email</label>
            <input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} placeholder="joao@empresa.com" />
          </div>
          <div>
            <label htmlFor="telefone" className="block text-sm font-semibold text-ink mb-1.5">Telefone</label>
            <input id="telefone" type="tel" required value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })} className={inputClass} placeholder="+244 900 000 000" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-ink mb-1.5">Senha</label>
            <input id="password" type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className={inputClass} placeholder="........" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-ink mb-1.5">Confirmar Senha</label>
            <input id="confirmPassword" type="password" required value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className={inputClass} placeholder="........" />
          </div>
        </div>

        <div className="flex items-start">
          <input type="checkbox" required className="rounded border-black/20 dark:border-white/20 text-brand-500 focus:ring-brand-500 mt-1 mr-2" />
          <span className="text-sm text-muted">
            Concordo com os{" "}
            <Link href="#" className="text-brand-600 hover:underline">Termos de Servico</Link>{" "}
            e{" "}
            <Link href="#" className="text-brand-600 hover:underline">Politica de Privacidade</Link>
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-500 text-white py-3 rounded-xl hover:bg-brand-600 transition font-semibold disabled:opacity-50"
        >
          {loading ? "A criar conta..." : "Criar Conta"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Ja tem uma conta?{" "}
        <Link href="/login" className="text-brand-600 hover:underline font-semibold">
          Entrar
        </Link>
      </p>
    </div>
  );
}