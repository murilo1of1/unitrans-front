"use client";
import { Box, Flex, Text, Button, Image, VStack, Card } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axios";
import DialogAddCompany from "@/components/dialogAddCompany";

export default function User() {
  const [companies, setCompanies] = useState([]);
  const [aluno, setAluno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("empresas");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const handleCompanyAdded = () => {
    const token = localStorage.getItem("token");
    const decodedToken = decodeToken(token);
    
    if (decodedToken && (decodedToken.idAluno || decodedToken.id)) {
      const studentId = decodedToken.idAluno || decodedToken.id;
      fetchCompanies(studentId, token);
    }
  };

  const fetchCompanies = async (idAluno, token) => {
    setLoading(true);
    try {
      const response = await api.get(
        `/vinculo/aluno/${idAluno}?ativo=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data) {
        setCompanies(
          Array.isArray(response.data.data) ? response.data.data : []
        );
      } else {
        setCompanies([]);
      }
    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      }
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "empresas":
        return (
          <Box>
            <Flex justifyContent="space-between" alignItems="center" mb={6}>
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color="#334155"
                fontFamily="Montserrat"
              >
                Suas Empresas
              </Text>
              <Button
                bg="#fdb525"
                color="white"
                fontFamily="Montserrat"
                fontWeight="bold"
                borderRadius="md"
                px={6}
                py={2}
                _hover={{
                  bg: "#f59e0b",
                  transform: "scale(1.02)",
                  transition: "0.3s",
                }}
                onClick={() => setIsDialogOpen(true)}
              >
                Adicionar Empresa
              </Button>
            </Flex>

            {loading ? (
              <Box textAlign="center" py={8}>
                <Text fontFamily="Montserrat" color="gray.500">
                  Carregando empresas...
                </Text>
              </Box>
            ) : companies.length === 0 ? (
              <Box textAlign="center" py={12}>
                <Text fontFamily="Montserrat" fontSize="lg" color="gray.500" mb={4}>
                  Você ainda não está vinculado a nenhuma empresa.
                </Text>
                <Text fontFamily="Montserrat" color="gray.400" mb={6}>
                  Adicione uma empresa para ter acesso aos seus veículos!
                </Text>
              </Box>
            ) : (
              <Box>
                {companies.map((vinculo) => (
                  <Card.Root
                    key={vinculo.id}
                    bg="white"
                    borderRadius="lg"
                    boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                    border="1px solid #E2E8F0"
                    mb={4}
                    p={6}
                    _hover={{ 
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", 
                      transform: "translateY(-1px)", 
                      transition: "all 0.2s" 
                    }}
                  >
                    <Flex justifyContent="space-between" alignItems="center">
                      <Flex alignItems="center">
                        <Box
                          w="60px"
                          h="60px"
                          bg="#fdb525"
                          borderRadius="lg"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          mr={4}
                        >
                          <Text fontSize="2xl" color="white">
                            🚐
                          </Text>
                        </Box>
                        <Box>
                          <Text
                            fontFamily="Montserrat"
                            fontSize="xl"
                            fontWeight="bold"
                            color="#334155"
                          >
                            {vinculo.empresa?.nome || "Empresa"}
                          </Text>
                          <Text
                            fontFamily="Montserrat"
                            fontSize="sm"
                            color="gray.500"
                          >
                            Vinculado em {new Date(vinculo.dataVinculo).toLocaleDateString()}
                          </Text>
                        </Box>
                      </Flex>
                      <Button
                        size="sm"
                        bg="transparent"
                        color="#64748B"
                        border="1px solid #E2E8F0"
                        fontFamily="Montserrat"
                        _hover={{ 
                          color: "#334155", 
                          bg: "#F1F5F9",
                          borderColor: "#CBD5E1"
                        }}
                      >
                        Ver Veículos
                      </Button>
                    </Flex>
                  </Card.Root>
                ))}
              </Box>
            )}
          </Box>
        );
      case "pagamentos":
        return (
          <Box textAlign="center" mt={8}>
            <Text fontFamily="Montserrat" fontSize="lg" color="gray.600">
              Seção de Pagamentos - Em desenvolvimento
            </Text>
          </Box>
        );
      case "solicitacoes":
        return (
          <Box textAlign="center" mt={8}>
            <Text fontFamily="Montserrat" fontSize="lg" color="gray.600">
              Seção de Solicitações - Em desenvolvimento
            </Text>
          </Box>
        );
      case "configuracoes":
        return (
          <Box textAlign="center" mt={8}>
            <Text fontFamily="Montserrat" fontSize="lg" color="gray.600">
              Seção de Configurações - Em desenvolvimento
            </Text>
          </Box>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const decodedToken = decodeToken(token);

    console.log("Decoded token:", decodedToken); // Debug

    if (!decodedToken || (!decodedToken.idAluno && !decodedToken.id)) {
      console.error("Token inválido");
      router.push("/login");
      return;
    }

    setAluno(decodedToken);
    // Usa idAluno se existir, senão usa id
    const studentId = decodedToken.idAluno || decodedToken.id;
    fetchCompanies(studentId, token);
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
            Área do Aluno {aluno ? `- ${aluno.nome}` : ""}
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
              bg={activeSection === "empresas" ? "#fdb525" : "transparent"}
              color="white"
              fontFamily="Montserrat"
              fontWeight="500"
              justifyContent="flex-start"
              borderRadius="lg"
              py={6}
              px={4}
              mb={1}
              leftIcon={<Text fontSize="md">🏢</Text>}
              _hover={{
                bg: activeSection === "empresas" ? "#fdb525" : "#475569",
                transform: "scale(1.01)",
                transition: "0.2s",
              }}
              onClick={() => handleSectionChange("empresas")}
            >
              Empresas
            </Button>
            <Button
              bg={activeSection === "pagamentos" ? "#fdb525" : "transparent"}
              color="white"
              fontFamily="Montserrat"
              fontWeight="500"
              justifyContent="flex-start"
              borderRadius="lg"
              py={6}
              px={4}
              mb={1}
              leftIcon={<Text fontSize="md">💳</Text>}
              _hover={{
                bg: activeSection === "pagamentos" ? "#fdb525" : "#475569",
                transform: "scale(1.01)",
                transition: "0.2s",
              }}
              onClick={() => handleSectionChange("pagamentos")}
            >
              Pagamentos
            </Button>
            <Button
              bg={activeSection === "solicitacoes" ? "#fdb525" : "transparent"}
              color="white"
              fontFamily="Montserrat"
              fontWeight="500"
              justifyContent="flex-start"
              borderRadius="lg"
              py={6}
              px={4}
              mb={1}
              leftIcon={<Text fontSize="md">📋</Text>}
              _hover={{
                bg: activeSection === "solicitacoes" ? "#fdb525" : "#475569",
                transform: "scale(1.01)",
                transition: "0.2s",
              }}
              onClick={() => handleSectionChange("solicitacoes")}
            >
              Solicitações
            </Button>
            <Button
              bg={activeSection === "configuracoes" ? "#fdb525" : "transparent"}
              color="white"
              fontFamily="Montserrat"
              fontWeight="500"
              justifyContent="flex-start"
              borderRadius="lg"
              py={6}
              px={4}
              leftIcon={<Text fontSize="md">⚙️</Text>}
              _hover={{
                bg: activeSection === "configuracoes" ? "#fdb525" : "#475569",
                transform: "scale(1.01)",
                transition: "0.2s",
              }}
              onClick={() => handleSectionChange("configuracoes")}
            >
              Configurações
            </Button>
          </VStack>
        </Box>

        <Box ml="280px" flex={1} p={8}>
          {renderContent()}
        </Box>
      </Flex>

      <DialogAddCompany
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCompanyAdded={handleCompanyAdded}
        idAluno={aluno?.idAluno || aluno?.id}
      />
    </Box>
  );
}