"use client";
import {
  Box,
  Flex,
  Heading,
  Button,
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
      overflowX="hidden"
    >
      <Flex
        as="header"
        w="100%"
        h={{ base: '70px', md: '100px' }}
        bg="#e5c4ff"
        color="black"
        align="center"
        justify="space-between"
        px={{ base: 4, md: 8 }}
        boxSizing="border-box"
        position="relative"
        zIndex={10}
      >
        <Flex align="center" gap={2}>
          <Image
            mr={{ base: 4, md: '10px' }}
            src="/logo.png"
            alt="logo"
            boxSize={{ base: '120px', md: '200px' }}
            objectFit="contain"
          />
        </Flex>

        <Flex align="center" gap={{ base: 2, md: 3 }}>
          {/* Desktop - Botão com ícone e texto */}
          <Button
            fontFamily="Montserrat"
            fontWeight="bold"
            bg="transparent"
            color="#342151"
            size="md"
            fontSize="md"
            px={4}
            display={{ base: 'none', md: 'flex' }}
            leftIcon={<CiCircleQuestion size={20} />}
            _hover={{
              bg: "#fdb525",
              color: "#342151",
            }}
            onClick={() => router.push("/")}
          >
            Como Funciona
          </Button>
          
          {/* Mobile - Só ícone */}
          <Button
            bg="transparent"
            color="#342151"
            size="sm"
            minW="40px"
            px={2}
            display={{ base: 'flex', md: 'none' }}
            _hover={{
              bg: "#fdb525",
              color: "#342151",
            }}
            onClick={() => router.push("/")}
          >
            <CiCircleQuestion size={24} />
          </Button>

          {/* Desktop - Botão com ícone e texto */}
          <Button
            fontFamily="Montserrat"
            fontWeight="bold"
            bg="transparent"
            color="#342151"
            size="md"
            fontSize="md"
            px={4}
            display={{ base: 'none', md: 'flex' }}
            leftIcon={<CiUser size={20} />}
            _hover={{
              bg: "#fdb525",
              color: "#342151",
            }}
            onClick={() => router.push("/register")}
          >
            Criar Conta
          </Button>
          
          {/* Mobile - Só ícone */}
          <Button
            bg="transparent"
            color="#342151"
            size="sm"
            minW="40px"
            px={2}
            display={{ base: 'flex', md: 'none' }}
            _hover={{
              bg: "#fdb525",
              color: "#342151",
            }}
            onClick={() => router.push("/register")}
          >
            <CiUser size={24} />
          </Button>

          {/* Desktop - Botão com ícone e texto */}
          <Button
            fontFamily="Montserrat"
            fontWeight="bold"
            bg="transparent"
            color="#342151"
            size="md"
            fontSize="md"
            px={4}
            mr="20px"
            display={{ base: 'none', md: 'flex' }}
            leftIcon={<CiLogin size={20} />}
            _hover={{
              bg: "#fdb525",
              color: "#342151",
            }}
            onClick={() => router.push("/login")}
          >
            Entrar
          </Button>
          
          {/* Mobile - Só ícone */}
          <Button
            bg="transparent"
            color="#342151"
            size="sm"
            minW="40px"
            px={2}
            display={{ base: 'flex', md: 'none' }}
            onClick={{
              bg: "#fdb525",
              color: "#342151",
            }}
            onClick={() => router.push("/login")}
          >
            <CiLogin size={24} />
          </Button>
        </Flex>
      </Flex>

      <Flex
        w="100%"
        h={{ base: 'auto', md: `calc(100vh - 100px)` }}
        align="center"
        justify="space-between"
        px={{ base: 4, md: 16 }}
        py={{ base: 6, md: 8 }}
        direction={{ base: 'column', md: 'row' }}
      >
        <Box display="flex" w="100%" justifyContent={{ base: 'center', md: 'flex-start' }}>
          <Box display="flex" flexDirection="column" alignItems={{ base: 'center', md: 'flex-start' }}>
            <Heading
              fontFamily="Montserrat"
              as="h1"
              fontSize={{ base: 'xl', md: '3xl' }}
              color="#fff"
              fontWeight="bold"
              textAlign={{ base: 'center', md: 'left' }}
              ml={{ base: 0, md: 55 }}
              mt={{ base: 0, md: -130 }}
            >
              Seu trajeto universitário, sem complicação!
            </Heading>
            <Button
              fontFamily="Montserrat"
              w={{ base: '160px', md: '180px' }}
              bg="#fdb525"
              color="white"
              size={{ base: 'md', md: 'lg' }}
              fontSize={{ base: 'md', md: 'lg' }}
              fontWeight="700"
              borderRadius="md"
              mt={{ base: 4, md: 4 }}
              ml={{ base: 0, md: 55 }}
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
        <Box display="flex" justifyContent={{ base: 'center', md: 'flex-end' }} mt={{ base: 8, md: 0 }}>
          <Image
            src="/mascotao.png"
            alt="Logo grande"
            boxSize={{ base: '220px', md: '490px' }}
            mr={{ base: 0, md: 95 }}
          />
        </Box>
      </Flex>
    </Box>
  );
}