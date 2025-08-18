'use client'
import { Box, Flex, Heading, Text, Image, Button } from "@chakra-ui/react";
import React from 'react';
import { useRouter } from "next/navigation";

export default function About() {
    const router = useRouter();
    return (
        <Box
        minH="100vh"
        bgImage="url(/teladeinicio.png)"
        display="flex"
        bgSize="cover"
        alignItems="center"
        justifyContent="center"
        px={[2, 8, 24]}
        py={12}
        bgPosition="center" 
        bgRepeat="no-repeat"
        >   
        <Box flex="1" display="flex" justifyContent="center" alignItems="center" p={6}>
            <Image
            src="/fastfood.png"
            borderRadius="lg"
            maxH="360px"
            objectFit="cover"
            boxShadow="md"
            mr={-20}
            />
        </Box>

        <Box flex="2" p={[4, 8, 12]}>
            <Heading
            fontFamily="Montserrat"
            color="#e05a6d"
            fontWeight={700}
            fontSize={["2xl", "3xl", "4xl"]}
            mb={6}
            >
            Somos uma empresa de tecnologia, apaixonada por comida!
            </Heading>
            <Text
            fontFamily="Montserrat"
            color="#f6f6f6"
            fontSize={["md", "lg"]}
            mb={4}
            >
            Tô com fome é praticidade, rapidez e qualidade. Investimos em tecnologia para proporcionar a melhor experiência em delivery, sempre com orgulho de ser uma empresa xaxinense.
            </Text>
            <Text
            fontFamily="Montserrat"
            color="#f6f6f6"
            fontSize={["md", "lg"]}
            mb={8}
            >
            Nosso propósito é alimentar bons momentos, gerar impacto positivo na sociedade e criar oportunidades para todos que fazem parte da nossa rede.
            </Text>
            <Button
            fontFamily="Montserrat"
            bg="#e05a6d"
            color="white"
            fontWeight="bold"
            size="lg"
            borderRadius="md"
            _hover={{
                opacity: 0.9,
                transform: "scale(1.01)",
                transition: "0.3s",
            }}
            onClick={() => router.push("/")}
            >
            Quero comer agora!
            </Button>
        </Box>
        </Box>
    );
    }