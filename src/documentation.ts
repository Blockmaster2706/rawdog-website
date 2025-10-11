export const documentationContent = `Dokumentieren Sie in fünf Stichpunkten Ihr Vorgehen:
o Wie sind Sie Schritt für Schritt vorgegangen?
- Zunächst habe ich die Anforderungen analysiert und die notwendigen Schritte geplant. Dann habe ich ein Github Projekt aufgesetzt und die nötigen Dependencies installiert, da ich TypeScript und TailwindCSS nutzen wollte. Desweiteren habe ich ein Github Pages Deployment eingerichtet um einen Stand der Seite zu haben den ich einfach teilen kann.
- Danach habe ich die Grundstruktur der Website mit HTML und CSS erstellt, und mir überlegt wie meine Seite aussehen soll.
- Anschließend begann ich mit TypeScript die Funktionalität der Seite zu implementieren, wobei ich mich schnell dazu entschied doch kein Tailwind zu nutzen (Für die Challenge).
- Aufgrund der steigenden Komplexität der Dateistruktur habe ich mich entschieden Modulbasiert zu entwickeln, und Cypresstests hinzuzuziehen um sicherzustellen, dass ich während der Entwicklung keine Funktionalität kaputt mache.
- Abschließend habe ich die Seite optisch verbessert und letzte Tests durchgeführt, um sicherzustellen, dass alles wie gewünscht funktioniert. 
o Was ist Ihnen besonders leicht gefallen?
- Besonders leicht viel mir das erstellen der Oberfläche selbst, da ich mit CSS und HTML recht vertraut bin. Schwieriger war es, ein gutes Design für die Seite zu finden, da ich kein Designer bin, allerdings war auch dies recht einfach. 
o Wo sind Probleme aufgetreten? Wie haben Sie diese gelöst?
- Besondere Probleme traten anfangs aufgrund des Fehlen eines Webservers auf, da man ohne diese keine module imports verwenden kann, ich allerdings auf diese angewiesen war um die Lesbarkeit der Dateien zu gewährleisten. Dieses Problem löste ich während der Entwicklung mit einem einfachen Live Server Plugin in VSCode, und später testete ich es auch mit XAMPP. GitHub Pages stellt ein gutes Backup falls etwas schief geht dar.
o Welche Qualitätsmerkmale für Benutzerfreundlichkeit haben Sie umgesetzt?
- Nunja, nicht besonders viele. Ich versuchte Text lesbar zu halten, kontrastreiche Farben zu verwenden, und Größen dynamisch und unabhängig von der Bildschirmgröße zu gestalten. Abseits davon sollte die Seite für mich persönlich ansprechend aussehen, und an ein Unix Terminal erinnern, weshalb ich keine speziellen UI/UX Prinzipien angewendet oder auf besonders einfache Benutzerführung geachtet habe. Es gibt jedoch einige Hilfetexte um den Benutzer zu unterstützen.
o Welche offenen Fragen oder Verbesserungsmöglichkeiten sehen Sie?
- Ich denke man könnte die Seite noch mit ein paar Befehlen mehr erweitern, sowie sicherstellen dass sie auch auf Mobilgeräten gut aussieht und sowohl den hellen als auch den dunklen Modus unterstützt.
`;
