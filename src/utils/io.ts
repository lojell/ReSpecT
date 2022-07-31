export function saveJSON(data, filename) {
    if (!data) {
        console.error('No data')
        return;
    }

    if (!filename) filename = 'ReSpecT_document.json'

    if (typeof data === "object") {
        data = JSON.stringify(data, undefined, 4)
    }

    const blob = new Blob([data], { type: 'text/json' })
    const a = document.createElement('a');

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
    a.click();
}

export function copyToClipboard(text) {
    var copyFrom = document.createElement("textarea");
    copyFrom.textContent = text;
    document.body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.blur();
    document.body.removeChild(copyFrom);
}