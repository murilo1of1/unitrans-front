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
      const response = await api.post(`/auth/login`, { ...content });
      if (response.status == 200 || response.status == 201) {
        const token = response.data.response;
        localStorage.setItem("token", token);
        console.log("Token de aluno salvo:", localStorage.getItem("token"));

        toaster.create({
          description:
            "Login de aluno realizado com sucesso! Redirecionando...",
          type: "success",
        });

        setTimeout(() => {
          router.push("/user");
        }, 1500);
        return;
      }
    } catch (error) {
      console.log("Login como aluno falhou, tentando como empresa...");
    }

    try {
      const response = await api.post(`/auth/login-empresa`, { ...content });
      if (response.status == 200 || response.status == 201) {
        const token = response.data.response;
        localStorage.setItem("token", token);
        console.log("Token de empresa salvo:", localStorage.getItem("token"));

        toaster.create({
          description:
            "Login de empresa realizado com sucesso! Redirecionando...",
          type: "success",
        });

        setTimeout(() => {
          router.push("/admin");
        }, 1500);
        return;
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
        h="600px"
        borderRadius={20}
        boxShadow="0 10px 30px rgba(0,0,0,0.3)"
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
