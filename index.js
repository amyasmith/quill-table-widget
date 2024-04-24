import Quill from "quill";
import "./widget.css";

export default function Widget(quill, _options) {
	const toolbar = quill.getModule("toolbar");
	toolbar.container.appendChild(getToolbarButton(quill));

	addWidget(quill);

	quill.on(Quill.events.SELECTION_CHANGE, (range, oldRange, source) => {
		const tableModule = quill.getModule("table");
		const [table, _row, _cell, _offset] = tableModule.getTable();
		if (table) {
			//we are in a table
			const rangeStart = quill.getIndex(table.rows()[0]); //get first row indices
			const rangeEnd = table.rows()[0].next
				? quill.getIndex(table.rows()[0].next)
				: quill.getLength();
			const bounds = quill.getBounds(rangeStart, rangeEnd); //get bounds
			const widget = document.getElementById("wi-widget"); //get widget
			widget.style.top = bounds.top - 11 + "px"; //position widget (11px is half its width)
			widget.style.left = bounds.left + bounds.width - 11 + "px";
			widget.setAttribute("class", "ql-tablewidget"); //unhide widget
		} else {
			//we are not in a table
			document.getElementById("wi-widget").setAttribute("class", "ql-tablewidget ql-hidden"); //hide widget
		}
	});
}

const makeTable = (quill, x, y) => {
	const tableModule = quill.getModule("table");
	if (!quill.getSelection()) {
		//need to set selection if there is none
		quill.setSelection(0); //i.e. field hasnt been clicked
	}
	tableModule.insertTable(x, y);
};

const addWidget = quill => {
	const container = quill.addContainer("ql-tablewidget");
	container.setAttribute("id", "wi-widget");
	container.setAttribute("class", "ql-tablewidget ql-hidden");
	container.innerHTML = `<button class="wi-menu-button"><svg viewBox="0 0 18 18">
		<line class="ql-stroke" x1="4" x2="14" y1="4" y2="4"></line>
		<line class="ql-stroke" x1="4" x2="14" y1="9" y2="9"></line>
		<line class="ql-stroke" x1="4" x2="14" y1="14" y2="14"></line>
	</svg>
	</button>
	<div class="wi-menu">
		<div id="wi-add-row">Insert Row</div>
		<div id="wi-add-column">Insert Column</div>
		<div id="wi-delete-row">Delete Row</div>
		<div id="wi-delete-column">Delete Column</div>
		<div id="wi-delete-table">Delete Table</div>
	</div>`;
	const tableModule = quill.getModule("table");
	document
		.getElementById("wi-add-row")
		.addEventListener("click", () => tableModule.insertRowBelow());

	document
		.getElementById("wi-add-column")
		.addEventListener("click", () => tableModule.insertColumnRight());

	document
		.getElementById("wi-delete-row")
		.addEventListener("click", () => tableModule.deleteRow());

	document
		.getElementById("wi-delete-column")
		.addEventListener("click", () => tableModule.deleteColumn());

	document
		.getElementById("wi-delete-table")
		.addEventListener("click", () => tableModule.deleteTable());
};

const getToolbarButton = quill => {
	const span = document.createElement("span");
	span.setAttribute("class", "ql-formats");
	const button = document.createElement("button");
	button.setAttribute("class", "wi-toolbar-button");
	button.innerHTML = `<svg viewBox="0 0 18 18">
		<rect class="ql-fill" height="5" width="12" x="3" y="1"></rect>
		<line class="ql-stroke" x1="3" x2="3" y1="2" y2="15"></line>
		<line class="ql-stroke" x1="15" x2="15" y1="2" y2="15"></line>
		<line class="ql-stroke" x1="9" x2="9" y1="3" y2="15"></line>
		<line class="ql-stroke" x1="3" x2="15" y1="10" y2="10"></line>
		<line class="ql-stroke" x1="3" x2="15" y1="15" y2="15"></line>
	</svg>`;
	span.appendChild(button);
	const tooltip = document.createElement("div");
	tooltip.setAttribute("class", "wi-tooltip");
	tooltip.innerHTML = `<p id="wi-tooltip-header">New Table</p>`; // + "<button/>".repeat(5 * 6);
	for (let i = 1; i < 7; i++) {
		for (let j = 1; j < 6; j++) {
			let createButton = document.createElement("button");
			createButton.addEventListener("pointerenter", () => {
				document.getElementById("wi-tooltip-header").innerText = `New Table: ${j}x${i}`;
			});
			createButton.addEventListener("pointerleave", () => {
				document.getElementById("wi-tooltip-header").innerText = `New Table`;
			});
			createButton.addEventListener("click", () => {
				makeTable(quill, i, j);
			});
			tooltip.appendChild(createButton);
		}
	}
	span.appendChild(tooltip);
	return span;
};
