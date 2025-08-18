'use client'
import { Box, Heading, VStack } from "@chakra-ui/react";
import React from 'react';
import RegisterInput from "@/components/registerInput";
import { Toaster, toaster } from "@/components/ui/toaster"
import axios from "@/utils/axios";
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();

  const registerUsuario = async (content) => {
    try {
      const response = await axios.post(`/users`, { ...content });
      if (response.status == 200 || response.status === 201) {
        toaster.create({
          description: "Usuario criado com sucesso! Redirecionando...",
          type: "success",
        });
        localStorage.setItem('token', response.data.response);
        router.push('/');
      } else {
        toaster.create({
          description: "Erro ao criar usuário!",
          type: "error",
        })
      }
    } catch (error) {
      toaster.create({
        description: "ERROR!",
        type: "error",
      })
    }
  }

  const receberDadosdoFilho = async (content) => {
    await registerUsuario(content)
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
    <Box
        w="50%"
        display="flex"
        justifyContent="center"
        alignItems="center"
    >
        <Box
          bg="#14101a"
          borderRadius="md"
          boxShadow="lg"
          p={8}
          minW="350px"
        >
          <VStack align="left" spacing={6}>
            <Heading fontFamily="Montserrat" color="white" textAlign="center" as="h1" fontSize={32} fontWeight={600}>
              Preencha seus dados!
            </Heading>
            <RegisterInput mandarDadosdofilho={receberDadosdoFilho} />
          </VStack>
        </Box>
      </Box>
      <Toaster />
    </Box>
  );
} 