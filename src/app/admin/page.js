'use client'
import { Box, Flex, Text, Button, VStack, IconButton, Image, Table } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { CiLogout } from "react-icons/ci";
import { FaReceipt, FaTicketAlt } from "react-icons/fa";
import api from "@/utils/axios";
import { useEffect, useState, useCallback } from "react";
import TabelaProdutos from "@/components/tableProducts";
import InputPesquisa from "@/components/inputPesquisa";
import { IoAdd } from "react-icons/io5";
import DialogCreateProduct from "@/components/dialogCreateProduct";
import TabelaCupoms from "@/components/tableCupoms";
import DialogCreateCupom from "@/components/dialogCreateCupom";
import ConfirmDialog from "@/components/dialogDeleteConfirmation";
import TabelaBebidas from "@/components/tableDrinks";
import DialogCreateDrink from "@/components/dialogCreateDrink";
import TabelaPedidos from "@/components/tableOrders";

export default function Admin() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [isDialogProductOpen, setIsDialogProductOpen] = useState(false);
  const [isDialogCupomOpen, setIsDialogCupomOpen] = useState(false);
  const [isDialogDrinkOpen, setIsDialogDrinkOpen] = useState(false);
  const [activeStep, setActiveStep] = useState("pedidos");
  const [cupoms, setCupoms] = useState([]);
  const [editingCupom, setEditingCupom] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [cupomIdToDelete, setCupomIdToDelete] = useState(null);
  const [isDeleteProductOpen, setIsDeleteProductOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [drinkIdToDelete, setDrinkIdToDelete] = useState(null);
  const [isDeleteDrinkOpen, setIsDeleteDrinkOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingDrink, setEditingDrink] = useState(null);
  
  useEffect(() => {
    getProducts();
    getCupoms();
    getDrinks();
    getOrders();
  }, []);

  const getOrders = useCallback(async () => {
    try {
      const ordersRes = await api.get('/order');
      const fetchedOrders = ordersRes.data.data || [];

      const orderProductsRes = await api.get('/order-product');
      const fetchedOrderProducts = orderProductsRes.data.data || [];

      const ordersWithItems = fetchedOrders.map((order) => {
        const itemsForThisOrder = fetchedOrderProducts.filter(
          (item) => item.idOrder === order.id
        );
        return {
          ...order,
          orderProducts: itemsForThisOrder,
        };
      });
      setOrders(ordersWithItems);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  }, []);


  const getProducts = async () => {
    try {
      const res = await api.get("/product");
      setProducts(res.data.data || []);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const getCupoms = async () => {
    try {
      const res = await api.get("/cupom");
      setCupoms(res.data.data || []);
    } catch (error) {
      console.error("Erro ao buscar cupons:", error);
    }
  };

  const getDrinks = async () => {
    try {
      const res = await api.get("/drink");
      setDrinks(res.data.data || []);
    } catch (error) {
      console.error("Erro ao buscar bebidas:", error);
    }
  };


  const EditCupom = (cupom) => {
    setEditingCupom(cupom);
    setIsDialogCupomOpen(true);
  };

  const EditProduct = (product) => {
    setEditingProduct(product);
    setIsDialogProductOpen(true);
  };

  const EditDrink = (drink) => {
    setEditingDrink(drink);
    setIsDialogDrinkOpen(true);
  };

  const DeleteCupomClick = (id) => {
    setCupomIdToDelete(id);
    setIsDeleteOpen(true);
  };

  const DeleteProductClick = (id) => {
    setProductIdToDelete(id);
    setIsDeleteProductOpen(true);
  };

  const DeleteDrinkClick = (id) => {
    setDrinkIdToDelete(id);
    setIsDeleteDrinkOpen(true);
  };

  const DeleteCupom = async () => {
    await api.delete(`/cupom/${cupomIdToDelete}`);
    setIsDeleteOpen(false);
    setCupomIdToDelete(null);
    getCupoms();
  };

  const DeleteProduct = async () => {
    await api.delete(`/product/${productIdToDelete}`);
    setIsDeleteProductOpen(false);
    setProductIdToDelete(null);
    getProducts();
  };

  const DeleteDrink = async () => {
    await api.delete(`/drink/${drinkIdToDelete}`);
    setIsDeleteDrinkOpen(false);
    setDrinkIdToDelete(null);
    getDrinks();
  };
  
  const filteredDrinks = drinks.filter(
    (item) =>
      item.name?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredProducts = products.filter(
    (item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCupoms = cupoms.filter(
    (item) =>
      item.code?.toLowerCase().includes(search.toLowerCase()) ||
      String(item.value)?.toLowerCase().includes(search.toLowerCase()) ||
      item.type?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredOrders = orders.filter(
    (order) =>
      String(order.id).includes(search) ||  
      order.orderProducts?.some(item => 
        (item.product?.name || item.drink?.name)?.toLowerCase().includes(search.toLowerCase())
      )
  );



  return (
    <Box minH="100vh" bgImage="url(/teladeinicio.png)" bgSize="cover" bgPosition="center" bgRepeat="no-repeat">
      <Flex
        as="header"
        justify="space-between"
        w="100%"
        h="90px"
        bg="#181824"
        color="#fff"
        align="center"
        px={8}
        position="fixed"
        top={0}
        left={0}
        zIndex={100}
      >
        <Flex>
          <Image 
            mr="15px"
            ml="25px" 
            src="/tocomfomenome.png" 
            alt="logo"  
            boxSize="90px"
            objectFit="contain"></Image>
        </Flex>
        <Flex>
          <Text
            fontFamily="Montserrat"
            color="#f6f6f6"
            ml={-590}
          >
            Painel administrativo
          </Text>
        </Flex>

        <Flex justifyContent="flex-end" align="center" gap={2}>
          <IconButton 
            fontFamily="Montserrat"
            fontWeight="bold"
            bg="transparent"
            variant="ghost"
            color="#fff"
            size="md"
            borderRadius="md"
            px={5}
            mr="20px"
            _hover={{ 
              bg: "white", 
              color: "#e05a6d",
              opacity: 0.9,
              transform: "scale(1.01)",
              transition: "0.3s", 
            }}
            onClick={() => router.push("/login")}
          ><CiLogout />Logout 
          </IconButton>
        </Flex>  
      </Flex>

      <Flex pt="70px" h="100vh">  
        <Box
          as="nav"
          w={["70px", "220px"]}
          bg="#181824"
          color="#fff"
          py={8}
          px={4}
          minH="calc(100vh - 70px)"
          position="fixed"
          top="70px"
          left={0}
          zIndex={90}
          display="flex"
          flexDirection="column"
          gap={6}
        >
          <VStack align="stretch" spacing={4}>
            <Button
              leftIcon={<FaReceipt />}
              variant="ghost"
              color={activeStep === "pedidos" ? "#e05a6d" : "#fff"}
              fontFamily="Montserrat"
              justifyContent="flex-start"
              _hover={{ bg: "#23233a", color: "#e05a6d" }}
              onClick={() => setActiveStep("pedidos")}
            >
              Pedidos
            </Button>
            <Button
              leftIcon={<FaReceipt />}
              variant="ghost"
              color={activeStep === "produtos" ? "#e05a6d" : "#fff"}
              fontFamily="Montserrat"
              justifyContent="flex-start"
              _hover={{ bg: "#23233a", color: "#e05a6d" }}
              onClick={() => setActiveStep("produtos")}
            >
              Produtos
            </Button>
            <Button
              leftIcon={<FaTicketAlt />}
              variant="ghost"
              color={activeStep === "bebidas" ? "#e05a6d" : "#fff"}
              fontFamily="Montserrat"
              justifyContent="flex-start"
              _hover={{ bg: "#23233a", color: "#e05a6d" }}
              onClick={() => setActiveStep("bebidas")}
            >
              Bebidas
            </Button>
            <Button
              leftIcon={<FaTicketAlt />}
              variant="ghost"
              color={activeStep === "cupons" ? "#e05a6d" : "#fff"}
              fontFamily="Montserrat"
              justifyContent="flex-start"
              _hover={{ bg: "#23233a", color: "#e05a6d" }}
              onClick={() => setActiveStep("cupons")}
            >
              Cupons
            </Button>
          </VStack>
        </Box>

        <Box
          flex="1"
          ml={["70px", "200px"]}
          p={10}
          display="flex"
          flexDirection="column"
          w="100%"
        >
          {activeStep === "pedidos" && (
            <>
              <Box w="100%" display="flex" maxW="900px" mx="auto" mb={1}>
                <InputPesquisa
                  placeholder="Pesquisar pedidos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Box>
              <TabelaPedidos items={filteredOrders} />
            </>
          )}
          {activeStep === "produtos" && (
            <>
              <Box w="100%" display="flex" maxW="900px" mx="auto" mb={1}>
                <InputPesquisa
                  placeholder="Pesquisar produtos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <IconButton
                  fontFamily="Montserrat"
                  fontWeight="bold"
                  bg="#e05a6d"
                  color="#fff"
                  size="sm"
                  borderRadius="md"
                  h="40px"
                  ml={1}
                  mb={-2}
                  mt={1}
                  px={5}
                  _hover={{
                    bg: "#f6f6f6",
                    color: "#e05a6d",
                    opacity: 0.9,
                    transform: "scale(1.01)",
                    transition: "0.3s",
                  }}
                  onClick={() => setIsDialogProductOpen(true)}
                >
                  <IoAdd />
                </IconButton>
                <DialogCreateProduct
                  isOpen={isDialogProductOpen}
                  onClose={() => {
                    setIsDialogProductOpen(false);
                    setEditingProduct(null);
                  }}
                  onCreated={getProducts}
                  editingProduct={editingProduct}
                />
              </Box>
              <TabelaProdutos 
                items={filteredProducts}
                onDelete={DeleteProductClick}
                onEdit={EditProduct} />
              <ConfirmDialog
                isOpen={isDeleteProductOpen}
                onClose={() => setIsDeleteProductOpen(false)}
                onConfirm={DeleteProduct}
                title="Excluir produto"
                description="Você tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
              />
            </>
          )} 

          {activeStep === "bebidas" && (
            <>
              <Box w="100%" display="flex" maxW="900px" mx="auto" mb={1}>
                <InputPesquisa
                  placeholder="Pesquisar bebidas..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <IconButton
                  fontFamily="Montserrat"
                  fontWeight="bold"
                  bg="#e05a6d"
                  color="#fff"
                  size="sm"
                  borderRadius="md"
                  h="40px"
                  ml={1}
                  mb={-2}
                  mt={1}
                  px={5}
                  _hover={{
                    bg: "#f6f6f6",
                    color: "#e05a6d",
                    opacity: 0.9,
                    transform: "scale(1.01)",
                    transition: "0.3s",
                  }}
                  onClick={() => setIsDialogDrinkOpen(true)}
                >
                  <IoAdd />
                </IconButton>
                <DialogCreateDrink
                  isOpen={isDialogDrinkOpen}
                  onClose={() => {
                    setIsDialogDrinkOpen(false);
                    setEditingDrink(null);
                  }}
                  onCreated={getDrinks}
                  editingProduct={editingDrink}
                />
              </Box>  
                <TabelaBebidas 
                items={filteredDrinks}
                onDelete={DeleteDrinkClick}
                onEdit={EditDrink} />
              <ConfirmDialog
                isOpen={isDeleteDrinkOpen}
                onClose={() => setIsDeleteDrinkOpen(false)}
                onConfirm={DeleteDrink}
                title="Excluir produto"
                description="Você tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
              />

            </>
          )}

          {activeStep === "cupons" && (
            <>
              <Box w="100%" display="flex" maxW="900px" mx="auto" mb={1}>
                <InputPesquisa
                  placeholder="Pesquisar cupons..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <IconButton
                  fontFamily="Montserrat"
                  fontWeight="bold"
                  bg="#e05a6d"
                  color="#fff"
                  size="sm"
                  borderRadius="md"
                  h="40px"
                  ml={1}
                  mb={-2}
                  mt={1}
                  px={5}
                  _hover={{
                    bg: "#f6f6f6",
                    color: "#e05a6d",
                    opacity: 0.9,
                    transform: "scale(1.01)",
                    transition: "0.3s",
                  }}
                  onClick={() => setIsDialogCupomOpen(true)}
                >
                  <IoAdd />
                </IconButton>
                <DialogCreateCupom
                  isOpen={isDialogCupomOpen}
                  onClose={() => {
                    setIsDialogCupomOpen(false);
                    setEditingCupom(null);
                  }}
                  onCreated={getCupoms}
                  editingCupom={editingCupom}
                />
              </Box>
              <TabelaCupoms 
                items={filteredCupoms}
                onEdit={EditCupom}
                onDelete={DeleteCupomClick} />
              <ConfirmDialog
                isOpen={isDeleteOpen}
                title="Excluir cupom"
                description="Você tem certeza que deseja excluir este cupom? Esta ação não pode ser desfeita."
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={DeleteCupom}>
              </ConfirmDialog>  
            </>
          )}
        </Box>
      </Flex>
    </Box>
  );
}