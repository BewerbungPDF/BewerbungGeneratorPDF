import {getRandomBewerbung} from './templates.js';
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
 * Увеличивает координату `y` на `delta`; при переполнении страницы
 * добавляет новую страницу и сбрасывает `y` к верхнему полю.
 *
 * @param {import('jspdf').jsPDF} doc    активный документ jsPDF
 * @param {number}                y      текущая позиция по оси Y (мм)
 * @param {number}                delta  высота следующего блока (мм)
 * @param {number}                [top]  верхнее поле на новой странице (по умолчанию 20)
 * @returns {number}  обновлённая позиция по оси Y
 */
function advanceY(doc, y, delta, top = 20) {
    if (y + delta > PAGE_HEIGHT - MARGIN_BOTTOM) {
        doc.addPage();
        return top;
    }
    return y + delta;
}

/**
 * Генерирует и инициирует загрузку Bewerbung в формате PDF.
 * Блокирует кнопку на время генерации, исключая повторные нажатия.
 * Валидация полей выполняется мастером при переходе между шагами,
 * поэтому кнопка загрузки доступна только при корректно заполненных данных.
 *
 * @param {HTMLButtonElement} btn  кнопка, инициировавшая действие
 */
export function generateBewerbungPDF(btn) {
    clearError('bewerbungError');

    btn.disabled = true;
    btn.textContent = 'Wird erstellt…';

    try {
        const {jsPDF} = window.jspdf;
        const doc = new jsPDF();

        const companyName = val('companyName');
        const companyStreet = val('companyStreet');
        const companyEmail = val('companyEmail');
        const personalName = val('personalName');
        const personalAddress = val('personalAddress');
        const personalPhone = val('personalPhone');
        const personalEmail = val('personalEmail');
        const place = val('place');
        const date = val('date');
        const jobTitle = val('jobTitle');
        const practiceType = val('practiceType');

        let y = 20;

        // -- Блок с данными компании --
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        const companyLines = [companyName, companyStreet, companyEmail].filter(Boolean);
        doc.text(companyLines.join('\n'), 20, y);
        y = advanceY(doc, y, companyLines.length * 7 + 8);

        // -- Блок с данными соискателя --
        doc.setFont('helvetica', 'normal');
        const personalLines = [personalName, personalAddress, personalPhone, personalEmail].filter(Boolean);
        doc.text(personalLines.join('\n'), 20, y);
        y = advanceY(doc, y, personalLines.length * 7 + 8);

        // -- Место и дата --
        y = advanceY(doc, y, 0);
        doc.text(`${place}, ${date}`, 20, y);
        y = advanceY(doc, y, 12);

        // -- Строка темы письма --
        doc.setFont('helvetica', 'bold');
        y = advanceY(doc, y, 0);
        doc.text(`Bewerbung ${jobTitle}`, 20, y);
        y = advanceY(doc, y, 10);

        // -- Заголовок шаблона --
        const {title, body} = getRandomBewerbung(practiceType, personalName);
        y = advanceY(doc, y, 0);
        doc.text(title, 20, y);
        y = advanceY(doc, y, 10);

        // -- Основной текст (может занимать несколько страниц) --
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const bodyLines = doc.splitTextToSize(body, 170);

        for (const line of bodyLines) {
            if (y > PAGE_HEIGHT - MARGIN_BOTTOM) {
                doc.addPage();
                y = 20;
            }
            doc.text(line, 20, y);
            y += 5; // межстрочный интервал при размере шрифта 10 pt
        }

        doc.save('Bewerbung.pdf');
    } catch (err) {
        showError('bewerbungError', 'PDF konnte nicht erstellt werden. Bitte versuche es erneut.');
        console.error('[Bewerbung PDF]', err);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Bewerbung herunterladen';
    }
}