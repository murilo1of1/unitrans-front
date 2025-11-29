"use client";
import {
  Box,
  Flex,
  Text,
  Button,
  Image,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axios";

import TableStudents from "@/components/tableStudents";
import TableSolicitations from "@/components/tableSolicitations";
import InputPesquisa from "@/components/inputPesquisa";

import DialogGenerateToken from "@/components/dialogGenerateToken";
import DialogConfirmation from "@/components/dialogConfirmation";
import DialogCreatePoint from "@/components/dialogCreatePoint";
import DialogCreateRoute from "@/components/dialogCreateRoute";
import DialogManageRoutePoints from "@/components/dialogManageRoutePoints";
import DialogPassengerList from "@/components/dialogPassengerList";
import { toaster } from "@/components/ui/toaster";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";

export default function Admin() {
  const [students, setStudents] = useState([]);
  const [solicitations, setSolicitations] = useState([]);
  const [rotas, setRotas] = useState([]);
  const [pontos, setPontos] = useState([]);
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingSolicitations, setLoadingSolicitations] = useState(false);
  const [loadingRotas, setLoadingRotas] = useState(false);
  const [loadingPontos, setLoadingPontos] = useState(false);
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState("rotas");
  const [studentsStep, setStudentsStep] = useState(0); // 0 = Alunos vinculados, 1 = Solicitações
  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isCreatePointDialogOpen, setIsCreatePointDialogOpen] = useState(false);
  const [isCreateRouteDialogOpen, setIsCreateRouteDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [editingPoint, setEditingPoint] = useState(null);
  const [isManageRoutePointsOpen, setIsManageRoutePointsOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [studentToRemove, setStudentToRemove] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPassengerDialogOpen, setIsPassengerDialogOpen] = useState(false);
  const [selectedRouteForPassengers, setSelectedRouteForPassengers] =
    useState(null);
  const router = useRouter();

  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);

    if (section === "alunos" && empresa?.idEmpresa) {
      const token = localStorage.getItem("token");
      fetchStudents(empresa.idEmpresa, token);
      fetchSolicitations(empresa.idEmpresa, token);
    } else if (section === "rotas" && empresa?.idEmpresa) {
      const token = localStorage.getItem("token");
      fetchRotas(empresa.idEmpresa, token);
      fetchPontos(empresa.idEmpresa, token);
    } else if (section === "pontos" && empresa?.idEmpresa) {
      const token = localStorage.getItem("token");
      fetchPontos(empresa.idEmpresa, token);
    }
  };

  const handleStudentsRefresh = () => {
    const token = localStorage.getItem("token");
    const decodedToken = decodeToken(token);

    if (decodedToken && decodedToken.idEmpresa) {
      fetchStudents(decodedToken.idEmpresa, token);
      fetchSolicitations(decodedToken.idEmpresa, token);
    }
  };

  const handleRemoveStudent = (studentId, reactivate = false) => {
    setStudentToRemove({ id: studentId, reactivate });
    setIsConfirmDialogOpen(true);
  };

  const handleApproveSolicitation = async (solicitationId) => {
    try {
      const token = localStorage.getItem("token");
      await api.patch(
        `/vinculos/solicitacao/${solicitationId}/aprovar`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toaster.create({
        title: "Solicitação aprovada com sucesso!",
        status: "success",
      });

      handleStudentsRefresh();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Erro ao aprovar solicitação";
      toaster.create({
        title: errorMessage,
        status: "error",
      });
    }
  };

  const handleRejectSolicitation = async (solicitationId) => {
    try {
      const token = localStorage.getItem("token");
      await api.patch(
        `/vinculos/solicitacao/${solicitationId}/rejeitar`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toaster.create({
        title: "Solicitação rejeitada",
        status: "info",
      });

      handleStudentsRefresh();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Erro ao rejeitar solicitação";
      toaster.create({
        title: errorMessage,
        status: "error",
      });
    }
  };

  const confirmDeleteVehicle = async () => {
    if (studentToRemove) {
      setIsDeleting(true);
      try {
        const token = localStorage.getItem("token");
        const endpoint = studentToRemove.reactivate
          ? `/vinculos/${studentToRemove.id}/reativar`
          : `/vinculos/${studentToRemove.id}/desativar`;

        await api.patch(
          endpoint,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toaster.create({
          title: studentToRemove.reactivate
            ? "Aluno reativado com sucesso!"
            : "Aluno desvinculado com sucesso!",
          status: "success",
        });

        handleStudentsRefresh();
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          `Erro ao ${
            studentToRemove.reactivate ? "reativar" : "desvincular"
          } aluno`;
        toaster.create({
          title: errorMessage,
          status: "error",
        });
      } finally {
        setIsDeleting(false);
        setStudentToRemove(null);
      }
    }
  };

  const fetchStudents = async (idEmpresa, token) => {
    setLoadingStudents(true);
    try {
      const response = await api.get(`/vinculos/empresa/${idEmpresa}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.data) {
        setStudents(
          Array.isArray(response.data.data) ? response.data.data : []
        );
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      }
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchSolicitations = async (idEmpresa, token) => {
    setLoadingSolicitations(true);
    try {
      const response = await api.get(
        `/vinculos/solicitacao/empresa/${idEmpresa}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data) {
        setSolicitations(
          Array.isArray(response.data.data) ? response.data.data : []
        );
      } else {
        setSolicitations([]);
      }
    } catch (error) {
      console.error("Erro ao buscar solicitações:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      }
      setSolicitations([]);
    } finally {
      setLoadingSolicitations(false);
    }
  };

  const fetchRotas = async (idEmpresa, token) => {
    setLoadingRotas(true);
    try {
      const response = await api.get(`/rotas/empresa/${idEmpresa}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.data) {
        setRotas(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        setRotas([]);
      }
    } catch (error) {
      console.error("Erro ao buscar rotas:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      }
      setRotas([]);
    } finally {
      setLoadingRotas(false);
    }
  };

  const fetchPontos = async (idEmpresa, token) => {
    setLoadingPontos(true);
    try {
      const response = await api.get(`/pontos/empresa/${idEmpresa}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.data) {
        setPontos(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        setPontos([]);
      }
    } catch (error) {
      console.error("Erro ao buscar pontos:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      }
      setPontos([]);
    } finally {
      setLoadingPontos(false);
    }
  };

  const handlePointCreated = () => {
    const token = localStorage.getItem("token");
    if (empresa?.idEmpresa) {
      fetchPontos(empresa.idEmpresa, token);
    }
  };

  const handleRouteCreated = () => {
    const token = localStorage.getItem("token");
    if (empresa?.idEmpresa) {
      fetchRotas(empresa.idEmpresa, token);
    }
  };

  const handleEditRoute = (route) => {
    setEditingRoute(route);
    setIsCreateRouteDialogOpen(true);
  };

  const handleEditPoint = (point) => {
    setEditingPoint(point);
    setIsCreatePointDialogOpen(true);
  };

  const handleManageRoutePoints = (route) => {
    setSelectedRoute(route);
    setIsManageRoutePointsOpen(true);
  };

  const handleViewPassengers = (route) => {
    setSelectedRouteForPassengers(route);
    setIsPassengerDialogOpen(true);
  };

  const handleDeletePoint = async (point) => {
    try {
      const authToken = localStorage.getItem("token");
      await api.delete(`/pontos/${point.id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      toaster.create({
        title: "Ponto excluído com sucesso!",
        status: "success",
      });

      // Refresh da lista de pontos
      const decodedToken = decodeToken(authToken);
      if (decodedToken?.idEmpresa) {
        fetchPontos(decodedToken.idEmpresa, authToken);
      }
    } catch (error) {
      console.error("Erro ao excluir ponto:", error);
      toaster.create({
        title: error.response?.data?.message || "Erro ao excluir ponto",
        status: "error",
      });
    }
  };

  const closeDialogs = () => {
    setEditingRoute(null);
    setEditingPoint(null);
    setSelectedRoute(null);
    setIsCreateRouteDialogOpen(false);
    setIsCreatePointDialogOpen(false);
    setIsManageRoutePointsOpen(false);
  };

  const filteredStudents = students.filter(
    (item) =>
      item.aluno?.nome?.toLowerCase().includes(search.toLowerCase()) ||
      item.aluno?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSolicitations = solicitations.filter(
    (item) =>
      item.aluno?.nome?.toLowerCase().includes(search.toLowerCase()) ||
      item.aluno?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const pendingSolicitations = solicitations.filter(
    (s) => s.status === "pendente"
  );

  const renderContent = () => {
    switch (activeSection) {
      case "alunos":
        return (
          <Box>
            <Flex justifyContent="space-between" alignItems="center" mb={4}>
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color="#334155"
                fontFamily="Montserrat"
              >
                Gestão de Alunos
              </Text>
              <Button
                bg="#fdb525"
                color="white"
                fontFamily="Montserrat"
                fontWeight="bold"
                _hover={{
                  bg: "#f59e0b",
                  transform: "scale(1.02)",
                  transition: "0.3s",
                }}
                onClick={() => setIsTokenDialogOpen(true)}
              >
                + Gerar Token
              </Button>
            </Flex>

            {/* Steps Navigation */}
            <HStack spacing={4} mb={6}>
              <Button
                bg={studentsStep === 0 ? "#fdb525" : "transparent"}
                color={studentsStep === 0 ? "white" : "#64748b"}
                fontFamily="Montserrat"
                fontWeight="500"
                border="1px solid #e2e8f0"
                borderRadius="lg"
                px={6}
                py={3}
                _hover={{
                  bg: studentsStep === 0 ? "#fdb525" : "#f8fafc",
                  borderColor: studentsStep === 0 ? "#fdb525" : "#cbd5e1",
                  transform: "scale(1.01)",
                  transition: "0.2s",
                }}
                onClick={() => setStudentsStep(0)}
              >
                <HStack spacing={2}>
                  <Text>👥</Text>
                  <Text fontWeight="bold">Alunos Vinculados</Text>
                  <Badge
                    bg={studentsStep === 0 ? "white" : "#fdb525"}
                    color={studentsStep === 0 ? "#fdb525" : "white"}
                    borderRadius="full"
                    px={2}
                    fontSize="xs"
                  >
                    {students.length}
                  </Badge>
                </HStack>
              </Button>

              <Button
                bg={studentsStep === 1 ? "#fdb525" : "transparent"}
                color={studentsStep === 1 ? "white" : "#64748b"}
                fontFamily="Montserrat"
                fontWeight="500"
                border="1px solid #e2e8f0"
                borderRadius="lg"
                px={6}
                py={3}
                _hover={{
                  bg: studentsStep === 1 ? "#fdb525" : "#f8fafc",
                  borderColor: studentsStep === 1 ? "#fdb525" : "#cbd5e1",
                  transform: "scale(1.01)",
                  transition: "0.2s",
                }}
                onClick={() => setStudentsStep(1)}
              >
                <HStack spacing={2}>
                  <Text>📝</Text>
                  <Text fontWeight="bold">Solicitações</Text>
                  {pendingSolicitations.length > 0 && (
                    <Badge
                      bg={studentsStep === 1 ? "white" : "#ef4444"}
                      color={studentsStep === 1 ? "#ef4444" : "white"}
                      borderRadius="full"
                      px={2}
                      fontSize="xs"
                    >
                      {pendingSolicitations.length}
                    </Badge>
                  )}
                </HStack>
              </Button>
            </HStack>

            {/* Search Bar */}
            <Flex mb={4}>
              <InputPesquisa
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  studentsStep === 0
                    ? "Pesquisar aluno..."
                    : "Pesquisar solicitação..."
                }
              />
            </Flex>

            {/* Content based on step */}
            {studentsStep === 0 ? (
              <TableStudents
                students={filteredStudents}
                loading={loadingStudents}
                onRemoveStudent={handleRemoveStudent}
              />
            ) : (
              <TableSolicitations
                solicitations={filteredSolicitations}
                loading={loadingSolicitations}
                onApproveSolicitation={handleApproveSolicitation}
                onRejectSolicitation={handleRejectSolicitation}
              />
            )}
          </Box>
        );
      case "rotas":
        return (
          <Box>
            <Flex justifyContent="space-between" alignItems="center" mb={6}>
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color="#334155"
                fontFamily="Montserrat"
              >
                Gestão de Rotas e Pontos
              </Text>
              <HStack spacing={3}>
                <Button
                  bg="#fdb525"
                  color="white"
                  fontFamily="Montserrat"
                  fontWeight="bold"
                  borderRadius="md"
                  px={4}
                  py={2}
                  _hover={{
                    bg: "#f59e0b",
                    transform: "scale(1.02)",
                    transition: "0.3s",
                  }}
                  onClick={() => setIsCreatePointDialogOpen(true)}
                >
                  + Criar Ponto
                </Button>
                <Button
                  bg="#fdb525"
                  color="white"
                  fontFamily="Montserrat"
                  fontWeight="bold"
                  borderRadius="md"
                  px={4}
                  py={2}
                  _hover={{
                    bg: "#f59e0b",
                    transform: "scale(1.02)",
                    transition: "0.3s",
                  }}
                  onClick={() => setIsCreateRouteDialogOpen(true)}
                >
                  + Criar Rota
                </Button>
              </HStack>
            </Flex>

            {loadingRotas ? (
              <Box textAlign="center" py={8}>
                <Text fontFamily="Montserrat" color="gray.500">
                  Carregando rotas...
                </Text>
              </Box>
            ) : rotas.length === 0 ? (
              <Box textAlign="center" py={12}>
                <Text
                  fontFamily="Montserrat"
                  fontSize="lg"
                  color="gray.500"
                  mb={4}
                >
                  Nenhuma rota cadastrada.
                </Text>
                <Text fontFamily="Montserrat" color="gray.400" mb={6}>
                  Crie sua primeira rota para começar a gerenciar o transporte!
                </Text>
              </Box>
            ) : (
              <Box>
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  color="#334155"
                  fontFamily="Montserrat"
                  mb={4}
                >
                  Rotas Cadastradas ({rotas.length})
                </Text>
                {rotas.map((rota) => (
                  <Box
                    key={rota.id}
                    bg="white"
                    borderRadius="lg"
                    boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                    border="1px solid #E2E8F0"
                    mb={4}
                    p={6}
                    _hover={{
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      transform: "translateY(-1px)",
                      transition: "all 0.2s",
                    }}
                  >
                    <Flex justifyContent="space-between" alignItems="center">
                      <Box>
                        <Text
                          fontFamily="Montserrat"
                          fontSize="xl"
                          fontWeight="bold"
                          color="#334155"
                          mb={2}
                        >
                          {rota.nome}
                        </Text>
                        <HStack spacing={4} mb={2}>
                          <Text
                            fontFamily="Montserrat"
                            fontSize="sm"
                            color="gray.600"
                          >
                            <Text as="span" fontWeight="bold">
                              Origem:
                            </Text>{" "}
                            {rota.origem}
                          </Text>
                          <Text
                            fontFamily="Montserrat"
                            fontSize="sm"
                            color="gray.600"
                          >
                            <Text as="span" fontWeight="bold">
                              Destino:
                            </Text>{" "}
                            {rota.destino}
                          </Text>
                        </HStack>
                      </Box>
                      <HStack spacing={3}>
                        <Button
                          size="md"
                          bg="transparent"
                          color="#64748B"
                          _hover={{ color: "#3B82F6", bg: "#F1F5F9" }}
                          p={3}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          onClick={() => handleEditRoute(rota)}
                        >
                          <FiEdit2 size={18} />
                        </Button>
                        <Button
                          size="md"
                          bg="transparent"
                          color="#64748B"
                          _hover={{ color: "#18c418ff", bg: "#f2fef4ff" }}
                          p={3}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          onClick={() => handleManageRoutePoints(rota)}
                        >
                          <FaMapMarkedAlt size={18} />
                        </Button>
                        <Button
                          size="md"
                          bg="transparent"
                          color="#64748B"
                          _hover={{ color: "#fdb525", bg: "#FEF3E2" }}
                          p={3}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          onClick={() => handleViewPassengers(rota)}
                        >
                          <FaUsers size={18} />
                        </Button>
                      </HStack>
                    </Flex>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        );
      case "pontos":
        return (
          <Box>
            <Flex justifyContent="space-between" alignItems="center" mb={6}>
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color="#334155"
                fontFamily="Montserrat"
              >
                Gestão de Pontos
              </Text>
              <Button
                bg="#fdb525"
                color="white"
                fontFamily="Montserrat"
                fontWeight="bold"
                borderRadius="md"
                px={4}
                py={2}
                _hover={{
                  bg: "#f59e0b",
                  transform: "scale(1.02)",
                  transition: "0.3s",
                }}
                onClick={() => setIsCreatePointDialogOpen(true)}
              >
                + Criar Ponto
              </Button>
            </Flex>

            {loadingPontos ? (
              <Box textAlign="center" py={8}>
                <Text fontFamily="Montserrat" color="gray.500">
                  Carregando pontos...
                </Text>
              </Box>
            ) : pontos.length === 0 ? (
              <Box textAlign="center" py={12}>
                <Text fontFamily="Montserrat" fontSize="lg" color="gray.400">
                  Nenhum ponto encontrado
                </Text>
                <Text fontFamily="Montserrat" color="gray.500" mt={2}>
                  Crie seu primeiro ponto para começar
                </Text>
              </Box>
            ) : (
              <Box>
                <VStack spacing={3} align="stretch">
                  {pontos.map((ponto) => (
                    <Box
                      key={ponto.id}
                      bg="white"
                      p={6}
                      borderRadius="lg"
                      boxShadow="0 2px 8px rgba(0,0,0,0.1)"
                      border="1px solid #e2e8f0"
                    >
                      <Flex
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        <Box flex={1}>
                          <Text
                            fontSize="lg"
                            fontWeight="bold"
                            color="#1e293b"
                            fontFamily="Montserrat"
                            mb={2}
                          >
                            {ponto.nome}
                          </Text>
                          {ponto.endereco && (
                            <Text
                              fontSize="sm"
                              color="#64748b"
                              fontFamily="Montserrat"
                            >
                              {ponto.endereco}
                            </Text>
                          )}
                          {ponto.latitude && ponto.longitude && (
                            <Text
                              fontSize="xs"
                              color="#94a3b8"
                              fontFamily="Montserrat"
                            >
                              Coordenadas: {ponto.latitude}, {ponto.longitude}
                            </Text>
                          )}
                        </Box>
                        <HStack spacing={2}>
                          <Button
                            size="md"
                            bg="transparent"
                            color="#64748B"
                            _hover={{ color: "#3B82F6", bg: "#F1F5F9" }}
                            p={3}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            onClick={() => handleEditPoint(ponto)}
                          >
                            <FiEdit2 size={18} />
                          </Button>
                          <Button
                            size="md"
                            bg="transparent"
                            color="#64748B"
                            _hover={{ color: "#dc2626", bg: "#fef2f2" }}
                            p={3}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            onClick={() => handleDeletePoint(ponto)}
                          >
                            <FaRegTrashAlt />
                          </Button>
                        </HStack>
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}
          </Box>
        );
      case "financeiro":
        return (
          <Box textAlign="center" mt={8}>
            <Text fontFamily="Montserrat" fontSize="lg" color="gray.600">
              Integração Financeira - Em desenvolvimento
            </Text>
          </Box>
        );
      default:
        return (
          <TabelaVeiculos
            vehicles={vehicles}
            loading={loading}
            onEdit={handleEditVehicle}
            onDelete={handleDeleteVehicle}
          />
        );
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const decodedToken = decodeToken(token);

    if (!decodedToken || !decodedToken.idEmpresa) {
      console.error("Token inválido");
      router.push("/login");
      return;
    }

    setEmpresa(decodedToken);

    if (activeSection === "alunos") {
      fetchStudents(decodedToken.idEmpresa, token);
      fetchSolicitations(decodedToken.idEmpresa, token);
    } else if (activeSection === "rotas") {
      fetchRotas(decodedToken.idEmpresa, token);
      fetchPontos(decodedToken.idEmpresa, token);
    }
  }, [router, activeSection]);

  return (
    <Box minH="100vh" bg="#E2E8F0">
      <Flex
        as="header"
        justify="space-between"
        w="100%"
        h="80px"
        bg="white"
        color="#334155"
        align="center"
        position="fixed"
        top={0}
        left={0}
        boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1)"
      >
        <Flex align="center">
          <Image
            src="/logosolo.png"
            alt="logo"
            objectFit="contain"
            boxSize="100px"
            mt={2}
            ml={4}
          />
          <Text
            fontFamily="Montserrat"
            color="#334155"
            fontWeight="bold"
            fontSize="lg"
          >
            Painel Administrativo {empresa ? `- ${empresa.nome}` : ""}
          </Text>
        </Flex>
        <Flex>
          <Button
            bg="#fdb525"
            color="white"
            fontFamily="Montserrat"
            fontWeight="bold"
            borderRadius="md"
            mr={8}
            _hover={{
              bg: "#f59e0b",
              transform: "scale(1.02)",
              transition: "0.3s",
            }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Flex>
      </Flex>

      <Flex pt="80px">
        <Box
          w="280px"
          bg="#2c2b3c"
          minH="calc(100vh - 80px)"
          position="fixed"
          left={0}
          top="80px"
        >
          <VStack spacing={1} align="stretch" p={4}>
            <Button
              bg={activeSection === "rotas" ? "#fdb525" : "transparent"}
              color="white"
              fontFamily="Montserrat"
              fontWeight="500"
              justifyContent="flex-start"
              borderRadius="lg"
              py={6}
              px={4}
              mb={1}
              leftIcon={<Text fontSize="md">🛣️</Text>}
              _hover={{
                bg: activeSection === "rotas" ? "#fdb525" : "#475569",
                transform: "scale(1.01)",
                transition: "0.2s",
              }}
              onClick={() => handleSectionChange("rotas")}
            >
              Rotas
            </Button>
            <Button
              bg={activeSection === "pontos" ? "#fdb525" : "transparent"}
              color="white"
              fontFamily="Montserrat"
              fontWeight="500"
              justifyContent="flex-start"
              borderRadius="lg"
              py={6}
              px={4}
              mb={1}
              leftIcon={<Text fontSize="md">📍</Text>}
              _hover={{
                bg: activeSection === "pontos" ? "#fdb525" : "#475569",
                transform: "scale(1.01)",
                transition: "0.2s",
              }}
              onClick={() => handleSectionChange("pontos")}
            >
              Pontos
            </Button>
            <Button
              bg={activeSection === "alunos" ? "#fdb525" : "transparent"}
              color="white"
              fontFamily="Montserrat"
              fontWeight="500"
              justifyContent="flex-start"
              borderRadius="lg"
              py={6}
              px={4}
              mb={1}
              leftIcon={<Text fontSize="md">👥</Text>}
              _hover={{
                bg: activeSection === "alunos" ? "#fdb525" : "#475569",
                transform: "scale(1.01)",
                transition: "0.2s",
              }}
              onClick={() => handleSectionChange("alunos")}
            >
              Alunos
              {pendingSolicitations.length > 0 && (
                <Badge
                  bg="#ef4444"
                  color="white"
                  borderRadius="full"
                  px={2}
                  py={1}
                  fontSize="xs"
                  ml={2}
                >
                  {pendingSolicitations.length}
                </Badge>
              )}
            </Button>
            <Button
              bg={activeSection === "financeiro" ? "#fdb525" : "transparent"}
              color="white"
              fontFamily="Montserrat"
              fontWeight="500"
              justifyContent="flex-start"
              borderRadius="lg"
              py={6}
              px={4}
              leftIcon={<Text fontSize="md">💰</Text>}
              _hover={{
                bg: activeSection === "financeiro" ? "#fdb525" : "#475569",
                transform: "scale(1.01)",
                transition: "0.2s",
              }}
              onClick={() => handleSectionChange("financeiro")}
            >
              Integração Financeira
            </Button>
          </VStack>
        </Box>

        <Box ml="280px" flex={1} p={8}>
          {renderContent()}
        </Box>
      </Flex>

      <DialogGenerateToken
        isOpen={isTokenDialogOpen}
        onClose={() => setIsTokenDialogOpen(false)}
        idEmpresa={empresa?.idEmpresa}
        onTokenGenerated={handleStudentsRefresh}
      />

      <DialogConfirmation
        isOpen={isConfirmDialogOpen}
        onClose={() => {
          setIsConfirmDialogOpen(false);
          setStudentToRemove(null);
        }}
        onConfirm={confirmDeleteVehicle}
        message={
          studentToRemove?.reactivate
            ? "Tem certeza que deseja reativar este aluno?"
            : "Tem certeza que deseja desvincular este aluno?"
        }
        confirmText={studentToRemove?.reactivate ? "Reativar" : "Desvincular"}
        cancelText="Cancelar"
        isLoading={isDeleting}
      />

      <DialogCreatePoint
        isOpen={isCreatePointDialogOpen}
        onClose={closeDialogs}
        onCreated={handlePointCreated}
        editingPoint={editingPoint}
      />

      <DialogCreateRoute
        isOpen={isCreateRouteDialogOpen}
        onClose={closeDialogs}
        onCreated={handleRouteCreated}
        editingRoute={editingRoute}
      />

      <DialogManageRoutePoints
        isOpen={isManageRoutePointsOpen}
        onClose={closeDialogs}
        route={selectedRoute}
      />

      <DialogPassengerList
        isOpen={isPassengerDialogOpen}
        onClose={() => setIsPassengerDialogOpen(false)}
        route={selectedRouteForPassengers}
      />
    </Box>
  );
}
