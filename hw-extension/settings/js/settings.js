Trello.setKey(APP_KEY);

var checkIfBoardIsPresent = function () {
  Trello.get('/member/me/boards', function(boards) {
    var isBoardPresent = !!boards.filter(function (board) {
      return board.name === 'Mes logements' && !board.closed;
    }).length;

    if (!isBoardPresent) {
      var newBoard = {
        name: 'Mes logements',
      };
      Trello.post('/boards', newBoard, function () {
        $('.alert-success').removeClass('hidden').text('Nous avons créé votre board Trello !');
      });
    } else {
      $('.alert-info').removeClass('hidden').text('Vous avez déjà un board trello !');
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
