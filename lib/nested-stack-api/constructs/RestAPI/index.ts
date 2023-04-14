/* ---------- External ---------- */
import { Cors, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

/* ---------- Interfaces ---------- */
interface Props {
  stack_name: string;
}

export class RestAPIConstruct extends Construct {
  public readonly rest_api: RestApi;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    /* ---------- APIs ---------- */
    this.rest_api = new RestApi(scope, `RestAPI-${props.stack_name}`, {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: ["*"],
      },
    });
  }
}
