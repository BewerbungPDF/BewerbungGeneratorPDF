/**
 * counters.js - живые счётчики символов для полей textarea.
 *
 * Для каждого настроенного поля:
 *   - Устанавливает атрибут `maxlength` для ограничения ввода
 *   - Вставляет живой элемент `<span>` со счётчиком после поля
 *   - Окрашивает счётчик в предупреждающий цвет при приближении к лимиту
 *   - Связывает счётчик с textarea через `aria-describedby`
 *
 * @typedef {{ id: string, max: number }} CounterConfig
 */

/** Порог предупреждения - счётчик подсвечивается при превышении этой доли от максимума. */
const WARN_AT = 0.9;

/**
 * Конфигурация отслеживаемых полей.
 * @type {CounterConfig[]}
 */
const COUNTER_FIELDS = [
    {id: 'cvExperience', max: 600},
    {id: 'cvSkills', max: 600},
    {id: 'cvHobbies', max: 300},
];

/**
 * Обновляет текст счётчика и состояние предупреждения для одного поля.
 *
 * @param {HTMLTextAreaElement} textarea  отслеживаемое поле
 * @param {HTMLElement}         counter   элемент счётчика
 * @param {number}              max       максимально допустимое число символов
 */
function updateCounter(textarea, counter, max) {
    const len = textarea.value.length;
    counter.textContent = `${len} / ${max}`;
    counter.classList.toggle('counter--warn', len >= Math.floor(max * WARN_AT));
}

/**
 * Подключает живой счётчик символов к одному полю textarea.
 *
 * @param {CounterConfig} config  конфигурация поля
 */
function attachCounter({id, max}) {
    const textarea = document.getElementById(id);
    if (!textarea) return;

    // Жёсткое ограничение на уровне DOM
    textarea.setAttribute('maxlength', String(max));

    // Создаём элемент счётчика
    const counter = document.createElement('span');
    counter.id = `${id}Counter`;
    counter.className = 'char-counter';
    counter.setAttribute('aria-live', 'polite');

    // Связываем поле со счётчиком для вспомогательных технологий
    const existing = textarea.getAttribute('aria-describedby');
    textarea.setAttribute(
        'aria-describedby',
        existing ? `${existing} ${counter.id}` : counter.id
    );

    // Вставляем счётчик сразу после textarea
    textarea.insertAdjacentElement('afterend', counter);

    // Инициализируем отображение и подписываемся на ввод
    updateCounter(textarea, counter, max);
    textarea.addEventListener('input', () => updateCounter(textarea, counter, max));
}

/**
 * Подключает счётчики ко всем настроенным полям.
 * Безопасно вызывать повторно - поля с уже существующим счётчиком пропускаются.
 */
export function initCounters() {
    COUNTER_FIELDS.forEach(config => {
        // Защита от повторной инициализации
        if (!document.getElementById(`${config.id}Counter`)) {
            attachCounter(config);
        }
    });
}