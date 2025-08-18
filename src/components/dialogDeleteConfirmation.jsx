import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Box,
  VStack,
  Text,
} from "@chakra-ui/react";

export default function DialogDeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  title = "Tem certeza?",
  description = "Essa ação não pode ser desfeita.",
  confirmText = "Excluir",
  cancelText = "Cancelar",
  isLoading = false,
}) {
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
          <Dialog.Content bg="#181824" color="#fff" borderRadius="lg">
            <Dialog.Header>
              <Dialog.Title fontFamily="Montserrat" color="#e05a6d">
                {title}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Box>
                <VStack spacing={4}>
                  <Text fontFamily="Montserrat">{description}</Text>
                </VStack>
              </Box>
            </Dialog.Body>
            <Dialog.Footer>
              <Button
                onClick={() => onClose(false)}
                fontFamily="Montserrat"
                bg="#23233a"
                color="#fff"
                mr={3}
                _hover={{ bg: "#23233a", opacity: 0.8, transform: "scale(1.03)", transition: "0.3s" }}
              >
                {cancelText}
              </Button>
              <Button
                onClick={() => onConfirm(true)}
                fontFamily="Montserrat"
                bg="#e05a6d"
                color="#fff"
                isLoading={isLoading}
                _hover={{ bg: "#db5c6e", opacity: 0.9, transform: "scale(1.03)", transition: "0.3s" }}
              >
                {confirmText}
              </Button>
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