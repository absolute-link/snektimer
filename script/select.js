class FancySelect extends HTMLElement {
	options = {};
	#value = [];
	set value(val){
		this.#value = val;
		this.updateDisplay();
	}
	get value(){
		return this.#value;
	}
	onSelect;
	multiSelect = false;
	isOpen = false;
	elementSize = {
		width: "9rem",
		height: "2rem"
	}
	maxOptionsToShow = 5;
	
	constructor(){
		super();
		this.updateDisplay = this.updateDisplay.bind(this);
	}
	
	connectedCallback(){
		this.style.width = this.elementSize.width;
		this.style.height = this.elementSize.height;
		this.style["backgroundColor"] = "#B7A981";
		this.style.display = "inline-block";
		this.style.cursor = "pointer";
		this.optionContainer = document.createElement('div');
		this.optionContainer.style.position = "absolute";
		this.optionContainer.style.backgroundColor = "#9B9572";
		this.optionContainer.style.padding = "0";
		this.optionContainer.style.height = this.elementSize.height;// recalculated on open/close anyway
		this.optionContainer.style.width = this.elementSize.width;
		this.optionContainer.style.display = "block";
		this.optionContainer.style.overflowX = "hidden";
		this.optionContainer.style.overflowY = "auto";
		this.optionContainer.style.boxSizing = "border-box";
		
		this.appendChild(this.optionContainer);
		
		this.currentlySelected = document.createElement('div');
		this.currentlySelected.innerHTML = "Select";
		this.currentlySelected.classList.add("withAfter");
		this.currentlySelected.setAttribute("content", "▼")
		this.currentlySelected.style.height = "100%";
		this.currentlySelected.style.width = "100%";
		this.currentlySelected.style.display = "flex";
		this.currentlySelected.style["align-items"] = "center";
		this.currentlySelected.style["padding-left"] = "0.5rem";
		this.currentlySelected.style["padding-right"] = "0.5rem";
		this.currentlySelected.style["boxSizing"] = "border-box";
		this.currentlySelected.style["justify-content"] = "space-between";
		this.appendChild(this.currentlySelected);
		this.currentlySelected.addEventListener('click', (e) => {
			this.isOpen = 1;
			this.updateDisplay();
		})
	}

	addOption(optionText, optionValue) {
		const option = document.createElement('div');
		option.innerHTML = optionText;
		option.style.width = this.elementSize.width;
		option.style.height = this.elementSize.height;
		option.style["boxSizing"] = "border-box";
		option.style.marginBottom = "0";
		option.style.padding = "0.25rem";
		option.classList.add("hasMouseOver");
		option.style.cursor = "pointer";
		this.optionContainer.appendChild(option);
		option.addEventListener('click', (e) => {
			this.select(optionValue, e);
		})
		this.options[optionValue] = option;
	}

	select(optionValue, e) {
		if(this.multiSelect && true){// TODO
			debugger;
		} else {
			this.value = [optionValue];
			if (this.onSelect) {
				this.onSelect([optionValue]);
			}
			this.isOpen = false;
			this.updateDisplay();
		}
	}
	
	updateDisplay(){
		this.optionContainer.style.display = this.isOpen ? "block" : "none";
		this.optionContainer.style.height = (this.offsetHeight * Math.min(this.maxOptionsToShow, Object.values(this.options).length)) + "px";
		if(this.value.length == 1){
			this.currentlySelected.innerHTML = this.options[this.value[0]].innerHTML;
		} else if(this.value.length > 1){
			this.currentlySelected.innerHTML = `Selected (${this.value.length})`;
		}
		for(let option in this.options){
			if(this.value.includes(option)){
				this.options[option].classList.add("selected");
			} else {
				this.options[option].classList.remove("selected");
			}
		}
	}
	
}

customElements.define('fancy-select', FancySelect);
