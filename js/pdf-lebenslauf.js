import { clearError, showError } from './pdf-utils.js';

const PAGE_HEIGHT = 297;
const MARGIN_BOTTOM = 20;

function val(id) {
    return (document.getElementById(id)?.value ?? '').trim();
}

function checkPageBreak(doc, y) {
    if (y > PAGE_HEIGHT - MARGIN_BOTTOM) {
        doc.addPage();
        return 25;
    }
    return y;
}

function writeSectionTitle(doc, title, y) {
    y = checkPageBreak(doc, y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(title, 20, y);

    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(20, y + 2, 190, y + 2);

    return y + 10;
}

function writeText(doc, text, y) {
    const lineHeight = 6;
    const lines = doc.splitTextToSize(text || '–', 170);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    for (const line of lines) {
        y = checkPageBreak(doc, y);
        doc.text(line, 20, y);
        y += lineHeight;
    }

    return y + 4;
}

function writeList(doc, text, y) {
    const items = (text || '').split('\n');

    for (const item of items) {
        if (!item.trim()) continue;

        y = checkPageBreak(doc, y);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);

        doc.text('• ' + item.trim(), 22, y);
        y += 6;
    }

    return y + 2;
}

export function generateLebenslaufPDF(btn) {
    clearError('lebenslaufError');

    btn.disabled = true;
    btn.textContent = 'Wird erstellt…';

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        let y = 25;

        // ===== HEADER =====
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.text(val('cvName') || 'Max Mustermann', 20, y);

        y += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);

        const contactLine = [
            val('cvAddress'),
            val('cvPhone'),
            val('cvEmail')
        ].filter(Boolean).join(' | ');

        doc.text(contactLine, 20, y);

        y += 15;

        // ===== Persönliche Daten =====
        y = writeSectionTitle(doc, 'Persönliche Daten', y);

        const birthDate = `${val('cvBirthDay')}.${val('cvBirthMonth')}.${val('cvBirthYear')}`;

        y = writeText(doc, `Geburtsdatum: ${birthDate}`, y);
        y = writeText(doc, `Geburtsort: ${val('cvBirthPlace')}`, y);

        // ===== Bildungsweg =====
        y = writeSectionTitle(doc, 'Bildungsweg', y);
        y = writeText(doc, val('cvSchool'), y);

        // ===== Berufserfahrung =====
        y = writeSectionTitle(doc, 'Berufserfahrung', y);
        y = writeList(doc, val('cvExperience'), y);

        // ===== Fähigkeiten =====
        y = writeSectionTitle(doc, 'Kenntnisse & Fähigkeiten', y);
        y = writeList(doc, val('cvSkills'), y);

        // ===== Sprachen =====
        y = writeSectionTitle(doc, 'Sprachen', y);
        y = writeList(doc, val('cvLanguages'), y);

        // ===== Stärken =====
        y = writeSectionTitle(doc, 'Stärken', y);
        y = writeList(doc, val('cvStrengths'), y);

        // ===== Interessen =====
        y = writeSectionTitle(doc, 'Interessen', y);
        y = writeList(doc, val('cvHobbies'), y);

        // ===== Footer =====
        y += 10;
        y = checkPageBreak(doc, y);

        doc.setFontSize(10);
        doc.text('Ort, Datum: ____________________', 20, y);
        doc.text('Unterschrift: ____________________', 120, y);

        doc.save('Lebenslauf.pdf');

    } catch (err) {
        showError('lebenslaufError', 'PDF konnte nicht erstellt werden.');
        console.error(err);
    } finally {
        btn.disabled = false;
        btn.textContent = 'PDF herunterladen';
    }
}
