# Allgemeiner Turniergenerator - Anforderungen

## Zielbild

Die App soll von einer Strongman-spezifischen Punkteverwaltung zu einem allgemeinen Turniergenerator erweitert werden. Nutzer sollen beim Erstellen eines Turniers eine Turnierart auswählen, Teilnehmer erfassen, Paarungen generieren, Ergebnisse eintragen und eine Rangliste bzw. einen Turnierbaum anzeigen können.

Die bestehende Strongman-Logik bleibt als eigener Turniertyp erhalten, soll aber langfristig neben den neuen generischen Turnierarten stehen.

## Gemeinsame Anforderungen

### Turniererstellung

- Nutzer können einen Turniernamen, eine Turnierart und eine Teilnehmerliste erfassen.
- Turniernamen müssen weiterhin eindeutig sein.
- Teilnehmernamen müssen innerhalb eines Turniers eindeutig und nicht leer sein.
- Die App muss vor Turnierstart prüfen, ob die Teilnehmeranzahl zur gewählten Turnierart passt.
- Turniere sollen als Entwurf gespeichert werden können, bevor Paarungen generiert wurden.
- Nach dem Start eines Turniers sollen Änderungen an der Teilnehmerliste nur noch über explizite Korrektur-/Reset-Aktionen möglich sein.

### Gemeinsames Datenmodell

- Es braucht ein generisches `Tournament`-Modell für:
  - Turnierart
  - Teilnehmer
  - Runden
  - Matches
  - Match-Ergebnisse
  - Tabellenstände bzw. Platzierungen
  - Turnierstatus: Entwurf, läuft, abgeschlossen
- Ein `Match` soll mindestens enthalten:
  - eindeutige Match-ID
  - Runde bzw. Phase
  - Teilnehmer A
  - Teilnehmer B
  - Ergebnis
  - Gewinner
  - Status: offen, abgeschlossen, Freilos
- Freilose müssen explizit modelliert werden, damit ungerade Teilnehmerzahlen nicht zu kaputten Paarungen führen.

### Ergebnisverwaltung

- Ergebnisse können pro Match eingetragen und nachträglich korrigiert werden.
- Ein Match kann nur abgeschlossen werden, wenn ein gültiges Ergebnis oder ein Gewinner gesetzt ist.
- Ergebnisvalidierung soll je Turnierart gleich funktionieren, z. B. keine negativen Scores und kein Gewinner ohne Teilnehmer.
- Optional sollen Unentschieden erlaubt oder verboten werden können, abhängig vom Turnierformat.

### Darstellung

- Jede Turnierart braucht eine passende Hauptansicht:
  - Turnierbaum für KO- und Doppel-KO-Turniere
  - Tabelle und Spielplan für Rundenturnier
  - Rundenliste, Paarungen und Tabelle für Schweizer System
- Jede Turnierart braucht eine Ergebnisseite mit Endplatzierungen.
- Navigation soll weiterhin URL-sicher mit kodierten Turniernamen funktionieren.

### Persistenz

- Alle neuen Turnierarten müssen über die bestehende Persistence-Schicht gespeichert und geladen werden.
- Bestehende gespeicherte Strongman-Turniere dürfen nicht brechen.
- Falls das Datenmodell erweitert wird, braucht es sinnvolle Defaults beim Laden alter Daten.

### Tests

- Für jede Turnierart müssen Tests für Paarungserzeugung, Ergebnisverarbeitung und Platzierungsberechnung angelegt werden.
- Edge Cases müssen abgedeckt werden:
  - ungerade Teilnehmerzahlen
  - minimale Teilnehmeranzahl
  - ungültige Ergebnisse
  - Korrektur eines bereits eingetragenen Ergebnisses
  - Abschluss des Turniers

## Turnierart: KO-Turnier

### Beschreibung

Ein KO-Turnier besteht aus direkten Ausscheidungsspielen. Der Gewinner eines Matches kommt in die nächste Runde, der Verlierer scheidet aus. Optional kann vor dem KO-Baum eine Gruppenphase gespielt werden.

### Anforderungen ohne Gruppenphase

