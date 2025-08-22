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
    <Box
      w="100%"
      maxW="1000px"
      bg="transparent"
      borderColor="#232234"
      borderWidth="1px"
      borderRadius="sm"
      p={6}
      mt={4}
      mx="auto"
    >
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="#fdb525"
          fontFamily="Montserrat"
        >
          Lista de Veículos
        </Text>
      </Flex>

      <Table.Root size="md" variant="striped" colorScheme="yellow">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader
              fontFamily="Montserrat"
              textAlign="center"
              fontWeight="bold"
              fontSize="lg"
              color="#fdb525"
            >
              ID
            </Table.ColumnHeader>
            <Table.ColumnHeader
              fontFamily="Montserrat"
              textAlign="center"
              fontWeight="bold"
              fontSize="lg"
              color="#fdb525"
            >
              Modelo
            </Table.ColumnHeader>
            <Table.ColumnHeader
              fontFamily="Montserrat"
              textAlign="center"
              fontWeight="bold"
              fontSize="lg"
              color="#fdb525"
            >
              Placa
            </Table.ColumnHeader>
            <Table.ColumnHeader
              fontFamily="Montserrat"
              textAlign="center"
              fontWeight="bold"
              fontSize="lg"
              color="#fdb525"
            >
              Ano
            </Table.ColumnHeader>
            <Table.ColumnHeader
              fontFamily="Montserrat"
              textAlign="center"
              fontWeight="bold"
              fontSize="lg"
              color="#fdb525"
            >
              Capacidade
            </Table.ColumnHeader>
            <Table.ColumnHeader
              fontFamily="Montserrat"
              textAlign="center"
              fontWeight="bold"
              fontSize="lg"
              color="#fdb525"
            >
              Status
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {vehicles.map((vehicle) => (
            <Table.Row
              key={vehicle.id}
              _hover={{ bg: "#2d2d44", borderRadius: "10px" }}
            >
              <Table.Cell
                fontFamily="Montserrat"
                textAlign="center"
                fontSize="md"
                color="#fff"
              >
                {vehicle.id}
              </Table.Cell>
              <Table.Cell
                fontFamily="Montserrat"
                textAlign="center"
                fontSize="md"
                color="#fff"
              >
                {vehicle.modelo || vehicle.descricao || "N/A"}
              </Table.Cell>
              <Table.Cell
                fontFamily="Montserrat"
                textAlign="center"
                fontSize="md"
                color="#fff"
              >
                {vehicle.placa || "N/A"}
              </Table.Cell>
              <Table.Cell
                fontFamily="Montserrat"
                textAlign="center"
                fontSize="md"
                color="#fff"
              >
                {vehicle.ano || "N/A"}
              </Table.Cell>
              <Table.Cell
                fontFamily="Montserrat"
                textAlign="center"
                fontSize="md"
                color="#fff"
              >
                {vehicle.capacidade || "N/A"}
              </Table.Cell>
              <Table.Cell
                fontFamily="Montserrat"
                textAlign="center"
                fontSize="md"
                color="#fff"
              >
                <Box
                  px={2}
                  py={1}
                  borderRadius="md"
                  bg={vehicle.ativo ? "#22C55E" : "#EF4444"}
                  color="#fff"
                  fontWeight="bold"
                  fontSize="sm"
                >
                  {vehicle.ativo ? "Ativo" : "Inativo"}
                </Box>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Toaster />
    </Box>
  );
};

export default TabelaVeiculos;
