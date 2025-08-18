'use client'
import {
  Box,
  Flex,
  Text,
  IconButton,
  Image,
  VStack,
  Button,
  SimpleGrid
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FaShoppingCart } from "react-icons/fa";
import InputPesquisaUser from "@/components/inputPesquisaUser";
import { useState, useEffect } from "react";
import ProductCard from "@/components/cardProduct";
import api from "@/utils/axios";
import DialogInfoUser from "@/components/dialogInfoUser";
import DialogAddressUser from "@/components/dialogAddressUser";
import DialogOrderUser from "@/components/dialogOrderUser";
import DialogAddToCart from "@/components/dialogAddToCart";
import { jwtDecode } from "jwt-decode";

export default function User() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isDialogInfoUserOpen, setIsDialogInfoUserOpen] = useState(false);
  const [isDialogAddressUserOpen, setIsDialogAddressUserOpen] = useState(false);
  const [isDialogOrderUserOpen, setIsDialogOrderUserOpen] = useState(false);
  const [addressInfo, setAddressInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isDialogAddToCartOpen, setIsDialogAddToCartOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [cart, setCart] = useState([]);

  
  
  useEffect(() => {
    getProducts();
    getAddress();
  }, []);
  
  const categoryMap = {
    "Todos": null,
    "Hambúrguer": 3,
    "Pizza": 2,
    "Pratos": 4,
  };

  const addToCartClick = (productId) => {
  setSelectedProductId(productId);
  setIsDialogAddToCartOpen(true);
};

  const openOrderDialog = async () => {
    const user = await getUser();
    setUserInfo(user);
    setIsDialogOrderUserOpen(true);
  }

  const openUserDialog = async () => {
    const user = await getUser();
    setUserInfo(user);
    setIsDialogInfoUserOpen(true);
  };

  const openAddressDialog = async () => {
    const address = await getAddress();
    const user = await getUser();
    setAddressInfo(address);
    setUserInfo(user);
    setIsDialogAddressUserOpen(true);
  }

  const getProducts = async () => {
    try {
      const res = await api.get("/product");
      setProducts(res.data.data || []);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const getUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return {};
        const decoded = jwtDecode(token);
        const res = await api.get(`/users/${decoded.idUsuario}`);
        return res.data.data || {};
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        return {};
      }
    };

  const getAddress = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return {};
        const decoded = jwtDecode(token);
        const res = await api.get(`/address/${decoded.idUsuario}`);
        return res.data.data || {};
      } catch (error) {
        console.error("Erro ao buscar endereço do usuário:", error);
        return {};
      }
    };  

  const filteredProducts = products
    .filter(product =>
      (selectedCategory === "Todos" || product.idCategory === categoryMap[selectedCategory]) &&
      product.name.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <Box
      minH="100vh"
      bgImage="url(/teladeinicio.png)"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
    >
      <Flex
        as="header"
        justify="space-between"
        w="100%"
        h="100px"
        bg="#181824"
        color="#fff"
        align="center"
        px={8}
        position="fixed"
        top={0}
        left={0}
        zIndex={100}
      >
        <Flex align="center">
          <Image
            mr="15px"
            ml="35px"
            src="/tocomfomenome.png"
            alt="logo"
            boxSize="100px"
            objectFit="contain"
          />
        </Flex>
          <Flex justify="center" align="center"  flex="1">
            <Button
            mr={10}
            variant="outline"
            borderRadius="full"
            borderColor="#e05a6d"
            color="#e05a6d"
            minW="110px"
            bg="transparent"
            fontFamily="Montserrat"
            _hover={{ 
              opacity: 0.9,
              transition: "0.3s",
              transform: "scale(1.03)",}}
            onClick={openUserDialog}
            >
            Usuário
            </Button>
            <Button
            mr={10}
            variant="outline"
            borderRadius="full"
            borderColor="#e05a6d"
            color="#e05a6d"
            minW="110px"
            bg="transparent"
            fontFamily="Montserrat"
            _hover={{ 
              opacity: 0.9,
              transition: "0.3s",
              transform: "scale(1.03)",}}
            onClick={openAddressDialog}
            >
            Endereço
            </Button>
            <Button
            mr={10}
            variant="outline"
            borderRadius="full"
            borderColor="#e05a6d"
            color="#e05a6d"
            minW="110px"
            bg="transparent"
            fontFamily="Montserrat"
            _hover={{ 
              opacity: 0.9,
              transition: "0.3s",
              transform: "scale(1.03)",}}
            onClick={openOrderDialog}
            >
            Pedidos
            </Button>
        </Flex>
        <Flex justifyContent="flex-end" align="center" gap={2}>
          <IconButton
            mr={4}  
            variant="ghost"
            color="#e05a6d"
            minW="110px"
            fontWeight="bold"
            bg="transparent"
            fontFamily="Montserrat"
            _hover={{ 
              opacity: 0.9,
              transition: "0.3s",
              transform: "scale(1.03)",}}
            >
            <FaShoppingCart />
          </IconButton>
        </Flex>
        <Box
          as="nav"
          w={["70px", "220px"]}
          bg="#181824"
          color="#fff"
          py={8}
          px={4}
          minH="calc(100vh - 100px)"
          position="fixed"
          top="100px"
          left={0}
          zIndex={90}
          display="flex"
          flexDirection="column"
          gap={6}
        >
          <VStack align="stretch" spacing={4}>
            <Button
              variant="ghost"
              color={selectedCategory === "Todos" ? "#e05a6d" : "#fff"}
              fontFamily="Montserrat"
              justifyContent="flex-start"
              _hover={{ bg: "#23233a", color: "#e05a6d" }}
              onClick={() => setSelectedCategory("Todos")}
            >
              Todos
            </Button>
            <Button
              variant="ghost"
              color={selectedCategory === "Hambúrguer" ? "#e05a6d" : "#fff"}
              fontFamily="Montserrat"
              justifyContent="flex-start"
              _hover={{ bg: "#23233a", color: "#e05a6d" }}
              onClick={() => setSelectedCategory("Hambúrguer")}
            >
              Hambúrguer
            </Button>
            <Button
              variant="ghost"
              color={selectedCategory === "Pizza" ? "#e05a6d" : "#fff"}
              fontFamily="Montserrat"
              justifyContent="flex-start"
              _hover={{ bg: "#23233a", color: "#e05a6d" }}
              onClick={() => setSelectedCategory("Pizza")}
            >
              Pizza
            </Button>
            <Button
              variant="ghost"
              color={selectedCategory === "Pratos" ? "#e05a6d" : "#fff"}
              fontFamily="Montserrat"
              justifyContent="flex-start"
              _hover={{ bg: "#23233a", color: "#e05a6d" }}
              onClick={() => setSelectedCategory("Pratos")}
            >
              Pratos
            </Button>
          </VStack>
        </Box>
      </Flex>
      <Box pt="120px" px={8} pl={["0", "220px"]}>
        <Box maxW="1200px" mx="auto">
          <Box display="flex" justifyContent="center" mb={8}>
            <InputPesquisaUser
              width="1180px"
              placeholder="e aí, tá com fome de quê?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>
          <SimpleGrid columns={[1, 2, 3, 4, 5]}>
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={() => addToCartClick(product.id)}/>
            ))}
          </SimpleGrid>
        </Box>
      </Box>
      <DialogInfoUser
        isOpen={isDialogInfoUserOpen}
        onClose={() => setIsDialogInfoUserOpen(false)}
        user={userInfo}
      />
      <DialogAddressUser
        isOpen={isDialogAddressUserOpen}
        onClose={() => setIsDialogAddressUserOpen(false)}
        address={addressInfo}
        user={userInfo}
      />
      <DialogOrderUser
        isOpen={isDialogOrderUserOpen}
        onClose={() => setIsDialogOrderUserOpen(false)}
        user={userInfo} 
      />  
      <DialogAddToCart
        isOpen={isDialogAddToCartOpen}
        onClose={() => setIsDialogAddToCartOpen(false)}
        productId={selectedProductId}
        onConfirm={(cartItem) => {
          setCart(prev => [...prev, cartItem]);
          setIsDialogAddToCartOpen(false);
        }}
      />
    </Box>
  );
}