"use client";
import {
  Input,
  Stack,
  IconButton,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { InputGroup } from "@/components/ui/input-group";
import React, { useState } from "react";
import { Toaster, toaster } from "@/components/ui/toaster";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stackMaxW = useBreakpointValue({ base: "80%", md: "450px" });
  const inputFontSize = useBreakpointValue({ base: "14px", md: "16px" });
  const inputHeight = useBreakpointValue({ base: "40px", md: "45px" });
  const buttonPaddingY = useBreakpointValue({ base: 2, md: 4 });

  const getContent = () => {
    return userType === "aluno"
      ? { nome, email, cpf: cpf.trim(), senha }
      : { nome: nomeEmpresa, cnpj: cnpj.trim(), email: emailEmpresa, senha: senhaEmpresa };
  };

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
    <Stack
      data-testid="register-input-stack"
      w="100%"

      /* 🔥 ALTERAÇÕES PEDIDAS 🔥 */

      // diminuir a caixa cinza
      maxW={{ base: "100%", md: "500px" }}

      // diminuir espaço interno superior e inferior do mobile
      pt={{ base: "28px", md: 0 }}
      pb={{ base: 1, md: 0 }}

      // mover tudo mais pra cima
      mt={{ base: "-28px", md: 0 }}
   
      /* resto intacto */
      spacing={{ base: 2.5, md: 3 }}
      px={{ base: 2, md: 0 }}
      mx="auto"
    >
      {userType === "aluno" && (
        <>
          <Input
            mt="2%"
            w="100%"
            fontFamily="Montserrat"
            borderColor="#f0f0f0"
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            color="white"
            _placeholder={{ color: "gray.400" }}
            fontSize={inputFontSize}
            height={inputHeight}
          />

          <Input
            w="100%"
            fontFamily="Montserrat"
            borderColor="#f0f0f0"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            color="white"
            _placeholder={{ color: "gray.400" }}
            fontSize={inputFontSize}
            height={inputHeight}
          />

          <Input
            w="100%"
            fontFamily="Montserrat"
            borderColor="#f0f0f0"
            placeholder="CPF"
            ref={withMask("999.999.999-99")}
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            color="white"
            _placeholder={{ color: "gray.400" }}
            fontSize={inputFontSize}
            height={inputHeight}
          />

          <InputGroup w="100%">
            <PasswordInput
              w="100%"
              fontFamily="Montserrat"
              borderColor="#f0f0f0"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              color="white"
              _placeholder={{ color: "gray.400" }}
              fontSize={inputFontSize}
              height={inputHeight}
            />
          </InputGroup>
        </>
      )}

      {userType === "empresa" && (
        <>
          <Input
            mt="2%"
            w="100%"
            fontFamily="Montserrat"
            borderColor="#f0f0f0"
            placeholder="Digite o nome da empresa"
            value={nomeEmpresa}
            onChange={(e) => setNomeEmpresa(e.target.value)}
            color="white"
            _placeholder={{ color: "gray.400" }}
            fontSize={inputFontSize}
            height={inputHeight}
          />

          <Input
            w="100%"
            fontFamily="Montserrat"
            borderColor="#f0f0f0"
            placeholder="Digite o CNPJ"
            ref={withMask("99.999.999/9999-99")}
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            color="white"
            _placeholder={{ color: "gray.400" }}
            fontSize={inputFontSize}
            height={inputHeight}
          />

          <Input
            w="100%"
            fontFamily="Montserrat"
            borderColor="#f0f0f0"
            placeholder="Digite o email da empresa"
            type="email"
            value={emailEmpresa}
            onChange={(e) => setEmailEmpresa(e.target.value)}
            color="white"
            _placeholder={{ color: "gray.400" }}
            fontSize={inputFontSize}
            height={inputHeight}
          />

          <InputGroup w="100%">
            <PasswordInput
              w="100%"
              fontFamily="Montserrat"
              borderColor="#f0f0f0"
              placeholder="Digite a senha"
              value={senhaEmpresa}
              onChange={(e) => setSenhaEmpresa(e.target.value)}
              color="white"
              _placeholder={{ color: "gray.400" }}
              fontSize={inputFontSize}
              height={inputHeight}
            />
          </InputGroup>
        </>
      )}

      <HStack spacing={2} w="100%" mt="3%">
        <IconButton
          bg={userType === "aluno" ? "#fdb525" : "transparent"}
          color={userType === "aluno" ? "white" : "#fdb525"}
          border="2px solid #fdb525"
          fontFamily="Montserrat"
          fontWeight="bold"
          borderRadius={5}
          flex="1"
          _hover={{ opacity: 0.9, transform: "scale(1.01)" }}
          onClick={() => setUserType("aluno")}
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
          _hover={{ opacity: 0.9, transform: "scale(1.01)" }}
          onClick={() => setUserType("empresa")}
        >
          Empresa
        </IconButton>
      </HStack>

      <IconButton
        bg="#fdb525"
        color="white"
        fontFamily="Montserrat"
        fontWeight="bold"
        borderRadius={5}
        mt="2%"
        w="100%"
        py={buttonPaddingY}
        _hover={{ opacity: 0.9, transform: "scale(1.01)" }}
        onClick={mandarDados}
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        {userType === "aluno" ? "Cadastrar Aluno" : "Cadastrar Empresa"}
      </IconButton>

      <Toaster />
    </Stack>
  );
}
