"use client";
import {
  Input,
  Stack,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { InputGroup } from "@/components/ui/input-group";
import React from "react";
import { useState, useEffect } from "react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { withMask } from "use-mask-input";

export default function RegisterInput({ mandarDadosdofilho }) {
  const [userType, setUserType] = useState("aluno"); 

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");

  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [emailEmpresa, setEmailEmpresa] = useState("");
  const [senhaEmpresa, setSenhaEmpresa] = useState("");

  const getContent = () => {
    if (userType === "aluno") {
      return {
        nome,
        email,
        cpf: cpf.trim(), 
        senha,
      };
    } else if (userType === "empresa") {
      return {
        nome: nomeEmpresa,
        cnpj: cnpj.trim(), 
        email: emailEmpresa,
        senha: senhaEmpresa,
      };
    }
    return {};
  };
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateAlunoForm = () => {
    if (!nome || !email || !cpf || !senha) {
      toaster.create({
        title: "Preencha todos os campos obrigatórios (Nome, Email, CPF e Senha)!",
        type: "error",
      });
      return false;
    }
    return true;
  };

  const validateEmpresaForm = () => {
    if (!nomeEmpresa || !cnpj || !emailEmpresa || !senhaEmpresa) {
      toaster.create({
        title: "Preencha todos os campos obrigatórios (Nome, CNPJ, Email e Senha)!",
        type: "error",
      });
      return false;
    }
    return true;
  };

  const mandarDados = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    const isValid = userType === "aluno" ? validateAlunoForm() : validateEmpresaForm();
    
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }
    
    await mandarDadosdofilho(getContent(), userType);
    setIsSubmitting(false);
  };

  return (
    <Stack>
      {userType === "aluno" && (
        <>
          <Input
            mt="2%"
            borderColor="#f0f0f0"
            fontFamily="Montserrat"
            variant="outline"
            placeholder="Digite seu nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            color="white"
            _placeholder={{ color: "gray.400" }}
          />
          
          <Input
            mt="1%"
            borderColor="#f0f0f0"
            fontFamily="Montserrat"
            variant="outline"
            placeholder="Digite seu email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            color="white"
            _placeholder={{ color: "gray.400" }}
          />
          
          <Input
            mt="1%"
            borderColor="#f0f0f0"
            fontFamily="Montserrat"
            placeholder="Digite seu CPF"
            ref={withMask("999.999.999-99")}
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            color="white"
            _placeholder={{ color: "gray.400" }}
          />

          <InputGroup mt="1%" w="100%">
            <PasswordInput
              fontFamily="Montserrat"
              borderColor="#f0f0f0"
              variant="outline"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              color="white"
              _placeholder={{ color: "gray.400" }}
            />
          </InputGroup>
        </>
      )}

      {userType === "empresa" && (
        <>
          <Input
            mt="2%"
            borderColor="#f0f0f0"
            fontFamily="Montserrat"
            variant="outline"
            placeholder="Digite o nome da empresa"
            value={nomeEmpresa}
            onChange={(e) => setNomeEmpresa(e.target.value)}
            color="white"
            _placeholder={{ color: "gray.400" }}
          />
          
          <Input
            mt="1%"
            borderColor="#f0f0f0"
            fontFamily="Montserrat"
            placeholder="Digite o CNPJ"
            ref={withMask("99.999.999/9999-99")}
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            color="white"
            _placeholder={{ color: "gray.400" }}
          />
          
          <Input
            mt="1%"
            borderColor="#f0f0f0"
            fontFamily="Montserrat"
            variant="outline"
            placeholder="Digite o email da empresa"
            type="email"
            value={emailEmpresa}
            onChange={(e) => setEmailEmpresa(e.target.value)}
            color="white"
            _placeholder={{ color: "gray.400" }}
          />

          <InputGroup mt="1%" w="100%">
            <PasswordInput
              fontFamily="Montserrat"
              borderColor="#f0f0f0"
              variant="outline"
              placeholder="Digite a senha"
              value={senhaEmpresa}
              onChange={(e) => setSenhaEmpresa(e.target.value)}
              color="white"
              _placeholder={{ color: "gray.400" }}
            />
          </InputGroup>
        </>
      )}

      <HStack spacing={1} w="100%" mt="3%" mb="1%">
        <IconButton
          bg={userType === "aluno" ? "#fdb525" : "transparent"}
          color={userType === "aluno" ? "white" : "#fdb525"}
          border="2px solid #fdb525"
          fontFamily="Montserrat"
          fontWeight="bold"
          borderRadius={5}
          flex="1"
          onClick={() => setUserType("aluno")}
          _hover={{
            opacity: 0.9,
            transform: "scale(1.01)",
            transition: "0.3s",
          }}
        >
          Aluno
        </IconButton>
        <IconButton
          bg={userType === "empresa" ? "#fdb525" : "transparent"}
          color={userType === "empresa" ? "white" : "#fdb525"}
          border="2px solid #fdb525"
          fontFamily="Montserrat"
          fontWeight="bold"
          borderRadius={5}
          flex="1"
          onClick={() => setUserType("empresa")}
          _hover={{
            opacity: 0.9,
            transform: "scale(1.01)",
            transition: "0.3s",
          }}
        >
          Empresa
        </IconButton>
      </HStack>

      <IconButton
        bg="#fdb525"
        color="white"
        variant="subtle"
        borderRadius={5}
        fontFamily="Montserrat"
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
        {userType === "aluno" ? "Cadastrar Aluno" : "Cadastrar Empresa"}
      </IconButton>

      <Toaster />
    </Stack>
  );
}
