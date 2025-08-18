import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Box,
  VStack,
  Input,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { FormLabel } from "@chakra-ui/form-control";
import { Toaster, toaster } from "@/components/ui/toaster"
import api from "@/utils/axios";
import { useState, useEffect } from "react";

export default function DialogCreateCupom({ isOpen, onClose, onCreated, editingCupom }) {
  const [code, setCode] = useState('');
  const [type, setType] = useState('');
  const [value, setValue] = useState('');
  const [uses, setUses] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && editingCupom) {
      setCode(editingCupom.code || '');
      setType(editingCupom.type || '');
      setValue(editingCupom.value || '');
      setUses(editingCupom.uses || '');
    } else if (isOpen && !editingCupom) {
      setCode('');
      setType('');
      setValue('');
      setUses('');
    }
    setIsLoading(false);
  }, [isOpen, editingCupom]);

  const typesCollection = createListCollection({
    items: [
      { label: "Valor", value: "valor" },
      { label: "Porcentagem", value: "porcentagem" },
    ],
  })

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("code", code);
      formData.append("type", type);
      formData.append("value", value);
      formData.append("uses", uses);

      let response;
      if (editingCupom) {
        response = await api.patch(`/cupom/${editingCupom.id}`, {
          code, type, value, uses
        });
      } else {
        response = await api.post('/cupom', formData);
      }

      if (response.status === 200 || response.status === 201) {
        toaster.create({
          title: editingCupom ? "Cupom atualizado com sucesso!" : "Cupom criado com sucesso!",
          type: "success",
        });
        if (onCreated) onCreated();
        onClose();
      } else {
        toaster.create({
          title: "Erro ao salvar cupom.",
          type: "error",
        });
      }
    } catch (error) {
      toaster.create({
        title: "Erro ao salvar cupom.",
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
        <Dialog.Backdrop/>
        <Dialog.Positioner>
          <Dialog.Content bg="#181824" color="#fff" borderRadius="lg">
            <Dialog.Header>
              <Dialog.Title fontFamily="Montserrat" color="#e05a6d">
                {editingCupom ? "Editar Cupom" : "Criar Cupom"}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Box>
                <VStack spacing={4} align="stretch">
                  <FormLabel fontFamily="Montserrat" color="#e05a6d">Nome</FormLabel>
                  <Input
                    fontFamily="Montserrat"
                    placeholder="Nome do cupom"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                  />
                  <FormLabel fontFamily="Montserrat" color="#e05a6d">Tipo</FormLabel>
                  <Select.Root
                    width="100%"
                    collection={typesCollection}
                    //value={type}
                    onValueChange={(value) => setType(value.value[0])}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Selecione o tipo" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                   <Select.Positioner>
                      <Select.Content bg="#black" color="#fff">
                        {typesCollection.items.map((type) => (
                          <Select.Item item={type} key={type.value}>
                            {type.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Select.Root>
                  <FormLabel fontFamily="Montserrat" color="#e05a6d">Valor</FormLabel>
                    <Input  
                      fontFamily="Montserrat"
                      placeholder="0"
                      value={value}
                      onChange={e => setValue(e.target.value)}
                    ></Input>
                   <FormLabel fontFamily="Montserrat" color="#e05a6d">Usos disponíveis</FormLabel>
                    <Input  
                      fontFamily="Montserrat"
                      placeholder="0"
                      value={uses}
                      onChange={e => setUses(e.target.value)}
                    ></Input>  
                  <Button
                    mt={4}
                    bg="#e05a6d"
                    color="#fff"
                    fontFamily="Montserrat"
                    fontWeight="bold"
                    borderRadius="md"
                    isLoading={isLoading}
                    onClick={handleSubmit}
                    _hover={{
                      opacity: 0.9,
                      transform: "scale(1.01)",
                      transition: "0.3s",
                      bg: "#db5c6e"
                    }}
                  >
                    {editingCupom ? "Salvar alterações" : "Criar cupom"}
                  </Button>
                </VStack>
              </Box>
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