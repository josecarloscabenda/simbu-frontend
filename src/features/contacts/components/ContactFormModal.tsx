"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/Select";
import TextArea from "@/components/ui/TextArea";
import PhoneInput from "@/components/ui/PhoneInput";
import Tabs from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import { contactsService } from "@/services/contacts.service";
import type { ContactoOut, ContactoCreate } from "@/types/database";

interface ContactFormModalProps {
  open: boolean;
  onClose: () => void;
  contact?: ContactoOut | null;
  onSaved: () => void;
}

const tipoPessoaOptions = [
  { value: "F", label: "F - Pessoa Fisica" },
  { value: "J", label: "J - Pessoa Juridica" },
  { value: "S", label: "S - Grupo Solidario" },
];

const montanteOptions = [
  { value: "ate_5m", label: "Ate 5.000.000 Kz" },
  { value: "5m_10m", label: "5.000.000 - 10.000.000 Kz" },
  { value: "10m_50m", label: "10.000.000 - 50.000.000 Kz" },
  { value: "50m_150m", label: "50.000.000 - 150.000.000 Kz" },
  { value: "150m_200m", label: "150.000.000 - 200.000.000 Kz" },
  { value: "acima_200m", label: "Acima de 200.000.000 Kz" },
];

const sectorOptions = [
  { value: "agricultura", label: "Agricultura" },
  { value: "pecuaria", label: "Pecuaria" },
  { value: "pesca", label: "Pesca" },
  { value: "servicos", label: "Servicos" },
  { value: "industria", label: "Industria" },
  { value: "turismo", label: "Turismo" },
  { value: "outro", label: "Outro" },
];

export default function ContactFormModal({ open, onClose, contact, onSaved }: ContactFormModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basico");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ContactoCreate>({
    nome: "",
    sobrenome: "",
    telefone: "",
    movel: "",
    email: "",
    tipo_pessoa: "",
    designacao: "",
    nif: "",
    localizacao: "",
    montante_desejado: "",
    sector_actividade: "",
    descricao_projecto: "",
  });

  useEffect(() => {
    if (contact) {
      setForm({
        nome: contact.nome || "",
        sobrenome: contact.sobrenome || "",
        telefone: contact.telefone || "",
        movel: contact.movel || "",
        email: contact.email || "",
        tipo_pessoa: contact.tipo_pessoa || "",
        designacao: contact.designacao || "",
        nif: contact.nif || "",
        localizacao: contact.localizacao || "",
        montante_desejado: contact.montante_desejado || "",
        sector_actividade: contact.sector_actividade || "",
        descricao_projecto: contact.descricao_projecto || "",
      });
    } else {
      setForm({
        nome: "", sobrenome: "", telefone: "", movel: "",
        email: "", tipo_pessoa: "", designacao: "",
        nif: "", localizacao: "", montante_desejado: "",
        sector_actividade: "", descricao_projecto: "",
      });
    }
    setActiveTab("basico");
  }, [contact, open]);

  const set = (key: keyof ContactoCreate, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.nome.trim()) {
      toast("error", "Nome e obrigatorio");
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form };
      // Clean empty strings to null
      for (const key of Object.keys(payload) as (keyof ContactoCreate)[]) {
        if (payload[key] === "") (payload as Record<string, unknown>)[key] = null;
      }
      // Keep nome
      payload.nome = form.nome.trim();

      if (contact) {
        await contactsService.update(contact.id_contacto, payload);
        toast("success", "Contacto actualizado");
      } else {
        await contactsService.create(payload);
        toast("success", "Contacto criado");
      }
      onSaved();
      onClose();
    } catch {
      toast("error", "Erro ao guardar contacto");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: "basico", label: "Informacao Basica" },
    { key: "projecto", label: "Dados do Projecto" },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={contact ? "Editar Contacto" : "Novo Contacto"}
      size="xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} loading={loading}>
            {contact ? "Guardar" : "Criar Contacto"}
          </Button>
        </>
      }
    >
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4 space-y-4">
        {activeTab === "basico" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Nome *" value={form.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Nome" />
              <Input label="Sobrenome" value={form.sobrenome || ""} onChange={(e) => set("sobrenome", e.target.value)} placeholder="Sobrenome" />
            </div>
            <PhoneInput label="Telefone" value={form.telefone || ""} onChange={(v) => set("telefone", v)} />
            <PhoneInput label="Movel" value={form.movel || ""} onChange={(v) => set("movel", v)} />
            <Input label="Email" type="email" value={form.email || ""} onChange={(e) => set("email", e.target.value)} placeholder="email@exemplo.com" />
          </>
        )}

        {activeTab === "projecto" && (
          <>
            <Select
              label="Tipo de Pessoa"
              value={form.tipo_pessoa || ""}
              onChange={(v) => set("tipo_pessoa", v)}
              options={tipoPessoaOptions}
              placeholder="Seleccionar..."
            />
            <Input label="Designacao" value={form.designacao || ""} onChange={(e) => set("designacao", e.target.value)} placeholder="Nome do projecto" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="NIF" value={form.nif || ""} onChange={(e) => set("nif", e.target.value)} placeholder="Numero de identificacao fiscal" />
              <Input label="Localizacao" value={form.localizacao || ""} onChange={(e) => set("localizacao", e.target.value)} placeholder="Provincia, municipio..." />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Montante Desejado"
                value={form.montante_desejado || ""}
                onChange={(v) => set("montante_desejado", v)}
                options={montanteOptions}
                placeholder="Seleccionar faixa..."
              />
              <Select
                label="Sector de Actividade"
                value={form.sector_actividade || ""}
                onChange={(v) => set("sector_actividade", v)}
                options={sectorOptions}
                placeholder="Seleccionar sector..."
              />
            </div>
            <TextArea
              label="Descricao do Projecto"
              value={form.descricao_projecto || ""}
              onChange={(e) => set("descricao_projecto", e.target.value)}
              placeholder="Descreva brevemente o projecto..."
              rows={4}
            />
          </>
        )}
      </div>
    </Modal>
  );
}