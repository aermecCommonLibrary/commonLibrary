class Utility {
	constructor() { }

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
				if (type === 'text') {
					value = control.value;
				}
				if (type === 'checkbox' || type === 'radio') {
					value = control.checked;
				}
				if (!!id) {
					valuesForm += `id:${id};value:${value};`;
				}
			});
		sessionStorage.setItem('valuesForm', valuesForm);
	}
	static resetHtml() {
		const htmlToReset = sessionStorage.getItem('container');
		if (htmlToReset) {
			document.getElementById('container').innerHTML = htmlToReset;
			const values = sessionStorage.getItem('valuesForm');
			const parts = values.split(';').filter(Boolean);
			const results = [];
			for (let i = 0; i < parts.length; i += 2) {
				const id = parts[i].split(':')[1];
				const value = parts[i + 1].split(':')[1];
				results.push({ id, value });
			}
			results.forEach(res => this.resetValueFormControl(res));
		}
	}
	static resetValueFormControl(curr) {
		const element = document.getElementById(curr.id);
		const type = element.type;
		if (type === 'text') {
			element.value = curr.value;
		}
		if (type === 'radio' || type === 'checkbox') {
			if (this.#isTrue(curr.value)) {
				element.checked = true;
			}
		}
	}
	static #isTrue(value) {
		return value === true || value === 'true';
	}
}