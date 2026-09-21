# Publicity Material Generator

A focused, dependency-free HTML, CSS and JavaScript workflow for entering programme information, selecting publicity formats, generating content, editing posters and exporting results.

## Project structure

```text
index.html                 Browser entry point
app.js                     UI views, navigation, project workflow and poster editor
assets/seen-logo.png       Standard SEEN logo used on every poster
scripts/
  config.js                Shared labels, defaults and template configuration
  translation.js           Automatic translation client
  content-generator.js     Platform-specific publicity copy generation
styles/
  main.css                 Stylesheet entry point
  utilities.css            Small shared utility classes
src/styles.css             Main component and responsive styles
Start-Localhost.ps1        Local static server and translation proxy
Start Website.bat          One-click Windows launcher
```

## Open without installing anything

Double-click `Start-Website.ps1`, or double-click `index.html`. The application runs directly in your web browser and does not require Node.js, npm, an internet connection, or a server.

To use a localhost address, double-click `Start Website.bat` (or run `Start-Website.ps1`). Keep its terminal window open while using the application at `http://localhost:5173`.

## Content generation and languages

The application uses its built-in local content generator and requires no API key. Selecting Chinese automatically translates the programme wording through the MyMemory translation service. Internet access is required for translation. The browser uses the local translation proxy when available and falls back to the public translation endpoint on static hosting. Translations remain editable, are saved with the project, and appear together on bilingual posters.

## Development

No package installation or build command is required. Edit the HTML, JavaScript and CSS files directly, then refresh the localhost page.

## Privacy

Do not enter sensitive member information. Programme wording selected for automatic translation is sent to the configured translation service.
