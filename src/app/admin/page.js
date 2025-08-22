"use client";
import { Box, Flex, Text, Button, Image, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axios";
import TabelaVeiculos from "@/components/tableVehiclesNew";
import InputPesquisa from "@/components/inputPesquisa";
import DialogCreateVehicle from "@/components/dialogCreateVehicle";

export default function Admin() {
  const [vehicles, setVehicles] = useState([]);
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState("veiculos");
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

  const handleVehicleCreated = () => {
    const token = localStorage.getItem("token");
    const decodedToken = decodeToken(token);
    
    if (decodedToken && decodedToken.idEmpresa) {
      fetchVehicles(decodedToken.idEmpresa, token);
    }
  };

  const fetchVehicles = async (idEmpresa, token) => {
    setLoading(true);
    try {
      const response = await api.get(
        `/empresa/${idEmpresa}/veiculos`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data) {
        setVehicles(
          Array.isArray(response.data.data) ? response.data.data : []
        );
      } else {
        setVehicles([]);
      }
    } catch (error) {
      console.error("Erro ao buscar veículos:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      }
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

    const filteredVehicles = vehicles.filter(
    (item) =>
      item.descricao?.toLowerCase().includes(search.toLowerCase()) ||
      item.modelo?.toLowerCase().includes(search.toLowerCase()) ||
      item.placa?.toLowerCase().includes(search.toLowerCase())
  );

  const renderContent = () => {
    switch (activeSection) {
      case "veiculos":
        return (
          <Box>
            <Flex justifyContent="space-between" alignItems="center" mb={2}>
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color="#334155"
                fontFamily="Montserrat"
              >
                Lista de Veículos
              </Text>
            </Flex>
            <Flex
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <InputPesquisa
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Pesquisar veículo..."
              />
              <Button
                bg="#fdb525"
                color="white"
                fontFamily="Montserrat"
                fontWeight="bold"
                ml={2}
                _hover={{ bg: "#f59e0b", transform: "scale(1.02)", transition: "0.3s" }}
                onClick={() => setIsDialogOpen(true)}
              >
                + Adicionar Veículo
              </Button>
            </Flex>
            <TabelaVeiculos vehicles={filteredVehicles} loading={loading} />
          </Box>
        );
      case "alunos":
        return (
          <Box textAlign="center" mt={8}>
            <Text fontFamily="Montserrat" fontSize="lg" color="gray.600">
              Seção de Alunos - Em desenvolvimento
            </Text>
          </Box>
        );
      case "financeiro":
        return (
          <Box textAlign="center" mt={8}>
            <Text fontFamily="Montserrat" fontSize="lg" color="gray.600">
              Integração Financeira - Em desenvolvimento
            </Text>
          </Box>
        );
      default:
        return <TabelaVeiculos vehicles={vehicles} loading={loading} />;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const decodedToken = decodeToken(token);

    if (!decodedToken || !decodedToken.idEmpresa) {
      console.error("Token inválido");
      router.push("/login");
      return;
    }

    setEmpresa(decodedToken);

    fetchVehicles(decodedToken.idEmpresa, token);
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
            Painel Administrativo {empresa ? `- ${empresa.nome}` : ""}
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
              bg={activeSection === "veiculos" ? "#fdb525" : "transparent"}
              color="white"
              fontFamily="Montserrat"
              fontWeight="500"
              justifyContent="flex-start"
              borderRadius="lg"
              py={6}
              px={4}
              mb={1}
              leftIcon={<Text fontSize="md">🚐</Text>}
              _hover={{
                bg: activeSection === "veiculos" ? "#fdb525" : "#475569",
                transform: "scale(1.01)",
                transition: "0.2s",
              }}
              onClick={() => handleSectionChange("veiculos")}
            >
              Veículos
            </Button>
            <Button
              bg={activeSection === "alunos" ? "#fdb525" : "transparent"}
              color="white"
              fontFamily="Montserrat"
              fontWeight="500"
              justifyContent="flex-start"
              borderRadius="lg"
              py={6}
              px={4}
              mb={1}
              leftIcon={<Text fontSize="md">👥</Text>}
              _hover={{
                bg: activeSection === "alunos" ? "#fdb525" : "#475569",
                transform: "scale(1.01)",
                transition: "0.2s",
              }}
              onClick={() => handleSectionChange("alunos")}
            >
              Alunos
            </Button>
            <Button
              bg={activeSection === "financeiro" ? "#fdb525" : "transparent"}
              color="white"
              fontFamily="Montserrat"
              fontWeight="500"
              justifyContent="flex-start"
              borderRadius="lg"
              py={6}
              px={4}
              leftIcon={<Text fontSize="md">💰</Text>}
              _hover={{
                bg: activeSection === "financeiro" ? "#fdb525" : "#475569",
                transform: "scale(1.01)",
                transition: "0.2s",
              }}
              onClick={() => handleSectionChange("financeiro")}
            >
              Integração Financeira
            </Button>
          </VStack>
        </Box>

        <Box ml="280px" flex={1} p={8}>
          {renderContent()}
        </Box>
      </Flex>

      <DialogCreateVehicle
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreated={handleVehicleCreated}
        idEmpresa={empresa?.idEmpresa}
      />
    </Box>
  );
}
