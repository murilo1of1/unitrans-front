"use client";

import { Box, Heading, VStack, Image } from "@chakra-ui/react";
import React, { useState } from "react";
import RegisterInput from "@/components/registerInput";
import { toaster } from "@/components/ui/toaster";
import axios from "@/utils/axios";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [userType, setUserType] = useState("aluno");

  const registerUsuario = async (content, userType) => {
    try {
      const endpoint = userType === "aluno" ? "/alunos" : "/empresas";
      const response = await axios.post(endpoint, { ...content });

      if (response.status == 200 || response.status === 201) {
        const userTypeLabel = userType === "aluno" ? "Aluno" : "Empresa";
        toaster.create({
          description: `${userTypeLabel} criado com sucesso! Redirecionando para o login...`,
          type: "success",
        });

        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        toaster.create({
          description: `Erro ao criar ${userType}!`,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao registrar:", error);
      toaster.create({
        description: error.response?.data?.message || "Erro ao criar conta!",
        type: "error",
      });
    }
  };

  const receberDadosdoFilho = async (content, userType) => {
    await registerUsuario(content, userType);
  };

  return (
    <Box
      w="100vw"
      h="100vh"
      maxH="100vh"
      overflow="hidden"
      display="flex"
      justifyContent="center"
      alignItems="center"
      filter="contrast(95%)"
      bgImage={"url(/fundotelainicial.png)"}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      suppressHydrationWarning
    >
      <Box
        w={{ base: "100%", md: "50%" }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          h={{ base: "550px", md: "630px" }}
          bg="#282738"
          borderRadius={20}
          boxShadow="0 10px 30px rgba(0,0,0,0.3)"
          p={{ base: 8, md: 10 }}
          w={{ base: "90%", md: "630px" }}
          maxW={{ base: "90%", md: "630px" }}
        >
          <VStack align="left" spacing={6}>
            <Image
              alignSelf="center"
              src="/logosolo.png"
              alt="logo"
              objectFit="contain"
              boxSize="180px"
              mb={-8}
              mt={-8}
            />

            <Heading
              fontFamily="Montserrat"
              color="white"
              textAlign="center"
              as="h1"
              fontSize={32}
              fontWeight={600}
            >
              Preencha seus dados!
            </Heading>

            <RegisterInput mandarDadosdofilho={receberDadosdoFilho} />
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}
