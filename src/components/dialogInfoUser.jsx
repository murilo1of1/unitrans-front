import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Box,
  Text,
  Flex,
  Input,
  HStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FormLabel } from "@chakra-ui/form-control";
import api from "@/utils/axios";
import { toaster } from "@/components/ui/toaster";

export default function DialogInfoUser({ isOpen, onClose, user }) {
  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    setName(user?.name || "");
    setUsername(user?.username || "");
    setEmail(user?.email || "");
  }, [user, isOpen]);

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase(); 
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const confirm = async () => {
    setIsLoading(true);
    try {
      await api.patch(`/users/${user.id}`, {
        name,
        username,
      });
      toaster.create({
        description: "Usuário atualizado com sucesso!",
        type: "success",
      });
      onClose();
    } catch (error) {
      toaster.create({
        description: "Erro ao atualizar usuário.",
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
                Informações do Usuário
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Flex direction="column" align="center" gap={4} py={4}>
                <Box
                  bg="#e05a6d"
                  color="#fff"
                  borderRadius="full"
                  w="80px"
                  h="80px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="2xl"
                  fontWeight="bold"
                  fontFamily="Montserrat"
                  mb={2}
                  userSelect="none"
                >
                  {getInitials(name)}
                </Box>
                <Box textAlign="center" w="100%">
                  <FormLabel textAlign="center" fontFamily="Montserrat" mb={1} color="#e05a6d">Nome</FormLabel>
                  <Input
                    fontFamily="Montserrat"
                    mb={2}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Nome"
                    color="#fff"
                    bg="#23233a"
                  />
                  <FormLabel textAlign="center" fontFamily="Montserrat" mb={1} color="#e05a6d">Apelido</FormLabel>
                  <Input
                    color="#fff"
                    fontFamily="Montserrat"
                    mb={2}
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Apelido"
                    bg="#23233a"
                  />
                  <FormLabel textAlign="center" fontFamily="Montserrat" mb={1} color="#e05a6d">E-mail</FormLabel>
                  <Input
                    color="#fff"
                    fontFamily="Montserrat"
                    mb={2}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email"
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