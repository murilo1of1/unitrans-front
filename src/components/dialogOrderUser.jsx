import {
  Dialog,
  Portal,
  Box,
  VStack,
  CloseButton,
} from "@chakra-ui/react";
import { FormLabel } from "@chakra-ui/form-control";
import { useState, useEffect } from "react";
import api from "@/utils/axios";

export default function DialogOrderUser({ isOpen, onClose, user }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const orderStatusTranslations = {
    pending: "Pendente",
    preparing: "Em Preparação",
    cancelled: "Cancelado",
    on_delivery: "Em Entrega",
    delivered: "Entregue",
    };


  useEffect(() => {
    if (!isOpen || !user?.id) return;
    async function getOrders() {
        try {
        setIsLoading(true);
        const res = await api.get(`/order/customer/${user.id}`);
        setOrders(res.data.data || []);
        } catch {
        setOrders([]);
        } finally {
        setIsLoading(false);
        }
  }
    getOrders();
  }, [isOpen, user]);

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={onClose}
      motionPreset="slide-in-bottom"
      placement="center"
    >
    <Portal>
    <Dialog.Backdrop />
    <Dialog.Positioner>
        <Dialog.Content bg="#181824" color="#fff" borderRadius="lg" minW="200px" maxW="1000px">
        <Dialog.Header>
            <FormLabel
            fontFamily="Montserrat"
            color="#e05a6d"
            fontSize="xxl"
            fontWeight="bold"
            mb={0}
            >
            Meus Pedidos
            </FormLabel>
        </Dialog.Header>
        <Dialog.Body>
            <VStack spacing={4} align="stretch">
            {orders.length === 0 ? (
                <FormLabel
                color="gray.400"
                textAlign="center"
                fontFamily="Montserrat"
                mb={0}
                >
                Nenhum pedido encontrado.
                </FormLabel>
            ) : (
                [...orders]
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .map((order) => (
                    <Box
                    key={order.id}
                    p={4}
                    borderRadius="lg"
                    borderColor="#23233a"
                    borderWidth="1px"
                    bg="#202032"
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    >
                    <FormLabel
                        fontFamily="Montserrat"
                        color="#e05a6d"
                        mb={0}
                        textAlign="left"
                        fontSize="md"
                    >
                        #{order.id} - {orderStatusTranslations[order.status] || order.status}
                    </FormLabel>
                    <Box
                        fontFamily="Montserrat"
                        fontSize="sm"
                        color="#fff"
                        mt={1}
                        textAlign="left"
                    >
                        {new Date(order.created_at).toLocaleString()}
                    </Box>
                    </Box>
                ))
            )}
            </VStack>
        </Dialog.Body>
        <Dialog.Footer />
        <Dialog.CloseTrigger asChild>
            <CloseButton size="sm" />
        </Dialog.CloseTrigger>
        </Dialog.Content>
    </Dialog.Positioner>
    </Portal>
    </Dialog.Root>
  );
}