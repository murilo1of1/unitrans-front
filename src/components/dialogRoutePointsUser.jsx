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

export default function DialogRoutePointsUser({ isOpen, onClose, route }) {
  const [pontosEmbarque, setPontosEmbarque] = useState([]);
  const [pontosDesembarque, setPontosDesembarque] = useState([]);
  const [currentStep, setCurrentStep] = useState(0); // 0 = Embarque, 1 = Desembarque
  const [selectedEmbarque, setSelectedEmbarque] = useState("");
  const [selectedDesembarque, setSelectedDesembarque] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
  ];

  useEffect(() => {
    if (isOpen && route) {
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

        // Separar pontos por tipo
        const embarque = pontos.filter((p) => p.tipo === "embarque");
        const desembarque = pontos.filter((p) => p.tipo === "desembarque");

        setPontosEmbarque(embarque);
        setPontosDesembarque(desembarque);
      }
    } catch (error) {
      console.error("Erro ao buscar pontos da rota:", error);
      toaster.create({
        title: "Erro ao carregar pontos da rota",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirm = async () => {
    // Aqui você pode implementar a lógica para salvar as escolhas do aluno
    // Por exemplo, salvar no backend as preferências de embarque e desembarque

    toaster.create({
      title: "Preferências salvas!",
      description: "Suas escolhas de embarque e desembarque foram registradas.",
      status: "success",
    });

    onClose();
  };

  const currentStepData = steps[currentStep];

  const renderTable = (pontos, selectedValue, onChange, noOptionText) => (
    <Box
      bg="white"
      borderRadius="md"
      overflow="hidden"
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1)"
    >
      {/* Header */}
      <Flex bg="#f8fafc" p={3} borderBottom="1px solid" borderColor="gray.200">
        <Box w="60px" textAlign="center">
          <Text
            fontFamily="Montserrat"
            fontWeight="bold"
            color="#334155"
            fontSize="sm"
          >
            Escolha
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
        <Box w="80px" textAlign="center">
          <Text
            fontFamily="Montserrat"
            fontWeight="bold"
            color="#334155"
            fontSize="sm"
          >
            Ordem
          </Text>
        </Box>
      </Flex>

      {/* Body */}
      <VStack spacing={0}>
        {pontos.map((rotaPonto, index) => (
          <Flex
            key={rotaPonto.id}
            w="full"
            p={3}
            bg={selectedValue === rotaPonto.id.toString() ? "#fef3c7" : "white"}
            _hover={{
              bg:
                selectedValue === rotaPonto.id.toString()
                  ? "#fef3c7"
                  : "#f1f5f9",
            }}
            cursor="pointer"
            onClick={() => onChange(rotaPonto.id.toString())}
            borderBottom="1px solid"
            borderColor="gray.100"
            borderLeft="2px solid"
            borderLeftColor={
              selectedValue === rotaPonto.id.toString()
                ? "#fdb525"
                : "transparent"
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
                  selectedValue === rotaPonto.id.toString()
                    ? "#fdb525"
                    : "#d1d5db"
                }
                bg={
                  selectedValue === rotaPonto.id.toString()
                    ? "#fdb525"
                    : "white"
                }
                position="relative"
                mx="auto"
              >
                {selectedValue === rotaPonto.id.toString() && (
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
              <Badge
                bg="#e2e8f0"
                color="#475569"
                fontSize="xs"
                px={2}
                py={1}
                borderRadius="full"
              >
                #{rotaPonto.ordem}
              </Badge>
            </Box>
          </Flex>
        ))}

        {/* Opção "Não vou embarcar/desembarcar" */}
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
            <Text
              fontFamily="Montserrat"
              fontWeight="500"
              color="#64748b"
              fontStyle="italic"
            >
              {noOptionText}
            </Text>
          </Box>
        </Flex>
      </VStack>
    </Box>
  );

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
                {/* Progress Steps */}
                <HStack spacing={4} justify="center">
                  {steps.map((step, index) => (
                    <Flex key={index} alignItems="center" gap={2}>
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
                        {index < currentStep ? (
                          <FiCheckCircle size={16} />
                        ) : (
                          index + 1
                        )}
                      </Box>
                      <Text
                        fontFamily="Montserrat"
                        fontSize="sm"
                        fontWeight={index === currentStep ? "bold" : "normal"}
                        color={index <= currentStep ? "#1e293b" : "#94a3b8"}
                      >
                        {step.title}
                      </Text>
                      {index < steps.length - 1 && (
                        <Box w={8} h="2px" bg="#e2e8f0" mx={2} />
                      )}
                    </Flex>
                  ))}
                </HStack>

                {/* Content */}
                {isLoading ? (
                  <Box textAlign="center" py={8}>
                    <Text fontFamily="Montserrat" color="#64748b">
                      Carregando pontos...
                    </Text>
                  </Box>
                ) : currentStepData.data.length === 0 ? (
                  <Box textAlign="center" py={8} bg="#f8fafc" borderRadius="md">
                    <Text fontFamily="Montserrat" color="#64748b">
                      Nenhum ponto de{" "}
                      {currentStep === 0 ? "embarque" : "desembarque"}{" "}
                      disponível nesta rota
                    </Text>
                  </Box>
                ) : (
                  renderTable(
                    currentStepData.data,
                    currentStepData.selectedValue,
                    currentStepData.onChange,
                    currentStepData.noOptionText
                  )
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
                  isDisabled={currentStep === 0}
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
                      isDisabled={!selectedDesembarque}
                      _hover={{
                        bg: "#f59e0b",
                        transform: "scale(1.02)",
                        transition: "0.3s",
                      }}
                    >
                      Confirmar Escolhas
                    </Button>
                  ) : (
                    <Button
                      bg="#fdb525"
                      color="white"
                      fontFamily="Montserrat"
                      fontWeight="bold"
                      onClick={handleNext}
                      isDisabled={!selectedEmbarque}
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
