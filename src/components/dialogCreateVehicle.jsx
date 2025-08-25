import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Box,
  VStack,
  Input,
  Icon,
  InputGroup,
} from "@chakra-ui/react";
import { FormLabel } from "@chakra-ui/form-control";
import { Toaster, toaster } from "@/components/ui/toaster";
import { FileUpload } from "@chakra-ui/react";
import { LuUpload } from "react-icons/lu";
import api from "@/utils/axios";
import { useState, useEffect } from "react";

export default function DialogCreateVehicle({
  isOpen,
  onClose,
  onCreated,
  editingVehicle,
  idEmpresa,
}) {
  const [modelo, setModelo] = useState("");
  const [placa, setPlaca] = useState("");
  const [descricao, setDescricao] = useState("");
  const [capacidade, setCapacidade] = useState("");
  const [imagem, setImagem] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && editingVehicle) {
      setModelo(editingVehicle.modelo || "");
      setPlaca(editingVehicle.placa || "");
      setDescricao(editingVehicle.descricao || "");
      setCapacidade(editingVehicle.capacidade || "");
      setImagem(""); // Deixa imagem vazia para substituir a antiga
    } else if (isOpen && !editingVehicle) {
      setModelo("");
      setPlaca("");
      setDescricao("");
      setCapacidade("");
      setImagem("");
    }
    setIsLoading(false);
  }, [isOpen, editingVehicle]);

  const handleFileChange = (event) => {
    console.log("Files recebidos:", event);
    const files = event.target?.files || event.dataTransfer?.files;
    if (files && files.length > 0) {
      setImagem(files[0]);
      console.log("Imagem setada:", files[0]);
    }
  };

  const handleCreateOrEdit = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("modelo", modelo);
      formData.append("placa", placa);
      formData.append("descricao", descricao);
      formData.append("capacidade", capacidade);
      formData.append("idEmpresa", idEmpresa);

      if (imagem instanceof File) {
        formData.append("imagem", imagem);
      }

      let response;
      if (editingVehicle) {
        response = await api.patch(`/veiculo/${editingVehicle.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        response = await api.post("/veiculo", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      if (response.status === 200 || response.status === 201) {
        toaster.create({
          title: editingVehicle
            ? "Veículo atualizado com sucesso!"
            : "Veículo criado com sucesso!",
          type: "success",
        });
        if (onCreated) onCreated();
        onClose();
      } else {
        toaster.create({
          title: editingVehicle
            ? "Erro ao atualizar veículo."
            : "Erro ao criar veículo.",
          type: "error",
        });
      }
    } catch (error) {
      toaster.create({
        title: editingVehicle
          ? "Erro ao atualizar veículo."
          : "Erro ao criar veículo.",
        status: "error",
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
          <Dialog.Content
            bg="#2c2b3c"
            color="#fff"
            borderRadius="lg"
            maxW="500px"
          >
            <Dialog.Header>
              <Dialog.Title
                fontFamily="Montserrat"
                color="white"
                fontSize="xl"
                fontWeight="bold"
              >
                {editingVehicle ? "Editar Veículo" : "Adicionar Veículo"}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Box>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <FormLabel
                      fontFamily="Montserrat"
                      color="white"
                      fontWeight="500"
                      mb={2}
                    >
                      Modelo do Veículo
                    </FormLabel>
                    <Input
                      fontFamily="Montserrat"
                      placeholder="Ex: Mercedes Sprinter"
                      value={modelo}
                      onChange={(e) => setModelo(e.target.value)}
                      bg="#3a3947"
                      border="1px solid #4a4a5c"
                      color="#fff"
                      _placeholder={{ color: "#a0a0a0" }}
                    />
                  </Box>

                  <Box>
                    <FormLabel
                      fontFamily="Montserrat"
                      color="white"
                      fontWeight="500"
                      mb={2}
                    >
                      Placa
                    </FormLabel>
                    <Input
                      fontFamily="Montserrat"
                      placeholder="Ex: ABC-1234"
                      value={placa}
                      onChange={(e) => setPlaca(e.target.value)}
                      bg="#3a3947"
                      border="1px solid #4a4a5c"
                      color="#fff"
                      _placeholder={{ color: "#a0a0a0" }}
                    />
                  </Box>

                  <Box>
                    <FormLabel
                      fontFamily="Montserrat"
                      color="white"
                      fontWeight="500"
                      mb={2}
                    >
                      Descrição
                    </FormLabel>
                    <Input
                      fontFamily="Montserrat"
                      placeholder="Breve descrição do veículo"
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      bg="#3a3947"
                      border="1px solid #4a4a5c"
                      color="#fff"
                      _placeholder={{ color: "#a0a0a0" }}
                    />
                  </Box>

                  <Box>
                    <FormLabel
                      fontFamily="Montserrat"
                      color="white"
                      fontWeight="500"
                      mb={2}
                    >
                      Capacidade (passageiros)
                    </FormLabel>
                    <Input
                      fontFamily="Montserrat"
                      placeholder="Ex: 30"
                      value={capacidade}
                      onChange={(e) => setCapacidade(e.target.value)}
                      bg="#3a3947"
                      border="1px solid #4a4a5c"
                      color="#fff"
                      _placeholder={{ color: "#a0a0a0" }}
                    />
                  </Box>

                  <Box>
                    <FormLabel
                      fontFamily="Montserrat"
                      color="white"
                      fontWeight="500"
                      mb={2}
                    >
                      Imagem do Veículo
                    </FormLabel>
                    <FileUpload.Root
                      maxW="xl"
                      alignItems="stretch"
                      maxFiles={1}
                      onChange={handleFileChange}
                    >
                      <FileUpload.HiddenInput />
                      <FileUpload.Dropzone
                        bg="#3a3947"
                        border="2px dashed #4a4a5c"
                        borderRadius="md"
                        p={6}
                        _hover={{ borderColor: "#fdb525", bg: "#454454" }}
                        transition="all 0.2s"
                      >
                        <Icon
                          as={LuUpload}
                          boxSize={8}
                          color="#fdb525"
                          mb={3}
                        />
                        <FileUpload.DropzoneContent>
                          <Box
                            color="#fff"
                            fontFamily="Montserrat"
                            fontSize="md"
                            fontWeight="500"
                            mb={1}
                          >
                            Arraste e solte a imagem aqui
                          </Box>
                          <Box
                            color="#a0a0a0"
                            fontFamily="Montserrat"
                            fontSize="sm"
                          >
                            ou clique para selecionar (.png, .jpg até 5MB)
                          </Box>
                          {imagem && (
                            <Box mt={4} color="#fdb525" fontFamily="Montserrat">
                              <Box
                                as="img"
                                src={
                                  imagem instanceof File
                                    ? URL.createObjectURL(imagem)
                                    : imagem
                                }
                                alt="Preview"
                                maxH="120px"
                                borderRadius="md"
                                mb={2}
                                border="2px solid #fdb525"
                              />
                              <Box
                                wordBreak="break-all"
                                fontSize="sm"
                                color="#fff"
                              >
                                {imagem.name || "Imagem selecionada"}
                              </Box>
                            </Box>
                          )}
                        </FileUpload.DropzoneContent>
                      </FileUpload.Dropzone>
                      <FileUpload.List />
                    </FileUpload.Root>
                  </Box>

                  <Button
                    mt={6}
                    bg="#fdb525"
                    color="white"
                    fontFamily="Montserrat"
                    fontWeight="bold"
                    borderRadius="md"
                    isLoading={isLoading}
                    onClick={handleCreateOrEdit}
                    size="lg"
                    _hover={{
                      bg: "#f59e0b",
                      transform: "scale(1.02)",
                      transition: "0.3s",
                    }}
                  >
                    {editingVehicle ? "Salvar Alterações" : "Adicionar Veículo"}
                  </Button>
                </VStack>
              </Box>
            </Dialog.Body>
            <Dialog.Footer />
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" color="white" _hover={{ bg: "#3a3947" }} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
