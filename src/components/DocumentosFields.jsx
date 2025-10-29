import InputField from "./InputField.jsx";
import SelectField from "./SelectField.jsx";

export default function DocumentosFields({ documentos, setDocumentos }) {
  return (
    <>
      <InputField
        label="RG *"
        value={documentos.rg}
        onChange={(v) => setDocumentos({ ...documentos, rg: v })}
        placeholder="Digite o RG do aluno"
      />

      <InputField
        label="CPF"
        value={documentos.cpf}
        onChange={(v) => setDocumentos({ ...documentos, cpf: v })}
        placeholder="Digite o CPF do aluno"
      />

      <InputField
        label="Cadastro Nacional de Saúde (SUS)"
        value={documentos.sus}
        onChange={(v) => setDocumentos({ ...documentos, sus: v })}
        placeholder="Número do SUS"
      />

      <InputField
        label="Cor/Raça *"
        value={documentos.corRaca}
        onChange={(v) => setDocumentos({ ...documentos, corRaca: v })}
        placeholder="Informe a cor/raça"
      />

      <InputField
        label="Nome do Pai"
        value={documentos.nomePai}
        onChange={(v) => setDocumentos({ ...documentos, nomePai: v })}
        placeholder="Nome do pai"
      />

      <InputField
        label="Nome da Mãe"
        value={documentos.nomeMae}
        onChange={(v) => setDocumentos({ ...documentos, nomeMae: v })}
        placeholder="Nome da mãe"
      />
    </>
  );
}
