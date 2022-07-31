import { PathItemObject, ReferenceObject, RequestBodyObject, ResponsesObject, SchemaObject, SchemasObject } from "openapi3-ts";
import ApiSpecBuilder, { OpenApiSpecBuildParams } from "../services/ApiSpecBuilder";
import { QueryString, PostData, Param, Response } from 'har-format';

import getRequest from './data/get.request.json';
import UrlEx from "../models/UrlEx";
import HAR from "../models/HAR";
import { mergeDeep } from "../utils/object";

describe("ApiSpecBuilder", () => {

  describe("createOpenApiV3", () => {
    it("should return initialized ApiSpecBuilder", () => {
      // Act
      const sut = ApiSpecBuilder.createOpenApiV3();

      // Assert
      expect(sut).not.toBeNull();
    });
  })


  describe("getBaseUrls", () => {

    it("should return all URLs in ordered manner", () => {
      // Arrange
      const expectedBaseUrls = [
        { url: 'https://api.github.com', count: 4 },
        { url: 'http://localhost:3000', count: 3 },
        { url: 'https://glovo.com', count: 1 },
      ];
      const requests = [
        { request: { url: `${expectedBaseUrls[0].url}/_private/browser/stats` } },
        { request: { url: `${expectedBaseUrls[0].url.toUpperCase()}/1/1/stats` } },
        { request: { url: `${expectedBaseUrls[2].url.toUpperCase() + '/'}/1/1/2` } },
        { request: { url: `${expectedBaseUrls[1].url + '/'}/3331/1/2` } },
        { request: { url: `${expectedBaseUrls[1].url.toUpperCase() + '/'}/3331/1/2` } },
        { request: { url: `${expectedBaseUrls[1].url.toUpperCase() + '/'}` } },
        { request: { url: `${expectedBaseUrls[0].url + '/'}` } },
        { request: { url: `${expectedBaseUrls[0].url.toUpperCase() + '/'}test` } },
        { request: { url: `javascript:` } },
      ].map(x => new HAR(x as chrome.devtools.network.Request));

      // Act
      const actualBaseUrls = ApiSpecBuilder.getBaseUrls(requests);

      // Assert
      expect(actualBaseUrls).toEqual(expectedBaseUrls)
    });

  });


  describe("buildPaths", () => {

    describe("Single request", () => {
      test("GET request - should not be null", () => {
        // Arrange
        const getRequest = require('./data/get.request.json');
        const sut = ApiSpecBuilder.createOpenApiV3();
        sut.buildRequestBody = () => ({} as any);

        // Act
        const getPathObject = sut.buildPaths([new HAR(getRequest as chrome.devtools.network.Request)]);

        // Assert
        expect(getPathObject?.paths).not.toBeNull();
      });

      test("GET request - path should be set", () => {
        // Arrange
        const getRequest = require('./data/get.request.json');
        const sut = ApiSpecBuilder.createOpenApiV3();
        sut.buildRequestBody = () => ({} as any);

        // Act
        const { paths } = sut.buildPaths([new HAR(getRequest as chrome.devtools.network.Request)]);

        // Assert
        expect(paths).toHaveProperty('/cs/sa/store_addresses/orders');
      });

      test("GET request - path should be set if its empty", () => {
        // Arrange
        const getRequest = JSON.parse(JSON.stringify(require('./data/get.request.json')));
        getRequest.request.url = "http://localhost";

        const sut = ApiSpecBuilder.createOpenApiV3();
        sut.buildRequestBody = () => ({} as any);

        // Act
        const { paths } = sut.buildPaths([new HAR(getRequest as chrome.devtools.network.Request)]);

        // Assert
        expect(paths).toHaveProperty('/');
      });

      test("GET request - only `get` section should be generated ", () => {
        // Arrange
        const getRequest = require('./data/get.request.json');
        const sut = ApiSpecBuilder.createOpenApiV3();
        sut.buildRequestBody = () => ({} as any);

        // Act
        const { paths: { "/cs/sa/store_addresses/orders": path } }
          = sut.buildPaths([new HAR(getRequest as chrome.devtools.network.Request)]);

        // Assert
        expect(path.get).not.toBeNull();
        expect(path.delete).toBeUndefined();
        expect(path.head).toBeUndefined();
        expect(path.options).toBeUndefined();
        expect(path.parameters).toBeUndefined();
        expect(path.patch).toBeUndefined();
        expect(path.post).toBeUndefined();
        expect(path.put).toBeUndefined();
        expect(path.servers).toBeUndefined();
        expect(path.summary).toBeUndefined();
        expect(path.trace).toBeUndefined();
        expect(path.$ref).toBeUndefined();
      });

      test("GET request - `operationId` correctly generated", () => {
        // Arrange
        const getRequest = require('./data/get.request.json');
        const sut = ApiSpecBuilder.createOpenApiV3();
        sut.buildRequestBody = () => ({} as any);

        // Act
        const { paths: { "/cs/sa/store_addresses/orders": { get } } }
          = sut.buildPaths([new HAR(getRequest as chrome.devtools.network.Request)]);

        // Assert
        expect(get.operationId).toEqual('getCsSaStoreAddressesOrders');
      });

      // test("GET request - `description` correctly generated", () => {
      //   // Arrange
      //   const getRequest = require('./data/get.request.json');
      //   const sut = ApiSpecBuilder.createOpenApiV3();
      //   sut.buildRequestBody = () => ({} as any);

      //   // Act
      //   const { paths: { "/cs/sa/store_addresses/orders": { get } } }
      //     = sut.buildPaths([new HAR(getRequest as chrome.devtools.network.Request)]);

      //   // Assert
      //   expect(get.description).toEqual('Generated by reSpecT');
      // });

      test("GET request - `summary` correctly generated", () => {
        // Arrange
        const getRequest = require('./data/get.request.json');
        const sut = ApiSpecBuilder.createOpenApiV3();
        sut.buildRequestBody = () => ({} as any);

        // Act
        const { paths: { "/cs/sa/store_addresses/orders": { get } } }
          = sut.buildPaths([new HAR(getRequest as chrome.devtools.network.Request)]);

        // Assert
        expect(get.summary).toEqual('Get CsSaStoreAddressesOrders record');
      });
    });

    describe("Multiple requests", () => {
      test("Multiple urls with the same urlPathTemplate", () => {
        // Arrange
        const requests = [
          { request: { method: "GET", url: 'https://api.site.com/Cs//sA////oRders//5f5138285762c04e946fc3ad2e7693e0/shoW_now' } },
          //{ request: { url: 'https://api.site.com/Cs//sA////oRders//11111/shoW_now', queryString: [{ name: "testParam", value: "" }] } },
          { request: { method: "GET", url: 'https://api.site.com/Cs//sA////oRders//33333/shoW_now' } },
          { request: { method: "GET", url: 'https://api.site.com/Cs//sA////oRders//11111--222_/shoW_now', } },
          { request: { method: "GET", url: 'https://api.site.com/Cs//sA////oRders//59c5c7cf-cefd-44c5-9a25-04c01eb1a0a7/shoW_now', } },
          { request: { method: "GET", url: 'https://api.site.com/Cs//sA////oRders//507f191e810c19729de860ea/shoW_now', } },
        ].map(x => new HAR(x as chrome.devtools.network.Request));

        const sut = ApiSpecBuilder.createOpenApiV3();
        sut.buildParameters = jest.fn();
        sut.buildRequestBody = () => ({} as any);

        // Act
        const { paths } = sut.buildPaths(requests);

        // Assert
        const pathes = Object.entries(paths);
        expect(pathes).toHaveLength(1);

        const [[pathTemplate, options]] = pathes;
        expect(pathTemplate).toEqual('/Cs//sA////oRders//{ordersParam}/shoW_now');
        expect(options).toHaveProperty('get');
        expect(options.get.operationId).toEqual('getCsSaOrdersShowNow');
        expect(options.get.summary).toEqual('Get CsSaOrdersShowNow record');
      });

      test("Same urlPathTemplate, Same method", () => {
        // Arrange
        const requests = [
          { request: { method: "GET", url: 'https://api.site.com/Cs//sA////oRders//5f5138285762c04e946fc3ad2e7693e0/shoW_now' } },
          { request: { method: "GET", url: 'https://api.site.com/Cs//sA////oRders//33333/shoW_now' } },
          { request: { method: "GET", url: 'https://api.site.com/Cs//sA////oRders//11111--222_/shoW_now', } },
          { request: { method: "GET", url: 'https://api.site.com/Cs//sA////oRders//59c5c7cf-cefd-44c5-9a25-04c01eb1a0a7/shoW_now', } },
          { request: { method: "GET", url: 'https://api.site.com/Cs//sA////oRders//507f191e810c19729de860ea/shoW_now', } },
        ].map(x => new HAR(x as chrome.devtools.network.Request));

        const sut = ApiSpecBuilder.createOpenApiV3();
        sut.buildParameters = jest.fn();
        sut.buildRequestBody = () => ({} as any);

        // Act
        const { paths } = sut.buildPaths(requests);

        // Assert
        const pathes = Object.entries(paths);
        expect(pathes).toHaveLength(1);

        const [[pathTemplate, options]] = pathes;
        expect(pathTemplate).toEqual('/Cs//sA////oRders//{ordersParam}/shoW_now');
        expect(options).toHaveProperty('get');
        expect(options.get.operationId).toEqual('getCsSaOrdersShowNow');
        expect(options.get.summary).toEqual('Get CsSaOrdersShowNow record');
      });

      test("Same urlPathTemplate, Different method", () => {
        // Arrange
        const requests = [
          { request: { method: "GET", url: 'https://api.site.com/Cs//sA////oRders//5f5138285762c04e946fc3ad2e7693e0/shoW_now' } },
          { request: { method: "GET", url: 'https://api.site.com/Cs//sA////oRders//33333/shoW_now' } },
          { request: { method: "DELETE", url: 'https://api.site.com/Cs//sA////oRders//11111--222_/shoW_now', } },
          { request: { method: "POST", url: 'https://api.site.com/Cs//sA////oRders//59c5c7cf-cefd-44c5-9a25-04c01eb1a0a7/shoW_now', } },
          { request: { method: "PUT", url: 'https://api.site.com/Cs//sA////oRders//507f191e810c19729de860ea/shoW_now', } },
        ].map(x => new HAR(x as chrome.devtools.network.Request));

        const sut = ApiSpecBuilder.createOpenApiV3();
        sut.buildParameters = jest.fn();
        sut.buildRequestBody = () => ({} as any);

        // Act
        const { paths } = sut.buildPaths(requests);

        // Assert
        const pathes = Object.entries(paths);
        expect(pathes).toHaveLength(1);

        const [[pathTemplate, options]] = pathes;
        expect(pathTemplate).toEqual('/Cs//sA////oRders//{ordersParam}/shoW_now');

        expect(Object.entries(options)).toHaveLength(4);

        expect(options).toHaveProperty('get');
        expect(options.get.operationId).toEqual('getCsSaOrdersShowNow');

        expect(options).toHaveProperty('delete');
        expect(options.delete.operationId).toEqual('deleteCsSaOrdersShowNow');

        expect(options).toHaveProperty('post');
        expect(options.post.operationId).toEqual('createCsSaOrdersShowNow');

        expect(options).toHaveProperty('put');
        expect(options.put.operationId).toEqual('updateCsSaOrdersShowNow');

      });

      test("Different urlPathTemplate, Different method", () => {
        // Arrange
        const requests = [
          { request: { method: "GET", url: 'https://api.site.com/Cs//sA////oRders//5f5138285762c04e946fc3ad2e7693e0/shoW_now' } },
          { request: { method: "GET", url: 'https://api.site.com/Cs//sA////oRders//unknown/shoW_now' } },
          { request: { method: "DELETE", url: 'https://api.site.com/Cs//sA////oRders//11111--222_/shoW_now', } },
          { request: { method: "POST", url: 'https://api.site.com/Cs//sA////oRders//test_path/shoW_now', } },
          { request: { method: "PUT", url: 'https://api.site.com/Cs//sA////oRders//507f191e810c19729de860ea/shoW_now', } },
        ].map(x => new HAR(x as chrome.devtools.network.Request));

        const sut = ApiSpecBuilder.createOpenApiV3();
        sut.buildParameters = jest.fn();
        sut.buildRequestBody = () => ({} as any);

        // Act
        const { paths } = sut.buildPaths(requests);

        // Assert
        const pathes = Object.entries(paths);
        expect(pathes).toHaveLength(3);

        const [[testPath, testPathOptions], [unknownPath, unknownPathOptions], [paramPath, paramPathOptions]] = pathes;

        expect(testPath).toEqual('/Cs//sA////oRders//test_path/shoW_now');
        expect(Object.entries(testPathOptions)).toHaveLength(1);
        expect(testPathOptions?.post?.operationId).toEqual('createCsSaOrdersTestPathShowNow');

        expect(unknownPath).toEqual('/Cs//sA////oRders//unknown/shoW_now');
        expect(Object.entries(unknownPathOptions)).toHaveLength(1);
        expect(unknownPathOptions?.get?.operationId).toEqual('getCsSaOrdersUnknownShowNow');

        expect(paramPath).toEqual('/Cs//sA////oRders//{ordersParam}/shoW_now');
        expect(Object.entries(paramPathOptions)).toHaveLength(3);
        expect(paramPathOptions?.get?.operationId).toEqual('getCsSaOrdersShowNow');
        expect(paramPathOptions?.delete?.operationId).toEqual('deleteCsSaOrdersShowNow');
        expect(paramPathOptions?.put?.operationId).toEqual('updateCsSaOrdersShowNow');
      });
    });
  });


  // https://swagger.io/docs/specification/serialization/#Query%20Parameters
  describe("buildParameters", () => {

    test("Empty parameters", () => {
      // Arrange
      const sut = ApiSpecBuilder.createOpenApiV3();

      // Act
      const parameters = sut.buildParameters([]);

      // Assert
      expect(parameters).toBeUndefined();
    });

    test("Simple parameters", () => {
      // Arrange
      const queryString: QueryString[] = [
        { name: 'strParam', value: 'param_value' },
        { name: 'numParam', value: '1.323' },
        { name: 'booleanParam', value: 'TRUE' },
      ];
      const sut = ApiSpecBuilder.createOpenApiV3();

      // Act
      const parameters = sut.buildParameters([new UrlEx("http://localhost", queryString)]);

      // Assert
      expect(parameters?.length).toEqual(3);

      const [strParam, numParam, booleanParam] = parameters;

      expect(strParam.name).toEqual(queryString[0].name);
      expect(strParam.in).toEqual('query');
      expect(strParam.style).toEqual('form');
      expect(strParam.required).toEqual(false);
      expect(strParam.explode).toEqual(true);
      // @ts-ignore
      expect(strParam.schema.type).toEqual('string');

      expect(numParam.name).toEqual(queryString[1].name);
      expect(numParam.in).toEqual('query');
      expect(numParam.style).toEqual('form');
      expect(numParam.required).toEqual(false);
      expect(numParam.explode).toEqual(true);
      // @ts-ignore
      expect(numParam.schema.type).toEqual('number');

      expect(booleanParam.name).toEqual(queryString[2].name);
      expect(booleanParam.in).toEqual('query');
      expect(booleanParam.style).toEqual('form');
      expect(booleanParam.required).toEqual(false);
      expect(booleanParam.explode).toEqual(true);
      // @ts-ignore
      expect(booleanParam.schema.type).toEqual('boolean');
    });

    describe("style = form; explode = true", () => {

      test("Array mapping", () => {
        // Arrange
        const queryString: QueryString[] = [
          { name: 'strArray', value: 'param1_value' },
          { name: 'strArray', value: 'param1_value' }, // Duplicate
          { name: 'strArray', value: 'param2_value' },
          { name: 'strArray', value: 'param3_value' },

          { name: 'numArray', value: '1' },
          { name: 'numArray', value: '2' },
          { name: 'numArray', value: '3.4' },
          { name: 'numArray', value: '3444' },

          { name: 'booleanArray', value: 'true' },
          { name: 'booleanArray', value: 'True' },
          { name: 'booleanArray', value: 'false' },
          { name: 'booleanArray', value: 'FALSE' },
        ];
        const sut = ApiSpecBuilder.createOpenApiV3();

        // Act
        const parameters = sut.buildParameters([new UrlEx("http://localhost", queryString)]);

        // Assert
        expect(parameters?.length).toEqual(3);

        const [strArray, numArray, booleanArray] = parameters;

        expect(strArray.name).toEqual(queryString[0].name);
        expect(strArray.in).toEqual('query');
        // @ts-ignore
        expect(strArray.schema.type).toEqual('array');
        // @ts-ignore
        expect(strArray.schema.items.type).toEqual('string');


        expect(numArray.name).toEqual(queryString[4].name);
        expect(numArray.in).toEqual('query');
        // @ts-ignore
        expect(numArray.schema.type).toEqual('array');
        // @ts-ignore
        expect(numArray.schema.items.type).toEqual('number');

        expect(booleanArray.name).toEqual(queryString[8].name);
        expect(booleanArray.in).toEqual('query');
        // @ts-ignore
        expect(booleanArray.schema.type).toEqual('array');
        // @ts-ignore
        expect(booleanArray.schema.items.type).toEqual('boolean');
      });

      // TODO: for now it's just simple parameter mapping
      // test("Object mapping", () => {

      // });
    });

    test("Multiple urls", () => {
      // Arrange
      const queryString1: QueryString[] = [
        { name: 'param1', value: 'param_value' },
        { name: 'param2', value: '1.323' },
        { name: 'param3', value: 'TRUE' },
      ];

      const queryString2: QueryString[] = [
        { name: 'param1', value: '1.323' },
        { name: 'param2', value: 'param_value' },
        { name: 'param3', value: 'param_value2' },
      ];

      const urls = [
        { url: 'https://api.site.com/Cs//sA////oRders//5f5138285762c04e946fc3ad2e7693e0/shoW_now', queryString: queryString2 },
        { url: 'https://api.site.com/Cs//sA////oRders//11111/shoW_now', queryString: queryString1 },
        { url: 'https://api.site.com/Cs//sA////oRders//33333/shoW_now', queryString: queryString2 },
        { url: 'https://api.site.com/Cs//sA////oRders//11111--222_/shoW_now', queryString: queryString1 },
        { url: 'https://api.site.com/Cs//sA////oRders//59c5c7cf-cefd-44c5-9a25-04c01eb1a0a7/shoW_now', queryString: [queryString1[0], queryString1[1]] },
        { url: 'https://api.site.com/Cs//sA////oRders//507f191e810c19729de860ea/shoW_now', },
      ].map(request => new UrlEx(request.url, request.queryString));


      const sut = ApiSpecBuilder.createOpenApiV3();

      // Act
      const parameters = sut.buildParameters(urls);

      // Assert
      expect(parameters?.length).toEqual(4);

      const [ordersParam, param1, param2, param3] = parameters;

      expect(ordersParam.name).toEqual("ordersParam");
      expect(ordersParam.in).toEqual("path");
      expect(ordersParam.required).toBeTruthy();
      // @ts-ignore
      expect(ordersParam.schema.type).toEqual("string");

      expect(param1.name).toEqual("param1");
      expect(param1.in).toEqual('query');
      expect(param1.style).toEqual('form');
      expect(param1.required).toEqual(false);
      expect(param1.explode).toEqual(true);
      // @ts-ignore
      expect(param1.schema.type).toEqual('array');
      // @ts-ignore
      expect(param1.schema.items.type).toEqual('string');

      expect(param2.name).toEqual("param2");
      expect(param2.in).toEqual('query');
      expect(param2.style).toEqual('form');
      expect(param2.required).toEqual(false);
      expect(param2.explode).toEqual(true);
      // @ts-ignore
      expect(param2.schema.type).toEqual('array');
      // @ts-ignore
      expect(param2.schema.items.type).toEqual('string');

      expect(param3.name).toEqual("param3");
      expect(param3.in).toEqual('query');
      expect(param3.style).toEqual('form');
      expect(param3.required).toEqual(false);
      expect(param3.explode).toEqual(true);
      // @ts-ignore
      expect(param3.schema.type).toEqual('array');
      // @ts-ignore
      expect(param3.schema.items.type).toEqual('string');
    });
  });


  describe("buildRequestBody", () => {

    describe("schemaName", () => {
      it("should correctly set schemaName", () => {
        // Arrange
        const mimeType = "application/x-www-form-urlencoded";
        const schemaName = 'getApiUser';

        const body: PostData = {
          mimeType: `${mimeType}; charset=UTF-8`,
          text: undefined
        }
        const request = new HAR({ request: { postData: body, method: 'GET', url: 'http://test.site/api/user' } } as chrome.devtools.network.Request);

        const sut = ApiSpecBuilder.createOpenApiV3();

        // Act
        const { requestBody, requestSchemas } = sut.buildRequestBody([request]);

        // Assert
        const reference = requestBody.content[mimeType].schema as ReferenceObject;
        expect(reference.$ref).toEqual(`#/components/schemas/${schemaName}`);
      });
    });

    describe("mimeType check", () => {
      it("should be application/x-www-form-urlencoded based on mimeType", () => {
        // Arrange
        const mimeType = "application/x-www-form-urlencoded";
        const body: PostData = {
          mimeType: `${mimeType}; charset=UTF-8`,
          params: undefined,
          text: undefined
        }
        const request = new HAR({ request: { postData: body, method: 'GET', url: 'http://test.site/api/user' } } as chrome.devtools.network.Request);

        const sut = ApiSpecBuilder.createOpenApiV3();

        // Act
        const { requestBody: actualBody } = sut.buildRequestBody([request]);

        // Assert
        expect(actualBody).not.toBeNull();
        expect(actualBody.content).toHaveProperty(mimeType);
      });

      it("should be application/x-www-form-urlencoded based on `params` set", () => {
        // Arrange
        const mimeType = "application/x-www-form-urlencoded";
        const body: PostData = {
          mimeType: `application/json; charset=UTF-8`,
          params: [],
          text: undefined
        }
        const request = new HAR({ request: { postData: body, method: 'GET', url: 'http://test.site/api/user' } } as chrome.devtools.network.Request);

        const sut = ApiSpecBuilder.createOpenApiV3();

        // Act
        const { requestBody: actualBody } = sut.buildRequestBody([request]);

        // Assert
        expect(actualBody).not.toBeNull();
        expect(actualBody.content).toHaveProperty(mimeType);
      });

      it("should be application/json based on mimeType", () => {
        // Arrange
        const mimeType = "application/json";
        const body: PostData = {
          mimeType: `${mimeType}; charset=UTF-8`,
          params: undefined,
          text: undefined
        }
        const request = new HAR({ request: { postData: body, method: 'GET', url: 'http://test.site/api/user' } } as chrome.devtools.network.Request);

        const sut = ApiSpecBuilder.createOpenApiV3();

        // Act
        const { requestBody: actualBody } = sut.buildRequestBody([request]);

        // Assert
        expect(actualBody).not.toBeNull();
        expect(actualBody.content).toHaveProperty(mimeType);
      });

      it("should be application/json based on `text` set", () => {
        // Arrange
        const mimeType = "application/json";
        const body: PostData = {
          mimeType: `application/x-www-form-urlencoded; charset=UTF-8`,
          params: undefined,
          text: "{}"
        }
        const request = new HAR({ request: { postData: body, method: 'GET', url: 'http://test.site/api/user' } } as chrome.devtools.network.Request);

        const sut = ApiSpecBuilder.createOpenApiV3();

        // Act
        const { requestBody: actualBody } = sut.buildRequestBody([request]);

        // Assert
        expect(actualBody).not.toBeNull();
        expect(actualBody.content).toHaveProperty(mimeType);
      });
    });


    describe("Param", () => {

      test("Single request", () => {
        // Arrange
        const mimeType = "application/x-www-form-urlencoded";
        const schemaName = 'getApiUser';

        const body: PostData = {
          mimeType: `${mimeType}; charset=UTF-8`,
          params: [
            { name: 'param_1', value: 'param_1_value' },
            { name: 'param_2', value: '1' },
            { name: 'param_3', value: 'True' },
          ],
        }
        const request = new HAR({ request: { postData: body, method: 'GET', url: 'http://test.site/api/user' } } as chrome.devtools.network.Request);

        const sut = ApiSpecBuilder.createOpenApiV3();

        // Act
        const { requestBody, requestSchemas } = sut.buildRequestBody([request]);

        // Assert
        const reference = requestBody.content[mimeType].schema as ReferenceObject;
        expect(reference.$ref).toEqual(`#/components/schemas/${schemaName}`);

        expect(requestSchemas).toHaveProperty(schemaName);
        expect(requestSchemas[schemaName].type).toEqual('object');

        const schema = requestSchemas[schemaName].properties as { [s: string]: SchemaObject }
        expect(schema[body.params[0].name].type).toEqual('string');
        expect(schema[body.params[1].name].type).toEqual('number');
        expect(schema[body.params[2].name].type).toEqual('boolean');
      });

      test("Multiple requests", () => {
        // Arrange
        const mimeType = "application/x-www-form-urlencoded";
        const schemaName = 'getApiUser';

        const requests = [
          {
            method: 'GET',
            url: 'http://test.site/api/user',
            postData: {
              mimeType: `${mimeType}; charset=UTF-8`,
              params: [
                { name: 'param_1', value: 'param_1_value' },
                { name: 'param_2', value: '1' },
                { name: 'param_3', value: 'True' },
                { name: 'param_5', value: 'tRue' },
              ],
            }
          },
          {
            method: 'GET',
            url: 'http://test.site/api/user',
            postData: {
              mimeType: `${mimeType}; charset=UTF-8`,
              params: [
                { name: 'param_3', value: 'param_1_value' },
                { name: 'param_1', value: '1' },
                { name: 'param_2', value: 'False' },
                { name: 'param_4', value: '1.2' },
                { name: 'param_5', value: 'False' },
              ],
            }
          }
        ].map(request => new HAR({ request } as chrome.devtools.network.Request))

        const sut = ApiSpecBuilder.createOpenApiV3();

        // Act
        const { requestBody, requestSchemas } = sut.buildRequestBody(requests);

        // Assert
        const reference = requestBody.content[mimeType].schema as ReferenceObject;
        expect(reference.$ref).toEqual(`#/components/schemas/${schemaName}`);

        expect(requestSchemas).toHaveProperty(schemaName);
        expect(requestSchemas[schemaName].type).toEqual('object');

        const schema = requestSchemas[schemaName].properties as { [s: string]: SchemaObject }
        expect(schema["param_1"].type).toEqual('string')
        expect(schema["param_2"].type).toEqual('string')
        expect(schema["param_3"].type).toEqual('string')
        expect(schema["param_4"].type).toEqual('number')
        expect(schema["param_5"].type).toEqual('boolean')
      });

    });

    describe("Text", () => {

      test("Single request", () => {
        // Arrange
        const mimeType = "application/json";
        const schemaName = 'getApiUser';
        const bodyJson = {
          field_1: 11,
          field_2: "str",
          field_3: true,
          nestedObject: {
            field_1: "str",
            field_2: true,
            field_3: 33,
            array: [{ field: 1 }]
          }
        };

        const body: PostData = {
          mimeType: `${mimeType}; charset=UTF-8`,
          text: JSON.stringify(bodyJson),
        }
        const request = new HAR({ request: { postData: body, method: 'GET', url: 'http://test.site/api/user' } } as chrome.devtools.network.Request);

        const sut = ApiSpecBuilder.createOpenApiV3();

        // Act
        const { requestBody, requestSchemas } = sut.buildRequestBody([request]);

        // Assert
        const reference = requestBody.content[mimeType].schema as ReferenceObject;

        expect(requestSchemas).toHaveProperty(schemaName);
        expect(requestSchemas[schemaName].type).toEqual('object');
        expect(requestSchemas[schemaName]).toMatchObject(sut.buildSchemaObject(bodyJson));
      });

      test("Multiple requests - same schema", () => {
        // Arrange
        const mimeType = "application/json";
        const schemaName = 'getApiUser';

        const bodyJson = {
          field_1: 11,
          field_2: "str",
          field_3: true,
          nestedObject: {
            field_1: "str",
            field_2: true,
            field_3: 33,
            array: [{ field: 1 }]
          }
        };

        const requests = [
          {
            method: 'GET',
            url: 'http://test.site/api/user',
            postData: {
              mimeType: `${mimeType}; charset=UTF-8`,
              text: JSON.stringify(bodyJson),
            }
          },
          {
            method: 'GET',
            url: 'http://test.site/api/user',
            postData: {
              mimeType: `${mimeType}; charset=UTF-8`,
              text: JSON.stringify(bodyJson),
            }
          }
        ].map(request => new HAR({ request } as chrome.devtools.network.Request))

        const sut = ApiSpecBuilder.createOpenApiV3();

        // Act
        const { requestBody, requestSchemas } = sut.buildRequestBody(requests);

        // Assert
        const reference = requestBody.content[mimeType].schema as ReferenceObject;

        expect(requestSchemas).toHaveProperty(schemaName);
        expect(requestSchemas[schemaName].type).toEqual('object');
        expect(requestSchemas[schemaName]).toMatchObject(sut.buildSchemaObject(bodyJson));
      });

      test("Multiple requests - different schema", () => {
        // Arrange
        const mimeType = "application/json";
        const schemaName = 'getApiUser';

        const body1Json = {
          field_1: 11,
          field_2: "str",
          field_3: true,
          nestedObject: {
            field_1: "str",
            field_2: true,
            field_3: 33,
            array: [{ field: 1 }]
          }
        };

        const body2Json = {
          field_1: 11,
          field_1_1: 12.22,
          field_2: "str",
          field_2_2: "str2",
          field_3: true,
          field_3_3: false,
          nestedObject: {
            field_1: "str",
            field_1_1: "str1",
            field_2: true,
            field_2_1: false,
            field_3: 33,
            field_3_1: 33.11,
            array: [{ field: 1, field_1: 2 }, { field_2: 'str' }]
          }
        };

        const requests = [
          {
            method: 'GET',
            url: 'http://test.site/api/user',
            postData: {
              mimeType: `${mimeType}; charset=UTF-8`,
              text: JSON.stringify(body1Json),
            }
          },
          {
            method: 'GET',
            url: 'http://test.site/api/user',
            postData: {
              mimeType: `${mimeType}; charset=UTF-8`,
              text: JSON.stringify(body2Json),
            }
          }
        ].map(request => new HAR({ request } as chrome.devtools.network.Request))

        const sut = ApiSpecBuilder.createOpenApiV3();

        // Act
        const { requestBody, requestSchemas } = sut.buildRequestBody(requests);

        // Assert
        const reference = requestBody.content[mimeType].schema as ReferenceObject;

        expect(requestSchemas).toHaveProperty(schemaName);
        expect(requestSchemas[schemaName].type).toEqual('object');
        expect(requestSchemas[schemaName]).toMatchObject(sut.buildSchemaObject(mergeDeep([body1Json, body2Json])));
      });
    });
  });

  describe("buildResponses", () => {
    test("basic", () => {
      // Arrange
      const mimeType = "application/x-www-form-urlencoded";
      const status = 200;
      const response: Response = {
        content: {
          mimeType,
          size: 0,
        },
        status,
        statusText: '',
        httpVersion: 'http1',
        cookies: [],
        headers: [],
        redirectURL: "",
        headersSize: 0,
        bodySize: 0
      };

      const body1Json = {
        field_1: 11,
        field_2: "str",
        field_3: true,
        nestedObject: {
          field_1: "str",
          field_2: true,
          field_3: 33,
          array: [{ field: 1 }]
        }
      };

      const request = new HAR({ response, request: { method: 'POST', url: 'http://test.site/api/user', } } as chrome.devtools.network.Request);
      request.responseBody = body1Json;

      const sut = ApiSpecBuilder.createOpenApiV3();

      // Act
      const responses = sut.buildResponses([request]);

      // Assert
      expect(responses).toBeTruthy();

      const { responsesObject, responseSchemas } = responses;

      expect(responsesObject).toHaveProperty(`${status}`);
      expect(responsesObject[status].content).toHaveProperty(mimeType);
      expect(responsesObject[status].content[mimeType].schema.$ref).toEqual('#/components/schemas/createApiUser');

      const schema = JSON.parse('{"createApiUser":{"type":"object","properties":{"field_1":{"type":"number"},"field_2":{"type":"string"},"field_3":{"type":"boolean"},"nestedObject":{"type":"object","properties":{"field_1":{"type":"string"},"field_2":{"type":"boolean"},"field_3":{"type":"number"},"array":{"type":"array","items":{"type":"object","properties":{"field":{"type":"number"}}}}}}}}}');
      expect(responseSchemas).toMatchObject(schema);
    });
  });


  describe("buildSchemaObject", () => {
    test("null", () => {
      // Arrange
      const body = null;
      const sut = ApiSpecBuilder.createOpenApiV3();

      // Act
      const schemaObject = sut.buildSchemaObject(body);

      // Assert
      expect(schemaObject.type).toEqual('null');
    });

    test("string", () => {
      // Arrange
      const body = "body";
      const sut = ApiSpecBuilder.createOpenApiV3();

      // Act
      const schemaObject = sut.buildSchemaObject(body) as SchemaObject;

      // Assert
      expect(schemaObject.type).toEqual('string');
    });

    test("flat object", () => {
      // Arrange
      const body = {
        field_num: 11,
        field_str: "str",
        field_bool: true,
      };
      const sut = ApiSpecBuilder.createOpenApiV3();

      // Act
      const schemaObject = sut.buildSchemaObject(body) as SchemaObject;

      // Assert
      expect(schemaObject.type).toEqual('object');
      // @ts-ignore
      expect(schemaObject.properties.field_num.type).toEqual('number');
      // @ts-ignore
      expect(schemaObject.properties.field_str.type).toEqual('string');
      // @ts-ignore
      expect(schemaObject.properties.field_bool.type).toEqual('boolean');
    });

    test("nested object", () => {
      // Arrange
      const body = {
        field_1: 11,
        field_2: "str",
        field_3: true,
        nestedObject: {
          field_1: "str",
          field_2: true,
          field_3: 33,
        }
      };
      const sut = ApiSpecBuilder.createOpenApiV3();

      // Act
      const schemaObject = sut.buildSchemaObject(body) as SchemaObject;

      // Assert
      expect(schemaObject.type).toEqual('object');
      // @ts-ignore
      expect(schemaObject.properties.field_1.type).toEqual('number');
      // @ts-ignore
      expect(schemaObject.properties.field_2.type).toEqual('string');
      // @ts-ignore
      expect(schemaObject.properties.field_3.type).toEqual('boolean');

      // @ts-ignore
      expect(schemaObject.properties.nestedObject.type).toEqual('object');
      // @ts-ignore
      expect(schemaObject.properties.nestedObject.properties.field_1.type).toEqual('string');
      // @ts-ignore
      expect(schemaObject.properties.nestedObject.properties.field_2.type).toEqual('boolean');
      // @ts-ignore
      expect(schemaObject.properties.nestedObject.properties.field_3.type).toEqual('number');
    });

    test("empty array", () => {
      // Arrange
      const body = [];
      const sut = ApiSpecBuilder.createOpenApiV3();

      // Act
      const schemaObject = sut.buildSchemaObject(body) as SchemaObject;

      // Assert
      expect(schemaObject.type).toEqual('array');
      expect(schemaObject.items).toBeUndefined();
    });

    test("array", () => {
      // Arrange
      const body = [{ field: 1 }];
      const sut = ApiSpecBuilder.createOpenApiV3();

      // Act
      const schemaObject = sut.buildSchemaObject(body) as SchemaObject;

      // Assert
      expect(schemaObject.type).toEqual('array');
      // @ts-ignore
      expect(schemaObject.items.type).toEqual('object');
      // @ts-ignore
      expect(schemaObject.items.properties.field.type).toEqual('number');

    });

    test("nested array", () => {
      // Arrange
      const body = {
        field_1: 11,
        field_2: "str",
        field_3: true,
        nestedObject: {
          field_1: "str",
          field_2: true,
          field_3: 33,
          array: [{ field: 1 }]
        }
      };
      const sut = ApiSpecBuilder.createOpenApiV3();

      // Act
      const schemaObject = sut.buildSchemaObject(body) as SchemaObject;

      // Assert

      // @ts-ignore
      expect(schemaObject.properties.nestedObject.properties.array.type).toEqual('array');
      // @ts-ignore
      expect(schemaObject.properties.nestedObject.properties.array.items.properties.field.type).toEqual('number');
    });
  });
});