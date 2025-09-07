"use client";
import { Box, Flex, Text, Button, Spinner, Badge } from "@chakra-ui/react";

export default function TableStudents({ students, loading, onRemoveStudent }) {
  if (loading) {
    return (
      <Flex justify="center" align="center" h="200px">
        <Spinner size="lg" color="#fdb525" />
      </Flex>
    );
  }

  if (!students || students.length === 0) {
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
          Nenhum aluno vinculado
        </Text>
        <Text fontFamily="Montserrat" fontSize="sm" color="gray.400">
          Gere um token de acesso para permitir que alunos se vinculem à sua
          empresa
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
              VINCULADO EM
            </Text>
          </Box>
          <Box flex="1" textAlign="center">
            <Text
              fontFamily="Montserrat"
              fontWeight="600"
              color="#475569"
              fontSize="sm"
            >
              ORIGEM
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
        {students.map((student, index) => (
          <Box
            key={student.id}
            ml={6}
            mr={6}
            mt={4}
            mb={4}
            borderBottom={
              index < students.length - 1 ? "1px solid #e2e8f0" : "none"
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
                  {student.aluno?.nome || "Nome não informado"}
                </Text>
                <Text fontFamily="Montserrat" fontSize="sm" color="#64748b">
                  {student.aluno?.email || "Email não informado"}
                </Text>
              </Box>

              <Box flex="1" textAlign="center">
                <Badge
                  bg={student.ativo ? "#10b981" : "#ef4444"}
                  color="white"
                  fontFamily="Montserrat"
                  fontSize="xs"
                  borderRadius="full"
                >
                  {student.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </Box>

              <Box flex="1" textAlign="center">
                <Text fontFamily="Montserrat" fontSize="sm" color="#64748b">
                  {new Date(student.dataVinculo).toLocaleDateString("pt-BR")}
                </Text>
              </Box>

              <Box flex="1" textAlign="center">
                <Badge
                  colorScheme={
                    student.origemVinculo === "token" ? "blue" : "purple"
                  }
                  fontFamily="Montserrat"
                  fontSize="xs"
                  borderRadius="full"
                >
                  {student.origemVinculo === "token" ? "Token" : "Solicitação"}
                </Badge>
              </Box>

              <Box flex="2" textAlign="right">
                {student.ativo ? (
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
                    onClick={() => onRemoveStudent(student.id)}
                  >
                    Desvincular
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    bg="transparent"
                    color="#22c55e"
                    border="1px solid #86efac"
                    fontFamily="Montserrat"
                    fontWeight="500"
                    _hover={{
                      bg: "#f0fdf4",
                      borderColor: "#22c55e",
                      transform: "scale(1.02)",
                      transition: "0.2s",
                    }}
                    onClick={() => onRemoveStudent(student.id, true)}
                  >
                    Reativar
                  </Button>
                )}
              </Box>
            </Flex>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
