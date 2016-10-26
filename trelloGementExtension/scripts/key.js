var APP_KEY = '146f7cd8bc7347c83fd87c6b5d0519c5';

chrome.storage.local.set(
  {
    'trellogement_trello_key': APP_KEY,
  },
  function() {
    console.log('Clé stockée de manière pas secure du tout !');
  }
);
