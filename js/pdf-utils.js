/**
 * pdf-utils.js - вспомогательные функции, общие для модулей генерации PDF.
 *
 * Содержит только логику, совместно используемую pdf-bewerbung.js и pdf-lebenslauf.js.
 */

/**
 * Отображает встроенное сообщение об ошибке в указанном контейнере.
 *
 * @param {string} errorId  идентификатор элемента `<p>` для вывода ошибки
 * @param {string} message  текст сообщения
 */
export function showError(errorId, message) {
    const el = document.getElementById(errorId);
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
}

/**
 * Скрывает и очищает контейнер сообщения об ошибке.
 *
 * @param {string} errorId  идентификатор элемента `<p>` для вывода ошибки
 */
export function clearError(errorId) {
    const el = document.getElementById(errorId);
    if (!el) return;
    el.textContent = '';
    el.hidden = true;
}