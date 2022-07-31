import toast from 'react-hot-toast';

import { RequestHeader } from "../../devtools/Panel/RequestExecuter/types";
import { isValidUrl } from "../../utils/url";
import HAR from '../../models/HAR';

async function callChromeRequest(requestArg) {
  var { url, method, headers, body } = requestArg;
  try {
    await fetch(url, {
      method: method,
      body: body || undefined,
      headers: headers
    })
  } catch (error) {
    return { error: error.toString() }
  }
  return { success: true };
}

export default class RequestExecuter {

  body = '';
  headers: RequestHeader[] = [{ enabled: true }]
  method = 'GET';
  url = '';

  loading: boolean = false;

  public get isValid(): boolean {
    return isValidUrl(this.url) && !!this.method;
  }

  public get headersValidCount(): number {
    return this.headers.filter(x => x.enabled && x.header && x.value).length;
  }

  public get bodyValidCount(): number {
    return this.body ? 1 : 0;
  }

  setUrl(url: string) {
    this.url = url;
  }

  setMethod(method: string) {
    this.method = method;
  }

  addEmptyHeader() {
    this.headers = [...this.headers, { enabled: true }];
  }

  setFromRequest(request: HAR) {
    this.method = request.request.request.method.toUpperCase()
    this.url = request.request.request.url
    this.headers = request.request.request.headers?.filter(x => x.name[0] != ':').map(x => ({ enabled: true, header: x.name, value: x.value } as RequestHeader));

    if (request.request.request.postData?.params) {
      const formBody = [];
      for (const param of request.request.request.postData?.params) {
        var encodedKey = encodeURIComponent(param.name);
        var encodedValue = encodeURIComponent(param.value);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      this.body = formBody.join("&");
    } else {
      this.body = request.request.request.postData?.text;
    }
  }

  updateHeader(value: RequestHeader, index: number): void {
    this.headers[index].enabled = value.enabled;
    this.headers[index].header = value.header;
    this.headers[index].value = value.value;
  }

  setBody(body: string) {
    this.body = body;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  async doRequest(tabId) {
    if (!this.isValid)
      return;

    this.setLoading(true);

    const headersObj = this.headers
      .filter(x => x.enabled && x.header && x.value)
      .reduce((root, value) => {
        root[value.header] = value.value;
        return root;
      }, {});

    const requestArg = {
      url: this.url,
      method: this.method,
      headers: headersObj,
      body: this.body
    };

    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: callChromeRequest,
        args: [requestArg],
      },
      (injectionResults) => {
        this.setLoading(false);
        const errors = injectionResults.filter(x => x.result?.error);
        if (errors.length) {
          const error = errors.reduce((root, frameResult) => root = root + ' ' + frameResult.result.error, "").trim();
          toast.error(`Something went wrong. \r\n ${error}`, { position: 'top-center' })
        }
      });
  }
}