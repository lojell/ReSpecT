import { QueryString } from "har-format";
import { capitalize, getUniqueString, toCamelCase, trimEnd } from "../utils/strings";


// IMPORTANT: keep the order exact how it declared here, since the last one covers everything.
const urlPathItemKindTesters = {
    uuid: /[({]?[a-fA-F0-9]{8}[-]?([a-fA-F0-9]{4}[-]?){3}[a-fA-F0-9]{12}[})]?/i,
    mongodbId: /[a-f\d]{24}$/i,
    separatedNumber: /^[\d-\._~]+[^a-zA-Z]+$/,
    number: /^[\d\.]+$/,
    entity: /.+/
};
type UrlPathItemKind = (keyof typeof urlPathItemKindTesters) | 'empty';

const urlPathItemKindTestersList = Object.entries(urlPathItemKindTesters);

export class UrlPathItem {
    public static Unknown = new UrlPathItem("unknown");
    public static Empty = new UrlPathItem("");

    public name: string;
    public normilized: string;
    public capitalized: string;

    public paramName: string = null;

    constructor(pathItemName: string) {
        this.name = pathItemName;
        this.normilized = toCamelCase(pathItemName);
        this.capitalized = capitalize(this.normilized);
    }

    private _kind: UrlPathItemKind;
    public get kind(): UrlPathItemKind {
        if (!this._kind) {
            this._kind = 'empty';

            for (const [kind, tester] of urlPathItemKindTestersList) {
                if (tester.test(this.name)) {
                    this._kind = kind as UrlPathItemKind;
                    break;
                }
            }
        }
        return this._kind;
    }
}

export default class UrlEx {

    public url: URL;
    public queryString: QueryString[];

    constructor(url: string, queryString: QueryString[] = null) {
        this.url = new URL(url);
        this.queryString = queryString;
    }

    private _pathItems: UrlPathItem[];
    public get pathItems(): UrlPathItem[] {
        if (!this._pathItems) {
            this._pathItems = [];

            if (this.url.pathname === '/') {
                return this._pathItems;
            }

            const reservedParamNames: string[] = [];
            const pathNames = this.url.pathname.slice(1).split('/');

            let currentEntityPathItem = UrlPathItem.Unknown;

            for (const pathName of pathNames) {
                const pathItem = new UrlPathItem(pathName);
                if (pathItem.kind === 'entity') {
                    currentEntityPathItem = pathItem
                } else if (pathItem.kind !== 'empty') {
                    const paramName =
                        getUniqueString(
                            currentEntityPathItem.capitalized.toLowerCase() + "Param",
                            reservedParamNames);

                    reservedParamNames.push(paramName)
                    pathItem.paramName = paramName;
                }

                this._pathItems.push(pathItem);
            }
        }

        return this._pathItems;
    }

    private _queryParams: Record<string, Array<string>>;
    public get queryParams(): Record<string, Array<string>> {
        if (!this._queryParams) {
            this._queryParams = this.queryString?.reduce((root, value) => {
                const existingValues = root[value.name] || [];
                root[value.name] = [...new Set([...existingValues, value.value])]
                return root;
            }, {}) as Record<string, Array<string>>;
        }

        return this._queryParams;
    }


    private _pathName: string;
    public get pathName(): string {
        if (!this._pathName) {
            this._pathName = this.pathItems
                .filter(x => x.kind === 'entity')
                .map(x => x.capitalized)
                .join('');
        }

        return this._pathName;
    }

    private _pathTemplate: string;
    public get pathTemplate(): string {
        if (!this._pathTemplate) {
            const url = this.pathItems.reduce((root, value) => {
                root += "/";

                if (value.kind !== 'empty') {
                    root += (value.kind === 'entity' ? value.name : "{" + value.paramName + "}");
                }

                return root;
            }, "");

            this._pathTemplate = url ? url : '/';
        }

        return this._pathTemplate;
    }

    private _shortUrlName: string;
    public get shortUrlName(): string {
        if (!this._shortUrlName) {
            if (this.url.href === "javascript:") {
                this._shortUrlName = "javascript:";
            } else {
                let temp = [];
                let finalUrl = '';
                const urlParts = this.url.pathname !==  '/'
                    ? (this.url.origin + this.url.pathname)
                    : this.url.origin

                for (let urlPart of urlParts.split('/').reverse()) {
                    if (urlPart) {
                        finalUrl = [urlPart, ...temp].join('');
                        break;
                    } else {
                        temp.push('/');
                    }
                }

                this._shortUrlName = finalUrl + this.url.search
            }
        }

        return this._shortUrlName;
    }
}