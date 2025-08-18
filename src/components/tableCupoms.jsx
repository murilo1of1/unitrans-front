import { Table, Box, IconButton } from "@chakra-ui/react";
import { MdEdit, MdDelete } from "react-icons/md";

export default function TabelaCupoms({ items, onEdit, onDelete }) {
  return (
    <Box
      w="100%"
      maxW="900px"
      bg="#181824"
      borderRadius="sm"
      p={6}
      mt={4}
      mx="auto"
    >
      <Table.Root size="md" variant="striped" colorScheme="pink">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader fontFamily="Montserrat" textAlign="center" fontWeight="bold" fontSize="lg" color="#e05a6d">
              Nome
            </Table.ColumnHeader>
            <Table.ColumnHeader fontFamily="Montserrat" textAlign="center" fontWeight="bold" fontSize="lg" color="#e05a6d">
              Tipo
            </Table.ColumnHeader>
            <Table.ColumnHeader fontFamily="Montserrat" textAlign="center" fontWeight="bold" fontSize="lg" color="#e05a6d">
              Valor
            </Table.ColumnHeader>
            <Table.ColumnHeader fontFamily="Montserrat" textAlign="center" fontWeight="bold" fontSize="lg" color="#e05a6d">
              Usos disponíveis
            </Table.ColumnHeader>
          </Table.Row> 
        </Table.Header>
        <Table.Body>
          {items.map((item) => (
            <Table.Row key={item.id} _hover={{ bg: "#2d2d44", borderRadius: 10}}>
              <Table.Cell fontFamily="Montserrat" textAlign="center" fontSize="md" color="#fff">
                {item.code}
              </Table.Cell>
              <Table.Cell fontFamily="Montserrat" textAlign="center" fontSize="md" color="#fff">
                {item.type}
              </Table.Cell>
              <Table.Cell fontFamily="Montserrat" textAlign="center" fontSize="md" color="#fff">
                {item.type === "porcentagem" ? `%${item.value}` : item.value}
              </Table.Cell>
              <Table.Cell fontFamily="Montserrat" textAlign="center" fontSize="md" color="#fff">
                {item.uses}
              </Table.Cell>
              <Table.Cell textAlign="center">
                <IconButton
                  aria-label="Editar"
                  size="sm"
                  bg= "transparent"
                  color= "#e05a6d"
                  ml={-10}
                  _hover={{
                    opacity: 0.9,
                    transform: "scale(1.09)",
                    transition: "0.2s",
                  }}
                  onClick={() => onEdit(item)}
                  mr={2}
                ><MdEdit /></IconButton>
                <IconButton
                  aria-label="Excluir"
                  size="sm"
                  bg= "transparent"
                  color= "#e05a6d"
                  _hover={{
                    opacity: 0.9,
                    transform: "scale(1.09)",
                    transition: "0.2s",
                  }}
                  onClick={() => onDelete(item.id)}
                ><MdDelete /></IconButton>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}