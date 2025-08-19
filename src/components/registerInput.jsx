"use client";
import {
  Input,
  Stack,
  IconButton,
  Portal,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { InputGroup } from "@/components/ui/input-group";
import React from "react";
import { useState, useEffect } from "react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { withMask } from "use-mask-input";

export default function RegisterInput({ mandarDadosdofilho }) {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Name, setName] = useState("");
  const [Phone, setPhone] = useState("");
  const [Username, setUsername] = useState("");
  const [CPF, setCPF] = useState("");
  const [Role, setRole] = useState("");

  const rolesCollection = createListCollection({
    items: [
      { label: "Entregador", value: "delivery" },
      { label: "Usuário", value: "user" },
    ],
  });

  const content = {
    email: Email,
    password: Password,
    name: Name,
    phone: Phone,
    username: Username,
    cpf: CPF,
    role: Role,
  };
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const mandarDados = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (!Password || !Email || !Name || !Phone || !Username || !CPF || !Role) {
      toaster.create({
        title: "Preencha todos os valores!",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }
    await mandarDadosdofilho(content);
    setIsSubmitting(false);
  };

  return (
    <Stack>
      <Input
        mt="4%"
        borderColor="#f0f0f0"
        fontFamily="Montserrat"
        variant="outline"
        placeholder="Digite seu nome completo"
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        mt="1%"
        borderColor="#f0f0f0"
        fontFamily="Montserrat"
        variant="outline"
        placeholder="Digite seu apelido"
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        mt="1%"
        borderColor="#f0f0f0"
        fontFamily="Montserrat"
        variant="outline"
        ref={withMask("(99) 99999-9999")}
        placeholder="Digite seu telefone"
        onChange={(e) => setPhone(e.target.value)}
      />
      <Input
        mt="1%"
        borderColor="#f0f0f0"
        fontFamily="Montserrat"
        placeholder="Digite seu CPF"
        ref={withMask("999.999.999-99")}
        onChange={(e) => setCPF(e.target.value)}
      />

      <Input
        mt="1%"
        borderColor="#f0f0f0"
        fontFamily="Montserrat"
        variant="outline"
        placeholder="Digite seu email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <InputGroup mt="1%" w="100%">
        <PasswordInput
          fontFamily="Montserrat"
          borderColor="#f0f0f0"
          variant="outline"
          placeholder="Digite sua senha"
          onChange={(e) => setPassword(e.target.value)}
        />
      </InputGroup>
      <IconButton
        bg="#fdb525"
        color="white"
        variant="subtle"
        borderRadius={5}
        _hover={{
          opacity: 0.9,
          transform: "scale(1.01)",
          transition: "0.3s",
        }}
        fontWeight="bold"
        onClick={mandarDados}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            mandarDados();
          }
        }}
        mt="1%"
        tabIndex={0}
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        Confirmar
      </IconButton>
      <Toaster />
    </Stack>
  );
}
