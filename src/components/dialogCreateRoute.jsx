import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Box,
  VStack,
  Input,
} from "@chakra-ui/react";
import { FormLabel } from "@chakra-ui/form-control";
import { Toaster, toaster } from "@/components/ui/toaster";
import api from "@/utils/axios";
import { useState, useEffect } from "react";

export default function DialogCreateRoute({
  isOpen,
  onClose,
  onCreated,
  editingRoute,
}) {
  const [nome, setNome] = useState("");
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && editingRoute) {
      setNome(editingRoute.nome || "");
      setOrigem(editingRoute.origem || "");
      setDestino(editingRoute.destino || "");
    } else if (isOpen && !editingRoute) {
      setNome("");
      setOrigem("");
      setDestino("");
    }
    setIsLoading(false);
  }, [isOpen, editingRoute]);

  const handleSubmit = async () => {
    if (!nome.trim()) {
      toaster.create({
        title: "Nome da rota é obrigatório",
        status: "error",
      });
      return;
    }

    if (!origem.trim()) {
      toaster.create({
        title: "Origem é obrigatória",
        status: "error",
      });
      return;
    }

    if (!destino.trim()) {
      toaster.create({
        title: "Destino é obrigatório",
        status: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      const authToken = localStorage.getItem("token");

      // Decodificar o token para obter o idEmpresa
      const decodeToken = (token) => {
        try {
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join("")
          );
          return JSON.parse(jsonPayload);
        } catch (error) {
          console.error("Erro ao decodificar token:", error);
          return null;
        }
      };

      const decodedToken = decodeToken(authToken);

      if (!decodedToken?.idEmpresa) {
        toaster.create({
          title: "Erro de autenticação",
          description: "ID da empresa não encontrado. Faça login novamente.",
          status: "error",
        });
        return;
      }

      const routeData = {
        nome: nome.trim(),
        origem: origem.trim(),
        destino: destino.trim(),
        idEmpresa: decodedToken.idEmpresa,
      };

      let response;
      if (editingRoute) {
        response = await api.patch(`/rotas/${editingRoute.id}`, routeData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      } else {
        response = await api.post("/rotas", routeData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      }

      if (response.status === 200 || response.status === 201) {
        toaster.create({
          title: editingRoute
            ? "Rota atualizada com sucesso!"
            : "Rota criada com sucesso!",
          status: "success",
        });
        onCreated && onCreated();
        onClose();
      }
    } catch (error) {
      console.error("Erro ao salvar rota:", error);
      toaster.create({
        title: error.response?.data?.message || "Erro ao salvar rota",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Portal>
      <Dialog.Root
        open={isOpen}
        onOpenChange={onClose}
        motionPreset="slide-in-bottom"
        placement="center"
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="#2c2b3c" color="#fff" borderRadius="lg">
            <Dialog.Header>
              <Dialog.Title
                fontFamily="Montserrat"
                color="#fdb525"
                fontSize="xl"
                fontWeight="bold"
              >
                {editingRoute ? "Editar Rota" : "Criar Nova Rota"}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack spacing={4} align="stretch">
                <Box>
                  <FormLabel
                    fontFamily="Montserrat"
                    color="#fdb525"
                    fontWeight="500"
                    mb={2}
                    htmlFor="nome"
                  >
                    Nome da Rota *
                  </FormLabel>
                  <Input
                    fontFamily="Montserrat"
                    id="nome"
                    placeholder="Ex: Linha 01, Rota Matutina, Centro-Bairro..."
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    bg="#3a3947"
                    border="1px solid #4a4a5c"
                    color="#fff"
                    _placeholder={{ color: "#a0a0a0" }}
                  />
                </Box>

                <Box>
                  <FormLabel
                    fontFamily="Montserrat"
                    color="#fdb525"
                    fontWeight="500"
                    mb={2}
                    htmlFor="origem"
                  >
                    Origem *
                  </FormLabel>
                  <Input
                    fontFamily="Montserrat"
                    id="origem"
                    placeholder="Ponto inicial da rota"
                    value={origem}
                    onChange={(e) => setOrigem(e.target.value)}
                    bg="#3a3947"
                    border="1px solid #4a4a5c"
                    color="#fff"
                    _placeholder={{ color: "#a0a0a0" }}
                  />
                </Box>

                <Box>
                  <FormLabel
                    fontFamily="Montserrat"
                    color="#fdb525"
                    fontWeight="500"
                    mb={2}
                    htmlFor="destino"
                  >
                    Destino *
                  </FormLabel>
                  <Input
                    fontFamily="Montserrat"
                    id="destino"
                    placeholder="Ponto final da rota"
                    value={destino}
                    onChange={(e) => setDestino(e.target.value)}
                    bg="#3a3947"
                    border="1px solid #4a4a5c"
                    color="#fff"
                    _placeholder={{ color: "#a0a0a0" }}
                  />
                </Box>
                <Button
                  mt={4}
                  bg="#fdb525"
                  color="white"
                  fontFamily="Montserrat"
                  fontWeight="bold"
                  borderRadius="md"
                  isLoading={isLoading}
                  onClick={handleSubmit}
                  size="lg"
                  _hover={{
                    bg: "#f59e0b",
                    transform: "scale(1.02)",
                    transition: "0.3s",
                  }}
                >
                  {editingRoute ? "Atualizar Rota" : "Criar Rota"}
                </Button>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer />
            <Dialog.CloseTrigger asChild>
              <CloseButton
                size="sm"
                color="#fdb525"
                _hover={{ bg: "#3a3947" }}
              />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
      <Toaster />
    </Portal>
  );
}
