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
            const code = block.textContent;
            navigator.clipboard.writeText(code).then(() => {
                icon.classList.remove('fa-clone');
                icon.classList.add('fa-clipboard');
                setTimeout(() => {
                    icon.classList.remove('fa-clipboard');
                    icon.classList.add('fa-clone');
                }, 250);
            }).catch(err => {
                console.error(`Failed to copy text from block: ${block.textContent}. Error: `, err);
            });
        });
        block.parentNode.appendChild(button);
    });
});