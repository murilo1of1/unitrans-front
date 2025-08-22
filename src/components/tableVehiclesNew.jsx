"use client";
import {
  Box,
  Text,
  Spinner,
  Flex,
  Table,
  Button,
  HStack,
} from "@chakra-ui/react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

import { Toaster, toaster } from "@/components/ui/toaster";

const TabelaVeiculos = ({ vehicles, loading }) => {
  if (loading) {
    return (
      <Flex justify="center" align="center" minH="200px">
        <Spinner size="xl" color="#fdb525" />
      </Flex>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <Flex direction="column" align="center" justify="center" minH="200px">
        <Text fontSize="xl" color="gray.500" fontFamily="Montserrat">
          Nenhum veículo encontrado.
        </Text>
      </Flex>
    );
  }

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="#334155"
          fontFamily="Montserrat"
        >
          Lista de Veículos
        </Text>
        <Button
          bg="#fdb525"
          color="white"
          fontFamily="Montserrat"
          fontWeight="bold"
          borderRadius="md"
          px={6}
          py={2}
          _hover={{
            transform: "scale(1.02)",
            transition: "0.3s",
          }}
        >
          + Adicionar Veículo
        </Button>
      </Flex>

      <Box
        w="100%"
        bg="white"
        borderRadius="lg"
        boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
        overflow="hidden"
      >
        <Table.Root size="md" variant="simple">
          <Table.Header bg="#F8FAFC">
            <Table.Row>
              <Table.ColumnHeader
                fontFamily="Montserrat"
                textAlign="center"
                fontWeight="600"
                fontSize="sm"
                color="#64748B"
                py={4}
                borderBottom="1px solid #E2E8F0"
              >
                ID
              </Table.ColumnHeader>
              <Table.ColumnHeader
                fontFamily="Montserrat"
                textAlign="left"
                fontWeight="600"
                fontSize="sm"
                color="#64748B"
                borderBottom="1px solid #E2E8F0"
              >
                Modelo
              </Table.ColumnHeader>
              <Table.ColumnHeader
                fontFamily="Montserrat"
                textAlign="left"
                fontWeight="600"
                fontSize="sm"
                color="#64748B"
                borderBottom="1px solid #E2E8F0"
              >
                Placa
              </Table.ColumnHeader>
              <Table.ColumnHeader
                fontFamily="Montserrat"
                textAlign="center"
                fontWeight="600"
                fontSize="sm"
                color="#64748B"
                borderBottom="1px solid #E2E8F0"
              >
                Ano
              </Table.ColumnHeader>
              <Table.ColumnHeader
                fontFamily="Montserrat"
                textAlign="center"
                fontWeight="600"
                fontSize="sm"
                color="#64748B"
                borderBottom="1px solid #E2E8F0"
              >
                Capacidade
              </Table.ColumnHeader>
              <Table.ColumnHeader
                fontFamily="Montserrat"
                textAlign="center"
                fontWeight="600"
                fontSize="sm"
                color="#64748B"
                borderBottom="1px solid #E2E8F0"
              >
                Status
              </Table.ColumnHeader>
              <Table.ColumnHeader
                fontFamily="Montserrat"
                textAlign="center"
                fontWeight="600"
                fontSize="sm"
                color="#64748B"
                borderBottom="1px solid #E2E8F0"
              >
                Ações
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {vehicles.map((vehicle, index) => (
              <Table.Row
                key={vehicle.id}
                bg={index % 2 === 0 ? "white" : "#F8FAFC"}
                _hover={{ bg: "#F1F5F9" }}
              >
                <Table.Cell
                  fontFamily="Montserrat"
                  textAlign="center"
                  fontSize="sm"
                  color="#334155"
                  py={4}
                  borderBottom="1px solid #E2E8F0"
                >
                  {vehicle.id}
                </Table.Cell>
                <Table.Cell
                  fontFamily="Montserrat"
                  textAlign="left"
                  fontSize="sm"
                  color="#334155"
                  py={4}
                  borderBottom="1px solid #E2E8F0"
                >
                  {vehicle.modelo || vehicle.descricao || "N/A"}
                </Table.Cell>
                <Table.Cell
                  fontFamily="Montserrat"
                  textAlign="left"
                  fontSize="sm"
                  color="#334155"
                  borderBottom="1px solid #E2E8F0"
                >
                  {vehicle.placa || "N/A"}
                </Table.Cell>
                <Table.Cell
                  fontFamily="Montserrat"
                  textAlign="center"
                  fontSize="sm"
                  color="#334155"
                  borderBottom="1px solid #E2E8F0"
                >
                  {vehicle.ano || "N/A"}
                </Table.Cell>
                <Table.Cell
                  fontFamily="Montserrat"
                  textAlign="center"
                  fontSize="sm"
                  color="#334155"
                  borderBottom="1px solid #E2E8F0"
                >
                  {vehicle.capacidade || "N/A"}
                </Table.Cell>
                <Table.Cell textAlign="center" borderBottom="1px solid #E2E8F0">
                  <Box
                    borderRadius="full"
                    bg={
                      vehicle.ativo === true
                        ? "#DCFCE7"
                        : vehicle.ativo === false
                        ? "#FEE2E2"
                        : "#FEF3C7"
                    }
                    color={
                      vehicle.ativo === true
                        ? "#166534"
                        : vehicle.ativo === false
                        ? "#991B1B"
                        : "#92400E"
                    }
                    fontWeight="500"
                    fontSize="xs"
                    fontFamily="Montserrat"
                    display="inline-block"
                  >
                    {vehicle.ativo === true
                      ? "Ativo"
                      : vehicle.ativo === false
                      ? "Inativo"
                      : "Manutenção"}
                  </Box>
                </Table.Cell>
                <Table.Cell
                  textAlign="center"
                  py={4}
                  borderBottom="1px solid #E2E8F0"
                >
                  <HStack spacing={2} justify="center">
                    <Button
                      size="sm"
                      bg="transparent"
                      color="#64748B"
                      _hover={{ color: "#3B82F6", bg: "#F1F5F9" }}
                      p={2}
                    >
                      <FiEdit2 size={16} />
                    </Button>
                    <Button
                      size="sm"
                      bg="transparent"
                      color="#64748B"
                      _hover={{ color: "#EF4444", bg: "#FEF2F2" }}
                      p={2}
                    >
                      <FiTrash2 size={16} />
                    </Button>
                  </HStack>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
      <Toaster />
    </>
  );
};

export default TabelaVeiculos;
