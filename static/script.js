console.assert(jspreadsheet);

const tableElement = document.getElementById("table");
console.assert(tableElement);
const saveButtonElement = document.getElementById("save-button");
console.assert(saveButtonElement);

async function run() {
    const fileName = fileNameFromPageUrl();

    if (fileName.endsWith(".csv")) {
        await tableMode(fileName);
    } else {
        console.log("todo");
    }
}

function fileNameFromPageUrl() {
    const url = new URL(document.URL);
    const path = url.pathname;
    console.assert(path[0] == '/');
    return path.slice(1);
}

async function tableMode(fileName) {
    saveButtonElement.addEventListener(
        "click", async () => await onSaveButtonClick(fileName));

    await loadFile(fileName);
}

async function onSaveButtonClick(fileName) {
    console.log("todo");
}

async function loadFile(fileName) {
    console.log(`load file ${fileName}`);

    removeChildren(tableElement);

    const path = `/api/table/${fileName}`;
    console.log(`path: ${path}`);
    const resp = await fetch(path);

    if (!resp.ok) {
        console.log("error loading file");
        console.log(resp);
        return;
    }

    const json = await resp.json();

    jspreadsheet(tableElement, {
        data: json.rows,
        columns: json.headers
    });
}

function removeChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

await run();
