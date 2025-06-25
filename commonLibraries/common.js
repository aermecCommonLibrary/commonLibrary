class Utility {
	constructor() { }

	static InputType = {
		CHECKBOX: 'checkbox',
		TEXT: 'text',
		RADIO: 'radio'
	};
	static Delimiter = '§';

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
	static initForSaveHtml() {
		window.addEventListener("beforeunload", ev => {
			let zoneData = document.getElementById("container");
			if (zoneData.children.length > 0) {
				this.saveHtml();
				this.saveFormValues();
			}
		});
	}
	static saveHtml() {
		const container = document.getElementById("container").innerHTML;
		sessionStorage.setItem('container', container);
	}
	static saveFormValues() {
		let valuesForm = '';
		document
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
					valuesForm += `${id}${this.Delimiter}${value}${this.Delimiter}`;
				}
			});
		this.#saveValuesForm(valuesForm);
	}
	static #saveValuesForm(valuesForm) {
		const lenghtToRemove = this.Delimiter.length;
		valuesForm = valuesForm.slice(0, valuesForm.length - lenghtToRemove);
		sessionStorage.setItem('valuesForm', valuesForm);
	}
	static resetHtml() {
		const htmlToReset = sessionStorage.getItem('container');
		if (htmlToReset) {
			document.getElementById('container').innerHTML = htmlToReset;
			const values = sessionStorage.getItem('valuesForm');
			const parts = values.split(this.Delimiter).filter(Boolean);
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
			if (this.#isTrue(curr.value)) {
				element.checked = true;
			}
		}
	}
	static #isTrue(value) {
		return value === true || value === 'true';
	}
}