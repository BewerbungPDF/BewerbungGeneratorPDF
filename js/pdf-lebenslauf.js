import { clearError, showError } from './pdf-utils.js';

const PAGE_HEIGHT = 297;
const MARGIN_BOTTOM = 18;

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

    // Заголовок секции
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(20, 20, 20);
    doc.text(title, 20, y);

    // линия (очень "немецкий стиль")
    doc.setDrawColor(180);
    doc.setLineWidth(0.5);
    doc.line(20, y + 2, 190, y + 2);

    return y + 9;
}

function field(doc, label, value, y) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    y = checkPage(doc, y);
    doc.text(`${label}:`, 20, y);

    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(value || '–', 150);

    let first = true;
    for (const line of lines) {
        if (!first) y = checkPage(doc, y);
        doc.text(line, 65, y);
        y += 6;
        first = false;
    }

    return y + 2;
}

function list(doc, value, y) {
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

        // ===== NAME HEADER (PROFESSIONELL) =====
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(0, 0, 0);
        doc.text(val('cvName') || 'Max Mustermann', 20, y);

        y += 8;

        // ===== CONTACT LINE =====
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);

        const contact = [
            val('cvAddress'),
            val('cvPhone'),
            val('cvEmail')
        ].filter(Boolean).join('   |   ');

        doc.text(contact, 20, y);

        y += 10;

        // тонкая линия под шапкой
        doc.setDrawColor(200);
        doc.line(20, y, 190, y);

        y += 10;

        // ===== PERSÖNLICHE DATEN =====
        y = section(doc, 'PERSÖNLICHE DATEN', y);

        const birth = `${val('cvBirthDay')}.${val('cvBirthMonth')}.${val('cvBirthYear')}`;

        y = field(doc, 'Geburtsdatum', birth, y);
        y = field(doc, 'Geburtsort', val('cvBirthPlace'), y);

        // ===== BILDUNGSWEG =====
        y = section(doc, 'BILDUNGSWEG', y);
        y = field(doc, 'Schule', val('cvSchool'), y);

        // ===== ERFAHRUNG =====
        y = section(doc, 'PRAKTISCHE ERFAHRUNG', y);
        y = list(doc, val('cvExperience'), y);

        // ===== KENNTNISSE =====
        y = section(doc, 'KENNTNISSE & FÄHIGKEITEN', y);
        y = list(doc, val('cvSkills'), y);

        // ===== SPRACHEN =====
        y = section(doc, 'SPRACHEN', y);
        y = list(doc, val('cvLanguages'), y);

        // ===== STÄRKEN =====
        y = section(doc, 'STÄRKEN', y);
        y = list(doc, val('cvStrengths'), y);

        // ===== INTERESSEN =====
        y = section(doc, 'INTERESSEN', y);
        y = list(doc, val('cvHobbies'), y);

        doc.save('Lebenslauf.pdf');

    } catch (err) {
        console.error(err);
        showError('lebenslaufError', 'PDF konnte nicht erstellt werden.');
    } finally {
        btn.disabled = false;
        btn.textContent = 'PDF herunterladen';
    }
}
