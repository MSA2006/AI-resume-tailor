import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from "docx";

export async function generateDOCX(data) {
  const paragraphs = [];

  const centered = (text, size, bold = false, color = "000000") =>
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [new TextRun({ text, bold, size, color, font: "Calibri" })],
    });

  const sectionHeading = (text) =>
    new Paragraph({
      spacing: { before: 200, after: 80 },
      border: { bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 } },
      children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 22, font: "Calibri" })],
    });

  const bullet = (text) =>
    new Paragraph({
      bullet: { level: 0 },
      spacing: { after: 60 },
      children: [new TextRun({ text, size: 20, font: "Calibri" })],
    });

  const entryHeader = (title, organization, date) => {
    const left = [title, organization].filter(Boolean).join(" — ");
    return new Paragraph({
      spacing: { before: 100, after: 40 },
      children: [
        new TextRun({ text: left, bold: true, size: 20, font: "Calibri" }),
        date ? new TextRun({ text: `\t${date}`, bold: true, size: 20, color: "555555", font: "Calibri" }) : new TextRun(""),
      ],
    });
  };

  // Header
  paragraphs.push(centered(data.name, 32, true));
  if (data.tagline) {
    paragraphs.push(centered(data.tagline, 24, true, "333333"));
  }
  paragraphs.push(centered(data.contact, 18, false, "555555"));
  // Summary
  if (data.summary) {
    paragraphs.push(sectionHeading("Summary"));
    paragraphs.push(new Paragraph({
      spacing: { after: 80 },
      children: [new TextRun({ text: data.summary, size: 20, font: "Calibri" })],
    }));
  }

  // Sections
  for (const section of data.sections) {
    paragraphs.push(sectionHeading(section.heading));

    for (const entry of section.entries) {
      if (entry.title || entry.organization || entry.date) {
        paragraphs.push(entryHeader(entry.title, entry.organization, entry.date));
      }
      if (entry.bullets?.length > 0) {
        for (const b of entry.bullets) {
          if (b.trim()) paragraphs.push(bullet(b));
        }
      }
      if (entry.text?.trim()) {
        paragraphs.push(new Paragraph({
          spacing: { after: 60 },
          children: [new TextRun({ text: entry.text, size: 20, font: "Calibri" })],
        }));
      }
    }
  }

  const doc = new Document({ sections: [{ children: paragraphs }] });
  return await Packer.toBuffer(doc);
}