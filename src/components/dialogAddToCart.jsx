import {
  Dialog,
  Portal,
  Box,
  Flex,
  Button,
  CloseButton,
  Input,
  Select,
  HStack,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { FormLabel } from "@chakra-ui/form-control";
import { useState, useEffect } from "react";
import api from "@/utils/axios";

export default function DialogAddToCart({ isOpen, onClose, productId, onConfirm }) {
  const [step, setStep] = useState(1);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [drinks, setDrinks] = useState([]);
  const [selectedDrink, setSelectedDrink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Busca produto ao abrir
  useEffect(() => {
    if (!isOpen || !productId) return;
    setIsLoading(true);
    api.get(`/product/${productId}`)
      .then(res => setProduct(res.data.data))
      .finally(() => setIsLoading(false));
  }, [isOpen, productId]);

  // Busca bebidas no step 2
  useEffect(() => {
    if (step !== 2 || drinks.length > 0) return;
    setIsLoading(true);
    api.get("/drink")
      .then(res => setDrinks(res.data.data || []))
      .finally(() => setIsLoading(false));
  }, [step, drinks.length]);

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const handleConfirm = () => {
    onConfirm({
      productId: product.id,
      name: product.name,
      quantity,
      drinkId: selectedDrink || null,
      drinkName: drinks.find(d => d.id === Number(selectedDrink))?.name || null,
    });
    setStep(1);
    setQuantity(1);
    setSelectedDrink("");
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose} motionPreset="slide-in-bottom" placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="#181824" color="#fff" borderRadius="lg" minW="350px">
            <Dialog.Header>
              <FormLabel fontFamily="Montserrat" color="#e05a6d" fontSize="xl" mb={0}>
                {step === 1 ? "Adicionar Produto" : "Adicionar Bebida"}
              </FormLabel>
            </Dialog.Header>
            <Dialog.Body>
              {isLoading ? (
                <Flex justify="center" align="center" minH="100px">
                  <Spinner color="#e05a6d" />
                </Flex>
              ) : (
                <>
                  {step === 1 && product && (
                    <Flex direction="column" gap={4}>
                      <Box>
                        <FormLabel fontFamily="Montserrat" color="#e05a6d" mb={1}>Produto</FormLabel>
                        <Text fontFamily="Montserrat" fontWeight="bold">{product.name}</Text>
                        <Text fontFamily="Montserrat" fontSize="sm" color="gray.300">{product.description}</Text>
                        <Text fontFamily="Montserrat" fontSize="md" color="#e05a6d" mt={2}>R$ {Number(product.price).toFixed(2)}</Text>
                      </Box>
                      <Box>
                        <FormLabel fontFamily="Montserrat" color="#e05a6d" mb={1}>Quantidade</FormLabel>
                        <Input
                          type="number"
                          min={1}
                          value={quantity}
                          onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                          fontFamily="Montserrat"
                          maxW="120px"
                          bg="#23233a"
                          color="#fff"
                        />
                      </Box>
                    </Flex>
                  )}
                  {step === 2 && (
                    <Flex direction="column" gap={4}>
                      <Box>
                        <FormLabel fontFamily="Montserrat" color="#e05a6d" mb={1}>Selecione uma bebida (opcional)</FormLabel>
                        <Select
                          placeholder="Nenhuma"
                          value={selectedDrink}
                          onChange={e => setSelectedDrink(e.target.value)}
                          fontFamily="Montserrat"
                          bg="#23233a"
                          color="#fff"
                        >
                          {drinks.map(drink => (
                            <option key={drink.id} value={drink.id}>{drink.name}</option>
                          ))}
                        </Select>
                      </Box>
                    </Flex>
                  )}
                </>
              )}
            </Dialog.Body>
            <Dialog.Footer>
              <HStack w="100%" justify="flex-end" spacing={3}>
                {step === 2 && (
                  <Button
                    onClick={handleBack}
                    color="#fff"
                    fontFamily="Montserrat"
                    variant="ghost"
                  >
                    Voltar
                  </Button>
                )}
                {step === 1 && (
                  <Button
                    onClick={handleNext}
                    bg="#e05a6d"
                    color="#fff"
                    fontFamily="Montserrat"
                    fontWeight="bold"
                    _hover={{ opacity: 0.9, bg: "#db5c6e" }}
                    isDisabled={isLoading}
                  >
                    Próximo
                  </Button>
                )}
                {step === 2 && (
                  <Button
                    onClick={handleConfirm}
                    bg="#e05a6d"
                    color="#fff"
                    fontFamily="Montserrat"
                    fontWeight="bold"
                    _hover={{ opacity: 0.9, bg: "#db5c6e" }}
                    isDisabled={isLoading}
                  >
                    Confirmar
                  </Button>
                )}
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