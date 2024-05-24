function randomRedirect(timeout, checkboxId) {
    setTimeout(function() {
        var checkbox = document.getElementById(checkboxId);
        if (!checkbox.checked) {
            var links = Array.from(document.body.getElementsByTagName('a'));
            links = links.filter(link => link.href !== '/public.asc');
            if (links.length > 0) {
                var randomLink = links[Math.floor(Math.random() * links.length)];
                window.location.href = randomLink.href;
            }
        }
    }, timeout);
}
randomRedirect(60000, 'redirect_cb');