import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Box,
  Flex,
  Input,
  HStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FormLabel } from "@chakra-ui/form-control";
import api from "@/utils/axios";
import { toaster } from "@/components/ui/toaster";

export default function DialogAddressUser({ isOpen, onClose, address, user }) {
  const [city, setCity] = useState(address?.city || "");
  const [state, setState] = useState(address?.state || "");
  const [street, setStreet] = useState(address?.street || "");
  const [zipCode, setZipCode] = useState(address?.zipCode || "");
  const [number, setNumber] = useState(address?.number || "");
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    setCity(address?.city || "");
    setState(address?.state || "");
    setStreet(address?.street || "");
    setZipCode(address?.zipCode || "");
    setNumber(address?.number || "");
  }, [address, isOpen]);

  const confirm = async () => {
    setIsLoading(true);
    try {
      await api.patch(`/address/${user.id}`, {
        city,
        state,
        street,
        zipCode,
        number
      });
      toaster.create({
        description: "Endereço atualizado com sucesso!",
        type: "success",
      });
      onClose();
    } catch (error) {
      toaster.create({
        description: "Erro ao atualizar.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          <Dialog.Content bg="#181824" color="#fff" borderRadius="lg" minW="350px">
            <Dialog.Header>
              <Dialog.Title fontFamily="Montserrat" color="#e05a6d">
                Informações de Endereço
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Flex direction="column" align="center" gap={4} py={4}>
                <Box textAlign="center" w="100%">
                  <FormLabel textAlign="center" fontFamily="Montserrat" mb={1} color="#e05a6d">Cidade</FormLabel>
                  <Input
                    fontFamily="Montserrat"
                    mb={2}
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    color="#fff"
                    bg="#23233a"
                  />
                  <FormLabel textAlign="center" fontFamily="Montserrat" mb={1} color="#e05a6d">Estado</FormLabel>
                  <Input
                    color="#fff"
                    fontFamily="Montserrat"
                    mb={2}
                    value={state}
                    onChange={e => setState(e.target.value)}
                    bg="#23233a"
                  />
                  <FormLabel textAlign="center" fontFamily="Montserrat" mb={1} color="#e05a6d">Rua</FormLabel>
                  <Input
                    color="#fff"
                    fontFamily="Montserrat"
                    mb={2}
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    bg="#23233a"
                  />
                  <FormLabel textAlign="center" fontFamily="Montserrat" mb={1} color="#e05a6d">Número</FormLabel>
                  <Input
                    color="#fff"
                    fontFamily="Montserrat"
                    mb={2}
                    value={number}
                    onChange={e => setNumber(e.target.value)}
                    bg="#23233a"
                  />
                  <FormLabel textAlign="center" fontFamily="Montserrat" mb={1} color="#e05a6d">CEP</FormLabel>
                  <Input
                    color="#fff"
                    fontFamily="Montserrat"
                    mb={2}
                    value={zipCode} 
                    onChange={e => setZipCode(e.target.value)}
                    bg="#23233a"
                  />
                </Box>
              </Flex>
            </Dialog.Body>
            <Dialog.Footer>
              <HStack w="100%" justify="flex-end" spacing={3}>
                <Button
                  onClick={onClose}
                  color="#fff"
                  fontWeight="bold"
                  fontFamily="Montserrat"
                  bg="#e05a6d"
                  _hover={{
                    opacity: 0.9,
                    transform: "scale(1.02)",
                    transition: "0.2s",
                    bg: "#db5c6e"
                    }}
                >
                    Cancelar
                </Button>
                <Button
                  onClick={confirm}
                  color="#fff"
                  fontWeight="bold"
                  fontFamily="Montserrat"
                  bg="#e05a6d"
                  _hover={{
                    opacity: 0.9,
                    transform: "scale(1.02)",
                    transition: "0.2s",
                    bg: "#db5c6e"
                    }}
                >
                  Confirmar
                </Button>
              </HStack>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}   