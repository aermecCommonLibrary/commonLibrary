// Ciao
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
	static initForSaveHtml(window) {
		window.addEventListener("beforeunload", function (e) {
			const container = document.getElementById("container");
			if (container && container.children.length > 0) {
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
		// Gestione Checkbox
		let checkValues = '|';
		document
			.querySelectorAll('input[type="checkbox"], input[type="radio"]')
			.forEach(control => {
				console.log(control.type);
				const id = control.id;
				const value = control.checked;
				checkValues += `id:${id};value:${value};`;
			});
		checkValues += '|';
		// Gestione Text
		let textValues = '|';
		document
			.querySelectorAll('input[type="text"]')
			.forEach(text => {
				const id = text.id;
				const value = text.value;
				textValues += `id:${id};value:${value};`;
			});
		textValues += '|';
		// Gestione Radiobutton
		let radioValues = '|';
		const valuesForm = checkValues + textValues + radioValues;
		sessionStorage.setItem('valuesForm', valuesForm);
	}
	static resetHtml() {
		const htmlToReset = sessionStorage.getItem('container');
		if (htmlToReset) {
			document.getElementById('container').innerHTML = htmlToReset;
			const splittedValuesLevel = sessionStorage.getItem('valuesForm').split('||');
			// Valorizzazione Checkbox e Radio
			const check = splittedValuesLevel[0].replace('|', '');
			const parts = check.split(';').filter(Boolean);
			const results = [];
			for (let i = 0; i < parts.length; i += 2) {
				const idPart = parts[i].split(':')[1];
				const checked = this.isTrue(parts[i + 1].split(':')[1]);
				results.push({ id: idPart, value: checked });
			}
			// Valorizzazione Text
			const text = splittedValuesLevel[1].replace('|', '');
			const partsText = text.split(';').filter(Boolean);
			for (let i = 0; i < partsText.length; i += 2) {
				const idPart = partsText[i].split(':')[1];
				const text = partsText[i + 1].split(':')[1];
				results.push({ id: idPart, value: text });
			}
			results.forEach(res => this.resetValueFormControl(res));
		}
	}
	static isTrue(value) {
		return value === true || value === 'true';
	}
	static resetValueFormControl(curr) {
		const element = document.getElementById(curr.id);
		const type = element.type;
		if (type === 'text') {
			element.value = curr.value;
		}
		if (type === 'checkbox') {
			element.checked = curr.value;
		}
		if (type === 'radio') {
			if (this.isTrue(curr.value)) {
				element.checked = true;
			}
		}
	}
}