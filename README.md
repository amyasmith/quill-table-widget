# quill-table-widget
A basic UI module for managing tables with Quill v2

[Demo](https://amyasmith.github.io/quill-table-widget/)

## Features:

 - Adds a menu to the toolbar for adding tables of various sizes
 - Displays a widget at the top-right corner of tables when selected
 - This widget allows:
   - Adding a row below the cursor
   - Adding a column to the left of the cursor
   - Removing the row below the cursor
   - Removing the column below the cursor
   - Removing the entire table

## Usage:
```
import Widget from "quill-table-widget";
import Quill from "quill";
...

Quill.register("modules/tableWidget", Widget);
const quill = new Quill(editorContainer, {
			theme: "snow",
			modules: {
				table: true,
				tableWidget: true
			}
		});
```
Both the table and tableWidget modules must be enabled.

## License:
This project is released entirely into the public domain. Do whatever you want with it.

## Contributing:
Do not.

This project is made for a specific purpose. If you have an issue, PR, or feature request, you are welcome to fork it.
