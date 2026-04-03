/**
 * wizard.js - навигация по многошаговой форме.
 *
 * Каждый режим (bewerbung / lebenslauf) имеет собственный упорядоченный список шагов.
 * Мастер отображает прогресс-бар и управляет кнопками «Назад» / «Далее».
 * Бизнес-логика в модуле отсутствует - он только показывает и скрывает панели шагов.
 *
 * Требования к HTML для каждого режима:
 *   - Панели шагов: [data-step="1"], [data-step="2"], … внутри контейнера формы
 *   - Кнопка «Назад»: id="btnBack"
 *   - Кнопка «Далее»: id="btnNext" (скрыта на последнем шаге, заменяется кнопкой загрузки)
 *   - Прогресс-бар: id="wizardProgressBar"
 *   - Метка шага: id="wizardStepLabel"
 *   - Баннер ошибок: id="wizardValidationError"
 */

/** @type {{ bewerbung: string[], lebenslauf: string[] }} */
const STEP_LABELS = {
    bewerbung: ['Firmendaten', 'Persönliche Daten'],
    lebenslauf: ['Persönliche Daten', 'Ausbildung & Fähigkeiten'],
};

/** @type {'bewerbung'|'lebenslauf'|null} */
let currentMode = null;

/** @type {number} нумерация с 1 */
let currentStep = 1;

/**
 * @param {Element} el
 * @returns {el is HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement}
 */
function isFormField(el) {
    return el instanceof HTMLInputElement
        || el instanceof HTMLSelectElement
        || el instanceof HTMLTextAreaElement;
}

/**
 * Возвращает общее количество шагов для активного режима.
 * @returns {number}
 */
function totalSteps() {
    return STEP_LABELS[currentMode]?.length ?? 1;
}

/**
 * Возвращает все панели шагов контейнера активного режима.
 * @returns {HTMLElement[]}
 */
function getStepPanels() {
    const container = document.getElementById(
        currentMode === 'bewerbung' ? 'bewerbungFields' : 'lebenslaufFields'
    );
    if (!container) return [];
    /** @type {HTMLElement[]} */
    const panels = Array.from(container.querySelectorAll('[data-step]'))
        .filter(el => el instanceof HTMLElement);

    return panels
        .sort((a, b) => Number(a.dataset.step) - Number(b.dataset.step));
}

/**
 * Возвращает панель шага по его порядковому номеру (нумерация с 1).
 * @param {number} step  номер шага
 * @returns {HTMLElement|null}
 */
function getStepPanel(step) {
    return getStepPanels().find(p => Number(p.dataset.step) === step) ?? null;
}

// ----------------------------------
// Валидация
// ----------------------------------

/**
 * Проверяет все обязательные и паттерн-поля внутри указанной панели.
 * Помечает некорректные поля классом `is-invalid` для визуальной индикации.
 *
 * @param {Element} panel  панель шага для валидации
 * @returns {string|null}  первое сообщение об ошибке или null при успехе
 */
function validatePanel(panel) {
    if (!panel) return null;

    // Сбрасываем предыдущее состояние ошибок внутри панели
    panel.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

    const fields = Array.from(
        panel.querySelectorAll('[aria-required="true"], [required]')
    ).filter(isFormField);

    for (const field of fields) {
        const value = field.value.trim();

        const isBirthDateField = ['cvBirthDay', 'cvBirthMonth', 'cvBirthYear'].includes(field.id);

        // Проверка на заполненность
        if (!value) {
            field.classList.add('is-invalid');
            field.focus();
            if (isBirthDateField) {
                return 'Bitte gib dein Geburtsdatum vollständig an.';
            }
            const label = panel.querySelector(`label[for="${field.id}"]`);
            const labelText = typeof label?.textContent === 'string' ? label.textContent.trim() : '';
            const placeholder = (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)
                ? field.placeholder
                : '';
            const name = labelText || placeholder || field.id || 'Feld';
            return `Bitte fülle das Feld "${name}" aus.`;
        }
    }

    // Валидация номера телефона (активируется атрибутом data-validate="phone")
    const phoneFields = panel.querySelectorAll('[data-validate="phone"]');
    for (const field of phoneFields) {
        if (!isFormField(field)) continue;
        const value = field.value.trim();
        // Допустимые символы: цифры, +, -, пробелы, скобки; минимум 6 цифр
        const digitCount = (value.match(/\d/g) ?? []).length;
        if (value && (!/^[+\d\s\-().]+$/.test(value) || digitCount < 6)) {
            field.classList.add('is-invalid');
            field.focus();
            return 'Telefonnummer darf nur Ziffern, +, -, Leerzeichen und Klammern enthalten.';
        }
    }

    return null;
}

