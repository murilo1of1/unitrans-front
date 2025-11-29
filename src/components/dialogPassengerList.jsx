import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Flex,
} from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import api from "@/utils/axios";
import { useState, useEffect } from "react";
import { FiUsers, FiMapPin } from "react-icons/fi";

export default function DialogPassengerList({ isOpen, onClose, route }) {
  const [passageirosData, setPassageirosData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tipoAtivo, setTipoAtivo] = useState("embarque"); // 'embarque' ou 'desembarque'

  useEffect(() => {
    if (isOpen && route) {
      fetchAllPassageiros();
    }
  }, [isOpen, route]);

  // Busca todos os dados de uma vez (embarque e desembarque)
  const fetchAllPassageiros = async () => {
    if (!route?.id) return;

    setIsLoading(true);
    try {
      const authToken = localStorage.getItem("token");
      const response = await api.post(
        "/rotas/passageiros",
        {
          idRota: route.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data) {
        setPassageirosData(response.data.data);
      }
    } catch (error) {
      console.error("Erro ao buscar passageiros:", error);
      toaster.create({
        title: "Erro ao carregar passageiros",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTipoChange = (tipo) => {
    setTipoAtivo(tipo);
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={onClose}
      motionPreset="slide-in-bottom"
      placement="center"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            bg="white"
            color="#1e293b"
            borderRadius="lg"
            maxW="900px"
            w="90vw"
          >
            <Dialog.Header borderBottom="1px solid #e2e8f0" pb={4}>
              <Dialog.Title
                fontFamily="Montserrat"
                color="#1e293b"
                fontSize="xl"
                fontWeight="bold"
              >
                <Flex alignItems="center" gap={2}>
                  <FiUsers />
                  Passageiros - {route?.nome}
                </Flex>
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <VStack spacing={4} align="stretch">
                {/* Botões para alternar tipo */}
                <Flex gap={2}>
                  <Button
                    onClick={() => handleTipoChange("embarque")}
                    bg={tipoAtivo === "embarque" ? "#fdb525" : "gray.100"}
                    color={tipoAtivo === "embarque" ? "white" : "gray.600"}
                    fontFamily="Montserrat"
                    fontWeight="bold"
                    size="sm"
                    _hover={{
                      bg: tipoAtivo === "embarque" ? "#f59e0b" : "gray.200",
                    }}
                  >
                    Pontos de Embarque
                  </Button>
                  <Button
                    onClick={() => handleTipoChange("desembarque")}
                    bg={tipoAtivo === "desembarque" ? "#fdb525" : "gray.100"}
                    color={tipoAtivo === "desembarque" ? "white" : "gray.600"}
                    fontFamily="Montserrat"
                    fontWeight="bold"
                    size="sm"
                    _hover={{
                      bg: tipoAtivo === "desembarque" ? "#f59e0b" : "gray.200",
                    }}
                  >
                    Pontos de Desembarque
                  </Button>
                </Flex>

                {/* Lista de pontos com passageiros */}
                {isLoading ? (
                  <Box textAlign="center" py={8}>
                    <Text fontFamily="Montserrat" color="#64748b">
                      Carregando passageiros...
                    </Text>
                  </Box>
                ) : !passageirosData ? (
                  <Box textAlign="center" py={8}>
                    <Text fontFamily="Montserrat" color="#64748b">
                      Erro ao carregar dados
                    </Text>
                  </Box>
                ) : (
                  (() => {
                    // Filtrar pontos pelo tipo ativo
                    const pontosFiltrados =
                      passageirosData.pontosComPassageiros.filter(
                        (ponto) => ponto.ponto.tipo === tipoAtivo
                      );
                    const totalPassageirosTipo = pontosFiltrados.reduce(
                      (total, ponto) => total + ponto.totalPassageiros,
                      0
                    );

                    if (pontosFiltrados.length === 0) {
                      return (
                        <Box textAlign="center" py={8}>
                          <Text fontFamily="Montserrat" color="#64748b">
                            Nenhum ponto de {tipoAtivo} configurado nesta rota
                          </Text>
                        </Box>
                      );
                    }

                    return (
                      <VStack spacing={4} align="stretch">
                        {/* Resumo */}
                        <Box
                          bg="#f8fafc"
                          p={3}
                          borderRadius="md"
                          border="1px solid #e2e8f0"
                        >
                          <Flex justify="space-between" align="center">
                            <Text
                              fontFamily="Montserrat"
                              fontWeight="bold"
                              color="#1e293b"
                            >
                              Total de Passageiros ({tipoAtivo}):{" "}
                              {totalPassageirosTipo}
                            </Text>
                            <Badge
                              bg="#e2e8f0"
                              color="#475569"
                              fontSize="xs"
                              px={2}
                              py={1}
                              borderRadius="full"
                            >
                              {pontosFiltrados.length} pontos
                            </Badge>
                          </Flex>
                        </Box>

                        {/* Lista de pontos */}
                        {pontosFiltrados.map((pontoData, index) => (
                          <Box
                            key={pontoData.ponto.id}
                            bg="white"
                            border="1px solid #e2e8f0"
                            borderRadius="md"
                            overflow="hidden"
                            boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1)"
                          >
                            {/* Cabeçalho do ponto */}
                            <Flex
                              bg="#f8fafc"
                              p={3}
                              justify="space-between"
                              align="center"
                              borderBottom="1px solid #e2e8f0"
                            >
                              <Flex align="center" gap={2}>
                                <FiMapPin color="#fdb525" />
                                <Box>
                                  <Text
                                    fontFamily="Montserrat"
                                    fontWeight="bold"
                                    color="#1e293b"
                                  >
                                    {pontoData.ponto.nome}
                                  </Text>
                                  <Text
                                    fontFamily="Montserrat"
                                    fontSize="sm"
                                    color="#64748b"
                                  >
                                    {pontoData.ponto.endereco ||
                                      "Endereço não informado"}
                                  </Text>
                                </Box>
                              </Flex>
                              <HStack spacing={2}>
                                <Badge
                                  bg="#e2e8f0"
                                  color="#475569"
                                  fontSize="xs"
                                  px={2}
                                  py={1}
                                  borderRadius="full"
                                >
                                  #{pontoData.ponto.ordem}
                                </Badge>
                                <Badge
                                  bg={
                                    pontoData.totalPassageiros > 0
                                      ? "#dcfce7"
                                      : "#fee2e2"
                                  }
                                  color={
                                    pontoData.totalPassageiros > 0
                                      ? "#16a34a"
                                      : "#dc2626"
                                  }
                                  fontSize="xs"
                                  px={2}
                                  py={1}
                                  borderRadius="full"
                                >
                                  {pontoData.totalPassageiros} passageiro
                                  {pontoData.totalPassageiros !== 1 ? "s" : ""}
                                </Badge>
                              </HStack>
                            </Flex>

                            {/* Lista de passageiros */}
                            {pontoData.passageiros.length === 0 ? (
                              <Box p={4} textAlign="center">
                                <Text
                                  fontFamily="Montserrat"
                                  fontSize="sm"
                                  color="#64748b"
                                  fontStyle="italic"
                                >
                                  Nenhum passageiro configurado para este ponto
                                </Text>
                              </Box>
                            ) : (
                              <VStack spacing={0} align="stretch">
                                {pontoData.passageiros.map(
                                  (passageiro, pIndex) => (
                                    <Flex
                                      key={passageiro.id}
                                      p={3}
                                      borderBottom={
                                        pIndex <
                                        pontoData.passageiros.length - 1
                                          ? "1px solid #f1f5f9"
                                          : "none"
                                      }
                                      align="center"
                                      _hover={{ bg: "#f8fafc" }}
                                    >
                                      <Box flex="1">
                                        <Text
                                          fontFamily="Montserrat"
                                          fontWeight="500"
                                          color="#1e293b"
                                        >
                                          {passageiro.nome}
                                        </Text>
                                        <Text
                                          fontFamily="Montserrat"
                                          fontSize="sm"
                                          color="#64748b"
                                        >
                                          {passageiro.email}
                                        </Text>
                                      </Box>
                                    </Flex>
                                  )
                                )}
                              </VStack>
                            )}
                          </Box>
                        ))}
                      </VStack>
                    );
                  })()
                )}
              </VStack>
            </Dialog.Body>

            <Dialog.Footer />

            <Dialog.CloseTrigger asChild>
              <CloseButton
                size="sm"
                color="#64748b"
                _hover={{ bg: "#f1f5f9" }}
              />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
      <Toaster />
    </Dialog.Root>
  );
}