- Die Teilnehmer werden in einen Turnierbaum gesetzt.
- Teilnehmeranzahlen, die keine Zweierpotenz sind, müssen durch Freilose ausgeglichen werden.
- Die App generiert Runden wie Achtelfinale, Viertelfinale, Halbfinale und Finale abhängig von der Teilnehmerzahl.
- Nach Eintragung eines Match-Gewinners wird der Gewinner automatisch in das nächste Match übernommen.
- Das Finale bestimmt Platz 1 und Platz 2.
- Optional soll ein Spiel um Platz 3 aktiviert werden können.
- Das Turnier ist abgeschlossen, wenn das Finale abgeschlossen ist und alle aktivierten Platzierungsspiele beendet sind.

### Anforderungen mit Gruppenphase

- Die Gruppenphase ist beim Erstellen optional aktivierbar.
- Nutzer können die Anzahl der Gruppen konfigurieren.
- Teilnehmer werden möglichst gleichmäßig auf Gruppen verteilt.
- Innerhalb jeder Gruppe spielt jeder gegen jeden.
- Gruppentabellen berechnen Punkte, Siege, Niederlagen, Unentschieden und Score-Differenz.
- Nutzer können konfigurieren, wie viele Teilnehmer pro Gruppe in die KO-Phase einziehen.
- Bei Gleichstand braucht es definierte Tie-Breaker:
  - Punkte
  - Score-Differenz
  - erzielte Scores
  - direkter Vergleich, falls verfügbar
  - manuelle Entscheidung als letzter Ausweg
- Nach Abschluss der Gruppenphase wird der KO-Baum aus den qualifizierten Teilnehmern erzeugt.

### Validierung

- Ohne Gruppenphase sind mindestens 2 Teilnehmer erforderlich.
- Mit Gruppenphase sind mindestens 2 Gruppen und genügend Teilnehmer für sinnvolle Gruppen erforderlich.
- Die Anzahl qualifizierter Teilnehmer muss in den KO-Baum passen; falls nötig werden Freilose erzeugt.

## Turnierart: Rundenturnier

### Beschreibung

Im Rundenturnier spielt jeder Teilnehmer gegen jeden anderen Teilnehmer. Die Rangliste entsteht aus den gesammelten Ergebnissen.

### Anforderungen

- Die App generiert automatisch alle Paarungen.
- Jede Paarung kommt genau einmal vor.
- Optional soll eine Hin- und Rückrunde unterstützt werden.
- Bei ungerader Teilnehmerzahl erhält pro Runde ein Teilnehmer spielfrei.
- Die App zeigt:
  - Spielplan nach Runden
  - Tabelle
  - offene und abgeschlossene Matches
- Die Tabelle berechnet:
  - Spiele
  - Siege
  - Unentschieden
  - Niederlagen
  - Punkte
  - erzielte Scores
  - erhaltene Scores
  - Score-Differenz
- Die Standardwertung soll konfigurierbar sein, z. B. 3 Punkte für Sieg, 1 Punkt für Unentschieden, 0 Punkte für Niederlage.
- Das Turnier ist abgeschlossen, wenn alle Paarungen abgeschlossen sind.

### Tie-Breaker

- Punkte
- Score-Differenz
- erzielte Scores
- direkter Vergleich, falls eindeutig
- manuelle Entscheidung als letzter Ausweg

### Validierung

- Mindestens 2 Teilnehmer erforderlich.
- Bei Rückrunde muss die App doppelte Paarungen bewusst als Hin- und Rückspiel kennzeichnen.

## Turnierart: Schweizer System

### Beschreibung

Im Schweizer System spielen Teilnehmer eine feste Anzahl von Runden. Teilnehmer mit ähnlicher aktueller Punktzahl werden gegeneinander gepaart. Nicht jeder spielt gegen jeden.

### Anforderungen

- Nutzer legt beim Erstellen die Anzahl der Runden fest.
- Die App empfiehlt eine Rundenzahl abhängig von der Teilnehmerzahl, z. B. grob `ceil(log2(Teilnehmerzahl))`.
- Runde 1 wird zufällig oder nach Setzliste gepaart.
- Ab Runde 2 werden Teilnehmer nach aktuellem Stand gruppiert und gegen möglichst gleich starke Gegner gepaart.
- Kein Paar soll mehrfach vorkommen, solange Alternativen möglich sind.
- Bei ungerader Teilnehmerzahl erhält ein Teilnehmer ein Freilos.
- Ein Teilnehmer darf höchstens ein Freilos im Turnier erhalten, solange vermeidbar.
- Freilos zählt als Sieg bzw. als konfigurierbare Punktzahl.
- Nach jeder abgeschlossenen Runde kann die nächste Runde generiert werden.
- Bereits generierte Runden dürfen nur zurückgesetzt werden, wenn dadurch keine späteren Ergebnisse inkonsistent bleiben.

