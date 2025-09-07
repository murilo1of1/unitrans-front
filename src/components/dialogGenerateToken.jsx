"use client";
import {
  Box,
  Flex,
  Text,
  Button,
  Input,
  VStack,
  HStack,
  useClipboard,
  Badge,
  Dialog,
  Portal,
  CloseButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster";
import api from "@/utils/axios";

export default function DialogGenerateToken({
  isOpen,
  onClose,
  idEmpresa,
  onTokenGenerated,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedToken, setGeneratedToken] = useState(null);
  const [tokenData, setTokenData] = useState(null);
  const { onCopy, hasCopied } = useClipboard(generatedToken || "");

  const handleGenerateToken = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/vinculo/token",
        {
          empresaId: idEmpresa,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setGeneratedToken(response.data.data.token);
        setTokenData(response.data.data);
        toaster.create({
          title: "Token gerado com sucesso!",
          status: "success",
        });
        if (onTokenGenerated) onTokenGenerated();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Erro ao gerar token";
      toaster.create({
        title: errorMessage,
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setGeneratedToken(null);
    setTokenData(null);
    onClose();
  };

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
          <Dialog.Content bg="#2c2b3c" w="700px">
            <Dialog.Header>
              <Dialog.Title fontFamily="Montserrat" color="white">
                Gerar Token de Acesso
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              {!generatedToken ? (
                <VStack spacing={4} align="stretch">
                  <Text
                    fontFamily="Montserrat"
                    color="white"
                    textAlign="center"
                  >
                    Gere um token de acesso para permitir que alunos se vinculem
                    à sua empresa.
                  </Text>
                  <Box
                    bg="#3a3947"
                    p={4}
                    borderRadius="md"
                    border="1px solid #4a4a5c"
                  >
                    <VStack spacing={2} align="flex-start">
                      <Text
                        fontFamily="Montserrat"
                        fontSize="sm"
                        fontWeight="600"
                        color="white"
                      >
                        Informações importantes:
                      </Text>
                      <Text
                        fontFamily="Montserrat"
                        fontSize="sm"
                        color="#a0a0a0"
                      >
                        • O token expira em 30 minutos
                      </Text>
                      <Text
                        fontFamily="Montserrat"
                        fontSize="sm"
                        color="#a0a0a0"
                      >
                        • Pode ser usado apenas uma vez
                      </Text>
                      <Text
                        fontFamily="Montserrat"
                        fontSize="sm"
                        color="#a0a0a0"
                      >
                        • Compartilhe apenas com alunos confiáveis
                      </Text>
                    </VStack>
                  </Box>
                </VStack>
              ) : (
                <VStack spacing={4} align="stretch">
                  <Box textAlign="center">
                    <Text
                      fontFamily="Montserrat"
                      color="#22c55e"
                      fontWeight="600"
                      mb={2}
                    >
                      Token gerado com sucesso!
                    </Text>
                    <Text fontFamily="Montserrat" fontSize="sm" color="#64748b">
                      Compartilhe este token com o aluno que deseja vincular:
                    </Text>
                  </Box>

                  <Box bg="#f0fdf4" p={4} borderRadius="md">
                    <HStack spacing={2}>
                      <Input
                        value={generatedToken}
                        readOnly
                        fontFamily="monospace"
                        fontSize="lg"
                        fontWeight="bold"
                        textAlign="center"
                        bg="white"
                        border="1px solid #e2e8f0"
                        color="#334155"
                        letterSpacing="2px"
                      />
                    </HStack>
                  </Box>

                  {tokenData && (
                    <Box bg="white" p={3} borderRadius="md">
                      <VStack spacing={1} align="flex-start">
                        <Text
                          fontFamily="Montserrat"
                          fontSize="sm"
                          fontWeight="600"
                          color="#334155"
                        >
                          Detalhes do Token:
                        </Text>
                        <Text
                          fontFamily="Montserrat"
                          fontSize="xs"
                          color="#334155"
                        >
                          Expira em:{" "}
                          {new Date(tokenData.expiraEm).toLocaleString("pt-BR")}
                        </Text>
                      </VStack>
                    </Box>
                  )}
                </VStack>
              )}
            </Dialog.Body>

            <Dialog.Footer>
              <HStack spacing={2} w="100%" justify="flex-end">
                {!generatedToken && (
                  <Button
                    bg="#fdb525"
                    color="white"
                    fontFamily="Montserrat"
                    fontWeight="bold"
                    _hover={{
                      bg: "#f59e0b",
                      transform: "scale(1.02)",
                      transition: "0.3s",
                    }}
                    onClick={handleGenerateToken}
                    isLoading={isLoading}
                  >
                    Gerar Token
                  </Button>
                )}
              </HStack>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" color="#64748b" bg="transparent" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
