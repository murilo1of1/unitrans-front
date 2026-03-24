"use client";
import React, { useState } from "react";
import {
  Button,
  Dialog,
  Portal,
  Box,
  VStack,
  Input,
  Text,
  Flex,
} from "@chakra-ui/react";
import { FormLabel } from "@chakra-ui/form-control";
import api from "@/utils/axios";
import { toaster } from "@/components/ui/toaster";

export default function DialogCreateFatura({ isOpen, onClose, student, empresaId }) {
  const [valor, setValor] = useState("");
  const [mesReferencia, setMesReferencia] = useState("");
  const [dataVencimento, setDataVencimento] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!valor || !mesReferencia) {
      toaster.create({
        description: "Preencha valor e mês de referência.",
        type: "error",
      });
      return;
    }
    
    setLoading(true);
    try {
      await api.post("/pagamentos/faturas", {
        alunoId: student.alunoId,
        empresaId: empresaId,
        valor: parseFloat(valor.replace(',', '.')),
        mes_referencia: mesReferencia,
        dataVencimento: dataVencimento || undefined
      });
      
      toaster.create({
        description: "Cobrança gerada com sucesso!",
        type: "success",
      });
      onClose();
      setValor("");
      setMesReferencia("");
      setDataVencimento("");
    } catch (error) {
      console.error(error);
      toaster.create({
        description: "Erro ao gerar cobrança.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <Dialog.Root open={isOpen} onOpenChange={onClose} placement="center">
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="white" color="black">
            <Dialog.Header>
              <Dialog.Title fontFamily="Montserrat" fontWeight="700">
                Gerar Cobrança para {student?.aluno?.nome}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text fontFamily="Montserrat" mb={4} fontSize="sm">
                Essa fatura será gerada via AbacatePay e ficará disponível para o aluno pagar.
              </Text>

              <Flex direction="column" gap={4}>
                <Box>
                  <FormLabel fontWeight="600" fontSize="sm">Valor (R$)</FormLabel>
                  <Input
                    placeholder="Ex: 150.00"
                    type="number"
                    value={valor}
                    border="1px solid #ccc"
                    onChange={(e) => setValor(e.target.value)}
                  />
                </Box>

                <Box>
                  <FormLabel fontWeight="600" fontSize="sm">Mês de Referência</FormLabel>
                  <Input
                    placeholder="Ex: Março/2026"
                    value={mesReferencia}
                    border="1px solid #ccc"
                    onChange={(e) => setMesReferencia(e.target.value)}
                  />
                </Box>

                <Box>
                  <FormLabel fontWeight="600" fontSize="sm">Data de Vencimento (Opcional)</FormLabel>
                  <Input
                    type="date"
                    value={dataVencimento}
                    border="1px solid #ccc"
                    onChange={(e) => setDataVencimento(e.target.value)}
                  />
                </Box>
              </Flex>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <Button
                  variant="outline"
                  fontFamily="Montserrat"
                  fontWeight="600"
                  color="#fdb525"
                  borderColor="#fdb525"
                  _hover={{ bg: "#fff7e6" }}
                  mr={3}
                >
                  Cancelar
                </Button>
              </Dialog.CloseTrigger>
              <Button
                bg="#fdb525"
                color="white"
                fontFamily="Montserrat"
                fontWeight="bold"
                _hover={{ bg: "#e5a321" }}
                onClick={handleCreate}
                loading={loading}
              >
                Gerar
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Portal>
  );
}
