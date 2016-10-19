Trello.setKey(APP_KEY);

var checkIfBoardIsPresent = function () {
  Trello.get('/member/me/boards', function(boards) {
    var trelloBoard = null;
    var isBoardPresent = !!boards.filter(function (board) {
      if (board.name === 'Mes logements' && !board.closed) {
        trelloBoard = board;
        return true;
      };
    }).length;

    if (!isBoardPresent) {
      var newBoard = {
        name: 'Mes logements',
        defaultLists: false,
      };
      Trello.post('/boards', newBoard, function (board) {
        $('.alert-success').removeClass('hidden').text('Nous avons créé votre board Trello !')
        .append(`<br><a class="btn btn-success" href="${board.url}">Voir mon board</a>`);
        var nameList = [
          'Je suis intéressé',
          'A appeler',
          'Visite programmée',
          'En attente de réponse',
          'KO',
        ];
        addInitialListsToBoard(nameList, board)
      });
    } else {
      $('.alert-info').removeClass('hidden').text('Vous avez déjà un board trello !')
      .append(`<br><a class="btn btn-primary" href="${trelloBoard.url}">Voir mon board</a>`);
    }

  });
};


function init() {

  // Check if page load is a redirect back from the auth procedure
  if (HashSearch.keyExists('token')) {
    Trello.authorize(
      {
        name: "TrelloGement",
        expiration: "never",
        interactive: false,
        scope: {read: true, write: true},
        success: function() {},
        error: function () {
          alert("Failed to authorize with Trello.")
        }
      });
    }

    // Message and button containers
    var lout = $("#trello_helper_loggedout");
    var lin = $("#trello_helper_loggedin");

    // Log in button
    $("#trello_helper_login").click(function () {
      Trello.authorize(
        {
          name: "TrelloGement",
          type: "redirect",
          expiration: "never",
          interactive: true,
          scope: {read: true, write: true},
          success: function () {
            // Can't do nothing, we've left the page
          },
          error: function () {
            alert("Failed to authorize with Trello.")
          }
        });
      });

      // Log out button
      $("#trello_helper_logout").click(function () {
        Trello.deauthorize();
        location.reload();
      });

      if (!localStorage.trello_token) {
        $(lout).show();
        $(lin).hide();
      } else {
        $(lout).hide();
        $(lin).show();
      }
    }

    $(document).ready(function() {
        init();
        Trello.authorize(
          {
            name: "TrelloGement",
            expiration: "never",
            interactive: false,
            scope: {read: true, write: true},
            success: checkIfBoardIsPresent,
            error: function () {
              console.error('Failed to authenticate');
            }
          });
    });

function addInitialListsToBoard(nameList, board) {
  if (nameList.length > 0) {
    Trello.post(
      `/boards/${board.id}/lists`,
      {
        name: nameList[0],
        pos: 'bottom',
      },
      function (response) {
        return addInitialListsToBoard(nameList.slice(1), board);
      }
    );
  }

  return;
}
