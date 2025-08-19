"use client";
import { Box, Heading, VStack, Image } from "@chakra-ui/react";
import React from "react";
import api from "@/utils/axios";
import LoginInput from "@/components/loginInput";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function LoginPc() {
  const router = useRouter();

  const loginUsuario = async (content) => {
    try {
      const response = await api.post(`/aluno/login`, { ...content });
      if (response.status == 200) {
        const token = response.data.response;
        localStorage.setItem("token", response.data.response);
        console.log("Token salvo:", localStorage.getItem("token"));
        const decoded = jwtDecode(token);
        const role = decoded.role;
        toaster.create({
          description: "Login realizado com sucesso! Redirecionando...",
          type: "success",
        });
        router.push("/");
        return;
      }
    } catch (error) {
      console.log("Login como aluno falhou, tentando como empresa...");
    }

    try {
      const response = await api.post(`/empresa/login`, { ...content });
      if (response.status == 200) {
        const token = response.data.response;
        localStorage.setItem("token", response.data.response);
        console.log("Token salvo:", localStorage.getItem("token"));
        const decoded = jwtDecode(token);
        const role = decoded.role;
        toaster.create({
          description: "Login realizado com sucesso! Redirecionando...",
          type: "success",
        });
        if (role === "admin") {
          router.push("/");
        } else {
          router.push("/");
        }
      } else {
        toaster.create({
          description: "Erro ao fazer login!",
          type: "error",
        });
      }
    } catch (error) {
      toaster.create({
        description: "Email ou senha incorretos!",
        type: "error",
      });
    }
  };

  const receberDadosdoFilho = async (content) => {
    await loginUsuario(content);
  };

  return (
    <Box
      w="100%"
      h="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      filter="contrast(95%)"
      bgImage={"url(/fundotelainicial.png)"}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
    >
      <Box
        w="500px"
        maxW="90%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bg="#232234"
        h="700px"
        borderRadius={20}
        boxShadow="0 10px 30px rgba(0,0,0,0.3)"
        p={6}
      >
        <VStack align="center" spacing={4} w="100%">
          <Image
            src="/logosolo.png"
            alt="logo"
            objectFit="contain"
            boxSize="180px"
            mb={-6}
            mt={-8}
          />
          <Heading
            fontFamily="Montserrat"
            color="white"
            textAlign="center"
            as="h1"
            fontSize={28}
            fontWeight={600}
            mb={-1}
          >
            Acesse sua conta
          </Heading>
          <LoginInput mandarDadosdofilho={receberDadosdoFilho} />
        </VStack>
      </Box>
      <Toaster />
    </Box>
  );
}
