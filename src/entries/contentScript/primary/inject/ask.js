export function main() {
	const style = document.createElement('style');
	style.id = 'ext-hide-brave-ask';
	style.textContent = `
		[data-ext-hide-brave-ask] #submit-llm-button,
		[data-ext-hide-brave-ask] button[formaction^="/ask"],
		[data-ext-hide-brave-ask] li.tab-item  a[href^="/ask"]  {
			display: none !important; 
		}
`;
	document.documentElement.appendChild(style);
	document.documentElement.setAttribute('data-ext-hide-brave-ask', '1');
}
