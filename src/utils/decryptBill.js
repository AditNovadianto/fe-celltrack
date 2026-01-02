function deobfuscateInvoice(encoded) {
  try {
    const decoded = atob(encoded);
    const [salt, invoice, timestamp] = decoded.split(":");

    if (salt !== "trx") return null;

    return {
      invoice,
      timestamp: Number(timestamp),
    };
  } catch (error) {
    console.error("Invalid obfuscated invoice");
    return null;
  }
}

const result = deobfuscateInvoice(
  "dHJ4OlRSWC0yMDI2MDEwMi1RN00yWjoxNzY3Mzc5ODIwNDIw"
);

console.log(result);
