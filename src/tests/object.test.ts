import { mergeDeep } from "../utils/object";

describe("object utils", () => {

  test("Multiple requests - different schema", () => {

    // Arrange
    const json1 = {
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

    const json2 = {
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
        field_3: "str",
        field_3_1: 33.11,
        array: [{ field: 1, field_1: 2 }, { field_2: 'str' }],
        array2: [{ field: 1, field_1: 2 }, { field_2: 'str' }],
      }
    };


    // Act
    const sut = mergeDeep([json1, json2]);

    // Assert
    expect(sut).not.toBeNull();

    expect(sut).toMatchObject({
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
        field_3: '33str',
        field_3_1: 33.11,
        array: [{ field: 1, field_1: 2, field_2: 'str' }],
        array2: [{ field: 1, field_1: 2, field_2: 'str' }]
      }
    });
  });

  test("Primitive array merging", () => {

    // Arrange
    const json1 = {
      nestedObject: {
        array: [1, "22", 3.44, false, null, undefined, true]
      }
    };

    const json2 = {
      nestedObject: {
        array: [1, "22", 3.44, false, null, undefined],
      }
    };


    // Act
    const sut = mergeDeep([json1, json2]);

    // Assert
    expect(sut).not.toBeNull();

    expect(sut).toMatchObject({
      nestedObject: {
        array: ['1223.44falsetrue']
      }
    });
  });

})