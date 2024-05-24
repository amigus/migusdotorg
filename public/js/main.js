(() => {
  // <stdin>
  function randomRedirect(timeout, checkboxId) {
    setTimeout(function() {
      var checkbox = document.getElementById(checkboxId);
      if (!checkbox.checked) {
        var links = document.body.getElementsByTagName("a");
        if (links.length > 0) {
          var randomLink = links[Math.floor(Math.random() * links.length)];
          window.location.href = randomLink.href;
        }
      }
    }, timeout);
  }
  randomRedirect(6e4, "redirect_cb");
})();
