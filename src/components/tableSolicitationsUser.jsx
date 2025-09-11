"use client";
import { Box, Flex, Text, Spinner, Badge } from "@chakra-ui/react";

export default function TableSolicitationsUser({ solicitations, loading }) {
  if (loading) {
    return (
      <Flex justify="center" align="center" h="200px">
        <Spinner size="lg" color="#fdb525" />
      </Flex>
    );
  }

  if (!solicitations || solicitations.length === 0) {
    return (
      <Box
        bg="white"
        borderRadius="md"
        textAlign="center"
        boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1)"
        mt={8}
        mb={4}
        ml={4}
        mr={4}
        p={8}
      >
        <Text fontFamily="Montserrat" fontSize="lg" color="gray.500" mb={2}>
          Nenhuma solicitação encontrada
        </Text>
        <Text fontFamily="Montserrat" fontSize="sm" color="gray.400">
          Suas solicitações de acesso às empresas aparecerão aqui
        </Text>
      </Box>
    );
  }

  return (
    <Box
      bg="white"
      borderRadius="md"
      overflow="hidden"
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1)"
    >
      <Box ml={6} mr={6} mt={4} mb={4} borderBottom="1px solid #e2e8f0">
        <Flex align="center">
          <Box flex="2" textAlign="left">
            <Text
              fontFamily="Montserrat"
              fontWeight="600"
              color="#475569"
              fontSize="sm"
            >
              EMPRESA
            </Text>
          </Box>
          <Box flex="1" textAlign="center">
            <Text
              fontFamily="Montserrat"
              fontWeight="600"
              color="#475569"
              fontSize="sm"
            >
              STATUS
            </Text>
          </Box>
          <Box flex="1" textAlign="center">
            <Text
              fontFamily="Montserrat"
              fontWeight="600"
              color="#475569"
              fontSize="sm"
            >
              SOLICITADO EM
            </Text>
          </Box>
          <Box flex="2" textAlign="right">
            <Text
              fontFamily="Montserrat"
              fontWeight="600"
              color="#475569"
              fontSize="sm"
            >
              AÇÕES
            </Text>
          </Box>
        </Flex>
      </Box>

      <Box ml={6} mr={6} mb={4}>
        {solicitations.map((solicitation, index) => (
          <Flex
            key={solicitation.id}
            align="center"
            borderBottom={
              index < solicitations.length - 1 ? "1px solid #f1f5f9" : "none"
            }
            pb={index < solicitations.length - 1 ? 4 : 0}
            mb={index < solicitations.length - 1 ? 4 : 0}
          >
            <Box flex="2" textAlign="left">
              <Text
                fontFamily="Montserrat"
                fontWeight="500"
                fontSize="sm"
                color="#334155"
                mb={1}
              >
                {solicitation.empresa?.nome || "Empresa não informada"}
              </Text>
            </Box>

            <Box flex="1" textAlign="center">
              <Badge
                bg={
                  solicitation.status === "pendente"
                    ? "#f59e0b"
                    : solicitation.status === "aprovado"
                    ? "#10b981"
                    : "#ef4444"
                }
                color="white"
                fontFamily="Montserrat"
                fontSize="xs"
                borderRadius="full"
              >
                {solicitation.status === "pendente"
                  ? "Em Análise"
                  : solicitation.status === "aprovado"
                  ? "Aprovado"
                  : "Rejeitado"}
              </Badge>
            </Box>

            <Box flex="1" textAlign="center">
              <Text fontFamily="Montserrat" fontSize="sm" color="#64748b">
                {new Date(solicitation.solicitadoEm).toLocaleDateString(
                  "pt-BR"
                )}
              </Text>
            </Box>

            <Box flex="2" textAlign="right">
              <Text fontFamily="Montserrat" fontSize="sm" color="#64748b">
                {solicitation.status === "pendente"
                  ? "Aguardando análise da empresa"
                  : solicitation.status === "aprovado"
                  ? `Respondido em ${new Date(
                      solicitation.responidoEm || solicitation.updated_at
                    ).toLocaleDateString("pt-BR")}`
                  : `Rejeitado em ${new Date(
                      solicitation.responidoEm || solicitation.updated_at
                    ).toLocaleDateString("pt-BR")}`}
              </Text>
            </Box>
          </Flex>
        ))}
      </Box>
    </Box>
  );
}
