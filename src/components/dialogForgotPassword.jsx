import {
  IconButton,
  Button,
  CloseButton,
  Dialog,
  Portal,
  Box,
  VStack,
  Input,
} from "@chakra-ui/react";
import { FormLabel } from "@chakra-ui/form-control";
import axios from "@/utils/axios";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster";

export default function DialogForgotPassword({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userType, setUserType] = useState("");

  const sendEmail = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/auth/forgot-password", { email });
      console.log("Resposta do endpoint:", response.data);

      if (response.status === 200 || response.status === 201) {
        setStep(2);
        toaster.create({
          title: "Se o e-mail existir em nosso sistema, o código foi enviado!",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      toaster.create({
        title: "Erro ao processar solicitação!",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/auth/reset-password", {
        token,
        newPassword,
      });

      if (response.status === 200 || response.status === 201) {
        toaster.create({
          title: "Senha alterada com sucesso!",
          type: "success",
        });

        setStep(1);
        setEmail("");
        setToken("");
        setNewPassword("");
        setUserType("");
        onClose();
      }
    } catch (error) {
      console.error("Erro ao redefinir a senha:", error);
      toaster.create({
        title:
          error.response?.data?.message ||
          "Código inválido ou expirado. Verifique e tente novamente.",
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
          <Dialog.Content bg="#282738" w="700px">
            <Dialog.Header>
              <Dialog.Title fontFamily="Montserrat" color="white">
                Esqueci minha senha
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Box>
                <VStack spacing={4}>
                  {step === 1 && (
                    <>
                      <FormLabel
                        htmlFor="email"
                        color="white"
                        fontFamily="Montserrat"
                      ></FormLabel>
                      <Input
                        fontFamily="Montserrat"
                        id="email"
                        placeholder="Digite seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        color="white"
                        _placeholder={{ color: "gray.400" }}
                      />
                      <IconButton
                        background="#fdb525"
                        w="100%"
                        fontFamily="Montserrat"
                        fontWeight="bold"
                        onClick={sendEmail}
                        color="white"
                        isLoading={isLoading}
                        _hover={{
                          opacity: 0.9,
                          transform: "scale(1.01)",
                          transition: "0.3s",
                        }}
                      >
                        Enviar código
                      </IconButton>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <FormLabel
                        htmlFor="token"
                        color="white"
                        fontFamily="Montserrat"
                      >
                        Código de recuperação
                      </FormLabel>
                      <Input
                        fontFamily="Montserrat"
                        id="token"
                        placeholder="Digite o código recebido"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        color="white"
                        _placeholder={{ color: "gray.400" }}
                      />
                      <FormLabel
                        htmlFor="new-password"
                        color="white"
                        fontFamily="Montserrat"
                      >
                        Nova senha
                      </FormLabel>
                      <Input
                        fontFamily="Montserrat"
                        id="new-password"
                        type="password"
                        placeholder="Digite a nova senha"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        color="white"
                        _placeholder={{ color: "gray.400" }}
                      />
                      <Button
                        fontFamily="Montserrat"
                        color="white"
                        background="#fdb525"
                        w="100%"
                        onClick={resetPassword}
                        isLoading={isLoading}
                        _hover={{
                          opacity: 0.9,
                          transform: "scale(1.01)",
                          transition: "0.3s",
                        }}
                      >
                        Redefinir senha
                      </Button>
                    </>
                  )}
                </VStack>
              </Box>
            </Dialog.Body>
            <Dialog.Footer></Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" color="white" bg="transparent" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
