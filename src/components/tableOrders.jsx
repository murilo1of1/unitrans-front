'use client';
import {
  Box,
  Text,
  Spinner,
  Flex,
  VStack,
  Button,
  Table,
  Select,
  createListCollection
} from '@chakra-ui/react';

import { Toaster, toaster } from "@/components/ui/toaster"
import { useEffect, useState, useCallback } from 'react';
import api from '@/utils/axios';

const TabelaPedidos = ({ items, loading, onReloadOrders }) => { 
  const [orders, setOrders] = useState([]);
  const [internalLoading, setInternalLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const getOrdersData = useCallback(async () => {
    setInternalLoading(true); 
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
      toaster.create({
        title: 'Erro ao carregar pedidos.',
        description: 'Não foi possível buscar os dados dos pedidos. Verifique o console para mais detalhes.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setInternalLoading(false); 
    }
  }, []);

  useEffect(() => {
    getOrdersData();
  }, [getOrdersData]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await api.patch(`/order/${orderId}`, { status: newStatus });
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toaster.create({
        title: 'Status do pedido atualizado.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(`Erro ao atualizar status do pedido ${orderId}:`, error);
      toaster.create({
        title: 'Erro ao atualizar status.',
        description: 'Não foi possível atualizar o status do pedido.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const renderOrderItems = (orderProducts) => {
    if (!orderProducts || orderProducts.length === 0) {
      return <Text color="#fff">Nenhum item</Text>;
    }
    return (
      <VStack align="flex-start" spacing={0} fontSize="sm" color="#fff">
        {orderProducts.map((item, index) => (
          <Text key={index}>
            {item.quantity}x{' '}
            {item.product ? item.product.name : item.drink ? item.drink.name : 'Item desconhecido'}
          </Text>
        ))}
      </VStack>
    );
  };

  const statusOptions = createListCollection({
    items: [
      { label: "Pendente", value: "pending" },
      { label: "Preparando", value: "preparing" },
      { label: "Em entrega", value: "on_delivery" },
      { label: "Entregue", value: "delivered" },
      { label: "Cancelado", value: "cancelled" },
    ],
  });

  if (loading || internalLoading) { 
    return (
      <Flex justify="center" align="center" minH="200px">
        <Spinner size="xl" color="#e05a6d" />
      </Flex>
    );
  }

  if (items && items.length === 0) { 
    return (
      <Flex direction="column" align="center" justify="center" minH="200px">
        <Text fontSize="xl" color="gray.500">Nenhum pedido encontrado.</Text>
      </Flex>
    );
  }

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
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="2xl" fontWeight="bold" color="#e05a6d" fontFamily="Montserrat">Lista de Pedidos</Text>
      </Flex>

      <Table.Root size="md" variant="striped" colorScheme="pink">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader fontFamily="Montserrat" textAlign="center" fontWeight="bold" fontSize="lg" color="#e05a6d">
              ID Pedido
            </Table.ColumnHeader>
            <Table.ColumnHeader fontFamily="Montserrat" textAlign="center" fontWeight="bold" fontSize="lg" color="#e05a6d">
              Itens
            </Table.ColumnHeader>
            <Table.ColumnHeader fontFamily="Montserrat" textAlign="center" fontWeight="bold" fontSize="lg" color="#e05a6d">
              Total
            </Table.ColumnHeader>
            <Table.ColumnHeader fontFamily="Montserrat" textAlign="center" fontWeight="bold" fontSize="lg" color="#e05a6d">
              Desconto
            </Table.ColumnHeader>
            <Table.ColumnHeader fontFamily="Montserrat" textAlign="center" fontWeight="bold" fontSize="lg" color="#e05a6d">
              Status
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {(items || orders).map((order) => (
            <Table.Row key={order.id} _hover={{ bg: "#2d2d44", borderRadius: "10px" }}>
              <Table.Cell fontFamily="Montserrat" textAlign="center" fontSize="md" color="#fff">
                {order.id}
              </Table.Cell>
              <Table.Cell fontFamily="Montserrat" textAlign="left" fontSize="md" color="#fff">
                {renderOrderItems(order.orderProducts)}
              </Table.Cell>
              <Table.Cell fontFamily="Montserrat" textAlign="center" fontSize="md" color="#fff">
                R$ {parseFloat(order.total).toFixed(2).replace('.', ',')}
              </Table.Cell>
              <Table.Cell fontFamily="Montserrat" textAlign="center" fontSize="md" color="#fff">
                R$ {parseFloat(order.totalDiscount).toFixed(2).replace('.', ',')}
              </Table.Cell>
              <Table.Cell textAlign="center">
                <Select.Root
                  width="100%"
                  collection={statusOptions}
                  onValueChange={(details) => handleStatusChange(order.id, details.value[0])}
                  disabled={updatingOrderId === order.id}
                  defaultValue={[order.status || "pending"]}
                >
                  <Select.HiddenSelect />
                  <Select.Control
                    bg="whiteAlpha.100"
                    borderRadius="md"
                  >
                    <Select.Trigger
                      fontFamily="Montserrat"
                      color="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      width="100%"
                    >
                      <Select.ValueText/>
                      <Select.Indicator />
                    </Select.Trigger>
                  </Select.Control>
                  <Select.Positioner>
                    <Select.Content
                      bg="#181824"
                      color="#fff"
                      borderRadius="md"
                      boxShadow="lg"
                      zIndex={999}
                    >
                      {statusOptions.items.map((opt) => (
                        <Select.Item item={opt} key={opt.value}>
                          <Select.ItemText fontFamily="Montserrat">{opt.label}</Select.ItemText>
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>
                {updatingOrderId === order.id}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default TabelaPedidos;