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
  Select,
  createListCollection,
  Flex,
} from "@chakra-ui/react";
import { FormLabel } from "@chakra-ui/form-control";
import { Toaster, toaster } from "@/components/ui/toaster";
import api from "@/utils/axios";
import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiMapPin } from "react-icons/fi";

export default function DialogManageRoutePoints({ isOpen, onClose, route }) {
  const [pontos, setPontos] = useState([]);
  const [pontosDisponiveis, setPontosDisponiveis] = useState([]);
  const [rotaPontos, setRotaPontos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPonto, setSelectedPonto] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("");

  const tiposCollection = createListCollection({
    items: [
      { label: "Embarque", value: "embarque" },
      { label: "Desembarque", value: "desembarque" },
    ],
  });

  useEffect(() => {
    if (isOpen && route) {
      fetchPontosDisponiveis();
      fetchRotaPontos();
    }
  }, [isOpen, route]);

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

  const fetchPontosDisponiveis = async () => {
    try {
      const authToken = localStorage.getItem("token");
      const decodedToken = decodeToken(authToken);

      if (!decodedToken?.idEmpresa) return;

      const response = await api.get(
        `/empresa/${decodedToken.idEmpresa}/pontos`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data && response.data.data) {
        setPontosDisponiveis(
          Array.isArray(response.data.data) ? response.data.data : []
        );
      }
    } catch (error) {
      console.error("Erro ao buscar pontos disponíveis:", error);
      toaster.create({
        title: "Erro ao carregar pontos",
        status: "error",
      });
    }
  };

  const fetchRotaPontos = async () => {
    if (!route?.id) return;

    try {
      const authToken = localStorage.getItem("token");
      const response = await api.get(`/rota/${route.id}/pontos`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data && response.data.data) {
        setRotaPontos(
          Array.isArray(response.data.data) ? response.data.data : []
        );
      }
    } catch (error) {
      console.error("Erro ao buscar pontos da rota:", error);
      toaster.create({
        title: "Erro ao carregar pontos da rota",
        status: "error",
      });
    }
  };

  const handleAddPonto = async () => {
    if (!selectedPonto || !selectedTipo) {
      toaster.create({
        title: "Selecione um ponto e o tipo",
        status: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      const authToken = localStorage.getItem("token");
      const response = await api.post(
        `/rota/${route.id}/pontos`,
        {
          idPonto: selectedPonto,
          tipo: selectedTipo,
          ordem: rotaPontos.length + 1,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 201) {
        toaster.create({
          title: "Ponto adicionado à rota com sucesso!",
          status: "success",
        });
        setSelectedPonto("");
        setSelectedTipo("");
        fetchRotaPontos();
      }
    } catch (error) {
      console.error("Erro ao adicionar ponto:", error);
      toaster.create({
        title: error.response?.data?.message || "Erro ao adicionar ponto",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePonto = async (rotaPontoId) => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await api.delete(
        `/rota/${route.id}/pontos/${rotaPontoId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        toaster.create({
          title: "Ponto removido da rota com sucesso!",
          status: "success",
        });
        fetchRotaPontos();
      }
    } catch (error) {
      console.error("Erro ao remover ponto:", error);
      toaster.create({
        title: error.response?.data?.message || "Erro ao remover ponto",
        status: "error",
      });
    }
  };

  const pontosCollections = createListCollection({
    items: pontosDisponiveis.map((ponto) => ({
      label: ponto.nome,
      value: ponto.id.toString(),
    })),
  });

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
            bg="#2c2b3c"
            color="#fff"
            borderRadius="lg"
            maxW="600px"
          >
            <Dialog.Header>
              <Dialog.Title
                fontFamily="Montserrat"
                color="#fdb525"
                fontSize="xl"
                fontWeight="bold"
              >
                <Flex alignItems="center" gap={2}>
                  <FiMapPin />
                  Gerenciar Pontos - {route?.nome}
                </Flex>
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack spacing={6} align="stretch">
                {/* Adicionar novo ponto */}
                <Box
                  bg="#3a3947"
                  p={4}
                  borderRadius="md"
                  border="1px solid #4a4a5c"
                >
                  <Text
                    fontFamily="Montserrat"
                    fontWeight="bold"
                    color="#fdb525"
                    mb={3}
                  >
                    Adicionar Ponto à Rota
                  </Text>
                  <VStack spacing={3}>
                    <Box w="100%">
                      <FormLabel
                        fontFamily="Montserrat"
                        color="#fdb525"
                        fontWeight="500"
                        mb={2}
                      >
                        Selecionar Ponto
                      </FormLabel>
                      <Select.Root
                        collection={pontosCollections}
                        value={selectedPonto ? [selectedPonto] : []}
                        onValueChange={(e) => setSelectedPonto(e.value[0])}
                      >
                        <Select.Trigger>
                          <Select.ValueText placeholder="Escolha um ponto..." />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Positioner>
                          <Select.Content>
                            {pontosCollections.items.map((ponto) => (
                              <Select.Item item={ponto} key={ponto.value}>
                                {ponto.label}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Select.Root>
                    </Box>

                    <Box w="100%">
                      <FormLabel
                        fontFamily="Montserrat"
                        color="#fdb525"
                        fontWeight="500"
                        mb={2}
                      >
                        Tipo do Ponto
                      </FormLabel>
                      <Select.Root
                        collection={tiposCollection}
                        value={selectedTipo ? [selectedTipo] : []}
                        onValueChange={(e) => setSelectedTipo(e.value[0])}
                      >
                        <Select.Trigger>
                          <Select.ValueText placeholder="Embarque ou Desembarque?" />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Positioner>
                          <Select.Content>
                            {tiposCollection.items.map((tipo) => (
                              <Select.Item item={tipo} key={tipo.value}>
                                {tipo.label}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Select.Root>
                    </Box>

                    <Button
                      leftIcon={<FiPlus />}
                      bg="#fdb525"
                      color="white"
                      fontFamily="Montserrat"
                      fontWeight="bold"
                      borderRadius="md"
                      isLoading={isLoading}
                      onClick={handleAddPonto}
                      _hover={{
                        bg: "#f59e0b",
                        transform: "scale(1.02)",
                        transition: "0.3s",
                      }}
                    >
                      Adicionar Ponto
                    </Button>
                  </VStack>
                </Box>

                {/* Lista de pontos da rota */}
                <Box>
                  <Text
                    fontFamily="Montserrat"
                    fontWeight="bold"
                    color="#fdb525"
                    mb={3}
                  >
                    Pontos da Rota ({rotaPontos.length})
                  </Text>

                  {rotaPontos.length === 0 ? (
                    <Box
                      textAlign="center"
                      py={6}
                      bg="#3a3947"
                      borderRadius="md"
                    >
                      <Text fontFamily="Montserrat" color="gray.400">
                        Nenhum ponto adicionado ainda
                      </Text>
                    </Box>
                  ) : (
                    <VStack spacing={2}>
                      {rotaPontos.map((rotaPonto, index) => (
                        <Box
                          key={rotaPonto.id}
                          w="100%"
                          bg="#3a3947"
                          p={3}
                          borderRadius="md"
                          border="1px solid #4a4a5c"
                        >
                          <Flex
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Flex alignItems="center" gap={3}>
                              <Text
                                fontFamily="Montserrat"
                                fontSize="sm"
                                color="gray.400"
                              >
                                #{index + 1}
                              </Text>
                              <Text fontFamily="Montserrat" fontWeight="bold">
                                {rotaPonto.ponto?.nome}
                              </Text>
                              <Badge
                                colorScheme={
                                  rotaPonto.tipo === "embarque"
                                    ? "blue"
                                    : "green"
                                }
                                fontSize="xs"
                              >
                                {rotaPonto.tipo}
                              </Badge>
                            </Flex>
                            <Button
                              size="sm"
                              bg="transparent"
                              color="red.400"
                              _hover={{ color: "red.300", bg: "#4a3947" }}
                              onClick={() => handleRemovePonto(rotaPonto.id)}
                            >
                              <FiTrash2 size={16} />
                            </Button>
                          </Flex>
                        </Box>
                      ))}
                    </VStack>
                  )}
                </Box>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer />
            <Dialog.CloseTrigger asChild>
              <CloseButton
                size="sm"
                color="#fdb525"
                _hover={{ bg: "#3a3947" }}
              />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
      <Toaster />
    </Dialog.Root>
  );
}
