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
import {
  FiPlus,
  FiTrash2,
  FiMapPin,
  FiChevronUp,
  FiChevronDown,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";

export default function DialogManageRoutePoints({ isOpen, onClose, route }) {
  const [pontos, setPontos] = useState([]);
  const [pontosDisponiveis, setPontosDisponiveis] = useState([]);
  const [rotaPontos, setRotaPontos] = useState([]);
  const [pontosEmbarque, setPontosEmbarque] = useState([]);
  const [pontosDesembarque, setPontosDesembarque] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPonto, setSelectedPonto] = useState("");
  const [currentStep, setCurrentStep] = useState(0); // 0 = Embarque, 1 = Desembarque
  const [hasChanges, setHasChanges] = useState(false);

  const steps = [
    {
      title: "Pontos de Embarque",
      subtitle: "Organize os pontos onde os passageiros embarcam",
      type: "embarque",
      data: pontosEmbarque,
      setData: setPontosEmbarque,
    },
    {
      title: "Pontos de Desembarque",
      subtitle: "Organize os pontos onde os passageiros desembarcam",
      type: "desembarque",
      data: pontosDesembarque,
      setData: setPontosDesembarque,
    },
  ];

  const currentStepData = steps[currentStep];

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
        const pontos = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setRotaPontos(pontos);

        // Separar pontos por tipo
        const embarque = pontos
          .filter((p) => p.tipo === "embarque")
          .sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
        const desembarque = pontos
          .filter((p) => p.tipo === "desembarque")
          .sort((a, b) => (a.ordem || 0) - (b.ordem || 0));

        setPontosEmbarque(embarque);
        setPontosDesembarque(desembarque);
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
    if (!selectedPonto) {
      toaster.create({
        title: "Selecione um ponto",
        status: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      const authToken = localStorage.getItem("token");
      const currentType = currentStepData.type;
      const currentTypePoints = currentStepData.data;

      const response = await api.post(
        `/rota/${route.id}/pontos`,
        {
          idPonto: selectedPonto,
          tipo: currentType,
          ordem: currentTypePoints.length + 1,
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

  const movePoint = (index, direction) => {
    const newData = [...currentStepData.data];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < newData.length) {
      [newData[index], newData[newIndex]] = [newData[newIndex], newData[index]];
      currentStepData.setData(newData);
      setHasChanges(true);
    }
  };

  const saveAllChanges = async () => {
    if (!hasChanges) return;

    try {
      const authToken = localStorage.getItem("token");

      const embarqueUpdates = pontosEmbarque.map((ponto, index) => ({
        id: ponto.id,
        ordem: index + 1,
      }));

      const desembarqueUpdates = pontosDesembarque.map((ponto, index) => ({
        id: ponto.id,
        ordem: index + 1,
      }));

      const allUpdates = [...embarqueUpdates, ...desembarqueUpdates];

      if (allUpdates.length > 0) {
        await Promise.all(
          allUpdates.map((update) =>
            api.patch(
              `/rota/${route.id}/pontos/${update.id}`,
              { ordem: update.ordem },
              {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              }
            )
          )
        );
      }

      setHasChanges(false);
    } catch (error) {
      console.error("Erro ao salvar ordem:", error);
      toaster.create({
        title: "Erro ao salvar ordem dos pontos",
        status: "error",
      });
    }
  };

  const handleClose = async () => {
    if (hasChanges) {
      await saveAllChanges();
    }
    onClose();
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
      onOpenChange={handleClose}
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
                  <FiMapPin />
                  Gerenciar Pontos - {route?.nome}
                </Flex>
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack spacing={6} align="stretch">
                <Flex justify="space-between" align="center">
                  <Flex gap={4}>
                    {steps.map((step, index) => (
                      <Button
                        key={index}
                        onClick={() => setCurrentStep(index)}
                        bg={currentStep === index ? "#fdb525" : "gray.100"}
                        color={currentStep === index ? "white" : "gray.600"}
                        fontFamily="Montserrat"
                        fontWeight="bold"
                        size="sm"
                        mb={1}
                        mt={1}
                        _hover={{
                          bg: currentStep === index ? "#f59e0b" : "gray.200",
                        }}
                      >
                        {step.title}
                      </Button>
                    ))}
                  </Flex>
                </Flex>

                {/* Step Content */}
                <Box>
                  <Text
                    fontFamily="Montserrat"
                    fontSize="lg"
                    fontWeight="bold"
                    color="#1e293b"
                    mb={1}
                  >
                    {currentStepData.title}
                  </Text>
                  <Text
                    fontFamily="Montserrat"
                    fontSize="sm"
                    color="#64748b"
                    mb={4}
                  >
                    {currentStepData.subtitle}
                  </Text>
                </Box>

                {/* Adicionar novo ponto */}
                <Box
                  bg="white"
                  p={4}
                  borderRadius="md"
                  border="1px solid #e2e8f0"
                  boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1)"
                >
                  <Text
                    fontFamily="Montserrat"
                    fontWeight="bold"
                    color="#1e293b"
                    mb={3}
                  >
                    Adicionar Ponto de {currentStepData.title.split(" ")[2]}
                  </Text>
                  <HStack spacing={3} w="100%">
                    <Box flex="1">
                      <Select.Root
                        collection={pontosCollections}
                        value={selectedPonto ? [selectedPonto] : []}
                        onValueChange={(e) => setSelectedPonto(e.value[0])}
                      >
                        <Select.Trigger
                          bg="white"
                          border="1px solid #d1d5db"
                          borderRadius="md"
                          p={2}
                          _hover={{ borderColor: "#9ca3af" }}
                          _focus={{
                            borderColor: "#fdb525",
                            boxShadow: "0 0 0 3px rgba(253, 181, 37, 0.1)",
                          }}
                        >
                          <Select.ValueText
                            placeholder="Escolha um ponto..."
                            color="#374151"
                          />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Positioner>
                          <Select.Content
                            bg="white"
                            border="1px solid #d1d5db"
                            borderRadius="md"
                            boxShadow="0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                            maxH="200px"
                            overflowY="auto"
                          >
                            {pontosCollections.items.map((ponto) => (
                              <Select.Item
                                item={ponto}
                                key={ponto.value}
                                _hover={{ bg: "#f9fafb" }}
                                _selected={{ bg: "#fef3c7", color: "#92400e" }}
                                color="#374151"
                                p={2}
                              >
                                {ponto.label}
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
                      alignSelf="end"
                      _hover={{
                        bg: "#f59e0b",
                        transform: "scale(1.02)",
                        transition: "0.3s",
                      }}
                    >
                      Adicionar Ponto
                    </Button>
                  </HStack>
                </Box>

                {/* Lista de pontos por step */}
                <Box>
                  <Text
                    fontFamily="Montserrat"
                    fontWeight="bold"
                    color="#1e293b"
                    mb={3}
                  >
                    {currentStepData.title} ({currentStepData.data.length})
                  </Text>

                  {currentStepData.data.length === 0 ? (
                    <Box
                      textAlign="center"
                      py={6}
                      bg="white"
                      borderRadius="md"
                      border="1px solid #e2e8f0"
                    >
                      <Text fontFamily="Montserrat" color="#64748b">
                        Nenhum ponto de {currentStepData.type} adicionado ainda
                      </Text>
                    </Box>
                  ) : (
                    <Box
                      bg="white"
                      borderRadius="md"
                      overflow="hidden"
                      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1)"
                    >
                      {/* Header */}
                      <Flex
                        bg="#f8fafc"
                        p={3}
                        borderBottom="1px solid"
                        borderColor="gray.200"
                      >
                        <Box w="60px" textAlign="center">
                          <Text
                            fontFamily="Montserrat"
                            fontWeight="bold"
                            color="#334155"
                            fontSize="sm"
                          >
                            Ordem
                          </Text>
                        </Box>
                        <Box flex="1" px={3}>
                          <Text
                            fontFamily="Montserrat"
                            fontWeight="bold"
                            color="#334155"
                            fontSize="sm"
                          >
                            Nome do Ponto
                          </Text>
                        </Box>
                        <Box flex="1" px={3}>
                          <Text
                            fontFamily="Montserrat"
                            fontWeight="bold"
                            color="#334155"
                            fontSize="sm"
                          >
                            Endereço
                          </Text>
                        </Box>
                        <Box w="120px" textAlign="center">
                          <Text
                            fontFamily="Montserrat"
                            fontWeight="bold"
                            color="#334155"
                            fontSize="sm"
                          >
                            Ações
                          </Text>
                        </Box>
                      </Flex>

                      {/* Body */}
                      <VStack spacing={0}>
                        {currentStepData.data.map((rotaPonto, index) => (
                          <Flex
                            key={rotaPonto.id}
                            w="full"
                            p={3}
                            bg="white"
                            _hover={{ bg: "#f1f5f9" }}
                            borderBottom="1px solid"
                            borderColor="gray.100"
                            align="center"
                          >
                            <Box w="60px" textAlign="center">
                              <Badge
                                bg="#e2e8f0"
                                color="#475569"
                                fontSize="xs"
                                px={2}
                                py={1}
                                borderRadius="full"
                              >
                                #{index + 1}
                              </Badge>
                            </Box>
                            <Box flex="1" px={3}>
                              <Text
                                fontFamily="Montserrat"
                                fontWeight="500"
                                color="#1e293b"
                              >
                                {rotaPonto.ponto?.nome}
                              </Text>
                            </Box>
                            <Box flex="1" px={3}>
                              <Text
                                fontFamily="Montserrat"
                                fontSize="sm"
                                color="#64748b"
                              >
                                {rotaPonto.ponto?.endereco ||
                                  "Endereço não informado"}
                              </Text>
                            </Box>
                            <Box w="120px">
                              <HStack spacing={1} justify="center">
                                <Button
                                  size="xs"
                                  bg="transparent"
                                  color="#64748b"
                                  _hover={{ color: "#374151", bg: "#f1f5f9" }}
                                  onClick={() => movePoint(index, "up")}
                                  isDisabled={index === 0}
                                  p={1}
                                >
                                  <FiChevronUp size={14} />
                                </Button>
                                <Button
                                  size="xs"
                                  bg="transparent"
                                  color="#64748b"
                                  _hover={{ color: "#374151", bg: "#f1f5f9" }}
                                  onClick={() => movePoint(index, "down")}
                                  isDisabled={
                                    index === currentStepData.data.length - 1
                                  }
                                  p={1}
                                >
                                  <FiChevronDown size={14} />
                                </Button>
                                <Button
                                  size="xs"
                                  bg="transparent"
                                  color="#ef4444"
                                  _hover={{ color: "#dc2626", bg: "#fef2f2" }}
                                  onClick={() =>
                                    handleRemovePonto(rotaPonto.id)
                                  }
                                  p={1}
                                >
                                  <FiTrash2 size={14} />
                                </Button>
                              </HStack>
                            </Box>
                          </Flex>
                        ))}
                      </VStack>
                    </Box>
                  )}
                </Box>
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
