console.assert(jspreadsheet);

const tableSection = document.getElementById("table-section");
console.assert(tableSection);

function documentNameFromPageUrl() {
    const url = new URL(document.URL);
    const path = url.pathname;
    console.assert(path[0] == '/');
    return path.slice(1);
}

async function run() {
    const file = documentNameFromPageUrl();

    if (file.endsWith(".csv")) {
        await loadFile(file);
    } else {
        console.log("todo");
    }
}

async function loadFile(fileName) {
    console.log(`load file ${fileName}`);

    removeChildren(tableSection);

    const path = `/api/table/${fileName}`;
    console.log(`path: ${path}`);
    const resp = await fetch(path);

    if (!resp.ok) {
        console.log("error loading file");
        console.log(resp);
        return;
    }

    const json = await resp.json();

    jspreadsheet(tableSection, {
        data: json.rows
    });
}

function removeChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

await run();
