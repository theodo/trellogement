Trello.setKey(APP_KEY);

function init() {

  // Check if page load is a redirect back from the auth procedure
  if (HashSearch.keyExists('token')) {
    Trello.authorize(
      {
        name: "Trello Helper Extension",
        expiration: "never",
        interactive: false,
        scope: {read: true, write: false},
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
          name: "Trello Helper Extension",
          type: "redirect",
          expiration: "never",
          interactive: true,
          scope: {read: true, write: false},
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
      Trello.authorize(
        {
          name: "Trello Helper Extension",
          expiration: "never",
          interactive: false,
          scope: {read: true, write: false},
          success: function () {

          },
          error: function () {
            console.error('Failed to authenticate');
          }
        });
        init();
    });
