"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useToast } from "@/components/ui/Toast";
import { authService } from "@/services/auth.service";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [senhaActual, setSenhaActual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const handleSubmit = async () => {
    if (!senhaActual || !novaSenha || !confirmar) {
      toast("error", "Todos os campos sao obrigatorios");
      return;
    }
    if (novaSenha !== confirmar) {
      toast("error", "As senhas nao coincidem");
      return;
    }
    if (novaSenha.length < 6) {
      toast("error", "A nova senha deve ter pelo menos 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      await authService.changePassword({ password_actual: senhaActual, password_nova: novaSenha });
      toast("success", "Senha alterada com sucesso");
      setSenhaActual("");
      setNovaSenha("");
      setConfirmar("");
      onClose();
    } catch {
      toast("error", "Erro ao alterar senha. Verifique a senha actual.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Alterar Senha"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} loading={loading}>Alterar Senha</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input label="Senha Actual" type="password" value={senhaActual} onChange={(e) => setSenhaActual(e.target.value)} placeholder="Senha actual" />
        <Input label="Nova Senha" type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} placeholder="Nova senha" />
        <Input label="Confirmar Nova Senha" type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} placeholder="Confirmar senha" />
      </div>
    </Modal>
  );
}