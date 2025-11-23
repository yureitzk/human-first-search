export function main() {
	const style = document.createElement('style');
	style.id = 'ext-hide-ai-overview';
	style.textContent = `
		[data-ext-hide-ai-overview] h1 { display: none !important; }   
		[data-ext-hide-ai-overview] [role="main"] { margin-top: 24px !important; }
	`;
	document.documentElement.appendChild(style);

	const patterns = [/ai overview/i, /AI による概要/];
	const observer = new MutationObserver(() => {
		const aiH1 = [...document.querySelectorAll('h1')].find((h) =>
			patterns.some((p) => p.test(h.innerText)),
		);
		if (aiH1) {
			document.documentElement.setAttribute('data-ext-hide-ai-overview', '1');
			observer.disconnect();
		}
	});
	observer.observe(document, { childList: true, subtree: true });
}
