"use client";
import { IconButton, Stack } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { InputGroup } from "@/components/ui/input-group";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import React from "react";
import { useState, useEffect } from "react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import DialogForgotPassword from "@/components/dialogForgotPassword";

export default function LoginInput({ mandarDadosdofilho }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [Email, setEmail] = useState("");
  const [Senha, setSenha] = useState("");
  const content = { email: Email, senha: Senha };
  const router = useRouter();

  const mandarDados = async () => {
    if (!Senha || !Email) {
      toaster.create({
        title: "Preencha todos os valores!",
        type: "error",
      });
      return;
    }
    mandarDadosdofilho(content);
  };

  return (
    <Stack>
      <InputGroup
        mt="7%"
        startElement={<FaUser color="white" opacity={0.8} />}
        w="100%"
      >
        <Input
          variant="outline"
          placeholder="Login"
          _placeholder={{ color: "white" }}
          onChange={(e) => setEmail(e.target.value)}
          borderColor="white"
        />
      </InputGroup>
      <InputGroup
        mt="2%"
        startElement={<FaLock color="white" opacity={0.8} />}
        w="100%"
      >
        <PasswordInput
          variant="outline"
          placeholder="Senha"
          _placeholder={{ color: "white" }}
          onChange={(e) => setSenha(e.target.value)}
          borderColor="white"
        />
      </InputGroup>
      <IconButton
        bg="#fdb525"
        color="white"
        variant="subtle"
        onClick={mandarDados}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            mandarDados();
          }
        }}
        mt="2%"
        borderRadius={5}
        _hover={{
          opacity: 0.9,
          transform: "scale(1.01)",
          transition: "0.3s",
        }}
        tabIndex={0}
        fontWeight="bold"
      >
        Entrar
      </IconButton>
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
        onClick={() => router.push("/register")}
      >
        Cadastrar
      </IconButton>
      <IconButton
        variant="plain"
        mt="1%"
        color="#fdb525"
        _hover={{
          opacity: 0.9,
          transform: "scale(1.01)",
          transition: "0.3s",
        }}
        onClick={() => setIsDialogOpen(true)}
        fontWeight="bold"
      >
        Esqueceu a senha?
      </IconButton>
      <DialogForgotPassword
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
      <Toaster />
    </Stack>
  );
}
