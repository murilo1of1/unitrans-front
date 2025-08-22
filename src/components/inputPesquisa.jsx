import { Input, InputGroup } from "@chakra-ui/react";

export default function InputPesquisa({ value, onChange, placeholder }) {
  return (
    <InputGroup>
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        bg="#f8fafc"
        color="#828ea2"
        border="1px #white"
        fontFamily="Montserrat"
        fontSize="md"
        borderRadius="md"
        _focus={{ borderColor: "white", boxShadow: "0 0 0 sm white" }}

      />
    </InputGroup>
  );
}