class FancySelect extends HTMLElement {
	options = {};
	value;// todo: getter and setter
	onSelect;

	addOption(optionText, optionValue) {
		const option = document.createElement('div');
		option.innerHTML = optionText;
		option.setAttribute('data-value', optionValue);
		this.appendChild(option);
		option.addEventListener('click', (e) => {
			this.select(optionValue);
		})
		this.options[optionValue] = option;
	}

	select(optionValue) {
		this.value = optionValue;
		if (this.onSelect) {
			this.onSelect(optionValue);
		}
	}
}

customElements.define('fancy-select', FancySelect);
