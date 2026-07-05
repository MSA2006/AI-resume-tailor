import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
export async function generatePDF(data, mode = "professional") {
  const pdfDoc = await PDFDocument.create();
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 595;
  const pageHeight = 842;

  // Tighter for internship (1 page), normal for professional
  const margin = mode === "internship" ? 45 : 50;
  const bodySize = mode === "internship" ? 9.5 : 10;
  const lineH = mode === "internship" ? 12 : 13;
  const headingSize = mode === "internship" ? 10 : 11;
  const nameSize = mode === "internship" ? 16 : 17;
  const maxWidth = pageWidth - margin * 2;
  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  const addPage = () => {
    page = pdfDoc.addPage([pageWidth, pageHeight]);
    y = pageHeight - margin;
  };

  const checkSpace = (needed) => {
    if (y < margin + needed) addPage();
  };

  const drawCenteredText = (text, font, size, color, after = 0) => {
    if (!text) return;
    const textWidth = font.widthOfTextAtSize(text, size);
    checkSpace(size + after);
    page.drawText(text, { x: (pageWidth - textWidth) / 2, y, size, font, color });
    y -= size + after;
  };

  const drawWrapped = (text, font, size, color, lineHeight, indent = 0) => {
  if (!text) return;
  // Sanitize characters that WinAnsi font can't encode
  text = text
    .replace(/\u2011/g, "-")   // non-breaking hyphen → regular hyphen
    .replace(/\u2013/g, "-")   // en dash → hyphen
    .replace(/\u2014/g, "--")  // em dash → double hyphen
    .replace(/\u2018/g, "'")   // left single quote → apostrophe
    .replace(/\u2019/g, "'")   // right single quote → apostrophe
    .replace(/\u201c/g, '"')   // left double quote → straight quote
    .replace(/\u201d/g, '"')   // right double quote → straight quote
    .replace(/\u2026/g, "...")  // ellipsis → three dots
    .replace(/[^\x00-\xFF]/g, ""); // strip any remaining non-latin chars
  const words = text.split(" ");
    let currentLine = "";
    const effectiveWidth = maxWidth - indent;

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (font.widthOfTextAtSize(testLine, size) > effectiveWidth && currentLine) {
        checkSpace(lineHeight);
        page.drawText(currentLine, { x: margin + indent, y, size, font, color });
        y -= lineHeight;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      checkSpace(lineHeight);
      page.drawText(currentLine, { x: margin + indent, y, size, font, color });
      y -= lineHeight;
    }
  };

  const drawSectionHeading = (text) => {
    checkSpace(40);
    y -= 8;
    page.drawText(text.toUpperCase(), {
      x: margin, y, size: bodySize, font: boldFont, color: rgb(0, 0, 0),
    });
    page.drawLine({
      start: { x: margin, y: y - 3 },
      end: { x: pageWidth - margin, y: y - 3 },
      thickness: 0.8,
      color: rgb(0, 0, 0),
    });
    y -= 14;
  };

  const drawBullet = (text) => {
    if (!text) return;
    checkSpace(16);
    page.drawText("•", { x: margin + 8, y, size: bodySize, font: regularFont, color: rgb(0, 0, 0) });
    drawWrapped(text, regularFont, bodySize, rgb(0.1, 0.1, 0.1), lineH, 20);
  };

  const drawEntryHeader = (title, organization, date) => {
    checkSpace(20);
    y -= 5;

    const leftText = [title, organization].filter(Boolean).join(" — ");
    const dateText = date || "";
    const dateWidth = dateText ? boldFont.widthOfTextAtSize(dateText, bodySize) : 0;
    const leftMaxWidth = maxWidth - dateWidth - 15;
    const fullLeftWidth = boldFont.widthOfTextAtSize(leftText, bodySize);

    if (dateText && fullLeftWidth <= leftMaxWidth) {
      // Fits on one line — draw title left, date right
      page.drawText(leftText, {
        x: margin, y, size: bodySize, font: boldFont, color: rgb(0, 0, 0),
      });
      page.drawText(dateText, {
        x: pageWidth - margin - dateWidth, y,
        size: bodySize, font: boldFont, color: rgb(0.3, 0.3, 0.3),
      });
      y -= lineH + 2;
    } else {
      // Too long — wrap title first, then date on its own line
      drawWrapped(leftText, boldFont, bodySize, rgb(0, 0, 0), lineH, 0);
      if (dateText) {
        checkSpace(lineH);
        page.drawText(dateText, {
          x: margin, y, size: bodySize,
          font: boldFont, color: rgb(0.3, 0.3, 0.3),
        });
        y -= lineH + 2;
      }
    }
  };

  // ─── HEADER ───────────────────────────────────────────
  drawCenteredText(data.name, boldFont, nameSize, rgb(0, 0, 0), 4);
  if (data.tagline) {
    drawCenteredText(data.tagline, boldFont, nameSize - 4, rgb(0.2, 0.2, 0.2), 4);
  }
  drawCenteredText(data.contact, regularFont, bodySize, rgb(0.3, 0.3, 0.3), 4);
  const isValidLink = (text) => {
    if (!text) return false;
    const t = text.trim().toLowerCase();
    if (t === "linkedin" || t === "github" || t.length < 5) return false;
    return true;
  };

  if (isValidLink(data.linkedin)) {
    drawCenteredText(data.linkedin, regularFont, bodySize, rgb(0.1, 0.1, 0.6), 4);
  }
  if (isValidLink(data.github)) {
    drawCenteredText(data.github, regularFont, bodySize, rgb(0.1, 0.1, 0.6), 4);
  }
  y -= 6;
  

  // ─── SUMMARY ──────────────────────────────────────────
  if (data.summary) {
    drawSectionHeading("SUMMARY");
    drawWrapped(data.summary, regularFont, bodySize, rgb(0.1, 0.1, 0.1), lineH, 0);
    y -= 4;
  }

  // ─── SECTIONS ─────────────────────────────────────────
  for (const section of data.sections) {
    drawSectionHeading(section.heading);

    for (const entry of section.entries) {
      const hasHeader = entry.title || entry.organization || entry.date;
      const isProjectSection = section.type === "projects";
      const useInlineTitle = mode === "internship" && isProjectSection;

      if (useInlineTitle && entry.bullets && entry.bullets.length > 0) {
        // Inline bold title + first bullet on same line
        const titleText = entry.title ? entry.title + ": " : "";
        const bulletText = entry.bullets[0];
        const titleWidth = boldFont.widthOfTextAtSize(titleText, bodySize);

        checkSpace(lineH);
        page.drawText("•", { x: margin + 8, y, size: bodySize, font: regularFont, color: rgb(0, 0, 0) });
        page.drawText(titleText, { x: margin + 20, y, size: bodySize, font: boldFont, color: rgb(0, 0, 0) });

        // Wrap the rest of bullet text
        const restWords = bulletText.split(" ");
        let currentLine = "";
        let firstLine = true;
        const firstLineWidth = maxWidth - 20 - titleWidth;

        for (const word of restWords) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const ew = firstLine ? firstLineWidth : maxWidth - 20;
          if (regularFont.widthOfTextAtSize(testLine, bodySize) > ew && currentLine) {
            if (firstLine) {
              page.drawText(currentLine, { x: margin + 20 + titleWidth, y, size: bodySize, font: regularFont, color: rgb(0.1, 0.1, 0.1) });
              firstLine = false;
            } else {
              checkSpace(lineH);
              page.drawText(currentLine, { x: margin + 20, y, size: bodySize, font: regularFont, color: rgb(0.1, 0.1, 0.1) });
            }
            y -= lineH;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) {
          if (firstLine) {
            page.drawText(currentLine, { x: margin + 20 + titleWidth, y, size: bodySize, font: regularFont, color: rgb(0.1, 0.1, 0.1) });
            y -= lineH;
          } else {
            checkSpace(lineH);
            page.drawText(currentLine, { x: margin + 20, y, size: bodySize, font: regularFont, color: rgb(0.1, 0.1, 0.1) });
            y -= lineH;
          }
        }

        // Remaining bullets if any
        for (let i = 1; i < entry.bullets.length; i++) {
          if (entry.bullets[i].trim()) drawBullet(entry.bullets[i]);
        }

      } else {
        if (hasHeader) {
          drawEntryHeader(entry.title, entry.organization, entry.date);
        }
        if (entry.bullets && entry.bullets.length > 0) {
          for (const bullet of entry.bullets) {
            if (bullet.trim()) drawBullet(bullet);
          }
        }
      }
      if (section.type === "skills" && entry.bullets && entry.bullets.length > 0 && !entry.text) {
  entry.text = entry.bullets.join(", ");
  entry.bullets = [];
      }

      // Plain text — only apply label-bolding for actual Skills sections
      if (entry.text && entry.text.trim()) {
        const isSkillsSection = section.type === "skills";

        if (isSkillsSection) {
          const skillLines = entry.text.split(/\.\s+|\n/).filter(l => l.trim());
          if (skillLines.length > 1) {
            for (const skillLine of skillLines) {
              if (!skillLine.trim()) continue;
              const colonIndex = skillLine.indexOf(":");
              if (colonIndex !== -1) {
                const label = skillLine.substring(0, colonIndex + 1);
                const rest = skillLine.substring(colonIndex + 1).trim();
                const labelWidth = boldFont.widthOfTextAtSize(label, bodySize);
                checkSpace(lineH);
                page.drawText(label, { x: margin, y, size: bodySize, font: boldFont, color: rgb(0, 0, 0) });
                y -= lineH;
                drawWrapped(rest, regularFont, bodySize, rgb(0.1, 0.1, 0.1), lineH, 0);
              } else {
                drawWrapped(skillLine, regularFont, bodySize, rgb(0.1, 0.1, 0.1), lineH, 0);
              }
            }
          } else {
            drawWrapped(entry.text, regularFont, bodySize, rgb(0.1, 0.1, 0.1), lineH, 0);
          }
        } else {
          // Free-form text (Additional Information, Interests, etc) — plain paragraphs, no label-bolding
          const paragraphs = entry.text.split("\n").filter(p => p.trim());
          for (const para of paragraphs) {
            drawWrapped(para, regularFont, bodySize, rgb(0.1, 0.1, 0.1), lineH, 0);
            y -= 2;
          }
        }
      }

      y -= 2;
    }
  }

  return await pdfDoc.save();
}