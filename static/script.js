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

let spreadsheet = null;

async function onSaveButtonClick(fileName) {
    if (spreadsheet == null) {
        return;
    }

    console.assert(spreadsheet);

    const headers = spreadsheet.getHeaders();
    const data = spreadsheet.getJson();

    console.log(headers);
    console.log(data);

    const headers2 = headers.split(",");
    const headers3 = headers2.map(title => ({ title }));

    console.log(headers2);
    console.log(headers3);

    const table = {
        headers: headers3,
        rows: data
    };

    const path = `/api/table/${fileName}`;

    const resp = await fetch(path, {
        method: "POST",
        body: JSON.stringify(table),
    });

    if (!resp.ok) {
        console.log("error");
    } else {
        console.log("ok");
    }
}

async function loadFile(fileName) {
    console.log(`load file ${fileName}`);

    console.assert(spreadsheet == null);

    const path = `/api/table/${fileName}`;
    console.log(`path: ${path}`);
    const resp = await fetch(path);

    if (!resp.ok) {
        console.log("error loading file");
        console.log(resp);
        return;
    }

    const json = await resp.json();

    spreadsheet = jspreadsheet(tableElement, {
        data: json.rows,
        columns: json.headers
    });
}

await run();
