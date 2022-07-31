import { PathItemObject, RequestBodyObject, ResponsesObject, SchemaObject, SchemasObject } from "openapi3-ts";
import ApiSpecBuilder, { OpenApiSpecBuildParams } from "../services/ApiSpecBuilder";
import { QueryString, PostData, Param, Response } from 'har-format';

import UrlEx, { UrlPathItem } from "../models/UrlEx";

// describe("UrlPathItem", () => {

// });

describe("UrlEx", () => {

  describe("schemaName", () => {
    test("Number, UUID, Date, MongoId", () => {
      // Arrange
      const ids = [
        '291470059',
        '291.470059',
        '291-470059',
        '2012-20-12',
        'ca761232ed4211cebacd00aa0057b223',
        'CA761232-ED42-11CE-BACD-00AA0057B223',
        'CA761232-ED42-11CE-BACD-00AA0057B223',
        'CA761232-ED42-11CE-BACD-00AA0057B223',
        '00000000-0000-0000-0000-000000000000',
        "507f1f77bcf86cd799439011",
        "507f191e810c19729de860ea",
      ];

      const urls = ids.map(x => `https://api.site.com/cs/sa/orders/${x}/show`);

      // Act
      const sut = urls.map(url => new UrlEx(url).pathName);

      // Assert
      const actualUrls = [...new Set(sut)];
      expect(actualUrls.length).toEqual(1);
      expect(actualUrls[0]).toEqual("CsSaOrdersShow");
    });

    test("case insensetive", () => {
      // Arrange
      const url = 'https://api.site.com/Cs/sA/oRders/2323432432/shoW';

      // Act
      const sut = new UrlEx(url).pathName;

      // Assert
      expect(sut).toEqual("CsSaOrdersShow");
    });

    test("multiple slashes", () => {
      // Arrange
      const url = 'https://api.site.com/Cs//sA////oRders//5f5138285762c04e946fc3ad2e7693e0/shoW';

      // Act
      const sut = new UrlEx(url).pathName;

      // Assert
      expect(sut).toEqual("CsSaOrdersShow");
    });

  });

  describe("pathItems", () => {

    test("empty pathname", () => {
      // Arrange
      const url = 'https://localhost';

      // Act
      const sut = new UrlEx(url);

      // Assert
      expect(sut.pathItems.length).toEqual(0);
    });


    test("Simple single param", () => {
      // Arrange
      const url = 'https://api.site.com/Cs//sA////oRders//5f5138285762c04e946fc3ad2e7693e0/shoW';

      // Act
      const sut = new UrlEx(url);

      // Assert
      expect(sut.pathItems.at(-2).paramName).toEqual("ordersParam");
    });

    test("Param with duplicated name", () => {
      // Arrange
      const url = 'https://api.site.com/Cs//sA////oRders//5f5138285762c04e946fc3ad2e7693e0/11////432-32423/shoW';

      // Act
      const sut = new UrlEx(url);

      // Assert
      expect(sut.pathItems[8].paramName).toEqual("ordersParam");
      expect(sut.pathItems[9].paramName).toEqual("ordersParam1");
      expect(sut.pathItems[13].paramName).toEqual("ordersParam2");
    });

    test("with `unknown` param for not entity begining urls", () => {
      // Arrange
      const url = 'https://api.site.com/5f5138285762c04e946fc3ad2e7693e0';

      // Act
      const sut = new UrlEx(url);

      // Assert
      expect(sut.pathItems[0].paramName).toEqual("unknownParam");
    });

    test("urlPartNormilized should be in camel case", () => {
      // Arrange
      const url = 'https://api.site.com/Cs//sA////oRders_TEST//5f5138285762c04e946fc3ad2e7693e0/shoW';

      // Act
      const sut = new UrlEx(url);

      // Assert
      expect(sut.pathItems.at(6).normilized).toEqual("ordersTest");
    });
  });


  describe("pathTemplate", () => {
    test("Simple template", () => {
      // Arrange
      const url = 'https://api.site.com/Cs//sA////oRders//5f5138285762c04e946fc3ad2e7693e0/11////432-32423/shoW';

      // Act
      const sut = new UrlEx(url);

      // Assert
      expect(sut.pathTemplate).toEqual("/Cs//sA////oRders//{ordersParam}/{ordersParam1}////{ordersParam2}/shoW");
    });
  });

  describe("shortUrlName", () => {
    test("Should show the last part of url", () => {
      // Arrange
      const url = 'https://api.site.com/Cs//sA////oRders//5f5138285762c04e946fc3ad2e7693e0/11////432-32423/shoW';

      // Act
      const sut = new UrlEx(url);

      // Assert
      expect(sut.shortUrlName).toEqual("shoW");
    });


    test("Should show the last part of url with slash", () => {
      // Arrange
      const url = 'https://api.site.com/Cs//sA////oRders//5f5138285762c04e946fc3ad2e7693e0/11////432-32423/shoW/';

      // Act
      const sut = new UrlEx(url);

      // Assert
      expect(sut.shortUrlName).toEqual("shoW/");
    });

    test("Should show the last part of url with multiple slash", () => {
      // Arrange
      const url = 'https://api.site.com/Cs//sA////oRders//5f5138285762c04e946fc3ad2e7693e0/11////432-32423/shoW///////////////////?test=query';

      // Act
      const sut = new UrlEx(url);

      // Assert
      expect(sut.shortUrlName).toEqual("shoW///////////////////?test=query");
    });


    test("Should show the host name with multiple slashes", () => {
      // Arrange
      const url = 'https://api.site.com//?query=test';

      // Act
      const sut = new UrlEx(url);

      // Assert
      expect(sut.shortUrlName).toEqual("api.site.com//?query=test");
    });

    test("Should show the host name", () => {
      // Arrange
      const url = 'https://api.site.com';

      // Act
      const sut = new UrlEx(url);

      // Assert
      expect(sut.shortUrlName).toEqual("api.site.com");
    });


    test("Should show the host name and query", () => {
      // Arrange
      const url = 'https://api.site.com/?query=test';

      // Act
      const sut = new UrlEx(url);

      // Assert
      expect(sut.shortUrlName).toEqual("api.site.com?query=test");
    });
  });
});