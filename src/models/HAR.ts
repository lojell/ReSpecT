import UrlEx from "./UrlEx";

const verbFriendlyNameMap = {
    'get': 'get',
    'post': 'create',
    'put': 'update',
    'delete': 'delete',
}

export default class HAR {

    public static verbFriendlyName(name: string): string {
        // Sanitize
        const sanitizedName = name.toLowerCase().replace(/[^a-zA-Z\d\s:]/g, '_');
        return verbFriendlyNameMap[sanitizedName] || sanitizedName;
    }

    public request: chrome.devtools.network.Request;
    public responseBody: any;

    constructor(request: chrome.devtools.network.Request) {
        this.request = request;
    }

    private _urlEx: UrlEx;
    public get urlEx(): UrlEx {
        return this._urlEx || (this._urlEx = new UrlEx(this.request.request.url, this.request.request.queryString));
    }

    private _isLocal: boolean;
    public get isLocal(): boolean {
        // @ts-ignore
        return this._isLocal || (this._isLocal = this.request?._initiator?.stack?.callFrames?.at(0)?.functionName === 'callChromeRequest');
    }

    private _schemaName: string;
    public get schemaName(): string {
        return this._schemaName || (this._schemaName = HAR.verbFriendlyName(this.request.request.method) + this.urlEx.pathName);
    }

    private _status: string;
    public get status(): string {
        return this._status || (this._status = this.request.response.status || this.request.response["_error"]);
    }

    private _hasError: boolean;
    public get hasError(): boolean {
        return this._hasError || (this._hasError = !this.request.response.status && this.request.response["_error"]);
    }

    //!!!!!!!!!!!!!!!!!!!!!!!! TODO: posibily the order of the requests can  be broken
    async resolveContent() {
        return new Promise<any>((resolve, reject) => {
            this.request.getContent((body, encoding) => {
                this.responseBody = null;
                if (body) {
                    const decodedBody = encoding === 'base64' ? atob(body) : body;
                    try {
                        this.responseBody = JSON.parse(decodedBody);
                    } catch (error) {
                        this.responseBody = decodedBody;
                    }
                }
                resolve(this.responseBody);
            });
        });
    };
}