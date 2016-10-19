// Prepare Trello client
chrome.storage.local.get('trellogement_trello_key', function (key) {
  Trello.setKey(key.trellogement_trello_key);
});

chrome.storage.local.get('trellogement_trello_token', function (token) {
  var token = token.trellogement_trello_token;
  Trello.setToken(token);
});

chrome.storage.local.get('trellogement_trello_board_id', function (boardId) {
  var boardId = boardId.trellogement_trello_board_id;
  init(boardId);
});

// Init function
function init(boardId) {
  Trello.get(`/boards/${boardId}/cards`, function(cards) {
    for (card of cards) {
      console.log(card.name, ' : ', card.desc);
    }
  });
}

var s = document.createElement('script');
s.src = chrome.extension.getURL('scripts/inject.js');
(document.head).appendChild(s);
