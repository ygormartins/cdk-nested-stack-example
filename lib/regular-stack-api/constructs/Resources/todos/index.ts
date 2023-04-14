/* ---------- External ---------- */
import {
  AuthorizationType,
  AwsIntegration,
  PassthroughBehavior,
  Resource,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

/* ---------- Constructs ---------- */
import { DynamoDBConstruct } from "@/lib/regular-stack-main/constructs/DynamoDB";
import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";

/* ---------- Interfaces ---------- */
interface Props {
  dynamodb_construct: DynamoDBConstruct;
  rest_api: RestApi;
}

export class TodosResource extends Construct {
  public readonly resource: Resource;

  public readonly by_id: Resource;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    /* ---------- Resources ---------- */
    this.resource = props.rest_api.root.addResource("todos");
    this.by_id = this.resource.addResource("{todo_id}");

    const integrationRole = new Role(this, "IntegrationRole", {
      assumedBy: new ServicePrincipal("apigateway.amazonaws.com"),
    });

    props.dynamodb_construct.main_table.grantReadWriteData(integrationRole);

    /* ---------- Methods ---------- */
    this.resource.addMethod(
      "POST",
      new AwsIntegration({
        service: "dynamodb",
        action: "PutItem",
        options: {
          credentialsRole: integrationRole,
          integrationResponses: [
            {
              statusCode: "201",
              responseTemplates: {
                "application/json": JSON.stringify({
                  message: "To-do created succesfully!",
                }),
              },
            },
          ],
          passthroughBehavior: PassthroughBehavior.WHEN_NO_TEMPLATES,
          requestTemplates: {
            "application/json": JSON.stringify({
              TableName: props.dynamodb_construct.main_table.tableName,
              Item: {
                partition_key: { S: "todos" },
                sort_key: { S: "todo#$context.requestId" },
                title: { S: "$input.path('$.title')" },
                description: { S: "$input.path('$.description')" },
              },
            }),
          },
        },
      }),
      {
        authorizationType: AuthorizationType.NONE,
        methodResponses: [{ statusCode: "201" }],
      }
    );

    this.resource.addMethod(
      "GET",
      new AwsIntegration({
        service: "dynamodb",
        action: "Query",
        options: {
          credentialsRole: integrationRole,
          integrationResponses: [{ statusCode: "200" }],
          passthroughBehavior: PassthroughBehavior.WHEN_NO_TEMPLATES,
          requestTemplates: {
            "application/json": JSON.stringify({
              TableName: props.dynamodb_construct.main_table.tableName,
              KeyConditionExpression:
                "partition_key = :partition_key and begins_with(sort_key, :sort_key_prefix)",
              ExpressionAttributeValues: {
                ":partition_key": { S: "todos" },
                ":sort_key_prefix": { S: "todo#" },
              },
            }),
          },
        },
      }),
      {
        authorizationType: AuthorizationType.NONE,
        methodResponses: [{ statusCode: "200" }],
      }
    );

    this.by_id.addMethod(
      "GET",
      new AwsIntegration({
        service: "dynamodb",
        action: "GetItem",
        options: {
          credentialsRole: integrationRole,
          integrationResponses: [{ statusCode: "200" }],
          passthroughBehavior: PassthroughBehavior.WHEN_NO_TEMPLATES,
          requestParameters: {
            "integration.request.path.todo_id": "method.request.path.todo_id",
          },
          requestTemplates: {
            "application/json": JSON.stringify({
              TableName: props.dynamodb_construct.main_table.tableName,
              Key: {
                partition_key: { S: "todos" },
                sort_key: { S: "todo#$input.params('todo_id')" },
              },
            }),
          },
        },
      }),
      {
        authorizationType: AuthorizationType.NONE,
        methodResponses: [{ statusCode: "200" }],
        requestParameters: {
          "method.request.path.todo_id": true,
        },
      }
    );
  }
}
