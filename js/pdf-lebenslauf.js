import {clearError, showError} from './pdf-utils.js';

/** Высота страницы A4 во внутренних единицах jsPDF (мм). */
const PAGE_HEIGHT = 297;

/** Нижнее поле - контент не размещается ниже этой координаты. */
const MARGIN_BOTTOM = 20;

/**
 * Читает значение поля по идентификатору элемента.
 *
 * @param {string} id  идентификатор элемента
 * @returns {string}   обрезанное значение или пустая строка, если элемент не найден
 */
function val(id) {
    return (document.getElementById(id)?.value ?? '').trim();
}

/**
 * Выводит строку с меткой (жирный заголовок + обычный текст значения) в заданной колонке.
 * При переполнении страницы автоматически добавляет новую.
 *
 * @param {import('jspdf').jsPDF} doc       активный документ jsPDF
 * @param {number}                x         левая граница колонки (мм)
 * @param {number}                y         текущая позиция по оси Y (мм)
 * @param {string}                label     подпись поля
 * @param {string}                value     значение поля (пустое - выводится как «–»)
 * @param {number}                wrapWidth максимальная ширина текста в колонке (мм)
 * @returns {number}  обновлённая позиция по оси Y
 */
function writeRow(doc, x, y, label, value, wrapWidth) {
    const lineH = 6;   // межстрочный интервал при размере шрифта 11 pt (мм)
    const gap = 4;     // отступ между строками

    // Жирная метка
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    if (y + lineH > PAGE_HEIGHT - MARGIN_BOTTOM) {
        doc.addPage();
        y = 30;
    }
    doc.text(`${label}:`, x, y);
    y += lineH;

    // Обычный текст значения (с переносом строк)
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(value || '–', wrapWidth);
    for (const line of lines) {
        if (y + lineH > PAGE_HEIGHT - MARGIN_BOTTOM) {
            doc.addPage();
            y = 30;
        }
        doc.text(line, x, y);
        y += lineH;
    }

    return y + gap;
}

/**
 * Генерирует и инициирует загрузку Lebenslauf в формате PDF.
 * Блокирует кнопку на время генерации, исключая повторные нажатия.
 * Валидация полей выполняется мастером при переходе между шагами,
 * поэтому кнопка загрузки доступна только при корректно заполненных данных.
 *
 * @param {HTMLButtonElement} btn  кнопка, инициировавшая действие
 */
export function generateLebenslaufPDF(btn) {
    clearError('lebenslaufError');

    btn.disabled = true;
    btn.textContent = 'Wird erstellt…';

    try {
        const {jsPDF} = window.jspdf;
        const doc = new jsPDF();

        // -- Заголовок документа --
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Lebenslauf', 105, 20, {align: 'center'});

        const birthDate = `${val('cvBirthDay')}.${val('cvBirthMonth')}.${val('cvBirthYear')}`;

        // -- Геометрия колонок --
        // Левая колонка: x=20, ширина 80 мм -> правый край ~100 мм
        // Правая колонка: x=110, ширина 85 мм -> правый край ~195 мм
        // Промежуток между колонками: 10 мм
        const leftX = 20;
        const rightX = 110;
        const leftWrap = 80;
        const rightWrap = 85;

        // -- Левая колонка --
        let leftY = 40;

        const leftRows = [
            ['Name', val('cvName')],
            ['Geburtsdatum', birthDate],
            ['Geburtsort', val('cvBirthPlace')],
            ['Adresse', val('cvAddress')],
            ['Telefon', val('cvPhone')],
            ['Email', val('cvEmail')],
            ['Sprachen', val('cvLanguages')],
            ['Stärken', val('cvStrengths')],
        ];

        for (const [label, value] of leftRows) {
            leftY = writeRow(doc, leftX, leftY, label, value, leftWrap);
        }

        // -- Правая колонка --
        let rightY = 40;

        const rightRows = [
            ['Schule', val('cvSchool')],
            ['Erfahrungen', val('cvExperience')],
            ['Fähigkeiten', val('cvSkills')],
            ['Hobbys', val('cvHobbies')],
        ];

        for (const [label, value] of rightRows) {
            rightY = writeRow(doc, rightX, rightY, label, value, rightWrap);
        }

        doc.save('Lebenslauf.pdf');
    } catch (err) {
        showError('lebenslaufError', 'PDF konnte nicht erstellt werden. Bitte versuche es erneut.');
        console.error('[Lebenslauf PDF]', err);
    } finally {
        btn.disabled = false;
        btn.textContent = 'PDF herunterladen';
    }
}