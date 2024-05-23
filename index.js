import Quill from "quill";
import "./widget.css";
import "./hover.css";

export default function Widget(quill, options) {
	const toolbar = quill.getModule("toolbar");
	const toolbarButton = getToolbarButton(quill, options);
	if (options.toolbarOffset && !!parseInt(options.toolbarOffset)) {
		const ref = Array.from(toolbar.container.children).at(parseInt(options.toolbarOffset));
		toolbar.container.insertBefore(toolbarButton, ref);
	} else {
		toolbar.container.appendChild(toolbarButton);
	}

	addWidget(quill);

	quill.on(Quill.events.EDITOR_CHANGE, () => {
		const tableModule = quill.getModule("table");
		const table = tableModule.getTable()[0];
		if (table) {
			//we are in a table
			const index = quill.getIndex(table.rows()[0]); //get location of first row
			const bounds = quill.getBounds(index); //get bounds
			showWidget(bounds);
		} else {
			//we are not in a table
			hideWidget();
		}
	});
}

const makeTable = (quill, x, y) => {
	const tableModule = quill.getModule("table");
	if (!quill.getSelection(true)) {
		//need to set selection if there is none
		quill.setSelection(0); //i.e. field hasnt been clicked
	}
	tableModule.insertTable(x, y);
	const bounds = quill.getBounds(quill.getSelection());
	showWidget(bounds); //show widget as table will be under cursor
};

const hideWidget = () => {
	document.getElementById("wi-widget").setAttribute("class", "ql-tablewidget ql-hidden");
};

const showWidget = bounds => {
	const widget = document.getElementById("wi-widget");
	widget.style.top = bounds.top - 11 + "px"; //position widget (11px is half its height)
	widget.style.right = "4px"; //4px is the margin (15px) minus half its width (again 11px)
	widget.setAttribute("class", "ql-tablewidget"); //unhide widget
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
	document.getElementById("wi-add-row").addEventListener("click", () => {
		if (!quill.isEnabled()) return;
		tableModule.insertRowBelow();
	});

	document.getElementById("wi-add-column").addEventListener("click", () => {
		if (!quill.isEnabled()) return;
		tableModule.insertColumnRight();
	});

	document.getElementById("wi-delete-row").addEventListener("click", () => {
		if (!quill.isEnabled()) return;
		tableModule.deleteRow();
		if (!tableModule.getTable[0]) {
			hideWidget();
		}
	});

	document.getElementById("wi-delete-column").addEventListener("click", () => {
		if (!quill.isEnabled()) return;
		tableModule.deleteColumn();
		if (!tableModule.getTable[0]) {
			hideWidget();
		}
	});

	document.getElementById("wi-delete-table").addEventListener("click", () => {
		if (!quill.isEnabled()) return;
		tableModule.deleteTable();
		hideWidget();
	});
};

const getToolbarButton = (quill, options) => {
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
	let d = [5, 6]; //default
	if (options.maxSize) {
		const u = [parseInt(options.maxSize?.[0]), parseInt(options.maxSize?.[1])];
		//if valid inputs
		if (u[0] && u[1]) {
			//clamp to range
			d = [[2, u[0], 12].sort((a, b) => a - b)[1], [2, u[1], 12].sort((a, b) => a - b)[1]];
		}
	}
	//style text to take up one grid column
	tooltip.innerHTML = `<p id="wi-tooltip-header" style="grid-column: 1/${d[0] + 1}">New Table</p>`;
	tooltip.style.gridTemplateColumns = "1fr ".repeat(d[0]); //set grid width

	for (let i = d[1]; i > 0; i--) {
		for (let j = d[0]; j > 0; j--) {
			//do in reverse order so CSS ~ selector works
			let createButton = document.createElement("div");
			createButton.setAttribute("class", `wicol-${j} wi-addtable`);
			createButton.addEventListener("pointerenter", () => {
				document.getElementById("wi-tooltip-header").innerText = `New Table: ${j}x${i}`;
			});
			createButton.addEventListener("pointerleave", () => {
				document.getElementById("wi-tooltip-header").innerText = `New Table`;
			});
			createButton.addEventListener("click", () => {
				makeTable(quill, i, j);
			});
			createButton.style.order = i * d[0] + j; //fix order
			tooltip.appendChild(createButton);
		}
	}
	span.appendChild(tooltip);
	return span;
};
