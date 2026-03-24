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
import { FiMapPin, FiCheckCircle } from "react-icons/fi";

function decodeToken(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export default function DialogRoutePointsUser({ isOpen, onClose, route }) {
  const [pontosEmbarque, setPontosEmbarque] = useState([]);
  const [pontosDesembarque, setPontosDesembarque] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedEmbarque, setSelectedEmbarque] = useState("");
  const [selectedDesembarque, setSelectedDesembarque] = useState("");
  const [selectedAssento, setSelectedAssento] = useState(null);
  const [capacidadeAssentos, setCapacidadeAssentos] = useState(40);
  const [assentosOcupados, setAssentosOcupados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSeats, setIsLoadingSeats] = useState(false);

  const steps = [
    {
      title: "Ponto de Embarque",
      subtitle: "Onde você vai subir no transporte?",
      data: pontosEmbarque,
      selectedValue: selectedEmbarque,
      onChange: setSelectedEmbarque,
      noOptionText: "Não vou embarcar nesta rota",
    },
    {
      title: "Ponto de Desembarque",
      subtitle: "Onde você vai descer do transporte?",
      data: pontosDesembarque,
      selectedValue: selectedDesembarque,
      onChange: setSelectedDesembarque,
      noOptionText: "Não vou desembarcar nesta rota",
    },
    {
      title: "Reserva de Assento",
      subtitle: "Escolha um assento disponível para finalizar",
      data: [],
      selectedValue: selectedAssento,
      onChange: setSelectedAssento,
      noOptionText: "",
    },
  ];

  useEffect(() => {
    if (isOpen && route) {
      setCurrentStep(0);
      setSelectedEmbarque("");
      setSelectedDesembarque("");
      setSelectedAssento(null);
      setAssentosOcupados([]);
      setCapacidadeAssentos(route.capacidadeAssentos || 40);
      fetchRotaPontos();
    }
  }, [isOpen, route]);

  const fetchRotaPontos = async () => {
    if (!route?.id) return;

    setIsLoading(true);
    try {
      const authToken = localStorage.getItem("token");
      const response = await api.get(`/rota/${route.id}/pontos`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data && response.data.data) {
        const pontos = response.data.data;
        setPontosEmbarque(pontos.filter((p) => p.tipo === "embarque"));
        setPontosDesembarque(pontos.filter((p) => p.tipo === "desembarque"));
      }
    } catch (error) {
      toaster.create({
        title: "Erro ao carregar pontos da rota",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMapaAssentos = async () => {
    if (!route?.id) return;

    setIsLoadingSeats(true);
    try {
      const authToken = localStorage.getItem("token");
      const response = await api.get(`/rota/${route.id}/assentos`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = response.data?.data;
      setCapacidadeAssentos(data?.capacidadeAssentos || route.capacidadeAssentos || 40);
      setAssentosOcupados(data?.assentosOcupados || []);
    } catch (error) {
      toaster.create({
        title: "Erro ao carregar mapa de assentos",
        type: "error",
      });
    } finally {
      setIsLoadingSeats(false);
    }
  };

  const canGoNext =
    (currentStep === 0 && selectedEmbarque && selectedEmbarque !== "none") ||
    (currentStep === 1 &&
      selectedDesembarque &&
      selectedDesembarque !== "none");

  const handleNext = async () => {
    if (currentStep === 1) {
      await fetchMapaAssentos();
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleConfirm = async () => {
    if (
      !selectedEmbarque ||
      selectedEmbarque === "none" ||
      !selectedDesembarque ||
      selectedDesembarque === "none" ||
      !selectedAssento
    ) {
      toaster.create({
        title: "Dados incompletos",
        description:
          "Selecione embarque, desembarque e um assento disponível.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token não encontrado");
      }

      const decodedToken = decodeToken(token);
      const alunoId = decodedToken.idAluno;

      if (!alunoId) {
        throw new Error("ID do aluno não encontrado no token");
      }

      const dadosEnvio = {
        idAluno: alunoId,
        idRota: route.id,
        pontoEmbarque: selectedEmbarque,
        pontoDesembarque: selectedDesembarque,
        numeroAssento: Number(selectedAssento),
      };

      await api.post("/aluno/escolher-pontos", dadosEnvio, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toaster.create({
        title: "Reserva confirmada!",
        description:
          "Seus pontos e assento foram registrados com sucesso.",
        type: "success",
      });

      onClose();
    } catch (error) {
      toaster.create({
        title: "Erro ao confirmar",
        description:
          error.response?.data?.message || "Erro interno do servidor",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentStepData = steps[currentStep];

  const renderTable = (pontos, selectedValue, onChange, noOptionText) => (
    <Box
      bg="white"
      borderRadius="md"
      overflow="hidden"
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1)"
    >
      <Flex bg="#f8fafc" p={3} borderBottom="1px solid" borderColor="gray.200">
        <Box w="60px" textAlign="center">
          <Text fontFamily="Montserrat" fontWeight="bold" color="#334155" fontSize="sm">
            Escolha
          </Text>
        </Box>
        <Box flex="1" px={3}>
          <Text fontFamily="Montserrat" fontWeight="bold" color="#334155" fontSize="sm">
            Nome do Ponto
          </Text>
        </Box>
        <Box flex="1" px={3}>
          <Text fontFamily="Montserrat" fontWeight="bold" color="#334155" fontSize="sm">
            Endereço
          </Text>
        </Box>
        <Box w="80px" textAlign="center">
          <Text fontFamily="Montserrat" fontWeight="bold" color="#334155" fontSize="sm">
            Ordem
          </Text>
        </Box>
      </Flex>

      <VStack spacing={0}>
        {pontos.map((rotaPonto) => (
          <Flex
            key={rotaPonto.id}
            w="full"
            p={3}
            bg={selectedValue === rotaPonto.ponto.id.toString() ? "#fef3c7" : "white"}
            _hover={{
              bg: selectedValue === rotaPonto.ponto.id.toString() ? "#fef3c7" : "#f1f5f9",
            }}
            cursor="pointer"
            onClick={() => onChange(rotaPonto.ponto.id.toString())}
            borderBottom="1px solid"
            borderColor="gray.100"
            borderLeft="2px solid"
            borderLeftColor={
              selectedValue === rotaPonto.ponto.id.toString() ? "#fdb525" : "transparent"
            }
            align="center"
          >
            <Box w="60px" textAlign="center">
              <Box
                w={4}
                h={4}
                borderRadius="full"
                border="2px solid"
                borderColor={
                  selectedValue === rotaPonto.ponto.id.toString() ? "#fdb525" : "#d1d5db"
                }
                bg={selectedValue === rotaPonto.ponto.id.toString() ? "#fdb525" : "white"}
                position="relative"
                mx="auto"
              >
                {selectedValue === rotaPonto.ponto.id.toString() && (
                  <Box
                    w={2}
                    h={2}
                    borderRadius="full"
                    bg="white"
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                  />
                )}
              </Box>
            </Box>
            <Box flex="1" px={3}>
              <Text fontFamily="Montserrat" fontWeight="500" color="#1e293b">
                {rotaPonto.ponto?.nome}
              </Text>
            </Box>
            <Box flex="1" px={3}>
              <Text fontFamily="Montserrat" fontSize="sm" color="#64748b">
                {rotaPonto.ponto?.endereco || "Endereço não informado"}
              </Text>
            </Box>
            <Box w="80px" textAlign="center">
              <Badge bg="#e2e8f0" color="#475569" fontSize="xs" px={2} py={1} borderRadius="full">
                #{rotaPonto.ordem}
              </Badge>
            </Box>
          </Flex>
        ))}

        <Flex
          w="full"
          p={3}
          bg={selectedValue === "none" ? "#fef3c7" : "white"}
          _hover={{ bg: selectedValue === "none" ? "#fef3c7" : "#f1f5f9" }}
          cursor="pointer"
          onClick={() => onChange("none")}
          borderBottom="1px solid"
          borderColor="gray.100"
          borderLeft="2px solid"
          borderLeftColor={selectedValue === "none" ? "#fdb525" : "transparent"}
          align="center"
        >
          <Box w="60px" textAlign="center">
            <Box
              w={4}
              h={4}
              borderRadius="full"
              border="2px solid"
              borderColor={selectedValue === "none" ? "#fdb525" : "#d1d5db"}
              bg={selectedValue === "none" ? "#fdb525" : "white"}
              position="relative"
              mx="auto"
            >
              {selectedValue === "none" && (
                <Box
                  w={2}
                  h={2}
                  borderRadius="full"
                  bg="white"
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                />
              )}
            </Box>
          </Box>
          <Box flex="1" px={3}>
            <Text fontFamily="Montserrat" fontWeight="500" color="#64748b" fontStyle="italic">
              {noOptionText}
            </Text>
          </Box>
        </Flex>
      </VStack>
    </Box>
  );

  const renderSeatMap = () => {
    const seats = Array.from({ length: capacidadeAssentos }, (_, i) => i + 1);

    if (isLoadingSeats) {
      return (
        <Box textAlign="center" py={8} bg="#f8fafc" borderRadius="md">
          <Text fontFamily="Montserrat" color="#64748b">
            Carregando mapa de assentos...
          </Text>
        </Box>
      );
    }

    return (
      <VStack spacing={4} align="stretch">
        <HStack spacing={5} justify="center" wrap="wrap">
          <HStack spacing={2}>
            <Box w={3} h={3} borderRadius="full" bg="#22c55e" />
            <Text fontFamily="Montserrat" fontSize="sm" color="#475569">
              Livre
            </Text>
          </HStack>
          <HStack spacing={2}>
            <Box w={3} h={3} borderRadius="full" bg="#ef4444" />
            <Text fontFamily="Montserrat" fontSize="sm" color="#475569">
              Ocupado
            </Text>
          </HStack>
          <HStack spacing={2}>
            <Box w={3} h={3} borderRadius="full" bg="#fdb525" />
            <Text fontFamily="Montserrat" fontSize="sm" color="#475569">
              Selecionado
            </Text>
          </HStack>
        </HStack>

        <Flex wrap="wrap" gap={2} justify="center" maxH="330px" overflowY="auto">
          {seats.map((seat) => {
            const isOccupied = assentosOcupados.includes(seat);
            const isSelected = selectedAssento === seat;
            const bg = isSelected ? "#fdb525" : isOccupied ? "#ef4444" : "#22c55e";

            return (
              <Button
                key={seat}
                w="52px"
                h="52px"
                borderRadius="md"
                bg={bg}
                color="white"
                fontFamily="Montserrat"
                fontWeight="bold"
                fontSize="sm"
                isDisabled={isOccupied}
                onClick={() => setSelectedAssento(seat)}
                _hover={{
                  opacity: isOccupied ? 1 : 0.9,
                  transform: isOccupied ? "none" : "scale(1.03)",
                }}
              >
                {seat}
              </Button>
            );
          })}
        </Flex>
      </VStack>
    );
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose} motionPreset="slide-in-bottom" placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="white" color="#1e293b" borderRadius="lg" maxW="900px" w="90vw">
            <Dialog.Header borderBottom="1px solid #e2e8f0" pb={4}>
              <Dialog.Title fontFamily="Montserrat" color="#1e293b" fontSize="xl" fontWeight="bold">
                <Flex alignItems="center" gap={3}>
                  <FiMapPin color="#fdb525" />
                  <Box>
                    <Text>{currentStepData.title}</Text>
                    <Text fontSize="sm" fontWeight="normal" color="#64748b">
                      {route?.nome} • {currentStepData.subtitle}
                    </Text>
                  </Box>
                </Flex>
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body py={6}>
              <VStack spacing={6} align="stretch">
                <HStack spacing={4} justify="center" wrap="wrap">
                  {steps.map((step, index) => (
                    <Flex key={step.title} alignItems="center" gap={2}>
                      <Box
                        w={8}
                        h={8}
                        borderRadius="full"
                        bg={index <= currentStep ? "#fdb525" : "#e2e8f0"}
                        color={index <= currentStep ? "white" : "#94a3b8"}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="sm"
                        fontWeight="bold"
                        fontFamily="Montserrat"
                      >
                        {index < currentStep ? <FiCheckCircle size={16} /> : index + 1}
                      </Box>
                      <Text
                        fontFamily="Montserrat"
                        fontSize="sm"
                        fontWeight={index === currentStep ? "bold" : "normal"}
                        color={index <= currentStep ? "#1e293b" : "#94a3b8"}
                      >
                        {step.title}
                      </Text>
                      {index < steps.length - 1 && <Box w={8} h="2px" bg="#e2e8f0" mx={2} />}
                    </Flex>
                  ))}
                </HStack>

                {currentStep < 2 ? (
                  isLoading ? (
                    <Box textAlign="center" py={8}>
                      <Text fontFamily="Montserrat" color="#64748b">
                        Carregando pontos...
                      </Text>
                    </Box>
                  ) : currentStepData.data.length === 0 ? (
                    <Box textAlign="center" py={8} bg="#f8fafc" borderRadius="md">
                      <Text fontFamily="Montserrat" color="#64748b">
                        Nenhum ponto de {currentStep === 0 ? "embarque" : "desembarque"} disponível nesta rota
                      </Text>
                    </Box>
                  ) : (
                    renderTable(
                      currentStepData.data,
                      currentStepData.selectedValue,
                      currentStepData.onChange,
                      currentStepData.noOptionText
                    )
                  )
                ) : (
                  renderSeatMap()
                )}
              </VStack>
            </Dialog.Body>

            <Dialog.Footer borderTop="1px solid #e2e8f0" pt={4}>
              <HStack spacing={3} justify="space-between" w="100%">
                <Button
                  bg="#fdb525"
                  color="white"
                  fontFamily="Montserrat"
                  fontWeight="bold"
                  onClick={handlePrevious}
                  isDisabled={currentStep === 0 || isLoading || isLoadingSeats}
                  _hover={{
                    bg: "#f59e0b",
                    transform: "scale(1.02)",
                    transition: "0.3s",
                  }}
                  _disabled={{
                    bg: "#d1d5db",
                    color: "#9ca3af",
                    cursor: "not-allowed",
                    transform: "none",
                  }}
                >
                  Anterior
                </Button>

                <HStack spacing={3}>
                  <Button
                    bg="#fdb525"
                    color="white"
                    fontFamily="Montserrat"
                    fontWeight="bold"
                    onClick={onClose}
                    _hover={{
                      bg: "#f59e0b",
                      transform: "scale(1.02)",
                      transition: "0.3s",
                    }}
                  >
                    Cancelar
                  </Button>

                  {currentStep === steps.length - 1 ? (
                    <Button
                      bg="#fdb525"
                      color="white"
                      fontFamily="Montserrat"
                      fontWeight="bold"
                      onClick={handleConfirm}
                      isDisabled={!selectedAssento || isLoading || isLoadingSeats}
                      isLoading={isLoading}
                      _hover={{
                        bg: "#f59e0b",
                        transform: "scale(1.02)",
                        transition: "0.3s",
                      }}
                    >
                      Confirmar Assento
                    </Button>
                  ) : (
                    <Button
                      bg="#fdb525"
                      color="white"
                      fontFamily="Montserrat"
                      fontWeight="bold"
                      onClick={handleNext}
                      isDisabled={!canGoNext || isLoading || isLoadingSeats}
                      _hover={{
                        bg: "#f59e0b",
                        transform: "scale(1.02)",
                        transition: "0.3s",
                      }}
                    >
                      Próximo
                    </Button>
                  )}
                </HStack>
              </HStack>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" color="#64748b" _hover={{ bg: "#f1f5f9" }} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
      <Toaster />
    </Dialog.Root>
  );
}
