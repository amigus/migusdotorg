document.addEventListener("DOMContentLoaded", function() {
    const codeBlocks = document.querySelectorAll("pre > code:not(.no-copy)");

    codeBlocks.forEach(block => {
        const button = document.createElement("button");
        button.className = "copy-button";

        const icon = document.createElement("i");
        icon.className = "fa fa-clone";
        icon.setAttribute("aria-hidden", "true");
        button.appendChild(icon);

        button.addEventListener("click", function() {
            const code = block.innerText;
            navigator.clipboard.writeText(code).then(() => {
                icon.classList.remove('fa-clone');
                icon.classList.add('fa-clipboard');
                setTimeout(() => {
                    icon.classList.remove('fa-clipboard');
                    icon.classList.add('fa-clone');
                }, 300); // Change icon for 300 milliseconds
            }).catch(err => {
                console.error("Failed to copy text: ", err);
            });
        });

        const pre = block.parentNode;
        pre.style.position = "relative";
        pre.appendChild(button);
    });
});