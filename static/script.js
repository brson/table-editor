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
}

await run();
