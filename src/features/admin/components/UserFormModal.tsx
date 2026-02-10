"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/button";
import { useToast } from "@/components/ui/Toast";
import { adminService } from "@/services/admin.service";
import { Save } from "lucide-react";
import type { PermissaoOut } from "@/types/database";

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  permissions: PermissaoOut[];
}

export default function UserFormModal({ open, onClose, onSaved, permissions }: UserFormModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    utilizador: "",
    password: "",
    nome_completo: "",
    email: "",
    telefone: "",
    empresa: "",
    id_permissao: "",
  });

  useEffect(() => {
    if (open) {
      setForm({ utilizador: "", password: "", nome_completo: "", email: "", telefone: "", empresa: "", id_permissao: "" });
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!form.utilizador || !form.password || !form.email || !form.id_permissao) {
      toast("error", "Preencha os campos obrigatorios");
      return;
    }
    setLoading(true);
    try {
      await adminService.createUser({
        utilizador: form.utilizador,
        password: form.password,
        nome_completo: form.nome_completo || null,
        email: form.email,
        telefone: form.telefone || null,
        empresa: form.empresa || null,
        id_permissao: parseInt(form.id_permissao),
      });
      toast("success", "Utilizador criado com sucesso");
      onSaved();
      onClose();
    } catch {
      toast("error", "Erro ao criar utilizador");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Novo Utilizador">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Utilizador *"
            value={form.utilizador}
            onChange={(e) => setForm({ ...form, utilizador: e.target.value })}
            placeholder="Nome de utilizador"
          />
          <Input
            label="Password *"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Senha"
          />
        </div>
        <Input
          label="Nome Completo"
          value={form.nome_completo}
          onChange={(e) => setForm({ ...form, nome_completo: e.target.value })}
          placeholder="Nome completo"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Email *"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="email@empresa.com"
          />
          <Input
            label="Telefone"
            value={form.telefone}
            onChange={(e) => setForm({ ...form, telefone: e.target.value })}
            placeholder="+244 900 000 000"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Empresa"
            value={form.empresa}
            onChange={(e) => setForm({ ...form, empresa: e.target.value })}
            placeholder="Empresa"
          />
          <Select
            label="Permissao *"
            value={form.id_permissao}
            onChange={(v) => setForm({ ...form, id_permissao: v })}
            options={permissions.map((p) => ({ value: p.id_permissao.toString(), label: p.nome_grupo }))}
            placeholder="Seleccionar..."
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} loading={loading} icon={<Save className="h-4 w-4" />}>Criar Utilizador</Button>
      </div>
    </Modal>
  );
}
