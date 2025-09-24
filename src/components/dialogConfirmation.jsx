import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Box,
  VStack,
  Text,
  HStack,
} from "@chakra-ui/react";

export default function DialogConfirmation({
  isOpen,   
  onClose,
  onConfirm,
  message,
  confirmText,
  cancelText,
  isLoading = false,
}) {
  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
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
            maxW="600px"
          >
            <Dialog.Header>
              <Dialog.Title
                fontFamily="Montserrat"
                color="white"
                fontSize="xl"
              ></Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Box>
                <Text
                  fontFamily="Montserrat"
                  color="white"
                  fontSize="md"
                  textAlign="flex-start"
                >
                  {message}
                </Text>
              </Box>
            </Dialog.Body>
            <Dialog.Footer>
              <HStack spacing={3} width="100%">
                <Button
                  bg="#fdb525"
                  color="white"
                  fontFamily="Montserrat"
                  fontWeight="bold"
                  borderRadius="md"
                  flex={1}
                  _hover={{
                    bg: "#f59e0b",
                    transform: "scale(1.02)",
                    transition: "0.3s",
                  }}
                  onClick={onClose}
                  disabled={isLoading}
                >
                  {cancelText}
                </Button>
                <Button
                  bg="#fdb525"
                  color="white"
                  fontFamily="Montserrat"
                  fontWeight="bold"
                  borderRadius="md"
                  flex={1}
                  isLoading={isLoading}
                  _hover={{
                    bg: "#f59e0b",
                    transform: "scale(1.02)",
                    transition: "0.3s",
                  }}
                  onClick={handleConfirm}
                >
                  {confirmText}
                </Button>
              </HStack>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" color="white" _hover={{ bg: "#3a3947" }} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
