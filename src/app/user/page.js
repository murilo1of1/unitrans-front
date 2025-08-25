"use client";
import { Box, Flex, Text, Button, Image, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function User() {
  const [activeSection, setActiveSection] = useState("botao1");
  const [userInfo, setUserInfo] = useState(null);
  const router = useRouter();

  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "botao1":
        return (
          <Box textAlign="center" mt={8}>
            <Text
              fontFamily="Montserrat"
              fontSize="2xl"
              fontWeight="bold"
              color="#334155"
              mb={4}
            >
              Seção Botão 1
            </Text>
            <Text fontFamily="Montserrat" fontSize="lg" color="gray.600">
              Conteúdo do Botão 1 - Em desenvolvimento
            </Text>
          </Box>
        );
      case "botao2":
        return (
          <Box textAlign="center" mt={8}>
            <Text
              fontFamily="Montserrat"
              fontSize="2xl"
              fontWeight="bold"
              color="#334155"
              mb={4}
            >
              Seção Botão 2
            </Text>
            <Text fontFamily="Montserrat" fontSize="lg" color="gray.600">
              Conteúdo do Botão 2 - Em desenvolvimento
            </Text>
          </Box>
        );
      case "botao3":
        return (
          <Box textAlign="center" mt={8}>
            <Text
              fontFamily="Montserrat"
              fontSize="2xl"
              fontWeight="bold"
              color="#334155"
              mb={4}
            >
              Seção Botão 3
            </Text>
            <Text fontFamily="Montserrat" fontSize="lg" color="gray.600">
              Conteúdo do Botão 3 - Em desenvolvimento
            </Text>
          </Box>
        );
      default:
        return (
          <Box textAlign="center" mt={8}>
            <Text fontFamily="Montserrat" fontSize="lg" color="gray.600">
              Selecione uma opção no menu lateral
            </Text>
          </Box>
        );
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const decodedToken = decodeToken(token);

    if (!decodedToken) {
      console.error("Token inválido");
      router.push("/login");
      return;
    }

    setUserInfo(decodedToken);
  }, [router]);

  return (
    <Box minH="100vh" bg="#E2E8F0">
      <Flex
        as="header"
        justify="space-between"
        w="100%"
        h="80px"
        bg="white"
        color="#334155"
        align="center"
        position="fixed"
        top={0}
        left={0}
        boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1)"
      >
        <Flex align="center">
          <Image
            src="/logosolo.png"
            alt="logo"
            objectFit="contain"
            boxSize="100px"
            mt={2}
            ml={4}
          />
          <Text
            fontFamily="Montserrat"
            color="#334155"
            fontWeight="bold"
            fontSize="lg"
          >
            Painel do Usuário{" "}
            {userInfo ? `- ${userInfo.nome || userInfo.email}` : ""}
          </Text>
        </Flex>
        <Flex>
          <Button
            bg="#fdb525"
            color="white"
            fontFamily="Montserrat"
            fontWeight="bold"
            borderRadius="md"
            mr={8}
            _hover={{
              bg: "#f59e0b",
              transform: "scale(1.02)",
              transition: "0.3s",
            }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Flex>
      </Flex>

      <Flex pt="80px">
        <Box
          w="280px"
          bg="#2c2b3c"
          minH="calc(100vh - 80px)"
          position="fixed"
          left={0}
          top="80px"
        >
          <VStack spacing={1} align="stretch" p={4}>
            <Button
              bg={activeSection === "botao1" ? "#fdb525" : "transparent"}
              color="white"
              fontFamily="Montserrat"
              fontWeight="500"
              justifyContent="flex-start"
              borderRadius="lg"
              py={6}
              px={4}
              mb={1}
              leftIcon={<Text fontSize="md">🔹</Text>}
              _hover={{
                bg: activeSection === "botao1" ? "#fdb525" : "#475569",
                transform: "scale(1.01)",
                transition: "0.2s",
              }}
              onClick={() => handleSectionChange("botao1")}
            >
              Botão 1
            </Button>
            <Button
              bg={activeSection === "botao2" ? "#fdb525" : "transparent"}
              color="white"
              fontFamily="Montserrat"
              fontWeight="500"
              justifyContent="flex-start"
              borderRadius="lg"
              py={6}
              px={4}
              mb={1}
              leftIcon={<Text fontSize="md">🔸</Text>}
              _hover={{
                bg: activeSection === "botao2" ? "#fdb525" : "#475569",
                transform: "scale(1.01)",
                transition: "0.2s",
              }}
              onClick={() => handleSectionChange("botao2")}
            >
              Botão 2
            </Button>
            <Button
              bg={activeSection === "botao3" ? "#fdb525" : "transparent"}
              color="white"
              fontFamily="Montserrat"
              fontWeight="500"
              justifyContent="flex-start"
              borderRadius="lg"
              py={6}
              px={4}
              leftIcon={<Text fontSize="md">🔷</Text>}
              _hover={{
                bg: activeSection === "botao3" ? "#fdb525" : "#475569",
                transform: "scale(1.01)",
                transition: "0.2s",
              }}
              onClick={() => handleSectionChange("botao3")}
            >
              Botão 3
            </Button>
          </VStack>
        </Box>

        <Box ml="280px" flex={1} p={8}>
          {renderContent()}
        </Box>
      </Flex>
    </Box>
  );
}
