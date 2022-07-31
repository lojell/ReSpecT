export interface Welcome7 {
    openapi: string;
    info: Info;
    externalDocs: ExternalDocs;
    servers: Server[];
    tags: Tag[];
    paths: Paths;
    components: Components;
}

export interface Components {
    schemas: Schemas;
    securitySchemes: SecuritySchemes;
}

export interface Schemas {
    Order: Order;
    Category: CategoryClass;
    User: User;
    Tag: CategoryClass;
    Pet: Pet;
    ApiResponse: APIResponse;
}

export interface APIResponse {
    type: string;
    properties: APIResponseProperties;
}

export interface APIResponseProperties {
    code: Code;
    type: Message;
    message: Message;
}

export interface Code {
    type: Type;
    format?: Format;
}

export enum Format {
    DateTime = "date-time",
    Int32 = "int32",
    Int64 = "int64",
}

export enum Type {
    Integer = "integer",
    String = "string",
}

export interface Message {
    type: Type;
}

export interface CategoryClass {
    type: string;
    properties: CategoryProperties;
    xml: CategoryXML;
}

export interface CategoryProperties {
    id: Code;
    name: Message;
}

export interface CategoryXML {
    name: string;
}

export interface Order {
    type: string;
    properties: OrderProperties;
    xml: CategoryXML;
}

export interface OrderProperties {
    id: Code;
    petId: Code;
    quantity: Code;
    shipDate: Code;
    status: Status;
    complete: Complete;
}

export interface Complete {
    type: string;
    default: boolean;
}

export interface Status {
    type: Type;
    description: string;
    enum: string[];
}

export interface Pet {
    required: string[];
    type: string;
    properties: PetProperties;
    xml: CategoryXML;
}

export interface PetProperties {
    id: Code;
    category: ItemsClass;
    name: PurpleName;
    photoUrls: PhotoUrls;
    tags: Tags;
    status: Status;
}

export interface ItemsClass {
    $ref: string;
}

export interface PurpleName {
    type: Type;
    example: string;
}

export interface PhotoUrls {
    type: string;
    xml: PhotoUrlsXML;
    items: Message;
}

export interface PhotoUrlsXML {
    name: string;
    wrapped: boolean;
}

export interface Tags {
    type: string;
    xml: PhotoUrlsXML;
    items: ItemsClass;
}

export interface User {
    type: string;
    properties: UserProperties;
    xml: CategoryXML;
}

export interface UserProperties {
    id: Code;
    username: Message;
    firstName: Message;
    lastName: Message;
    email: Message;
    password: Message;
    phone: Message;
    userStatus: UserStatus;
}

export interface UserStatus {
    type: Type;
    description: string;
    format: string;
}

export interface SecuritySchemes {
    petstore_auth: PetstoreAuthClass;
    api_key: APIKey;
}

export interface APIKey {
    type: string;
    name: string;
    in: string;
}

export interface PetstoreAuthClass {
    type: string;
    flows: Flows;
}

export interface Flows {
    implicit: Implicit;
}

export interface Implicit {
    authorizationUrl: string;
    scopes: Scopes;
}

export interface Scopes {
    "write:pets": string;
    "read:pets": string;
}

export interface ExternalDocs {
    description: string;
    url: string;
}

export interface Info {
    title: string;
    description: string;
    termsOfService: string;
    contact: Contact;
    license: License;
    version: string;
}

export interface Contact {
    email: string;
}

export interface License {
    name: string;
    url: string;
}

export interface Paths {
    "/pet": PetClass;
    "/pet/findByStatus": PetFindByStatus;
    "/pet/findByTags": PetFindByTags;
    "/pet/{petId}": PetPetID;
    "/pet/{petId}/uploadImage": PetPetIDUploadImage;
    "/store/inventory": StoreInventory;
    "/store/order": StoreOrder;
    "/store/order/{orderId}": StoreOrderOrderID;
    "/user": UserClass;
    "/user/createWithArray": UserCreateWith;
    "/user/createWithList": UserCreateWith;
    "/user/login": UserLogin;
    "/user/logout": UserLogout;
    "/user/{username}": UserUsername;
}

export interface PetClass {
    put: Put;
    post: PetPost;
}

export interface PetPost {
    tags: string[];
    summary: string;
    operationId: string;
    requestBody: PurpleRequestBody;
    responses: PurpleResponses;
    security: PostSecurity[];
    "x-codegen-request-body-name": string;
}

export interface PurpleRequestBody {
    description: string;
    content: PurpleContent;
    required: boolean;
}

export interface PurpleContent {
    "application/json": ApplicationJSON;
    "application/xml": ApplicationJSON;
}

