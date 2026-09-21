'use strict';

let translationTimer;

function scheduleTranslations() {
  clearTimeout(translationTimer);
  translationTimer = setTimeout(() => {
    syncForm();
    (info.languages || []).filter(language => language !== 'English').forEach(language => autoTranslate(language, true));
  }, 900);
}

function updateTranslationCard(language, translations) {
  Object.entries(translations).forEach(([field, value]) => {
    const input = document.querySelector(`[name="translation:${language}:${field}"]`);
    if (input) input.value = value || '';
  });
  const card = document.querySelector(`[name="translation:${language}:title"]`)?.closest('.translation-card');
  const status = card?.querySelector(':scope > div > span');
  if (status) status.textContent = 'Auto translated';
}

function setTranslationStatus(language, message) {
  const card = document.querySelector(`[name="translation:${language}:title"]`)?.closest('.translation-card');
  const status = card?.querySelector(':scope > div > span');
  if (status) status.textContent = message;
}

async function autoTranslate(language, quiet = false) {
  if (language === 'English') return;
  if (!quiet) toast(`Translating to ${language}…`);
  setTranslationStatus(language, 'Translating…');
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language, texts: { title: info.title, description: info.description, registration: info.registration, audience: info.audience } })
    });
    const responseText = await response.text();
    let data;
    try { data = JSON.parse(responseText); } catch { throw new Error('Invalid translation response'); }
    if (!response.ok || !data.translations) throw new Error(data.error || 'Translation failed');
    info.translations = info.translations || {};
    info.translations[language] = data.translations;
    updateTranslationCard(language, data.translations);
    if (!quiet) toast(`${language} translation is ready.`);
  } catch (error) {
    setTranslationStatus(language, 'Translation failed');
    if (!quiet) toast(`Translation unavailable: ${error.message}`);
  }
}
