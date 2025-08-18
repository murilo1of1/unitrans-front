import { Table, Box, IconButton } from "@chakra-ui/react";
import { MdEdit, MdDelete } from "react-icons/md";

export default function TabelaBebidas({ items, onDelete, onEdit }) { 
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
              
            </Table.ColumnHeader>
            <Table.ColumnHeader fontFamily="Montserrat" textAlign="center" fontWeight="bold" fontSize="lg" color="#e05a6d">
              Nome
            </Table.ColumnHeader>
            <Table.ColumnHeader fontFamily="Montserrat" textAlign="center" fontWeight="bold" fontSize="lg" color="#e05a6d">
              Descrição
            </Table.ColumnHeader>
            <Table.ColumnHeader fontFamily="Montserrat" textAlign="center" fontWeight="bold" fontSize="lg" color="#e05a6d">
              Preço
            </Table.ColumnHeader>
          </Table.Row> 
        </Table.Header>
        <Table.Body>
          {items.map((item) => (
            <Table.Row key={item.id} _hover={{ bg: "#2d2d44", borderRadius: 10}}>
              <Table.Cell display="flex" justifyContent="center">
                {item.image && (
                  <img src={item.image} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 12 }} />
                )}
              </Table.Cell>
              <Table.Cell fontFamily="Montserrat" textAlign="center" fontSize="md" color="#fff">
                {item.name}
              </Table.Cell>
              <Table.Cell textAlign="center" fontFamily="Montserrat" fontSize="md" color="#fff">
                R$ {Number(item.price).toFixed(2)}
              </Table.Cell>
              <Table.Cell textAlign="center">
                <IconButton
                  aria-label="Editar"
                  size="sm"
                  bg= "transparent"
                  color= "#e05a6d"
                  
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