"use client";

import { useState } from "react";
import api from "../../utils/axios";
import {
  Box,
  Flex,
  Heading,
  Button,
  Image,
  Text,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { CiLogin, CiUser, CiCircleQuestion, CiWallet } from "react-icons/ci";

export default function PagamentoPix() {
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState(null);
  const [error, setError] = useState("");
  const [simulando, setSimulando] = useState(false);
  const [pagamentoStatus, setPagamentoStatus] = useState("");
  const router = useRouter();

  const gerarPix = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/pagamentos/pix", {
        amount: 1000,
        description: "Assinatura Unitrans",
      });
      setPixData(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Erro ao gerar o Pix. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const simularPagamento = async () => {
    if (!pixData || !pixData.id) return;
    try {
      setSimulando(true);
      setError("");
      await api.post(`/pagamentos/pix/simular/${pixData.id}`);
      setPagamentoStatus("Pagamento simulado com sucesso!");
      alert("Sucesso! Pagamento simulado e processado.");
    } catch (err) {
      console.error(err);
      setError("Erro ao simular pagamento.");
    } finally {
      setSimulando(false);
    }
  };

  const copiarCodigo = () => {
    if (pixData?.brCode) {
      navigator.clipboard.writeText(pixData.brCode);
      alert("Código Pix copiado para a área de transferência.");
    }
  };

  return (
    <Box
      minH="100vh"
      bgImage="url(/fundotelainicial.png)"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
    >
      <Flex
        as="header"
        w="100%"
        h="100px"
        bg="#e5c4ff"
        color="black"
        align="center"
        justify="space-between"
        px={10}
        boxShadow="md"
      >
        <Image src="/logo.png" alt="logo" w="100px" h="auto" />

        <Flex gap={8} fontSize="lg" fontWeight="semibold">
          <Flex align="center" gap={2} cursor="pointer" _hover={{ color: "gray.600" }} onClick={() => router.push('/')}>
            <CiUser size={24} />
            <Text>Voltar ao Início</Text>
          </Flex>
          <Flex align="center" gap={2} bg="blackAlpha.200" px={3} py={1} borderRadius="md">
            <CiWallet size={24} />
            <Text>Pagamento</Text>
          </Flex>
        </Flex>
      </Flex>

      <Flex flexDir="column" align="center" justify="center" mt={20}>
        <Box bg="#e5c4ff" p={8} borderRadius="2xl" shadow="xl" w="full" maxW="500px" textAlign="center" position="relative">
          <Heading mb={6} color="black">Assinar Unitrans</Heading>

          {error && (
            <Text color="red.500" mb={4} fontWeight="bold">
              {error}
            </Text>
          )}

          {!pixData ? (
            <VStack spacing={6}>
              <Text fontSize="lg" color="blackAlpha.800">
                Gere um código Pix para validar seu acesso especial na plataforma e viajar sem complicação!
              </Text>
              <Button
                colorScheme="purple"
                size="lg"
                w="full"
                border="2px solid black"
                bg="white"
                color="black"
                _hover={{ bg: "gray.200" }}
                onClick={gerarPix}
                isLoading={loading}
                loadingText="Gerando..."
              >
                Gerar Pagamento PIX R$ 10,00
              </Button>
            </VStack>
          ) : (
            <VStack spacing={5} align="center">
              <Text fontSize="xl" fontWeight="bold" color="green.600">
                Pix gerado com sucesso!
              </Text>

              <Box bg="white" p={4} borderRadius="lg" border="2px solid black">
                <Image src={pixData.brCodeBase64} alt="QR Code Pix" w="200px" h="200px" objectFit="contain" />
              </Box>

              <Box w="full" textAlign="left">
                <Text fontSize="sm" fontWeight="bold" mb={2} color="black">
                  Pix Copia e Cola:
                </Text>
                <Flex align="center">
                  <Input 
                    flex={1}
                    value={pixData.brCode} 
                    readOnly 
                    bg="white" 
                    color="black"
                    border="2px solid black"
                    borderRightRadius={0}
                  />
                  <Button onClick={copiarCodigo} colorScheme="purple" p={3} borderLeftRadius={0}>
                    Copiar
                  </Button>
                </Flex>
              </Box>

              <Box w="full" borderTop="1px solid gray" pt={4} mt={2}>
                <Text fontSize="sm" color="gray.600" mb={3}>Opções Retidas para Testes (Dev Mode):</Text>
                <Button
                  w="full"
                  bg={pagamentoStatus ? "green.400" : "black"}
                  color="white"
                  _hover={{ bg: pagamentoStatus ? "green.500" : "gray.800" }}
                  size="md"
                  onClick={simularPagamento}
                  isLoading={simulando}
                  loadingText="Simulando API..."
                  isDisabled={!!pagamentoStatus}
                >
                  {pagamentoStatus ? "Simulado com sucesso!" : "Simular Pagamento neste Pix"}
                </Button>
              </Box>
              
              <Button 
                variant="link" 
                color="gray.600" 
                onClick={() => {
                  setPixData(null);
                  setPagamentoStatus("");
                }}
              >
                Cancelar e voltar
              </Button>
            </VStack>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
