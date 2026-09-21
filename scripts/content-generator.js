'use strict';

function generateMaterials(ids) {
  const date = info.date
    ? new Date(`${info.date}T00:00:00`).toLocaleDateString('en-SG', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Date to be confirmed';
  const time = [info.startTime, info.endTime].filter(Boolean).join(' – ') || 'Time to be confirmed';
  const title = info.title || 'Our Upcoming Programme';
  const venue = info.venue || 'Venue to be confirmed';
  const description = info.description || 'Join us for an engaging and meaningful programme.';
  const registration = info.registration || 'Contact us to register.';

  function whatsappMessage(language) {
    const translated = (info.translations || {})[language] || {};
    const copy = language === 'English'
      ? { title, description, registration }
      : {
          title: translated.title || title,
          description: translated.description || description,
          registration: translated.registration || registration
        };
    const wording = {
      English: { heading: 'ENGLISH', hello: 'Hello! 👋', invite: "You're invited to", date: 'Date', time: 'Time', venue: 'Venue', closing: 'We hope to see you there!' },
      Chinese: { heading: '中文', hello: '您好！👋', invite: '诚邀您参加', date: '日期', time: '时间', venue: '地点', closing: '期待与您见面！' },
      Malay: { heading: 'BAHASA MELAYU', hello: 'Hai! 👋', invite: 'Anda dijemput ke', date: 'Tarikh', time: 'Masa', venue: 'Tempat', closing: 'Kami berharap dapat berjumpa dengan anda!' },
      Tamil: { heading: 'தமிழ்', hello: 'வணக்கம்! 👋', invite: 'இதில் கலந்துகொள்ள உங்களை அன்புடன் அழைக்கிறோம்', date: 'தேதி', time: 'நேரம்', venue: 'இடம்', closing: 'உங்களை அங்கு சந்திக்க ஆவலுடன் காத்திருக்கிறோம்!' }
    }[language] || null;
    if (!wording) return '';
    const locale = { English: 'en-SG', Chinese: 'zh-CN', Malay: 'ms-MY', Tamil: 'ta-IN' }[language];
    const localDate = info.date ? new Date(`${info.date}T00:00:00`).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' }) : date;
    return `【${wording.heading}】\n${wording.hello}\n\n${wording.invite} *${copy.title}*.\n\n📅 ${wording.date}: ${localDate}\n⏰ ${wording.time}: ${time}\n📍 ${wording.venue}: ${venue}\n\n${copy.description}\n\n${copy.registration}\n\n${wording.closing}`;
  }

  function multilingualWhatsapp() {
    const languages = info.languages && info.languages.length ? info.languages : ['English'];
    return languages.map(whatsappMessage).filter(Boolean).join('\n\n━━━━━━━━━━━━━━━━━━━━\n\n');
  }

  const formats = {
    poster: () => `${title}\n${date} • ${time}\n${venue}\n${description}\n${registration}`,
    whatsapp: multilingualWhatsapp,
    facebook: () => `You're invited to ${title}!\n\n${description}\n\nJoin us on ${date}, from ${time}, at ${venue}. This programme is designed for ${info.audience || 'our community'} and promises a welcoming, enjoyable experience.\n\n${registration}\n\nPlease share this with someone who may be interested.`,
    instagram: () => `Something special is coming ✨\n\n${title}\n📅 ${date} • ⏰ ${time}\n📍 ${venue}\n\n${description}\n\n${registration}\n\n#CommunityProgramme #Events #JoinUs`,
    website: () => `${title}\n\n${description}\n\nAbout the programme\n${description} This session is open to ${info.audience || 'all interested participants'}. ${info.slots ? `Places are limited to ${info.slots} participants.` : ''}\n\nDate: ${date}\nTime: ${time}\nVenue: ${venue}\n\nHow to register\n${registration}`,
    email: () => `Subject: Invitation: ${title}\n\nDear participant,\n\nWe are pleased to invite you to ${title}. ${description}\n\nDate: ${date}\nTime: ${time}\nVenue: ${venue}\n\n${registration}\n\nIf you have questions, please contact ${info.contact || 'our team'}.\n\nWarm regards,\nProgramme Team`,
    video: () => `OPENING TITLE (0–3 sec)\n${title}\n\nSCENE 1 (3–8 sec)\nShow welcoming programme imagery.\nOn-screen text: “${description}”\n\nSCENE 2 (8–14 sec)\nShow participants enjoying the activity.\nOn-screen text: “${date} • ${time}”\n\nSCENE 3 (14–20 sec)\nShow the venue and friendly facilitators.\nOn-screen text: “${venue}”\n\nCLOSING CALL TO ACTION (20–25 sec)\nJoin us at ${title}. ${registration}`
  };

  return Object.fromEntries(ids.map(id => [id, formats[id]()]));
}

function copyMaterialText(value) {
  if (navigator.clipboard && location.protocol !== 'file:') {
    navigator.clipboard.writeText(value).then(() => toast('Copied to clipboard.'));
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = value;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
  toast('Copied to clipboard.');
}
