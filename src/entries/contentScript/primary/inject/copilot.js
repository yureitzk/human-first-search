export function main() {
	const style = document.createElement('style');
	style.id = 'ext-hide-bing-copilot';
	style.textContent = `
		[data-ext-hide-bing-copilot] #b_copilot_search_container,
		[data-ext-hide-bing-copilot] #b-scopeListItem-copilotsearch,
		[data-ext-hide-bing-copilot] #b-scopeListItem-conv,
		[data-ext-hide-bing-copilot] .b_phead_chat_link,
		[data-ext-hide-bing-copilot-el] {
			display: none !important; 
		}
`;
	document.documentElement.appendChild(style);
	document.documentElement.setAttribute('data-ext-hide-bing-copilot', '1');

	const observer = new MutationObserver(() => {
		const copilotAnswerContainerEl = document.querySelector('#copans_container');
		if (copilotAnswerContainerEl) {
			let parentEL = copilotAnswerContainerEl.closest('li');

			if (parentEL) {
				parentEL.setAttribute('data-ext-hide-bing-copilot-el', 'true');
				observer.disconnect();
			}
		}
	});

	observer.observe(document, { childList: true, subtree: true });
}
