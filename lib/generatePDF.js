import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function generatePDF(text) {
  const pdfDoc = await PDFDocument.create();
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 50;
  const maxWidth = pageWidth - margin * 2;

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  const addPage = () => {
    page = pdfDoc.addPage([pageWidth, pageHeight]);
    y = pageHeight - margin;
  };

  const checkSpace = (space) => {
    if (y < margin + space) addPage();
  };

  // Detect what kind of line it is
  const isSectionHeading = (line) => {
    const headings = [
      "summary", "experience", "education", "skills",
      "professional experience", "work experience", "projects",
      "certifications", "changes made", "objective", "achievements"
    ];
    return headings.some((h) => line.toLowerCase().trim() === h || line.toLowerCase().trim() === h + ":");
  };

  const isNameLine = (index) => index === 0;
  const isContactLine = (index) => index === 1;

  const drawWrappedText = (text, font, size, color, lineHeight, indent = 0) => {
    const words = text.split(" ");
    let currentLine = "";
    const effectiveWidth = maxWidth - indent;

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, size);
      if (testWidth > effectiveWidth && currentLine) {
        checkSpace(lineHeight);
        page.drawText(currentLine, {
          x: margin + indent,
          y,
          size,
          font,
          color,
        });
        y -= lineHeight;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      checkSpace(lineHeight);
      page.drawText(currentLine, {
        x: margin + indent,
        y,
        size,
        font,
        color,
      });
      y -= lineHeight;
    }
  };

  const drawCenteredText = (text, font, size, color, lineHeight) => {
    const textWidth = font.widthOfTextAtSize(text, size);
    const x = (pageWidth - textWidth) / 2;
    checkSpace(lineHeight);
    page.drawText(text, { x, y, size, font, color });
    y -= lineHeight;
  };

  const drawDivider = () => {
    checkSpace(10);
    page.drawLine({
      start: { x: margin, y: y + 4 },
      end: { x: pageWidth - margin, y: y + 4 },
      thickness: 0.8,
      color: rgb(0.4, 0.4, 0.4),
    });
    y -= 6;
  };

  const lines = text.split("\n").filter((l) => l.trim() !== "" || true);
  let lineIndex = 0;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line === "") {
      y -= 6;
      continue;
    }

    // Name — big, bold, centered
    if (isNameLine(lineIndex)) {
      drawCenteredText(line, boldFont, 18, rgb(0, 0, 0), 24);
      lineIndex++;
      continue;
    }

    // Contact info — small, centered, gray
    if (isContactLine(lineIndex)) {
      drawCenteredText(line, regularFont, 9, rgb(0.3, 0.3, 0.3), 16);
      y -= 6;
      lineIndex++;
      continue;
    }

    // Section headings — bold, uppercase, with divider
  if (isSectionHeading(line)) {
    y -= 10;
    checkSpace(24);
    const upper = line.replace(":", "").toUpperCase();
    page.drawText(upper, {
      x: margin,
      y,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0.6),
    });
    y -= 16;
    drawDivider();
    lineIndex++;
    continue;
  }

    // Bullet points
    if (line.startsWith("-") || line.startsWith("•")) {
      const bulletText = line.replace(/^[-•]\s*/, "");
      checkSpace(14);
      page.drawText("•", { x: margin + 4, y, size: 10, font: regularFont, color: rgb(0, 0, 0) });
      drawWrappedText(bulletText, regularFont, 10, rgb(0, 0, 0), 14, 14);
      lineIndex++;
      continue;
    }

    // Job title lines (contains | or dates)
    if (line.includes("|") || /\d{4}/.test(line)) {
      drawWrappedText(line, boldFont, 10, rgb(0, 0, 0), 15, 0);
      lineIndex++;
      continue;
    }

    // Regular text
    drawWrappedText(line, regularFont, 10, rgb(0.15, 0.15, 0.15), 14, 0);
    lineIndex++;
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}