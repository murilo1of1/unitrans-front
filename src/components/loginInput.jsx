"use client";
import { IconButton, Stack } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { InputGroup } from "@/components/ui/input-group";
import { FaUser, FaLock } from "react-icons/fa";
import React, { useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import DialogForgotPassword from "@/components/dialogForgotPassword";

export default function LoginInput({ mandarDadosdofilho }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [Email, setEmail] = useState("");
  const [Senha, setSenha] = useState("");
  const router = useRouter();

  const mandarDados = () => {
    if (!Senha || !Email) {
      toaster.create({
        title: "Preencha todos os valores!",
        type: "error",
      });
      return;
    }
    mandarDadosdofilho({ email: Email, senha: Senha });
  };

  return (
    <Stack
      alignItems="center"
      spacing={3}
      w="100%"
      maxW={{ base: "85%", md: "420px" }} // Desktop original — mobile reduz
      mx="auto"
    >
      {/* EMAIL */}
      <InputGroup
        mt="7%"
        startElement={<FaUser color="white" opacity={0.8} />}
        w="100%"
      >
        <Input
          variant="outline"
          placeholder="Email"
          fontFamily="Montserrat"
          fontSize={{ base: "14px", md: "16px" }} // Mobile menor
          h={{ base: "38px", md: "45px" }} // Mobile menor
          _placeholder={{ color: "white" }}
          onChange={(e) => setEmail(e.target.value)}
          borderColor="white"
        />
      </InputGroup>

      {/* SENHA */}
      <InputGroup
        mt="2%"
        startElement={<FaLock color="white" opacity={0.8} />}
        w="100%"
      >
        <PasswordInput
          variant="outline"
          placeholder="Senha"
          fontFamily="Montserrat"
          fontSize={{ base: "14px", md: "16px" }}
          h={{ base: "38px", md: "45px" }}
          _placeholder={{ color: "white" }}
          onChange={(e) => setSenha(e.target.value)}
          borderColor="white"
        />
      </InputGroup>

      {/* BOTÃO ENTRAR */}
      <IconButton
        bg="#fdb525"
        color="white"
        variant="subtle"
        fontFamily="Montserrat"
        fontSize={{ base: "14px", md: "16px" }}
        h={{ base: "38px", md: "45px" }}
        w="100%"
        onClick={mandarDados}
        mt="2%"
        borderRadius={5}
        _hover={{
          opacity: 0.9,
          transform: "scale(1.01)",
          transition: "0.3s",
        }}
        fontWeight="bold"
      >
        Entrar
      </IconButton>

      {/* BOTÃO CADASTRAR */}
      <IconButton
        bg="#fdb525"
        color="white"
        variant="subtle"
        fontFamily="Montserrat"
        fontSize={{ base: "14px", md: "16px" }}
        h={{ base: "38px", md: "45px" }}
        w="100%"
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

      {/* ESQUECEU A SENHA */}
      <IconButton
        variant="plain"
        mt="1%"
        fontFamily="Montserrat"
        fontSize={{ base: "12px", md: "14px" }}
        w={{ base: "100%", md: "auto" }}
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
    </Stack>
  );
}
