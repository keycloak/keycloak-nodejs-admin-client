/**
 * https://www.keycloak.org/docs-api/15.0/rest-api/#_jsonnode
 */

enum JsonNodeType {
  ARRAY,
  BINARY,
  BOOLEAN,
  MISSING,
  NULL,
  NUMBER,
  OBJECT,
  POJO,
  STRING,
}

export default interface JsonNode {
  array?: boolean;
  bigDecimal?: boolean;
  bigInteger?: boolean;
  binary?: boolean;
  boolean?: boolean;
  containerNode?: boolean;
  double?: boolean;
  empty?: boolean;
  float?: boolean;
  floatingPointNumber?: boolean;
  int?: boolean;
  integralNumber?: boolean;
  long?: boolean;
  missingNode?: boolean;
  nodeType: JsonNodeType;
  null?: boolean;
  number?: boolean;
  object?: boolean;
  pojo?: boolean;
  short?: boolean;
  textual?: boolean;
  valueNode?: boolean;
}
