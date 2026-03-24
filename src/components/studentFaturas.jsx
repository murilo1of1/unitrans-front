"use client";
import { useState, useEffect } from "react";
import { Box, Flex, Text, Button, Badge, HStack, Dialog, Portal } from "@chakra-ui/react";
import { Card } from "@chakra-ui/react";
import api from "@/utils/axios";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";

export default function StudentFaturas() {
  const [faturas, setFaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFatura, setSelectedFatura] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  };

  const fetchFaturas = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const decoded = decodeToken(token);
      if (!decoded || (!decoded.idAluno && !decoded.id)) return;
      const alunoId = decoded.idAluno || decoded.id;

      const response = await api.get(`/pagamentos/faturas/aluno/${alunoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFaturas(response.data);
    } catch (error) {
      console.error(error);
      toaster.create({
        description: "Erro ao buscar faturas.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaturas();
  }, []);

  const handlePay = (fatura) => {
    if (fatura.pixCopiaCola) {
      navigator.clipboard.writeText(fatura.pixCopiaCola);
      toaster.create({
        description: "Código Pix Copia e Cola copiado!",
        type: "success",
      });
    } else {
      toaster.create({
        description: "Código Pix indisponível no momento.",
        type: "error",
      });
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={8}>
        <Text fontFamily="Montserrat" color="gray.500">
          Carregando faturas...
        </Text>
      </Box>
    );
  }

  if (faturas.length === 0) {
    return (
      <Box textAlign="center" py={12}>
        <Text fontFamily="Montserrat" fontSize="lg" color="gray.500" mb={4}>
          Nenhuma fatura encontrada.
        </Text>
        <Text fontFamily="Montserrat" color="gray.400">
          Suas faturas geradas pelas empresas aparecerão aqui.
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      {faturas.map((fatura) => (
        <Card.Root
          key={fatura.id}
          bg="white"
          borderRadius="lg"
          boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1)"
          border="1px solid #E2E8F0"
          mb={4}
          p={6}
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Box>
              <Text
                fontFamily="Montserrat"
                fontSize="lg"
                fontWeight="bold"
                color="#334155"
              >
                Ref: {fatura.mes_referencia || "Mensalidade"}
              </Text>
              <Text fontFamily="Montserrat" fontSize="sm" color="gray.500" mb={1}>
                Valor: R$ {parseFloat(fatura.valor).toFixed(2)}
              </Text>
              <Text fontFamily="Montserrat" fontSize="sm" color="gray.600" mb={1}>
                Empresa: {fatura.empresa?.nome || "Desconhecida"}
              </Text>
              <HStack mt={2}>
                <Badge
                  colorScheme={fatura.status === "PAGA" ? "green" : "orange"}
                  bg={fatura.status === "PAGA" ? "green.100" : "orange.100"}
                  color={fatura.status === "PAGA" ? "green.800" : "orange.800"}
                  px={2} py={1} borderRadius="md"
                >
                  {fatura.status}
                </Badge>
                {fatura.codigoSuportePagamento && (
                   <Text fontSize="xs" color="gray.400">
                     Suporte: {fatura.codigoSuportePagamento}
                   </Text>
                )}
              </HStack>
            </Box>
            
            {fatura.status !== "PAGA" && (
              <Button
                size="sm"
                bg="#fdb525"
                color="white"
                fontFamily="Montserrat"
                fontWeight="bold"
                _hover={{ bg: "#f59e0b" }}
                onClick={() => {
                  setSelectedFatura(fatura);
                  setIsModalOpen(true);
                }}
              >
                Pagar
              </Button>
            )}
          </Flex>
        </Card.Root>
      ))}

      <Portal>
        <Dialog.Root open={isModalOpen} onOpenChange={() => setIsModalOpen(false)} placement="center">
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content bg="white" color="black" p={6} borderRadius="md" mx={4}>
              <Dialog.Header>
                <Dialog.Title fontFamily="Montserrat" fontWeight="700" textAlign="center" fontSize="xl">
                  Pagamento PIX
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body display="flex" flexDirection="column" alignItems="center">
                <Text fontFamily="Montserrat" mb={4} fontSize="md" textAlign="center">
                  Escaneie o QR Code abaixo com o aplicativo do seu banco:
                </Text>
                
                <Box p={4} border="2px solid #E2E8F0" borderRadius="lg" mb={4} bg="white">
                  {selectedFatura?.qrCodeBase64 ? (
                    <img 
                      src={selectedFatura.qrCodeBase64} 
                      alt="QR Code PIX" 
                      width="200" 
                      height="200" 
                    />
                  ) : (
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(selectedFatura?.pixCopiaCola || '')}`} 
                      alt="QR Code PIX" 
                    />
                  )}
                </Box>

                <Text fontFamily="Montserrat" mb={2} fontSize="sm" color="gray.600">
                  Ou pague utilizando o código "Copia e Cola":
                </Text>

                <Button
                  width="full"
                  bg="#fdb525"
                  color="white"
                  fontFamily="Montserrat"
                  fontWeight="bold"
                  _hover={{ bg: "#e5a321" }}
                  onClick={() => handlePay(selectedFatura)}
                >
                  Copiar Código PIX
                </Button>
              </Dialog.Body>
              <Dialog.Footer justifyContent="center" mt={4}>
                <Dialog.CloseTrigger asChild>
                  <Button variant="ghost" fontFamily="Montserrat" fontWeight="600" color="gray.500">
                    Fechar
                  </Button>
                </Dialog.CloseTrigger>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>
      </Portal>
    </Box>
  );
}