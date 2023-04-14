/* ---------- External ---------- */
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

/* ---------- Constructs ---------- */
import { DynamoDBConstruct } from "@/lib/regular-stack-main/constructs/DynamoDB";

export class RegularStackMain extends Stack {
  public readonly dynamodb_construct: DynamoDBConstruct;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.dynamodb_construct = new DynamoDBConstruct(
      this,
      `DynamoDB-Construct-${props?.stackName}`,
      {
        stack_name: props?.stackName || "",
      }
    );
  }
}
