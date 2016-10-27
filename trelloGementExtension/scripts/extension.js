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
  compare(boardId);

  // If user is on search page, print which offers are already in trello
  if (window.location.href.indexOf('www.seloger.com/list') !== -1)
  {
    compareList(boardId);
  }

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
          $('#button_trello').remove();
          buttonLocalisation.append(buttonAdded);
          Trello.post('/cards/' + data.id + '/actions/comments', { text : scrap()['description']});
          console.log('Card created successfully.');//TODO change button on the page
        });
      });
    }
  }, false);
});

//Creating Trello buttons and button localisation

var buttonLocalisation = $(".resume__infos .resume__action");

var buttonAdded = $("<button>", {
  type: "button",
  class: "btn",
  id:"button_trello",
  text:"Déjà ajouté !",
  alt:"Déjà ajouté !",
});

var buttonToAdd = $("<button>", {
  type: "button",
  id:"button_trello",
  class: "btn",
  onclick:"createCard()",
  text:"Ajouter à Trellogement",
  alt:"Ajouter à Trellogement",
});

// Init function
function init(boardId) {
  Trello.get(`/boards/${boardId}/cards`, function(cards) {
    for (card of cards) {
      console.log(card.name, ' : ', card.desc);
    }
  });
}

//Compare function
function compare(boardId){
  var currentPage = scrap();
  console.log(currentPage);
  var checkIfCardPresent = false;
  var idCard = null;
  Trello.get(`/boards/${boardId}/cards`, function(cards) {
    for (card of cards) {

      //We look for a card with the same title and if we found it
      //We compare the descriptions
      if (card.name == currentPage['title']) {
        checkIfCardPresent = true;
        var idCard = card.id;
        Trello.get('/cards/'+idCard+'/actions', {filter : "commentCard"}, function(comments) {

          //We compare the descriptions and add the button matching the status
          if (comments[0].data.text == currentPage['description']) { //the ad has already been added
            buttonLocalisation.append(buttonAdded);
          } else { //if the ad hasn't been added
            buttonLocalisation.append(buttonToAdd);
          }

        });

        }
      }

      //If no title matches, we add the initial button anyway
      if (!checkIfCardPresent) {
        buttonLocalisation.append(buttonToAdd);
      }


    });
}


//Compare function for search list
function compareList(boardId){
  Trello.get(`/boards/${boardId}/cards`, function(cards) {
    for (card of cards) {
      var description = card.desc;
      var offerId = description.substring(description.lastIndexOf("/")+1,description.lastIndexOf(".htm"));

      $('article').each(function() {
          if($(this).data('listing-id') == offerId)
          {
            $(this).find('ul.property_list').append('<li style="background-color:#4c4cff; color:white">Ajouté!</li>');
          }
      });
    }
  });
}

var s = document.createElement('script');
s.src = chrome.extension.getURL('scripts/inject.js');
(document.head).appendChild(s);
