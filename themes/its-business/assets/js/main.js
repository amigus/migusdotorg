// Add a copy to clipboard button to pre>code blocks
document.addEventListener('DOMContentLoaded', function () {
	document.querySelectorAll('pre > code').forEach(function (codeBlock) {
		const pre = codeBlock.parentElement;
		// Avoid duplicate buttons
		if (pre.querySelector('.copy-btn')) return;
		const btn = document.createElement('button');
		const icon = document.createElement("i");
		btn.className = 'copy-btn';
		btn.type = 'button';
		btn.title = 'Copy to clipboard';
		icon.className = "fa fa-clone";
		icon.setAttribute("aria-hidden", "true");
		btn.appendChild(icon);
		btn.addEventListener('click', function () {
			navigator.clipboard.writeText(codeBlock.innerText).then(() => {
				icon.classList.remove('fa-clone');
				icon.classList.add('fa-clipboard');
				setTimeout(() => {
					icon.classList.remove('fa-clipboard');
					icon.classList.add('fa-clone');
				}, 150);
			});
		});
		pre.appendChild(btn);
		pre.style.position = 'relative';
	});
});
