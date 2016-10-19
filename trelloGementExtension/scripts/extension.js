// scrap datas from the current url and return an dictionnary
function scrap() {
    var infos = {
      img: $('img.carrousel_image_visu').attr('src'),
      price: $('span.resume__prix').text().trim(),
      title: $('h1.detail-title').text().replace(/\r?\n|\r/g,'').replace(/ +(?= )/g,'').trim(),
      description: $('p.description').html(),
      link: window.location.href,
    };
    return infos;
}

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

  // This part handles request made from seLoger pages by clicking on buttons
  window.addEventListener("message", function(event) {
    // We only accept messages from the page
    if (event.source != window)
      return;

    // Action to create a new card
    if (event.data == 'createCard') {

      var infos = scrap();
      Trello.get('/boards/' + boardId + '/lists', { fields: "id,name" }, function(lists) {
        // Getting list id
        var listId;
        for (index in lists)
        {
          if (lists[index].name == "Je suis intéressé")
          {
            listId = lists[index].id;
          }
        }

        // Creating the new card
        var newCard = {
          name: infos['title'],
          desc: 'Prix du logement : ' + infos['price'] + '\n\n Lien vers la page : ' + infos['link'],
          urlSource: infos['img'],
          idList: listId,
          pos: 'top'
        };
        Trello.post('/cards/', newCard, function(data) {
          // Creating here the comment with description of offer in it
          Trello.post('/cards/' + data.id + '/actions/comments', { text : scrap()['description']});
          console.log('Card created successfully.');//TODO change button on the page
        });
      });
    }
  }, false);
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
