import {
  IconButton,
  Button,
  CloseButton,
  Dialog,
  Portal,
  Box,
  VStack,
  Input
} from "@chakra-ui/react";
import { FormLabel } from "@chakra-ui/form-control";
import axios from "@/utils/axios";
import { useState } from "react";
import { Toaster, toaster } from "@/components/ui/toaster"

export default function DialogForgotPassword({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const sendEmail = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/users/forgot-password', { email });
      if (response.status === 200) {
        setStep(2);
      } else {
        toaster.create({
        title: "Erro ao enviar o e-mail. Por favor, tente novamente.",
        type: "error"
      })
      }
    } catch (error) {
      console.error("Erro ao enviar o e-mail:", error);
      toaster.create({
        title: "Erro ao enviar o e-mail!",
        type: "error"
      });
    }finally {
      setIsLoading(false);
    } 
  };

  const resetPassword = async () => {
    try {
      const response = await axios.post('/users/reset-password', { token, newPassword });
      if (response.status === 200) {
        toaster.create({
        title: "Senha alterada com sucesso!",
        type: "success"
      });
        onClose();
      } else {
        toaster.create({
          title:'Erro ao alterar a senha. Verifique o código e tente novamente.',
          type: "error"
        });
      }
    } catch (error) {
      console.error("Erro ao redefinir a senha:", error);
      alert('Ocorreu um erro ao redefinir a senha. Por favor, tente novamente.');
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
          <Dialog.Content bg="#181824">
            <Dialog.Header>
              <Dialog.Title fontFamily="Montserrat">Esqueci minha senha</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Box>
                <VStack spacing={4}>
                  {step === 1 && (
                    <>
                      <FormLabel htmlFor="email"></FormLabel>
                      <Input  
                        fontFamily="Montserrat"
                        id="email"
                        placeholder="Digite seu e-mail"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                      <IconButton  
                        background="#db5c6e" 
                        w="100%" 
                        fontFamily="Montserrat"
                        onClick={sendEmail} 
                        color="white"
                        _hover={{opacity: 0.9,
                                 transform: "scale(1.01)",
                                 transition: "0.3s",}}>
                            Enviar código
                      </IconButton>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <FormLabel htmlFor="token">Código de recuperação</FormLabel>
                      <Input
                        id="token"
                        placeholder="Digite o código recebido"
                        value={token}
                        onChange={e => setToken(e.target.value)}
                      />
                      <FormLabel htmlFor="new-password">Nova senha</FormLabel>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="Digite a nova senha"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                      />
                      <Button 
                        fontFamily="Montserrat" 
                        color="white" 
                        background="#db5c6e" 
                        w="100%" 
                        onClick={resetPassword}
                        _hover={{opacity: 0.9,
                                 transform: "scale(1.01)",
                                 transition: "0.3s",}}>
                        Redefinir senha
                      </Button>
                    </>
                  )}
                </VStack>
              </Box>
            </Dialog.Body>
            <Dialog.Footer>
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