'use client'
import { Box, Heading, VStack } from "@chakra-ui/react";
import React from 'react';
import api from "@/utils/axios";
import LoginInput from "@/components/loginInput";
import { Toaster, toaster } from "@/components/ui/toaster"
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";

export default function LoginPc() {
  
  const router = useRouter();

  const loginUsuario = async (content) => {
    try {
      const response = await api.post(`/users/login`, { ...content });
      if (response.status == 200) {
        const token = response.data.response;
        localStorage.setItem('token', response.data.response);
        console.log("Token salvo:", localStorage.getItem('token'));
        const decoded = jwtDecode(token);
        const role = decoded.role;
        toaster.create({
          description: "Login realizado com sucesso! Redirecionando...",
          type: "success",
        });
        if (role === "admin") {
            router.push("/admin");
            console.log("redirecionando para admin")
          } else if (role === "delivery") {
            router.push("/delivery");
          } else {
            router.push("/user");
          }
          } else {
        toaster.create({
          description: "Erro ao fazer login!",
          type: "error",
        })
      }
    } catch (error) {
      toaster.create({
        description: "Senha ou e-mail incorretos!",
        type: "error",
      })
    }
  }

  const receberDadosdoFilho = async (content) => {
    await loginUsuario(content)
  };

  return (
    <Box
      w="100%" h="100vh" display="flex" justifyContent="center" alignItems="center" 
      filter="contrast(95%)"
      bgImage={"url(/fundodelivery.png)"}
      bgSize="100% 115%"
      bgPosition="center"
      bgRepeat="no-repeat"
    >
      <Box w="55%" display="flex" justifyContent="center" alignItems="center">
      </Box>

      <Box
        w="50%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <VStack align="left" >
          <Heading fontFamily="Montserrat" color="white" textAlign="center" as="h1" fontSize={40} fontWeight={600} >
            Bem-Vindo
            <span style={{ fontFamily: "monospace", fontSize: "1.2em", color: "white" }} >!</span>
          </Heading>
          <LoginInput mandarDadosdofilho={receberDadosdoFilho} />
        </VStack>
      </Box>
      <Toaster />
    </Box>
  );
} 