export interface ApplicationJSON {
    schema: ItemsClass;
}

export interface PurpleResponses {
    "405": The405;
}

export interface The405 {
    description: string;
    content: The405_Content;
}

export interface The405_Content {
}

export interface PostSecurity {
    petstore_auth: PetstoreAuthElement[];
}

export enum PetstoreAuthElement {
    ReadPets = "read:pets",
    WritePets = "write:pets",
}

export interface Put {
    tags: string[];
    summary: string;
    operationId: string;
    requestBody: PurpleRequestBody;
    responses: { [key: string]: The405 };
    security: PostSecurity[];
    "x-codegen-request-body-name": string;
}

export interface PetFindByStatus {
    get: PetFindByStatusGet;
}

export interface PetFindByStatusGet {
    tags: string[];
    summary: string;
    description: string;
    operationId: string;
    parameters: PurpleParameter[];
    responses: { [key: string]: PurpleResponse };
    security: PostSecurity[];
}

export interface PurpleParameter {
    name: string;
    in: string;
    description: string;
    required: boolean;
    style: string;
    explode: boolean;
    schema: PurpleSchema;
}

export interface PurpleSchema {
    type: string;
    items: Items;
}

export interface Items {
    type: Type;
    default: string;
    enum: string[];
}

export interface PurpleResponse {
    description: string;
    content: FluffyContent;
}

export interface FluffyContent {
    "application/xml"?: Empty;
    "application/json"?: Empty;
}

export interface Empty {
    schema: Schema;
}

export interface Schema {
    type: string;
    items: ItemsClass;
}

export interface PetFindByTags {
    get: PetFindByTagsGet;
}

export interface PetFindByTagsGet {
    tags: string[];
    summary: string;
    description: string;
    operationId: string;
    parameters: FluffyParameter[];
    responses: { [key: string]: PurpleResponse };
    deprecated: boolean;
    security: PostSecurity[];
}

export interface FluffyParameter {
    name: string;
    in: string;
    description: string;
    required: boolean;
    style: string;
    explode: boolean;
    schema: FluffySchema;
}

export interface FluffySchema {
    type: string;
    items: Message;
}

export interface PetPetID {
    get: PetPetIDGet;
    post: PetPetIDPost;
    delete: PetPetIDDelete;
}

export interface PetPetIDDelete {
    tags: string[];
    summary: string;
    operationId: string;
    parameters: PostParameter[];
    responses: { [key: string]: The405 };
    security: PostSecurity[];
}

export interface PostParameter {
    name: string;
    in: string;
    schema: Code;
    description?: string;
    required?: boolean;
}

export interface PetPetIDGet {
    tags: string[];
    summary: string;
    description: string;
    operationId: string;
    parameters: PostParameter[];
    responses: { [key: string]: PostResponse };
    security: PurpleSecurity[];
}

export interface PostResponse {
    description: string;
    content: TentacledContent;
}

export interface TentacledContent {
    "application/json"?: ApplicationJSON;
    "application/xml"?: ApplicationJSON;
}

export interface PurpleSecurity {
    api_key: any[];
}

export interface PetPetIDPost {
    tags: string[];
    summary: string;
    operationId: string;
    parameters: PostParameter[];
    requestBody: FluffyRequestBody;
    responses: PurpleResponses;
    security: PostSecurity[];
}

export interface FluffyRequestBody {
    content: StickyContent;
}

export interface StickyContent {
    "application/x-www-form-urlencoded": ApplicationXWWWFormUrlencoded;
}

export interface ApplicationXWWWFormUrlencoded {
    schema: ApplicationXWWWFormUrlencodedSchema;
}

export interface ApplicationXWWWFormUrlencodedSchema {
    properties: PurpleProperties;
}

export interface PurpleProperties {
    name: StatusClass;
    status: StatusClass;
}

export interface StatusClass {
    type: Type;
    description: string;
}

export interface PetPetIDUploadImage {
    post: PetPetIDUploadImagePost;
}

export interface PetPetIDUploadImagePost {
    tags: string[];
    summary: string;
    operationId: string;
    parameters: PostParameter[];
    requestBody: TentacledRequestBody;
    responses: FluffyResponses;
    security: PostSecurity[];
}

export interface TentacledRequestBody {
    content: IndigoContent;
}

export interface IndigoContent {
    "multipart/form-data": MultipartFormData;
}

export interface MultipartFormData {
    schema: MultipartFormDataSchema;
}

export interface MultipartFormDataSchema {
    properties: FluffyProperties;
}

