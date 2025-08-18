'use client'
import { Box, Flex, Heading, Text, Image, Button } from "@chakra-ui/react";
import React from 'react';
import { useRouter } from "next/navigation";
import { CiLocationOn } from "react-icons/ci";

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
        <Box    
            flex="1" 
            display="flex" 
            justifyContent="center" 
            flexDirection="column"
            alignItems="center" 
            p={6}
            mr={-20}>
                <Image
                src="/localizacao.png"
                borderRadius="lg"
                maxH="360px"
                objectFit="cover"
                boxShadow="md"
                mb={5}
                />
                <Image
                src="/outroangulo.png"
                borderRadius="lg"
                maxH="360px"
                objectFit="cover"
                boxShadow="md"
                />
        </Box>

        <Box ml={70} flex="2" p={[4, 8, 12]}>
           <Heading
                fontFamily="Montserrat"
                color="#e05a6d"
                fontWeight={700}
                fontSize={["2xl", "3xl", "4xl"]}
                mb={6}
                >
                <Box as="span" display="inline-flex" alignItems="center" gap={2}>
                    <CiLocationOn size={32} style={{ animation: "bounce 1.5s infinite" }} />
                    Venha nos visitar!
                </Box>
                </Heading>
            <Text
            fontFamily="Montserrat"
            color="#f6f6f6"
            fontSize={["md", "lg"]}
            mb={4}
            >
            Praça Frei Bruno, 100 - Centro, Xaxim - SC
            </Text>
            <Text
            fontFamily="Montserrat"
            color="#f6f6f6"
            fontSize={["md", "lg"]}
            mb={8}
            >
            Estamos no coração de Xaxim, prontos para te atender com rapidez, qualidade e aquele sabor especial. Sinta-se à vontade para retirar seu pedido ou apenas dar um oi!
            </Text>
            <Box
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                mb={6}
                w="100%"
                maxW="500px"
                >
                <iframe
                    title="Mapa Localização"
                    src="https://www.google.com/maps?q=Praça+Frei+Bruno,+100,+Xaxim+-+SC&output=embed"
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </Box>
            <Button
            fontFamily="Montserrat"
            bg="transparent"    
            color="#e05a6d"
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