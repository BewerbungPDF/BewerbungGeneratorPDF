/**
 * main.js - точка входа.
 *
 * Ответственность:
 *   - Инициализация UI и счётчиков при DOMContentLoaded
 *   - Регистрация всех обработчиков событий
 *   - Делегирование бизнес-логики доменным модулям
 */

import {initUI, showMode} from './ui.js';
import {nextStep, prevStep} from './wizard.js';
import {initCounters} from './counters.js';
import {generateBewerbungPDF} from './pdf-bewerbung.js';
import {generateLebenslaufPDF} from './pdf-lebenslauf.js';

document.addEventListener('DOMContentLoaded', () => {

    // -- Первоначальная настройка --
    initUI();
    initCounters();

    // -- Делегированная обработка кликов по кнопкам --
    document.getElementById('mainContent')?.addEventListener('click', event => {
        const target = event.target instanceof Element ? event.target.closest('button') : null;
        if (!target) return;

        switch (target.id) {
            case 'btnChooseLebenslauf':
                showMode('lebenslauf');
                break;
            case 'btnChooseBewerbung':
                showMode('bewerbung');
                break;
            case 'btnNext':
                nextStep();
                break;
            case 'btnBack':
                prevStep();
                break;
            case 'downloadBewerbungBtn':
                generateBewerbungPDF(target);
                break;
            case 'downloadLebenslaufBtn':
                generateLebenslaufPDF(target);
                break;
        }
    });

});