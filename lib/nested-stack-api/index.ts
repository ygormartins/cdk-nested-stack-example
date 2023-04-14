/* ---------- External ---------- */
import { NestedStackProps, NestedStack } from "aws-cdk-lib";
import { Construct } from "constructs";

/* ---------- Constructs ---------- */
import { RestAPIConstruct } from "@/lib/nested-stack-api/constructs/RestAPI";
import { ResourcesConstruct } from "@/lib/nested-stack-api/constructs/Resources";
import { DynamoDBConstruct } from "@/lib/nested-stack-main/constructs/DynamoDB";

/* ---------- Interfaces ---------- */
interface Props extends NestedStackProps {
  stack_name: string;
  dynamodb_construct: DynamoDBConstruct;
}

export class NestedStackAPI extends NestedStack {
  public readonly rest_api_construct: RestAPIConstruct;

  public readonly resources_construct: ResourcesConstruct;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    this.rest_api_construct = new RestAPIConstruct(
      this,
      `RestAPI-Construct-${props.stack_name}`,
      {
        stack_name: props.stack_name,
      }
    );

    this.resources_construct = new ResourcesConstruct(
      this,
      `Resources-Construct-${props.stack_name}`,
      {
        stack_name: props.stack_name,
        rest_api: this.rest_api_construct.rest_api,
        dynamodb_construct: props.dynamodb_construct,
      }
    );
  }
}
