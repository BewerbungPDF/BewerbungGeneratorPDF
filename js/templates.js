/**
 * Шаблоны Bewerbung.
 * Каждый шаблон принимает `practiceType` и `personalName` в момент рендеринга.
 *
 * @typedef {{ title: string, body: string }} BewerbungTemplate
 * @callback BewerbungTemplateFactory
 * @param {string} practiceType  наименование должности или вида практики
 * @param {string} personalName  полное имя соискателя
 * @returns {BewerbungTemplate}  случайно выбранный, заполненный шаблон
 */
export function getRandomBewerbung(practiceType, personalName) {
    /** @type {BewerbungTemplateFactory[]} */
    const templates = [
        (pt, pn) => ({
            title: `Bewerbung um die Stelle als ${pt}`,
            body:
                `Sehr geehrte Damen und Herren,

Hiermit bewerbe ich mich um die Stelle als "${pt}" in Ihrem Unternehmen. Die Möglichkeit, in Ihrem Unternehmen tätig zu sein, interessiert mich sehr, da ich gerne praktische Erfahrungen sammeln und meine Fähigkeiten weiterentwickeln möchte.

Ich arbeite zielstrebig, zuverlässig und mit großer Sorgfalt. Neue Aufgaben sehe ich als Chance, etwas Neues zu lernen und mich persönlich sowie fachlich weiterzuentwickeln. In der Schule habe ich gelernt, strukturiert zu arbeiten, Verantwortung für meine Aufgaben zu übernehmen und auch in stressigen Situationen den Überblick zu behalten.

Darüber hinaus bin ich belastbar, hilfsbereit und arbeite gerne mit anderen Menschen zusammen. Teamarbeit ist für mich sehr wichtig, da man gemeinsam oft bessere Ergebnisse erreichen kann. Gleichzeitig bin ich in der Lage, Aufgaben selbstständig und verantwortungsbewusst zu erledigen. Pünktlichkeit, Zuverlässigkeit und ein respektvoller Umgang mit anderen sind für mich selbstverständlich.

Durch schulische Projekte und praktische Erfahrungen habe ich gelernt, mich schnell an neue Situationen anzupassen und motiviert an neue Herausforderungen heranzugehen. Ich bin stets bereit, mein Bestes zu geben und neue Kenntnisse zu erwerben.

Ich würde mich sehr freuen, meine Motivation und Einsatzbereitschaft in Ihr Unternehmen einzubringen und gleichzeitig wertvolle Einblicke in die Arbeitswelt zu erhalten.

Über eine positive Rückmeldung und die Möglichkeit, mich persönlich bei Ihnen vorzustellen, freue ich mich sehr.

Mit freundlichen Grüßen,
${pn}`,
        }),

        (pt, pn) => ({
            title: `Bewerbung um die Position als ${pt} – Engagement und Teamfähigkeit`,
            body:
                `Sehr geehrte Damen und Herren,

die Position als "${pt}" spricht mich besonders an, da sie mir die Möglichkeit bietet, meine Fähigkeiten optimal einzubringen und mich fachlich weiterzuentwickeln. Ich habe bereits wertvolle Erfahrungen in den Bereichen Organisation, Projektmanagement und Kundenkommunikation gesammelt, die ich nun gezielt in Ihrem Unternehmen einsetzen möchte.

Ich zeichne mich durch Verantwortungsbewusstsein, Engagement und Teamfähigkeit aus. Gleichzeitig arbeite ich eigenständig, strukturiert und lösungsorientiert. Meine Flexibilität und Lernbereitschaft ermöglichen es mir, mich schnell in neue Aufgabenfelder einzuarbeiten und effizient zum Unternehmenserfolg beizutragen.

Besonders wichtig ist mir, meine theoretischen Kenntnisse praxisnah anzuwenden und kontinuierlich auszubauen. Ich bin motiviert, aktiv neue Herausforderungen anzunehmen und Verantwortung zu übernehmen. Durch meine offene und kommunikative Art integriere ich mich schnell in Teams und trage zu einem positiven Arbeitsklima bei.

Gerne würde ich Sie in einem persönlichen Gespräch von meiner Motivation, meinen Fähigkeiten und meinem Engagement überzeugen.

Mit freundlichen Grüßen,
${pn}`,
        }),

        (pt, pn) => ({
            title: `Bewerbung als ${pt} – Motivation und Zuverlässigkeit`,
            body:
                `Sehr geehrte Damen und Herren,

mit großem Interesse habe ich erfahren, dass Sie eine Stelle als "${pt}" anbieten. Hiermit möchte ich mich dafür bewerben.

Ich bin eine motivierte und verantwortungsbewusste Person, die großen Wert auf Zuverlässigkeit und Genauigkeit legt.

Besonders wichtig sind mir Pünktlichkeit, Lernbereitschaft und ein respektvoller Umgang miteinander. Ich bin bereit, mich schnell in neue Aufgabenbereiche einzuarbeiten und mein Bestes für Ihr Unternehmen zu geben.

Über eine Einladung zu einem persönlichen Gespräch würde ich mich sehr freuen.

Mit freundlichen Grüßen,
${pn}`,
        }),

        (pt, pn) => ({
            title: `Bewerbung um die Stelle als ${pt} – Zielstrebigkeit und Engagement`,
            body:
                `Sehr geehrte Damen und Herren,

hiermit möchte ich mich um die Stelle als "${pt}" bewerben.

Ich zeichne mich durch eine zielstrebige und sorgfältige Arbeitsweise aus. Neue Aufgaben motivieren mich, da ich mich gerne weiterentwickle und Verantwortung übernehme. In der Schule sowie bei praktischen Tätigkeiten habe ich gelernt, strukturiert zu arbeiten und auch unter Zeitdruck den Überblick zu behalten.

Ich bin belastbar, hilfsbereit und arbeite sowohl selbstständig als auch im Team effektiv. Es ist mir wichtig, zuverlässig zu sein und vereinbarte Aufgaben termingerecht zu erfüllen. Gerne möchte ich meine Fähigkeiten in Ihrem Unternehmen einbringen und weiter ausbauen.

Über eine positive Rückmeldung und die Möglichkeit eines persönlichen Gesprächs freue ich mich sehr.

Mit freundlichen Grüßen,
${pn}`,
        }),

        (pt, pn) => ({
            title: `Interesse an der Position als ${pt} – Konzentration und Verantwortungsbewusstsein`,
            body:
                `Sehr geehrte Damen und Herren,

auf diesem Weg möchte ich mein Interesse an der Stelle als "${pt}" in Ihrem Unternehmen zum Ausdruck bringen.

Ich arbeite konzentriert, verantwortungsbewusst und mit klarer Zielorientierung. Aufgaben gehe ich strukturiert an und bemühe mich stets, qualitativ gute Ergebnisse zu erzielen. Dabei ist es für mich selbstverständlich, zuverlässig zu handeln und Absprachen einzuhalten. Neue Herausforderungen sehe ich als Chance, meine Kenntnisse zu erweitern und mich persönlich weiterzuentwickeln.

Durch meine offene und respektvolle Art integriere ich mich schnell in ein Team und trage zu einer angenehmen Zusammenarbeit bei. Gleichzeitig bin ich in der Lage, eigenständig Entscheidungen zu treffen und Verantwortung zu übernehmen.

Gerne würde ich Sie in einem persönlichen Gespräch von meiner Motivation überzeugen.

Mit freundlichen Grüßen,
${pn}`,
        }),

        (pt, pn) => ({
            title: `Bewerbung um die Position als ${pt} – Engagement und Lernbereitschaft`,
            body:
                `Sehr geehrte Damen und Herren,

mit großem Interesse bewerbe ich mich bei Ihnen um die Position als "${pt}".

Ich bin eine engagierte und lernbereite Persönlichkeit, die ihre Aufgaben mit Sorgfalt und Verantwortungsbewusstsein erfüllt. Eine zuverlässige und genaue Arbeitsweise ist für mich selbstverständlich. Dabei lege ich Wert auf klare Kommunikation und eine konstruktive Zusammenarbeit im Team.

Besonders motiviert mich die Möglichkeit, praktische Erfahrungen zu sammeln und meine Fähigkeiten weiterzuentwickeln. Ich arbeite selbstständig, bleibe auch in anspruchsvollen Situationen ruhig und verliere meine Ziele nicht aus dem Blick.

Über die Gelegenheit, mich persönlich bei Ihnen vorzustellen, würde ich mich sehr freuen.

Mit freundlichen Grüßen,
${pn}`,
        }),

        (pt, pn) => ({
            title: `Motivierte Bewerbung als ${pt} – Zuverlässigkeit und Engagement`,
            body:
                `Sehr geehrte Damen und Herren,

hiermit übersende ich Ihnen meine Bewerbung für die Stelle als "${pt}".

Ich bin motiviert, leistungsbereit und stets daran interessiert, meine Fähigkeiten weiterzuentwickeln. Aufgaben übernehme ich mit Verantwortungsbewusstsein und erledige sie sorgfältig sowie termingerecht. Eine strukturierte Planung und ein effizientes Arbeiten sind für mich selbstverständlich.

Durch meine offene Art finde ich mich schnell in neue Teams ein und schätze eine respektvolle Zusammenarbeit. Gleichzeitig arbeite ich selbstständig und behalte auch bei mehreren Aufgaben den Überblick. Mein Ziel ist es, aktiv zum Erfolg Ihres Unternehmens beizutragen und dabei wertvolle praktische Erfahrungen zu sammeln.

Gerne erläutere ich meine Motivation in einem persönlichen Gespräch näher.

Mit freundlichen Grüßen,
${pn}`,
        }),

        (pt, pn) => ({
            title: `Zuverlässige und zielorientierte Bewerbung als ${pt}`,
            body:
                `Sehr geehrte Damen und Herren,

hiermit bewerbe ich mich um die Position als "${pt}" in Ihrem Unternehmen.

Ich bin eine zuverlässige und zielorientierte Person, die großen Wert auf Genauigkeit und Einsatzbereitschaft legt. Neue Aufgaben nehme ich mit Motivation an und arbeite mich schnell in unbekannte Themen ein. Dabei handle ich stets verantwortungsvoll und organisiert.

Ein respektvolles Auftreten sowie Teamfähigkeit sind für mich selbstverständlich. Gleichzeitig arbeite ich konzentriert und selbstständig, um gesetzte Ziele effizient zu erreichen. Es motiviert mich, aktiv zum Erfolg Ihres Unternehmens beizutragen und mich fachlich wie persönlich weiterzuentwickeln.

Über eine Einladung zu einem persönlichen Gespräch freue ich mich sehr.

Mit freundlichen Grüßen,
${pn}`,
        }),

        (pt, pn) => ({
            title: `Bewerbung für die Position als ${pt}`,
            body:
                `Sehr geehrte Damen und Herren,

Hiermit möchte ich mich um die Stelle als "${pt}" in Ihrem Unternehmen bewerben. Die ausgeschriebene Position spricht mich besonders an, da ich die Chance sehe, neue Erfahrungen zu sammeln und meine Fähigkeiten praktisch einzusetzen.

Ich bin eine engagierte und lernbereite Person. In der Schule habe ich gelernt, organisiert und sorgfältig zu arbeiten, Aufgaben termingerecht zu erledigen und auch unter Druck den Überblick zu behalten. Neue Herausforderungen motivieren mich, weil ich dabei die Möglichkeit habe, mich weiterzuentwickeln und Verantwortung zu übernehmen.

Teamarbeit macht mir großen Spaß, da ich den Austausch mit anderen Menschen schätze und überzeugt bin, dass man gemeinsam bessere Ergebnisse erzielen kann. Gleichzeitig bin ich in der Lage, Aufgaben selbstständig und zuverlässig zu erledigen. Freundlichkeit, Hilfsbereitschaft und Pünktlichkeit gehören zu meinen Stärken.

Über eine Einladung zu einem persönlichen Gespräch würde ich mich sehr freuen.

Mit freundlichen Grüßen,
${pn}`,
        }),

        (pt, pn) => ({
            title: `Bewerbung um die Position als ${pt}`,
            body:
                `Sehr geehrte Damen und Herren,

mit großem Interesse habe ich Ihre Stellenausschreibung für die Position als "${pt}" gelesen. Ich möchte mich hiermit um diese Stelle bewerben, da sie mir die Möglichkeit bietet, meine Kenntnisse und Fähigkeiten optimal einzubringen und weiterzuentwickeln.

Ich arbeite sorgfältig, zuverlässig und zielorientiert. Neue Aufgaben motivieren mich, da ich gerne lerne und mich sowohl persönlich als auch fachlich weiterentwickeln möchte. Während meiner schulischen und praktischen Erfahrungen habe ich gelernt, strukturiert zu arbeiten, Verantwortung zu übernehmen und sowohl eigenständig als auch im Team effizient zu agieren.

Besonders wichtig sind mir Pünktlichkeit, Teamarbeit und ein respektvoller Umgang mit anderen Menschen. Ich bin überzeugt, dass ich durch meine Motivation, Lernbereitschaft und Einsatzbereitschaft Ihr Team bereichern kann.

Über die Gelegenheit, mich persönlich bei Ihnen vorzustellen, würde ich mich sehr freuen.

Mit freundlichen Grüßen,
${pn}`,
        }),

        (pt, pn) => ({
            title: `Bewerbung als ${pt}`,
            body:
                `Sehr geehrte Damen und Herren,

hiermit möchte ich mich um die Stelle als "${pt}" in Ihrem Unternehmen bewerben. Die ausgeschriebene Position hat mein Interesse geweckt, da ich die Möglichkeit sehe, praktische Erfahrungen zu sammeln und meine Fähigkeiten gezielt einzubringen.

Ich arbeite zuverlässig, strukturiert und engagiert. Neue Aufgaben motivieren mich besonders, da ich stets bestrebt bin, mich fachlich und persönlich weiterzuentwickeln. Während meiner schulischen und praktischen Tätigkeiten habe ich gelernt, Aufgaben gewissenhaft und eigenverantwortlich zu erledigen sowie effektiv im Team zusammenzuarbeiten.

Meine Stärken liegen in meiner Lernbereitschaft, Belastbarkeit und meinem respektvollen Umgang mit Kollegen. Ich bin überzeugt, dass ich Ihr Team tatkräftig unterstützen und einen positiven Beitrag leisten kann.

Über eine Einladung zu einem persönlichen Gespräch freue ich mich sehr.

Mit freundlichen Grüßen,
${pn}`,
        }),

        (pt, pn) => ({
            title: `Motivationsschreiben für die Stelle als ${pt}`,
            body:
                `Sehr geehrte Damen und Herren,

mit diesem Schreiben möchte ich mich für die Stelle als "${pt}" in Ihrem Unternehmen vorstellen.

Ich arbeite gewissenhaft, diszipliniert und mit hoher Einsatzbereitschaft. Mir ist es wichtig, Aufgaben nicht nur zu erfüllen, sondern sie zuverlässig und sorgfältig umzusetzen. Herausforderungen motivieren mich besonders, da ich dadurch meine Fähigkeiten erweitern und neue Erfahrungen sammeln kann.

Ich bin teamorientiert, respektvoll im Umgang mit anderen und gleichzeitig in der Lage, selbstständig Verantwortung zu übernehmen. Pünktlichkeit und Verlässlichkeit sehe ich als grundlegende Voraussetzungen für eine erfolgreiche Zusammenarbeit.

Gerne würde ich meine Motivation und meine Stärken in einem persönlichen Gespräch näher erläutern.

Mit freundlichen Grüßen,
${pn}`,
        }),
    ];

    // Выбираем случайную фабричную функцию и вызываем её с переданными параметрами
    /** @type {BewerbungTemplateFactory} */
    const factory = templates[Math.floor(Math.random() * templates.length)] || templates[0];
    return factory(practiceType, personalName);
}