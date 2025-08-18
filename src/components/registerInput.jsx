'use client'
import { Input, Stack, IconButton, Portal, Select, createListCollection } from "@chakra-ui/react";
import {
  PasswordInput,
} from "@/components/ui/password-input"
import { InputGroup } from "@/components/ui/input-group"
import React from 'react';
import { useState, useEffect } from "react";
import { Toaster, toaster } from "@/components/ui/toaster"
import { useRouter } from 'next/navigation'
import { withMask } from "use-mask-input"

export default function RegisterInput({ mandarDadosdofilho }) {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [Name , setName] = useState('');
  const [Phone , setPhone] = useState('');   
  const [Username , setUsername] = useState('');
  const [CPF, setCPF] = useState('');
  const [Role, setRole] = useState('');

  const rolesCollection = createListCollection({
    items: [
      { label: "Entregador", value: "delivery" },
      { label: "Usuário", value: "user" }
    ],
  })
  
  const content = { email: Email, password: Password, name: Name, phone: Phone, username: Username, cpf: CPF, role: Role };
  const router = useRouter();
  
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mandarDados = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (!Password || !Email || !Name || !Phone || !Username || !CPF || !Role) {
      toaster.create({
        title: "Preencha todos os valores!",
        type: "error"
      });
      setIsSubmitting(false);
      return;
    }
    await mandarDadosdofilho(content);
    setIsSubmitting(false);
  };

  return (
      <Stack>
        <Input 
          mt="4%"
          fontFamily="Montserrat"
          variant="outline"
          placeholder="Digite seu nome completo"
          onChange={(e) => setName(e.target.value)}
        />
        <Input 
          mt="1%"
          fontFamily="Montserrat"
          variant="outline"
          placeholder="Digite seu apelido"
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input 
          mt="1%"
          fontFamily="Montserrat"
          variant="outline" ref={withMask('(99) 99999-9999')}
          placeholder="Digite seu telefone"
          onChange={(e) => setPhone(e.target.value)}
        />
        <Input
          mt="1%"
          fontFamily="Montserrat"
          placeholder="Digite seu CPF" ref={withMask('999.999.999-99')}
          onChange={(e) => setCPF(e.target.value)}
        />

        <Select.Root
            mt="%1"
            collection={rolesCollection}
            width="100%"
            onValueChange={(value) => setRole(value.value[0])}
            >
            <Select.HiddenSelect />
            <Select.Control>
            <Select.Trigger>
                <Select.ValueText fontFamily="Montserrat" placeholder="Selecione seu cargo" />
            </Select.Trigger>
            <Select.IndicatorGroup>
                <Select.Indicator />
            </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
            <Select.Positioner>
                <Select.Content>
                {rolesCollection.items.map((role) => (
                    <Select.Item item={role} key={role.value}>
                    {role.label}
                    <Select.ItemIndicator />
                    </Select.Item>
                ))}
                </Select.Content>
            </Select.Positioner>
            </Portal>
      </Select.Root>

        <Input 
          mt="1%"
          fontFamily="Montserrat"
          variant="outline"
          placeholder="Digite seu email"
          onChange={(e) => setEmail(e.target.value)}
        />

      <InputGroup mt="1%" w="100%" >
        <PasswordInput
          fontFamily="Montserrat"
          variant="outline"
          placeholder="Digite sua senha"
          onChange={(e) => setPassword(e.target.value)}
        />
      </InputGroup>
      <IconButton
        bg= "#e05a6d" 
        color= "white"
        variant="subtle"
        borderRadius={5}
        _hover={{
            opacity: 0.9,
            transform: "scale(1.01)",
            transition: "0.3s",
          }}
        fontWeight="bold"
        onClick={mandarDados}
        onKeyDown={(e) => {
            if (e.key === 'Enter') {
                mandarDados();
            }
        }}
        mt="1%"
        tabIndex={0}
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >Confirmar
      </IconButton>
      <Toaster />
    </Stack>
    );
} 