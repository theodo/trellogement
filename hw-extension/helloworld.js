function login() {
  // Login on Trello is done here
  var authenticationSuccess = function() { console.log("Successful authentication"); };
  var authenticationFailure = function() { console.log("Failed authentication"); };

  Trello.authorize({
    type: 'popup',
    name: 'TrelloGement',
    scope: {
      read: 'true',
      write: 'true' },
    expiration: 'never',
    success: authenticationSuccess,
    error: authenticationFailure
  });
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('button').addEventListener('click', login);
});
