"use client";
import {
  Box,
  Flex,
  Heading,
  Button,
  IconButton,
  Image,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { CiLogin, CiUser, CiCircleQuestion } from "react-icons/ci";

export default function HomePage() {
  const router = useRouter();

  return (
    <Box
      minH="100vh"
      maxH="100vh"
      w="100vw"
      overflow="hidden"
      bgImage="url(/fundotelainicial.png)"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      suppressHydrationWarning
    >
      <Flex
        as="header"
        w="100%"
        h={{ base: "70px", md: "100px" }}
        bg="#e5c4ff"
        color="black"
        align="center"
        justify="space-between"
        px={{ base: 4, md: 8 }}
        boxSizing="border-box"
        position="relative"
        zIndex={10}
        suppressHydrationWarning
      >
        {/* Logo */}
        <Flex align="center" gap={2}>
          <Image
            src="/logo.png"
            alt="logo"
            boxSize={{ base: "120px", md: "200px" }}
            objectFit="contain"
            ml={{ base: 0, md: "50px" }}
            mr={{ base: 0, md: "15px" }}
          />
        </Flex>

        {/* Menu de Navegação */}
        <Flex align="center" gap={{ base: 1, md: 3 }}>
          {/* Como Funciona - Desktop only */}
          <IconButton
            fontFamily="Montserrat"
            fontWeight="bold"
            bg="transparent"
            variant="ghost"
            color="#342151"
            size={{ base: "sm", md: "md" }}
            borderRadius="md"
            px={{ base: 2, md: 5 }}
            display={{ base: "none", md: "flex" }}
            _hover={{
              bg: "#fdb525",
              color: "#342151",
              opacity: 0.9,
              transform: "scale(1.01)",
              transition: "0.3s",
            }}
            _active={{
              bg: "#fdb525",
              transform: "scale(0.98)",
            }}
            onClick={() => router.push("/")}
          >
            <CiCircleQuestion />
            Como Funciona
          </IconButton>

          {/* Criar Conta - Desktop */}
          <IconButton
            fontFamily="Montserrat"
            fontWeight="bold"
            bg="transparent"
            variant="ghost"
            color="#342151"
            size={{ base: "sm", md: "md" }}
            borderRadius="md"
            px={{ base: 2, md: 5 }}
            display={{ base: "none", md: "flex" }}
            _hover={{
              bg: "#fdb525",
              color: "#342151",
              opacity: 0.9,
              transform: "scale(1.01)",
              transition: "0.3s",
            }}
            _active={{
              bg: "#fdb525",
              transform: "scale(0.98)",
            }}
            onClick={() => router.push("/register")}
          >
            <CiUser />
            Criar Conta
          </IconButton>

          {/* Criar Conta - Mobile (apenas ícone) */}
          <IconButton
            bg="transparent"
            color="#342151"
            size="sm"
            minW="40px"
            px={2}
            display={{ base: "flex", md: "none" }}
            _active={{
              bg: "#fdb525",
              transform: "scale(0.95)",
            }}
            onClick={() => router.push("/register")}
          >
            <CiUser size={24} />
          </IconButton>

          {/* Entrar - Desktop */}
          <IconButton
            fontFamily="Montserrat"
            fontWeight="bold"
            bg="transparent"
            variant="ghost"
            color="#342151"
            size="md"
            borderRadius="md"
            px={5}
            mr="20px"
            display={{ base: "none", md: "flex" }}
            _hover={{
              bg: "#fdb525",
              color: "#342151",
              opacity: 0.9,
              transform: "scale(1.01)",
              transition: "0.3s",
            }}
            _active={{
              bg: "#fdb525",
              transform: "scale(0.98)",
            }}
            onClick={() => router.push("/login")}
          >
            <CiLogin />
            Entrar
          </IconButton>

          {/* Entrar - Mobile */}
          <IconButton
            bg="transparent"
            color="#342151"
            size="sm"
            minW="40px"
            px={2}
            display={{ base: "flex", md: "none" }}
            _active={{
              bg: "#fdb525",
              transform: "scale(0.95)",
            }}
            onClick={() => router.push("/login")}
          >
            <CiLogin size={24} />
          </IconButton>
        </Flex>
      </Flex>

      <Flex
        w="100%"
        minH={{ base: "calc(100vh - 70px)", md: "calc(100vh - 100px)" }}
        align="center"
        justify={{ base: "center", md: "space-between" }}
        px={{ base: 4, sm: 6, md: 12, lg: 16 }}
        py={{ base: 6, md: 8 }}
        flexDirection={{ base: "column", md: "row" }}
        gap={{ base: 6, md: 0 }}
        suppressHydrationWarning
      >
        {/* Seção de Texto e CTA */}
        <VStack
          align={{ base: "center", md: "flex-start" }}
          spacing={{ base: 4, md: 6 }}
          flex={1}
          maxW={{ base: "100%", md: "600px" }}
          ml={{ base: 0, md: 8, lg: 55 }}
          mt={{ base: 8, md: -16, lg: -130 }}
        >
          <Heading
            fontFamily="Montserrat"
            as="h1"
            fontSize={{ base: "2xl", sm: "3xl", md: "4xl", lg: "5xl" }}
            color="#fff"
            fontWeight="bold"
            textAlign={{ base: "center", md: "left" }}
            lineHeight="1.2"
            px={{ base: 2, md: 0 }}
          >
            Seu trajeto universitário, sem complicação!
          </Heading>

          <Button
            fontFamily="Montserrat"
            w={{ base: "100%", sm: "220px", md: "180px" }}
            maxW="300px"
            bg="#fdb525"
            color="white"
            size={{ base: "lg", md: "lg" }}
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="700"
            borderRadius="md"
            mb={{ base: 12, md: 0 }}
            _hover={{
              opacity: 0.9,
              transform: "scale(1.01)",
              transition: "0.3s",
            }}
            _active={{
              transform: "scale(0.98)",
            }}
            onClick={() => router.push("/login")}
          >
            Quero começar
          </Button>
        </VStack>

        <Box
          display="flex"
          justifyContent={{ base: "center", md: "flex-end" }}
          flex={{ base: "none", md: 1 }}
          mt={{ base: -12, md: 0 }}
        >
          <Image
            src="/mascotao.png"
            alt="Mascote Unitrans"
            boxSize={{ base: "300px", sm: "300px", md: "350px", lg: "490px" }}
            objectFit="contain"
            mr={{ base: 0, md: 8, lg: 95 }}
          />
        </Box>
      </Flex>
    </Box>
  );
}
