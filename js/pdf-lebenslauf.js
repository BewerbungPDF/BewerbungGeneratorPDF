import { clearError, showError } from './pdf-utils.js';

const PAGE_HEIGHT = 297;
const MARGIN_BOTTOM = 20;

function val(id) {
    return (document.getElementById(id)?.value ?? '').trim();
}

function checkPage(doc, y) {
    if (y > PAGE_HEIGHT - MARGIN_BOTTOM) {
        doc.addPage();
        return 25;
    }
    return y;
}

function section(doc, title, y) {
    y = checkPage(doc, y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text(title, 20, y);

    doc.setLineWidth(0.6);
    doc.line(20, y + 2, 190, y + 2);

    return y + 10;
}

function text(doc, value, y) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    const lines = doc.splitTextToSize(value || '–', 170);

    for (const line of lines) {
        y = checkPage(doc, y);
        doc.text(line, 20, y);
        y += 6;
    }

    return y + 4;
}

function bulletList(doc, value, y) {
    const items = (value || '').split('\n');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    for (const item of items) {
        if (!item.trim()) continue;

        y = checkPage(doc, y);
        doc.text(`• ${item.trim()}`, 22, y);
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

        // ===== HEADER (PROFESSIONELL) =====
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.text(val('cvName') || 'Max Mustermann', 20, y);

        y += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);

        const contact = [
            val('cvAddress'),
            val('cvPhone'),
            val('cvEmail')
        ].filter(Boolean).join('  |  ');

        doc.text(contact, 20, y);

        y += 12;

        doc.setDrawColor(120);
        doc.line(20, y, 190, y);

        y += 10;

        // ===== PERSÖNLICHE DATEN =====
        y = section(doc, 'PERSÖNLICHE DATEN', y);

        const birth = `${val('cvBirthDay')}.${val('cvBirthMonth')}.${val('cvBirthYear')}`;

        y = text(doc, `Geburtsdatum: ${birth}`, y);
        y = text(doc, `Geburtsort: ${val('cvBirthPlace')}`, y);

        // ===== BILDUNGSWEG =====
        y = section(doc, 'BILDUNGSWEG', y);
        y = text(doc, val('cvSchool'), y);

        // ===== ERFAHRUNG =====
        y = section(doc, 'PRAKTISCHE ERFAHRUNG', y);
        y = bulletList(doc, val('cvExperience'), y);

        // ===== KENNTNISSE =====
        y = section(doc, 'KENNTNISSE & FÄHIGKEITEN', y);
        y = bulletList(doc, val('cvSkills'), y);

        // ===== SPRACHEN =====
        y = section(doc, 'SPRACHEN', y);
        y = bulletList(doc, val('cvLanguages'), y);

        // ===== STÄRKEN =====
        y = section(doc, 'STÄRKEN', y);
        y = bulletList(doc, val('cvStrengths'), y);

        // ===== INTERESSEN =====
        y = section(doc, 'INTERESSEN', y);
        y = bulletList(doc, val('cvHobbies'), y);

        // ===== FOOTER =====
        y += 15;
        y = checkPage(doc, y);

        doc.setFontSize(10);
        doc.text('Ort, Datum: _________________________', 20, y);
        doc.text('Unterschrift: _________________________', 120, y);

        doc.save('Lebenslauf.pdf');

    } catch (err) {
        console.error(err);
        showError('lebenslaufError', 'PDF konnte nicht erstellt werden.');
    } finally {
        btn.disabled = false;
        btn.textContent = 'PDF herunterladen';
    }
}
