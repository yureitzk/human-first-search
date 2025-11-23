export function main() {
	const style = document.createElement('style');
	style.textContent = `
    [data-ext-hide-ai="true"] {
      display: none !important;
    }
  `;
	document.documentElement.appendChild(style);

	const observer = new MutationObserver(() => {
		const navLink = document.querySelector(
			'[role="navigation"] [href*="&udm=50"]',
		);
		if (navLink) {
			let parentDiv = navLink.closest('div');

			if (parentDiv) {
				parentDiv.setAttribute('data-ext-hide-ai', 'true');
				observer.disconnect();
			}
		}
	});

	observer.observe(document, { childList: true, subtree: true });
}