export interface FluffyProperties {
    additionalMetadata: StatusClass;
    file: UserStatus;
}

export interface FluffyResponses {
    "200": Purple200;
}

export interface Purple200 {
    description: string;
    content: IndecentContent;
}

export interface IndecentContent {
    "application/json": ApplicationJSON;
}

export interface StoreInventory {
    get: StoreInventoryGet;
}

export interface StoreInventoryGet {
    tags: string[];
    summary: string;
    description: string;
    operationId: string;
    responses: TentacledResponses;
    security: PurpleSecurity[];
}

export interface TentacledResponses {
    "200": Fluffy200;
}

export interface Fluffy200 {
    description: string;
    content: HilariousContent;
}

export interface HilariousContent {
    "application/json": PurpleApplicationJSON;
}

export interface PurpleApplicationJSON {
    schema: TentacledSchema;
}

export interface TentacledSchema {
    type: string;
    additionalProperties: Code;
}

export interface StoreOrder {
    post: StoreOrderPost;
}

export interface StoreOrderPost {
    tags: string[];
    summary: string;
    operationId: string;
    requestBody: DeleteRequestBody;
    responses: { [key: string]: PostResponse };
    "x-codegen-request-body-name": string;
}

export interface DeleteRequestBody {
    description: string;
    content: AmbitiousContent;
    required: boolean;
}

export interface AmbitiousContent {
    "*/*": ApplicationJSON;
}

export interface StoreOrderOrderID {
    get: StoreOrderOrderIDGet;
    delete: StoreOrderOrderIDDelete;
}

export interface StoreOrderOrderIDDelete {
    tags: string[];
    summary: string;
    description: string;
    operationId: string;
    parameters: TentacledParameter[];
    responses: { [key: string]: The405 };
}

export interface TentacledParameter {
    name: string;
    in: string;
    description: string;
    required: boolean;
    schema: StickySchema;
}

export interface StickySchema {
    minimum: number;
    type: Type;
    format: Format;
    maximum?: number;
}

export interface StoreOrderOrderIDGet {
    tags: string[];
    summary: string;
    description: string;
    operationId: string;
    parameters: TentacledParameter[];
    responses: { [key: string]: PostResponse };
}

export interface UserClass {
    post: UserPost;
}

export interface UserPost {
    tags: string[];
    summary: string;
    description: string;
    operationId: string;
    requestBody: DeleteRequestBody;
    responses: StickyResponses;
    "x-codegen-request-body-name": string;
}

export interface StickyResponses {
    default: The405;
}

export interface UserCreateWith {
    post: UserCreateWithArrayPost;
}

export interface UserCreateWithArrayPost {
    tags: string[];
    summary: string;
    operationId: string;
    requestBody: StickyRequestBody;
    responses: StickyResponses;
    "x-codegen-request-body-name": string;
}

export interface StickyRequestBody {
    description: string;
    content: CunningContent;
    required: boolean;
}

export interface CunningContent {
    "*/*": Empty;
}

export interface UserLogin {
    get: UserLoginGet;
}

export interface UserLoginGet {
    tags: string[];
    summary: string;
    operationId: string;
    parameters: PutParameter[];
    responses: { [key: string]: FluffyResponse };
}

export interface PutParameter {
    name: string;
    in: string;
    description: string;
    required: boolean;
    schema: Message;
}

export interface FluffyResponse {
    description: string;
    headers?: Headers;
    content: MagentaContent;
}

export interface MagentaContent {
    "application/xml"?: Application;
    "application/json"?: Application;
}

export interface Application {
    schema: Message;
}

export interface Headers {
    "X-Rate-Limit": XExpiresAfter;
    "X-Expires-After": XExpiresAfter;
}

export interface XExpiresAfter {
    description: string;
    schema: Code;
}

export interface UserLogout {
    get: UserLogoutGet;
}

export interface UserLogoutGet {
    tags: string[];
    summary: string;
    operationId: string;
    responses: StickyResponses;
}

export interface UserUsername {
    get: UserUsernameGet;
    put: PutClass;
    delete: PutClass;
}

export interface PutClass {
    tags: string[];
    summary: string;
    description: string;
    operationId: string;
    parameters: PutParameter[];
    responses: { [key: string]: The405 };
    requestBody?: DeleteRequestBody;
    "x-codegen-request-body-name"?: string;
}

export interface UserUsernameGet {
    tags: string[];
    summary: string;
    operationId: string;
    parameters: PutParameter[];
    responses: { [key: string]: PostResponse };
}

export interface Server {
    url: string;
}

export interface Tag {
    name: string;
    description: string;
    externalDocs?: ExternalDocs;
}
