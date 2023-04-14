/* ---------- External ---------- */
import { CfnAuthorizer, RestApi } from "aws-cdk-lib/aws-apigateway";
import { ISecret, Secret } from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";

/* ---------- Constructs ---------- */
import { DynamoDBConstruct } from "@/lib/regular-stack-main/constructs/DynamoDB";

/* ---------- Resources ---------- */
import { TodosResource } from "@/lib/regular-stack-api/constructs/Resources/todos";

/* ---------- Interfaces ---------- */
interface Props {
  dynamodb_construct: DynamoDBConstruct;
  stack_name: string;
  rest_api: RestApi;
}

export class ResourcesConstruct extends Construct {
  public readonly todos_resource: TodosResource;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    /* ---------- Resources ---------- */
    this.todos_resource = new TodosResource(
      scope,
      `DisplayPageResource-${props.stack_name}`,
      { dynamodb_construct: props.dynamodb_construct, rest_api: props.rest_api }
    );
  }
}
