import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Box,
  VStack,
  Input,
  HStack,
} from "@chakra-ui/react";
import { FormLabel } from "@chakra-ui/form-control";
import { Toaster, toaster } from "@/components/ui/toaster";
import api from "@/utils/axios";
import { useState, useEffect } from "react";

export default function DialogCreatePoint({
  isOpen,
  onClose,
  onCreated,
  editingPoint,
}) {
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && editingPoint) {
      setNome(editingPoint.nome || "");
      setEndereco(editingPoint.endereco || "");
      setLatitude(editingPoint.latitude?.toString() || "");
      setLongitude(editingPoint.longitude?.toString() || "");
    } else if (isOpen && !editingPoint) {
      setNome("");
      setEndereco("");
      setLatitude("");
      setLongitude("");
    }
    setIsLoading(false);
  }, [isOpen, editingPoint]);

  const handleSubmit = async () => {
    if (!nome.trim()) {
      toaster.create({
        title: "Nome é obrigatório",
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

      const pointData = {
        nome: nome.trim(),
        endereco: endereco.trim(),
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        idEmpresa: decodedToken.idEmpresa,
      };

      let response;
      if (editingPoint) {
        response = await api.patch(`/ponto/${editingPoint.id}`, pointData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      } else {
        response = await api.post("/ponto", pointData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      }

      if (response.status === 200 || response.status === 201) {
        toaster.create({
          title: editingPoint
            ? "Ponto atualizado com sucesso!"
            : "Ponto criado com sucesso!",
          status: "success",
        });
        onCreated && onCreated();
        onClose();
      }
    } catch (error) {
      console.error("Erro ao salvar ponto:", error);
      toaster.create({
        title: error.response?.data?.message || "Erro ao salvar ponto",
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
                {editingPoint ? "Editar Ponto" : "Criar Novo Ponto"}
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
                    Nome do Ponto *
                  </FormLabel>
                  <Input
                    fontFamily="Montserrat"
                    id="nome"
                    placeholder="Ex: Terminal Central, Shopping, Universidade..."
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
                    htmlFor="endereco"
                  >
                    Endereço
                  </FormLabel>
                  <Input
                    fontFamily="Montserrat"
                    id="endereco"
                    placeholder="Endereço completo do ponto"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    bg="#3a3947"
                    border="1px solid #4a4a5c"
                    color="#fff"
                    _placeholder={{ color: "#a0a0a0" }}
                  />
                </Box>

                <HStack spacing={4}>
                  <Box flex={1}>
                    <FormLabel
                      fontFamily="Montserrat"
                      color="#fdb525"
                      fontWeight="500"
                      mb={2}
                      htmlFor="latitude"
                    >
                      Latitude
                    </FormLabel>
                    <Input
                      fontFamily="Montserrat"
                      id="latitude"
                      type="number"
                      step="any"
                      placeholder="-23.550520"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      bg="#3a3947"
                      border="1px solid #4a4a5c"
                      color="#fff"
                      _placeholder={{ color: "#a0a0a0" }}
                    />
                  </Box>
                  <Box flex={1}>
                    <FormLabel
                      fontFamily="Montserrat"
                      color="#fdb525"
                      fontWeight="500"
                      mb={2}
                      htmlFor="longitude"
                    >
                      Longitude
                    </FormLabel>
                    <Input
                      fontFamily="Montserrat"
                      id="longitude"
                      type="number"
                      step="any"
                      placeholder="-46.633309"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      bg="#3a3947"
                      border="1px solid #4a4a5c"
                      color="#fff"
                      _placeholder={{ color: "#a0a0a0" }}
                    />
                  </Box>
                </HStack>
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
                  {editingPoint ? "Atualizar Ponto" : "Criar Ponto"}
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
