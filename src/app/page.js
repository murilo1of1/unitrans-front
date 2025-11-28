"use client";
import {
  Box,
  Flex,
  Heading,
  Button,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { CiLogin, CiUser, CiCircleQuestion } from "react-icons/ci";

export default function HomePage() {
  const router = useRouter();

  return (
    <Box
      minH="100vh"
      bgImage="url(/fundotelainicial.png)"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
    >
      <Flex
        as="header"
        w="100%"
        h="100px"
        bg="#e5c4ff"
        color="black"
        align="center"
        justify="space-between"
        px={8}
        boxSizing="border-box"
        position="relative"
        zIndex={10}
      >
        <Flex align="center" gap={2}>
          <Image
            mr="15px"
            ml="50px"
            src="/logo.png"
            alt="logo"
            boxSize="200px"
            objectFit="contain"
          ></Image>
        </Flex>

        <Flex align="center" gap={3}>
          <IconButton
            fontFamily="Montserrat"
            fontWeight="bold"
            bg="transparent"
            variant="ghost"
            color="#342151"
            size="md"
            borderRadius="md"
            px={5}
            _hover={{
              bg: "#fdb525",
              color: "#342151",
              opacity: 0.9,
              transform: "scale(1.01)",
              transition: "0.3s",
            }}
            onClick={() => router.push("/")}
          >
            <CiCircleQuestion />
            Como Funciona
          </IconButton>
          <IconButton
            fontFamily="Montserrat"
            fontWeight="bold"
            bg="transparent"
            variant="ghost"
            color="#342151"
            size="md"
            borderRadius="md"
            px={5}
            _hover={{
              bg: "#fdb525",
              color: "#342151",
              opacity: 0.9,
              transform: "scale(1.01)",
              transition: "0.3s",
            }}
            onClick={() => router.push("/register")}
          >
            <CiUser />
            Criar Conta
          </IconButton>  
            
          {/* Botão Desktop */}
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
            onClick={() => router.push("/login")}
          >
            <CiLogin />
            Entrar
          </IconButton>

          {/* Botão Mobile */}
          <IconButton
            bg="transparent"
            color="#342151"
            size="sm"
            minW="40px"
            px={2}
            display={{ base: "flex", md: "none" }}
            _hover={{
              bg: "#fdb525",
              color: "#342151",
            }}
            onClick={() => router.push("/login")}
          >
            <CiLogin size={24} />
          </IconButton>
        </Flex>
      </Flex>

      <Flex
        w="100%"
        h={`calc(100vh - 70px)`}
        align="center"
        justify="space-between"
        px={16}
        py={8}
      >
        <Box display="flex">
          <Box>
            <Heading
              fontFamily="Montserrat"
              as="h1"
              fontSize="3xl"
              color="#fff"
              fontWeight="bold"
              ml={55}
              mt={-130}
            >
              Seu trajeto universitário, sem complicação!
            </Heading>
            <Button
              fontFamily="Montserrat"
              w="180px"
              bg="#fdb525"
              color="white"
              size="lg"
              fontSize="lg"
              fontWeight="700"
              borderRadius="md"
              mt={4}
              ml={55}
              _hover={{
                opacity: 0.9,
                transform: "scale(1.01)",
                transition: "0.3s",
              }}
              onClick={() => router.push("/login")}
            >
              Quero começar
            </Button>
          </Box>
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <Image
            src="/mascotao.png"
            alt="Logo grande"
            boxSize="490px"
            mr={95}
          />
        </Box>
      </Flex>
    </Box>
  );
}
