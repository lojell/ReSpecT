import { parseDomain, ParseResultType } from "parse-domain";

import HAR from "../../models/HAR";
import ApiSpecBuilder from "../../services/ApiSpecBuilder";

export default class AppState {

  tab: chrome.tabs.Tab;
  host: string | null = null;
  hostFilter: { title: string, pattert: RegExp };

  ready = false;
  requests: HAR[] = []

  filteredUrls: string[] = [];

  groupByRequest = false;
  captureNetwork = true;
  isToolsExpanded = true;

  constructor() {
    this._requestFinishedListener = this._requestFinishedListener.bind(this);
  }

  public get baseUrls(): string[] {
    const actualBaseUrls = ApiSpecBuilder.getBaseUrls(this.requests, false);
    return actualBaseUrls.map(x => x.url);
  }


  public get filteredRequests(): HAR[] {
    return this.filteredUrls.length ? this.requests.filter(request => this.filteredUrls.includes(request.urlEx.url.origin)) || [] : this.requests;
  }

  initialize(tab: chrome.tabs.Tab) {
    try {
      this.tab = tab;
      this.setHost(tab ? new URL(tab.url).host : 'ReSpecT')
      this.setCaptureNetwork(true);
      chrome.devtools.network.onRequestFinished.addListener(this._requestFinishedListener);
      this.ready = true;
    } catch (error) {
      console.error(error);
    }
  }

  setHost(host: string) {
    this.host = host;

    const parseResult = parseDomain(host);
    this.hostFilter = parseResult.type === ParseResultType.Listed
      ? { title: `${parseResult.domain}.${parseResult.topLevelDomains}`, pattert: new RegExp(`.${parseResult.domain}.`) }
      : { title: host, pattert: new RegExp(host) }
  }

  addRequest(request: HAR) {
    console.log(request);
    this.requests = [...this.requests, request];
  }

  removeRequest(request: HAR) {
    console.log(request);
    this.requests = [...this.requests.filter(x => x != request)];
  }

  setToolsExpanded(expanded) {
    this.isToolsExpanded = expanded;
  }

  setCaptureNetwork(captureNetwork) {
    this.captureNetwork = captureNetwork;

    // if (captureNetwork) {
    //   chrome.devtools.network.onRequestFinished.addListener(this._requestFinishedListener);
    // } else {
    //   chrome.devtools.network.onRequestFinished.removeListener(this._requestFinishedListener);
    // }
  }

  setGroupByRequest(groupByRequest) {
    this.groupByRequest = groupByRequest;
  }

  setRequestFilter(activeUrls: string[]) {
    this.filteredUrls = activeUrls;
  }

  clearRequests(): void {
    this.requests = [];
    this.filteredUrls = [];
  }

  _requestFinishedListener(request: chrome.devtools.network.Request) {
    // TODO: support only XHR requests for now
    if (request._resourceType !== "fetch" && request._resourceType !== "xhr") {
      return;
    }

    const requestX = new HAR(request);

    if (this.captureNetwork || requestX.isLocal) {
      requestX.resolveContent()
        .then(() => {
          this.addRequest(requestX);
        })
    }
  }
}