### Tabelle

- Die Tabelle berechnet:
  - Punkte
  - Siege
  - Unentschieden
  - Niederlagen
  - Buchholz-Wertung oder vergleichbare Gegnerstärke-Wertung
  - Score-Differenz
- Tie-Breaker:
  - Punkte
  - Buchholz
  - Score-Differenz
  - erzielte Scores
  - manuelle Entscheidung

### Validierung

- Mindestens 4 Teilnehmer empfohlen, mindestens 2 technisch erlaubt.
- Rundenzahl darf nicht negativ oder null sein.
- Die Rundenzahl darf nicht so hoch sein, dass Wiederholungen unvermeidbar werden, ohne dass die App den Nutzer warnt.

## Turnierart: Doppel-KO-System

### Beschreibung

Im Doppel-KO-System scheidet ein Teilnehmer erst nach zwei Niederlagen aus. Es gibt einen Gewinnerbaum und einen Verliererbaum. Der Sieger des Verliererbaums spielt im Finale gegen den Sieger des Gewinnerbaums.

### Anforderungen

- Die App erzeugt einen Gewinnerbaum.
- Verlierer aus dem Gewinnerbaum werden automatisch in die passende Runde des Verliererbaums verschoben.
- Verlierer im Verliererbaum scheiden aus.
- Gewinner im Verliererbaum bleiben im Verliererbaum, bis sie das Loser-Bracket-Finale gewinnen.
- Das Grand Final besteht aus:
  - Gewinner Gewinnerbaum gegen Gewinner Verliererbaum
  - optionalem Bracket-Reset-Finale, falls der Gewinner aus dem Verliererbaum das erste Grand Final gewinnt
- Die App muss klar anzeigen:
  - Gewinnerbaum
  - Verliererbaum
  - ausgeschiedene Teilnehmer
  - aktuelle Niederlagenanzahl je Teilnehmer
- Freilose müssen im Gewinnerbaum unterstützt werden.
- Das Turnier ist abgeschlossen, wenn das Grand Final entschieden ist und ein möglicher Bracket Reset abgeschlossen wurde.

### Platzierungen

- Platz 1 und 2 ergeben sich aus dem Grand Final.
- Weitere Platzierungen ergeben sich aus der Ausscheidungsrunde im Verliererbaum.
- Teilnehmer, die in derselben Verliererbaumrunde ausscheiden, können gleiche Platzierungen erhalten oder nach Zusatzkriterien sortiert werden.

### Validierung

- Mindestens 2 Teilnehmer erforderlich.
- Die App muss verhindern, dass ein Teilnehmer nach zwei Niederlagen erneut in ein Match gesetzt wird.
- Match-Ergebnisse im Gewinnerbaum müssen die Folgeplatzierung im Verliererbaum konsistent aktualisieren.

## Technische Umsetzungshinweise

### Vorgeschlagene Architektur

- Turnierlogik pro Turnierart in eigene Module auslagern, z. B.:
  - `logic/knockoutTournament`
  - `logic/roundRobinTournament`
  - `logic/swissTournament`
  - `logic/doubleEliminationTournament`
- Gemeinsame Match-, Round- und Standing-Typen in `src/types` definieren.
- UI-Komponenten nach Turnierart trennen, aber gemeinsame Komponenten für Match-Karten, Tabellen und Ergebnisformulare wiederverwenden.
- Persistence-Schicht beibehalten und nur um Migration/Defaults erweitern.

### Nicht-Ziele für den ersten Ausbauschritt

- Keine Online-Synchronisation.
- Keine Benutzerkonten.
- Kein Import/Export.
- Keine komplexen Setzlisten-Algorithmen über einfache manuelle oder zufällige Setzung hinaus.
- Keine automatischen Zeitpläne mit Uhrzeiten oder Spielorten.

## Empfohlene Implementierungsreihenfolge

1. Gemeinsames generisches Turniermodell und Match-Modell einführen.
2. Rundenturnier implementieren, da es die einfachste Tabellenlogik hat.
3. KO-Turnier ohne Gruppenphase implementieren.
4. KO-Turnier mit Gruppenphase ergänzen.
5. Schweizer System implementieren.
6. Doppel-KO-System implementieren.
7. Bestehende Strongman-Ansicht in die neue Turnierart-Auswahl integrieren.
