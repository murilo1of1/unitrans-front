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
import TabelaVeiculos from "@/components/tableVehiclesNew";
import TableStudents from "@/components/tableStudents";
import TableSolicitations from "@/components/tableSolicitations";
import InputPesquisa from "@/components/inputPesquisa";
import DialogCreateVehicle from "@/components/dialogCreateVehicle";
import DialogGenerateToken from "@/components/dialogGenerateToken";
import DialogConfirmation from "@/components/dialogConfirmation";
import { toaster } from "@/components/ui/toaster";

export default function Admin() {
  const [vehicles, setVehicles] = useState([]);
  const [students, setStudents] = useState([]);
  const [solicitations, setSolicitations] = useState([]);
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingSolicitations, setLoadingSolicitations] = useState(false);
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState("veiculos");
  const [studentsStep, setStudentsStep] = useState(0); // 0 = Alunos vinculados, 1 = Solicitações
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [studentToRemove, setStudentToRemove] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
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
    }
  };

  const handleVehicleCreated = () => {
    const token = localStorage.getItem("token");
    const decodedToken = decodeToken(token);

    if (decodedToken && decodedToken.idEmpresa) {
      fetchVehicles(decodedToken.idEmpresa, token);
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

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    setIsDialogOpen(true);
  };

  const handleDeleteVehicle = (vehicleId) => {
    setVehicleToDelete(vehicleId);
    setIsConfirmDialogOpen(true);
  };

  const handleRemoveStudent = (studentId, reactivate = false) => {
    setStudentToRemove({ id: studentId, reactivate });
    setIsConfirmDialogOpen(true);
  };

  const handleApproveSolicitation = async (solicitationId) => {
    try {
      const token = localStorage.getItem("token");
      await api.patch(
        `/vinculo/solicitacao/${solicitationId}/aprovar`,
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
        `/vinculo/solicitacao/${solicitationId}/rejeitar`,
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
    if (vehicleToDelete) {
      setIsDeleting(true);
      try {
        const token = localStorage.getItem("token");
        await api.delete(`/veiculo/${vehicleToDelete}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        handleVehicleCreated();
      } catch (error) {
        console.error("Erro ao deletar veículo:", error);
      } finally {
        setIsDeleting(false);
        setVehicleToDelete(null);
      }
    }

    if (studentToRemove) {
      setIsDeleting(true);
      try {
        const token = localStorage.getItem("token");
        const endpoint = studentToRemove.reactivate
          ? `/vinculo/${studentToRemove.id}/reativar`
          : `/vinculo/${studentToRemove.id}/desativar`;

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

  const fetchVehicles = async (idEmpresa, token) => {
    setLoading(true);
    try {
      const response = await api.get(`/empresa/${idEmpresa}/veiculos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.data) {
        setVehicles(
          Array.isArray(response.data.data) ? response.data.data : []
        );
      } else {
        setVehicles([]);
      }
    } catch (error) {
      console.error("Erro ao buscar veículos:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      }
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (idEmpresa, token) => {
    setLoadingStudents(true);
    try {
      const response = await api.get(`/vinculo/empresa/${idEmpresa}`, {
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
        `/vinculo/solicitacao/empresa/${idEmpresa}`,
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

  const filteredVehicles = vehicles.filter(
    (item) =>
      item.descricao?.toLowerCase().includes(search.toLowerCase()) ||
      item.modelo?.toLowerCase().includes(search.toLowerCase()) ||
      item.placa?.toLowerCase().includes(search.toLowerCase())
  );

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
      case "veiculos":
        return (
          <Box>
            <Flex justifyContent="space-between" alignItems="center" mb={2}>
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color="#334155"
                fontFamily="Montserrat"
              >
                Lista de Veículos
              </Text>
            </Flex>
            <Flex
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <InputPesquisa
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar veículo..."
              />
              <Button
                bg="#fdb525"
                color="white"
                fontFamily="Montserrat"
                fontWeight="bold"
                ml={2}
                _hover={{
                  bg: "#f59e0b",
                  transform: "scale(1.02)",
                  transition: "0.3s",
                }}
                onClick={() => setIsDialogOpen(true)}
              >
                + Adicionar Veículo
              </Button>
            </Flex>
            <TabelaVeiculos
              vehicles={filteredVehicles}
              loading={loading}
              onEdit={handleEditVehicle}
              onDelete={handleDeleteVehicle}
            />
          </Box>
        );
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

    fetchVehicles(decodedToken.idEmpresa, token);
    if (activeSection === "alunos") {
      fetchStudents(decodedToken.idEmpresa, token);
      fetchSolicitations(decodedToken.idEmpresa, token);
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
              bg={activeSection === "veiculos" ? "#fdb525" : "transparent"}
              color="white"
              fontFamily="Montserrat"
              fontWeight="500"
              justifyContent="flex-start"
              borderRadius="lg"
              py={6}
              px={4}
              mb={1}
              leftIcon={<Text fontSize="md">🚐</Text>}
              _hover={{
                bg: activeSection === "veiculos" ? "#fdb525" : "#475569",
                transform: "scale(1.01)",
                transition: "0.2s",
              }}
              onClick={() => handleSectionChange("veiculos")}
            >
              Veículos
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

      <DialogCreateVehicle
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingVehicle(null);
        }}
        onCreated={handleVehicleCreated}
        editingVehicle={editingVehicle}
        idEmpresa={empresa?.idEmpresa}
      />

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
          setVehicleToDelete(null);
          setStudentToRemove(null);
        }}
        onConfirm={confirmDeleteVehicle}
        message={
          vehicleToDelete
            ? "Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita."
            : studentToRemove?.reactivate
            ? "Tem certeza que deseja reativar este aluno?"
            : "Tem certeza que deseja desvincular este aluno?"
        }
        confirmText={
          vehicleToDelete
            ? "Excluir"
            : studentToRemove?.reactivate
            ? "Reativar"
            : "Desvincular"
        }
        cancelText="Cancelar"
        isLoading={isDeleting}
      />
    </Box>
  );
}
