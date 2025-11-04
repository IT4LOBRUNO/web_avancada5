export default function validateBirthDate(dateString) {
  if (!dateString) return "Informe uma data válida";

  const date = new Date(dateString);

  //O m~es deve possuir a data certa
  if (isNaN(date.getTime())) {
    return "Data inválida.";
  }

  const today = new Date();
  const minDate = new Date("1900-01-01");

  //Ninguém nasce no futuro
  if (date > today) {
    return "A data de nascimento não pode estar no futuro.";
  }

  if (date < minDate) {
    return "A data de nascimento é muito antiga.";
  }

  const [year, month, day] = dateString.split("-").map(Number);
  const validDate = new Date(year, month - 1, day);
  if (
    validDate.getFullYear() !== year ||
    validDate.getMonth() !== month - 1 ||
    validDate.getDate() !== day
  ) {
    return "Data inválida (ex.: 31/02 não existe).";
  }

  return null; // Nenhum erro
}
