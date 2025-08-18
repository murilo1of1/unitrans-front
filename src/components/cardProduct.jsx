import { Box, Image, Text, IconButton, Flex } from "@chakra-ui/react";
import { IoAdd } from "react-icons/io5";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <Box mb={5} mr={8} bg="#181824" borderRadius="md" p={4}  w="220px">
      <Image
        src={product.image}
        alt={product.name}
        borderRadius="md"
        h="150px"
        w="100%"
        objectFit="cover"
        mb={3}
      />
      <Text fontWeight="bold" color="#fff" fontSize="lg">{product.name}</Text>
      <Text color="#bdbdbd" fontSize="sm" mb={2}>{product.description}</Text>
      <Flex justify="space-between" align="center" mt={2}>
        <Text color="#e05a6d" fontWeight="bold" fontSize="md">
          R$ {Number(product.price).toFixed(2).replace('.', ',')}
        </Text>
        <IconButton 
            size="sm"
            color="#fff"  
            borderRadius="md" 
            bg="#e05a6d"
            _hover={{ bg: "#fff", color: "#e05a6d" }}
            onClick={onAddToCart}>
          <IoAdd />
        </IconButton>
      </Flex>
    </Box>
  );
}