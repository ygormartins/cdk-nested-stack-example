/* ---------- External ---------- */
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

/* ---------- Constructs ---------- */
import { DynamoDBConstruct } from "@/lib/nested-stack-main/constructs/DynamoDB";

/* ---------- Stacks ---------- */
import { NestedStackAPI } from "@/lib/nested-stack-api";

export class NestedStackMain extends Stack {
  public readonly dynamodb_construct: DynamoDBConstruct;

  public readonly api_stack: NestedStackAPI;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.dynamodb_construct = new DynamoDBConstruct(
      this,
      `DynamoDB-Construct-${props?.stackName}`,
      {
        stack_name: props?.stackName || "",
      }
    );

    this.api_stack = new NestedStackAPI(
      this,
      `API-NestedStack-${props?.stackName}`,
      {
        dynamodb_construct: this.dynamodb_construct,
        stack_name: props?.stackName || "",
        description: "API resources for NestedStack - nested",
      }
    );
  }
}
