import {initWizard} from './wizard.js';

/**
 * Заполняет элемент `<select>` диапазоном целочисленных значений.
 *
 * @param {string} selectId    идентификатор целевого элемента `<select>`
 * @param {number} from        начальное значение (включительно)
 * @param {number} to          конечное значение (включительно)
 * @param {string} placeholder текст пустого варианта по умолчанию
 */
function populateRange(selectId, from, to, placeholder) {
    const select = document.getElementById(selectId);
    if (!select) return;

    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = placeholder;
    select.appendChild(defaultOpt);

    for (let i = from; i <= to; i++) {
        const opt = document.createElement('option');
        opt.value = String(i);
        opt.textContent = String(i);
        select.appendChild(opt);
    }
}

/**
 * Заполняет выпадающие списки дня, месяца и года рождения.
 */
function populateDateSelects() {
    populateRange('cvBirthDay', 1, 31, 'Tag');

    const monthSelect = document.getElementById('cvBirthMonth');
    if (monthSelect) {
        const months = [
            'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
            'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
        ];
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = 'Monat';
        monthSelect.appendChild(defaultOpt);

        months.forEach((name, i) => {
            const opt = document.createElement('option');
            opt.value = String(i + 1);
            opt.textContent = name;
            monthSelect.appendChild(opt);
        });
    }

    // Годы перечисляются в порядке убывания
    const yearSelect = document.getElementById('cvBirthYear');
    if (yearSelect) {
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = 'Jahr';
        yearSelect.appendChild(defaultOpt);

        const currentYear = new Date().getFullYear();
        for (let y = currentYear; y >= 1900; y--) {
            const opt = document.createElement('option');
            opt.value = String(y);
            opt.textContent = String(y);
            yearSelect.appendChild(opt);
        }
    }
}

/**
 * Подставляет сегодняшнюю дату в поле даты Bewerbung в формате ДД.ММ.ГГГГ.
 */
function setTodayDate() {
    const dateEl = document.getElementById('date');
    if (!dateEl) return;

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    dateEl.value = `${dd}.${mm}.${yyyy}`;
}

/**
 * Переключает приложение в выбранный режим: скрывает приветственный экран,
 * отображает форму и запускает мастер с первого шага.
 *
 * @param {'bewerbung'|'lebenslauf'} mode выбранный режим документа
 */
export function showMode(mode) {
    document.getElementById('welcome').hidden = true;
    document.getElementById('formShell').hidden = false;

    document.getElementById('formTitle').textContent =
        mode === 'lebenslauf' ? 'Lebenslauf erstellen' : 'Bewerbung erstellen';

    // Показываем только форму выбранного режима
    document.getElementById('bewerbungFields').hidden = mode !== 'bewerbung';
    document.getElementById('lebenslaufFields').hidden = mode !== 'lebenslauf';

    // Передаём управление мастеру шагов
    initWizard(mode);
}

/**
 * Выполняет первоначальную инициализацию UI при загрузке страницы.
 */
export function initUI() {
    populateDateSelects();
    setTodayDate();
}