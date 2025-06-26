class Utility {
	constructor() { }

	static InputType = {
		CHECKBOX: 'checkbox',
		TEXT: 'text',
		RADIO: 'radio'
	};
	static DELIMITER = '§';
	static STOREDHTML = 'htmlStored';
	static VALUEFORM = 'formValueStored';

	static getScreenInfo() {
		const output = new Map();
		output.set("inchesDiagonal", extractInchesDiagonal());
		output.set("screenOrientation", screen.orientation.type);
		return output;
	}
	static extractInchesDiagonal() {
		const width = window.screen.width;
		const height = window.screen.height;
		const ppi = extractScreenPpi();
		const diagonalePixel = Math.sqrt(width ** 2 + height ** 2);
		return diagonalePixel / ppi;
	}
	static extractScreenPpi() {
		let dpiElement = document.createElement("div");
		dpiElement.style.width = "1in"; // 1 inch di larghezza
		dpiElement.style.visibility = "hidden";
		document.body.appendChild(dpiElement);

		let ppi = dpiElement.offsetWidth * window.devicePixelRatio;
		document.body.removeChild(dpiElement);

		return ppi;
	}
	static #extractDomElement(id) {
		let element = document.getElementById(id);
		if (!element) {
			element = document.getElementsByTagName('body')[0];
		}
		return element;
	}
	static initForSaveHtml(elementId) {
		window.addEventListener("beforeunload", ev => {
			const element = this.#extractDomElement(elementId);
			if (element.children.length > 0) {
				this.saveHtml(elementId);
				this.saveFormValues(elementId);
			}
		});
	}
	static saveHtml(elementId) {
		let element = this.#extractDomElement(elementId);
		sessionStorage.setItem(this.STOREDHTML, element.innerHTML);
	}
	static saveFormValues(elementId) {
		let element = this.#extractDomElement(elementId);
		let valuesForm = '';
		element
			.querySelectorAll('input')
			.forEach(control => {
				const id = control.id;
				let value;
				const type = control.type;
				if (type === this.InputType.TEXT) {
					value = control.value;
				}
				if (type === this.InputType.CHECKBOX || type === this.InputType.RADIO) {
					value = control.checked;
				}
				if (!!id && !!value) {
					valuesForm += `${id}${this.DELIMITER}${value}${this.DELIMITER}`;
				}
			});
		this.#saveValuesForm(valuesForm);
	}
	static #saveValuesForm(valuesForm) {
		const lenghtToRemove = this.DELIMITER.length;
		valuesForm = valuesForm.slice(0, valuesForm.length - lenghtToRemove);
		sessionStorage.setItem(this.VALUEFORM, valuesForm);
	}
	static resetHtml(elementId) {
		const html = sessionStorage.getItem(this.STOREDHTML);
		if (!!html) {
			let element = this.#extractDomElement(elementId);
			element.innerHTML = html;
			const formValue = sessionStorage.getItem(this.VALUEFORM);
			const parts = formValue.split(this.DELIMITER).filter(Boolean);
			const results = [];
			for (let i = 0; i < parts.length; i += 2) {
				const id = parts[i];
				const value = parts[i + 1];
				results.push({ id, value });
			}
			results.forEach(res => this.resetValueFormControl(res));
		}
	}
	static resetValueFormControl(curr) {
		const element = document.getElementById(curr.id);
		const type = element.type;
		if (type === this.InputType.TEXT) {
			element.value = curr.value;
		}
		if (type === this.InputType.RADIO || type === this.InputType.CHECKBOX) {
			element.checked = this.#isTrue(curr.value);
		}
	}
	static #isTrue(value) {
		return value === true || value === 'true';
	}
}