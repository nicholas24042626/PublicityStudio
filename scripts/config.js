'use strict';

const STORE = 'pmg-projects-v1';

const labels = {
  poster: 'Event Poster',
  whatsapp: 'WhatsApp Message',
  facebook: 'Facebook Post',
  instagram: 'Instagram Post',
  website: 'Website Description',
  video: 'Video Script',
  email: 'Email Announcement'
};

const posterDesigns = [
  ['Simple', 'Aa'],
  ['Modern', 'M'],
  ['Community', '♥'],
  ['Senior Friendly', 'A+'],
  ['Bold', '✦'],
  ['Nature', '⌁']
];

const translationLabels = {
  English: ["YOU'RE INVITED", 'DATE', 'TIME', 'VENUE', 'RESERVE YOUR PLACE', 'OPEN TO'],
  Chinese: ['诚邀您参加', '日期', '时间', '地点', '立即报名', '适合'],
  Malay: ['ANDA DIJEMPUT', 'TARIKH', 'MASA', 'TEMPAT', 'DAFTAR SEKARANG', 'TERBUKA KEPADA'],
  Tamil: ['உங்களை அன்புடன் அழைக்கிறோம்', 'தேதி', 'நேரம்', 'இடம்', 'இப்போதே பதிவு செய்யுங்கள்', 'யாருக்காக']
};

function blank() {
  return {
    title: '', description: '', date: '', startTime: '', endTime: '', venue: '',
    audience: '', registration: '', contact: '', slots: '', category: 'Community',
    languages: ['English'], translations: {}
  };
}
