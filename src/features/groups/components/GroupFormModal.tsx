"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import TextArea from "@/components/ui/TextArea";
import { useToast } from "@/components/ui/Toast";
import { groupsService } from "@/services/groups.service";
import type { GrupoOut } from "@/types/database";

interface GroupFormModalProps {
  open: boolean;
  onClose: () => void;
  group?: GrupoOut | null;
  onSaved: () => void;
}

export default function GroupFormModal({ open, onClose, group, onSaved }: GroupFormModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (group) {
      setNome(group.nome_grupo || "");
      setDescricao(group.descricao_grupo || "");
    } else {
      setNome("");
      setDescricao("");
    }
  }, [group, open]);

  const handleSubmit = async () => {
    if (!nome.trim()) {
      toast("error", "Nome do grupo e obrigatorio");
      return;
    }
    setLoading(true);
    try {
      if (group) {
        await groupsService.update(group.id_grupo, { nome_grupo: nome.trim(), descricao_grupo: descricao.trim() || null });
        toast("success", "Grupo actualizado");
      } else {
        await groupsService.create({ nome_grupo: nome.trim() });
        toast("success", "Grupo criado");
      }
      onSaved();
      onClose();
    } catch {
      toast("error", "Erro ao guardar grupo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={group ? "Editar Grupo" : "Novo Grupo"}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} loading={loading}>
            {group ? "Guardar" : "Criar Grupo"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input label="Nome do Grupo *" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Clientes VIP" />
        <TextArea label="Descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descricao do grupo..." rows={3} />
      </div>
    </Modal>
  );
}