/**
 * Показывает или скрывает баннер ошибок валидации текущего шага.
 * @param {string|null} message  текст ошибки или null для сброса
 */
function setStepError(message) {
    const el = document.getElementById('wizardValidationError');
    if (!el) return;
    if (message) {
        el.textContent = message;
        el.hidden = false;
    } else {
        el.textContent = '';
        el.hidden = true;
    }
}

// ----------------------------------
// Рендеринг
// ----------------------------------

/**
 * Обновляет прогресс-бар и метку шага в соответствии с `currentStep`.
 */
function renderProgress() {
    const label = document.getElementById('wizardStepLabel');
    const bar = document.getElementById('wizardProgressBar');
    const total = totalSteps();
    const pct = Math.round((currentStep / total) * 100);
    const stepName = STEP_LABELS[currentMode]?.[currentStep - 1] ?? '';

    if (label) {
        label.textContent = `Schritt ${currentStep} von ${total}: ${stepName}`;
    }
    if (bar) {
        bar.style.width = `${pct}%`;
        bar.setAttribute('aria-valuenow', String(currentStep));
        bar.setAttribute('aria-valuemax', String(total));
    }
}

/**
 * Возвращает интерфейс к приветственному экрану.
 */
function showWelcomeScreen() {
    const welcome = document.getElementById('welcome');
    const formShell = document.getElementById('formShell');

    if (formShell) formShell.hidden = true;
    if (welcome) welcome.hidden = false;

    document.getElementById('btnChooseLebenslauf')?.focus({preventScroll: false});
}

/**
 * Отображает панель `currentStep` и скрывает все остальные.
 * Переводит фокус на первый интерактивный элемент или заголовок активной панели.
 */
function renderStepPanels() {
    getStepPanels().forEach(panel => {
        const isActive = Number(panel.dataset.step) === currentStep;
        panel.hidden = !isActive;

        if (isActive) {
            const focusTarget = panel.querySelector('input, select, textarea, h2, h3, [tabindex]');
            if (focusTarget instanceof HTMLElement) {
                focusTarget.focus({preventScroll: false});
            }
        }
    });
}

/**
 * Обновляет видимость и атрибуты кнопок «Назад» / «Далее».
 */
function renderButtons() {
    const btnBack = document.getElementById('btnBack');
    const btnNext = document.getElementById('btnNext');
    const total = totalSteps();
    const isLastStep = currentStep >= total;

    if (btnBack) {
        btnBack.hidden = false;
        // На первом шаге кнопка возвращает к экрану выбора, а не к предыдущему шагу
        btnBack.setAttribute(
            'aria-label',
            currentStep === 1 ? 'Zurück zur Auswahl' : 'Zurück zum vorherigen Schritt'
        );
    }
    if (btnNext) {
        btnNext.hidden = isLastStep;
        btnNext.style.display = isLastStep ? 'none' : '';
    }
}

/**
 * Полный цикл рендеринга - вызывается после любого изменения состояния.
 */
function render() {
    setStepError(null);
    renderProgress();
    renderStepPanels();
    renderButtons();
}

// ----------------------------------
// Публичный API навигации
// ----------------------------------

/**
 * Переходит к следующему шагу только при успешной валидации текущего.
 */
export function nextStep() {
    if (currentStep >= totalSteps()) return;

    const panel = getStepPanel(currentStep);
    const error = validatePanel(panel);
    if (error) {
        setStepError(error);
        return;
    }

    currentStep++;
    render();
}

/**
 * Возвращается на один шаг назад или на приветственный экран с первого шага.
 */
export function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        render();
    } else if (currentStep === 1) {
        showWelcomeScreen();
    }
}

/**
 * Инициализирует мастер для заданного режима, сбрасывая состояние на первый шаг.
 *
 * @param {'bewerbung'|'lebenslauf'} mode  режим документа
 */
export function initWizard(mode) {
    currentMode = mode;
    currentStep = 1;
    render();
}