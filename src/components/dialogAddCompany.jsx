import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Box,
  VStack,
  Input,
  Flex,
  Text,
  HStack,
} from "@chakra-ui/react";
import { FormLabel } from "@chakra-ui/form-control";
import { toaster } from "@/components/ui/toaster";
import api from "@/utils/axios";
import { useState, useEffect } from "react";

export default function DialogAddCompany({
  isOpen,
  onClose,
  onCompanyAdded,
  idAluno,
}) {
  const [methodType, setMethodType] = useState("");
  const [token, setToken] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMethodType("");
      setToken("");
      setSearchTerm("");
      setCompanies([]);
      setSelectedCompany(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  const fetchCompanies = async () => {
    setIsLoadingCompanies(true);
    try {
      const authToken = localStorage.getItem("token");
      const response = await api.get("/empresas", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data && response.data.data) {
        setCompanies(
          Array.isArray(response.data.data) ? response.data.data : []
        );
      } else {
        setCompanies([]);
      }
    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
      toaster.create({
        title: "Erro ao carregar empresas",
        type: "error",
      });
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  const handleUseToken = async () => {
    if (!token.trim()) {
      toaster.create({
        title: "Token é obrigatório",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      const authToken = localStorage.getItem("token");
      const response = await api.post(
        "/vinculos/usar-token",
        {
          token: token.trim(),
          alunoId: idAluno,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toaster.create({
          title: "Vínculo criado com sucesso!",
          type: "success",
        });
        if (onCompanyAdded) onCompanyAdded();
        onClose();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Erro ao usar token";
      toaster.create({
        title: errorMessage,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAccess = async () => {
    if (!selectedCompany) {
      toaster.create({
        title: "Selecione uma empresa",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      const authToken = localStorage.getItem("token");
      const response = await api.post(
        "/vinculos/solicitacao",
        {
          alunoId: idAluno,
          empresaId: selectedCompany.id,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toaster.create({
          title: "Solicitação enviada com sucesso!",
          type: "success",
        });
        onClose();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Erro ao enviar solicitação";
      toaster.create({
        title: errorMessage,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCompanies = companies.filter((company) =>
    company.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderMethodSelection = () => (
    <VStack spacing={4} align="stretch">
      <Button
        bg="#fdb525"
        color="white"
        fontFamily="Montserrat"
        p={6}
        borderRadius="md"
        fontWeight="bold"
        _hover={{
          bg: "#fdb525",
          transform: "scale(1.02)",
          transition: "transform 0.2s",
        }}
        onClick={() => setMethodType("token")}
      >
        <Text fontWeight="bold">Usar Token</Text>
      </Button>

      <Button
        bg="#fdb525"
        color="white"
        fontFamily="Montserrat"
        p={6}
        borderRadius="md"
        fontWeight="bold"
        _hover={{
          bg: "#fdb525",
          transform: "scale(1.02)",
          transition: "transform 0.2s",
        }}
        onClick={() => {
          setMethodType("solicitacao");
          fetchCompanies();
        }}
      >
        <Text fontWeight="bold">Solicitar Acesso</Text>
      </Button>
    </VStack>
  );

  const renderTokenMethod = () => (
    <VStack spacing={4} align="stretch">
      <Box>
        <FormLabel
          fontFamily="Montserrat"
          color="#fdb525"
          fontWeight="500"
          mb={2}
        >
          Token de Acesso
        </FormLabel>
        <Input
          fontFamily="Montserrat"
          placeholder="Ex: ABCD1234"
          value={token}
          onChange={(e) => setToken(e.target.value.toUpperCase())}
          maxLength={8}
          bg="#3a3947"
          border="1px solid #4a4a5c"
          color="#fff"
          _placeholder={{ color: "#a0a0a0" }}
        />
      </Box>

      <Button
        bg="#fdb525"
        color="white"
        fontFamily="Montserrat"
        fontWeight="bold"
        borderRadius="md"
        isLoading={isLoading}
        onClick={handleUseToken}
        size="lg"
        _hover={{
          bg: "#f59e0b",
          transform: "scale(1.02)",
          transition: "0.3s",
        }}
      >
        Vincular com Token
      </Button>
    </VStack>
  );

  const renderRequestMethod = () => (
    <VStack spacing={4} align="stretch">
      <Box>
        <FormLabel
          fontFamily="Montserrat"
          color="#fdb525"
          fontWeight="500"
          mb={2}
        >
          Buscar Empresa
        </FormLabel>
        <Input
          fontFamily="Montserrat"
          placeholder="Digite o nome da empresa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          bg="#3a3947"
          border="1px solid #4a4a5c"
          color="#fff"
          _placeholder={{ color: "#a0a0a0" }}
        />
      </Box>

      {isLoadingCompanies ? (
        <Box textAlign="center" py={4}>
          <Text fontFamily="Montserrat" color="gray.400">
            Carregando empresas...
          </Text>
        </Box>
      ) : (
        <Box maxH="200px" overflowY="auto">
          {filteredCompanies.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Text fontFamily="Montserrat" color="gray.400">
                Nenhuma empresa encontrada
              </Text>
            </Box>
          ) : (
            filteredCompanies.map((company) => (
              <Button
                key={company.id}
                w="100%"
                bg="#3a3947"
                color="white"
                fontFamily="Montserrat"
                justifyContent="flex-start"
                borderRadius="md"
                mb={2}
                minH="60px"
                border={
                  selectedCompany?.id === company.id
                    ? "2px solid #fdb525"
                    : "2px solid transparent"
                }
                _hover={{
                  bg: "#454454",
                  borderColor:
                    selectedCompany?.id === company.id ? "#fdb525" : "#6b7280",
                }}
                onClick={() => setSelectedCompany(company)}
              >
                <Flex alignItems="center">
                  <Box textAlign="left">
                    <Text fontWeight="bold">{company.nome}</Text>
                    <Text fontSize="sm" color="gray.300">
                      {company.email || "Empresa de transporte"}
                    </Text>
                  </Box>
                </Flex>
              </Button>
            ))
          )}
        </Box>
      )}

      {selectedCompany && (
        <Button
          bg="#fdb525"
          color="white"
          fontFamily="Montserrat"
          fontWeight="bold"
          borderRadius="md"
          isLoading={isLoading}
          onClick={handleRequestAccess}
          size="lg"
          _hover={{
            bg: "#f59e0b",
            transform: "scale(1.02)",
            transition: "0.3s",
          }}
        >
          Enviar Solicitação
        </Button>
      )}
    </VStack>
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
            bg="#2c2b3c"
            color="#fff"
            borderRadius="lg"
            maxW="500px"
          >
            <Dialog.Header>
              <Dialog.Title
                fontFamily="Montserrat"
                color="#fdb525"
                fontSize="xl"
                fontWeight="bold"
              >
                Adicionar Empresa
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Box>
                {!methodType && renderMethodSelection()}
                {methodType === "token" && renderTokenMethod()}
                {methodType === "solicitacao" && renderRequestMethod()}
              </Box>
            </Dialog.Body>
            <Dialog.Footer />
            {methodType && (
              <Button
                variant="ghost"
                size="sm"
                color="#fdb525"
                onClick={() => setMethodType("")}
                position="absolute"
                mt="8px"
                ml={408}
                _hover={{ bg: "#3a3947" }}
              >
                ←
              </Button>
            )}
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
    </Dialog.Root>
  );
}
