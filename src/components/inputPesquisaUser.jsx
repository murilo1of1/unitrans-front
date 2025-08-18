import { Input, InputGroup } from "@chakra-ui/react";

export default function InputPesquisaUser({ value, onChange, placeholder, ...props }) {
  return (
    <InputGroup mb={-5} mt={1}>
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        bg="#181824"
        color="#fff"
        border="1px #white"
        fontFamily="Montserrat"
        fontSize="md"
        borderRadius="md"
        {...props}
        _focus={{ borderColor: "white", boxShadow: "0 0 0 sm white" }}

      />
    </InputGroup>
  );
}