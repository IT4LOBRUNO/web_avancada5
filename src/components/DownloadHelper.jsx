export function downloadBase64File(base64, filename, mimeType = "application/pdf") {
  if (!base64) {
    alert("Arquivo não disponível.");
    return;
  }

  let linkSource = base64.startsWith("data:")
    ? base64
    : `data:${mimeType};base64,${base64}`;

  try {
    const link = document.createElement("a");
    link.href = linkSource;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Erro ao baixar arquivo:", error);
    alert("Falha ao baixar o arquivo.");
  }
}
