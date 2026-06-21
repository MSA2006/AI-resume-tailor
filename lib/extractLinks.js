import PDFParser from "pdf2json";

export function extractLinksFromPDF(buffer) {
  return new Promise((resolve) => {
    const pdfParser = new PDFParser();
    const links = { linkedin: "", github: "" };

    pdfParser.on("pdfParser_dataError", () => {
      resolve(links); // fail silently, just return empty
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      try {
        for (const page of pdfData.Pages) {
          if (!page.HLinks) continue;
          for (const link of page.HLinks) {
            const url = link.url || "";
            const lower = url.toLowerCase();
            if (lower.includes("linkedin.com") && !links.linkedin) {
              links.linkedin = url;
            }
            if (lower.includes("github.com") && !links.github) {
              links.github = url;
            }
          }
        }
      } catch (e) {
        // ignore, just return whatever we found
      }
      resolve(links);
    });

    pdfParser.parseBuffer(buffer);
  });
}