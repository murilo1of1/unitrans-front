"use client";
import { Box, Flex, Text, Button, Spinner, Badge } from "@chakra-ui/react";

export default function TableSolicitations({
  solicitations,
  loading,
  onApproveSolicitation,
  onRejectSolicitation,
}) {
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
      >
        <Text fontFamily="Montserrat" fontSize="lg" color="gray.500" mb={2}>
          Nenhuma solicitação pendente
        </Text>
        <Text fontFamily="Montserrat" fontSize="sm" color="gray.400">
          Quando alunos solicitarem acesso à sua empresa, eles aparecerão aqui
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
              ALUNO
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

      <Box>
        {solicitations.map((solicitation, index) => (
          <Box
            key={solicitation.id}
            ml={6}
            mr={6}
            mt={4}
            mb={4}
            borderBottom={
              index < solicitations.length - 1 ? "1px solid #e2e8f0" : "none"
            }
            _hover={{ bg: "#f8fafc" }}
          >
            <Flex align="center">
              <Box flex="2" textAlign="left">
                <Text
                  fontFamily="Montserrat"
                  fontWeight="600"
                  color="#334155"
                  mb={1}
                >
                  {solicitation.aluno?.nome || "Nome não informado"}
                </Text>
                <Text fontFamily="Montserrat" fontSize="sm" color="#64748b">
                  {solicitation.aluno?.email || "Email não informado"}
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
                {solicitation.status === "pendente" ? (
                  <Flex gap={2} justify="flex-end">
                    <Button
                      size="sm"
                      bg="#22c55e"
                      color="white"
                      fontFamily="Montserrat"
                      fontWeight="500"
                      _hover={{
                        bg: "#16a34a",
                        transform: "scale(1.02)",
                        transition: "0.2s",
                      }}
                      onClick={() => onApproveSolicitation(solicitation.id)}
                    >
                      Aprovar
                    </Button>
                    <Button
                      size="sm"
                      bg="transparent"
                      color="#ef4444"
                      border="1px solid #fca5a5"
                      fontFamily="Montserrat"
                      fontWeight="500"
                      _hover={{
                        bg: "#fef2f2",
                        borderColor: "#ef4444",
                        transform: "scale(1.02)",
                        transition: "0.2s",
                      }}
                      onClick={() => onRejectSolicitation(solicitation.id)}
                    >
                      Rejeitar
                    </Button>
                  </Flex>
                ) : (
                  <Text fontFamily="Montserrat" fontSize="sm" color="#64748b">
                    {solicitation.respondidoEm
                      ? `Respondido em ${new Date(
                          solicitation.respondidoEm
                        ).toLocaleDateString("pt-BR")}`
                      : "Processado"}
                  </Text>
                )}
              </Box>
            </Flex>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
