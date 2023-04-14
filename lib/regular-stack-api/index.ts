/* ---------- External ---------- */
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

/* ---------- Constructs ---------- */
import { RestAPIConstruct } from "@/lib/regular-stack-api/constructs/RestAPI";
import { ResourcesConstruct } from "@/lib/regular-stack-api/constructs/Resources";

/* ---------- Types ---------- */
import { RegularStackMain } from "@/lib/regular-stack-main";

/* ---------- Interfaces ---------- */
interface Props extends StackProps {
  main_stack: RegularStackMain;
}

export class RegularStackAPI extends Stack {
  public readonly rest_api_construct: RestAPIConstruct;

  public readonly resources_construct: ResourcesConstruct;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    this.rest_api_construct = new RestAPIConstruct(
      this,
      `RestAPI-Construct-${props?.stackName}`,
      {
        stack_name: props.stackName || "",
      }
    );

    this.resources_construct = new ResourcesConstruct(
      this,
      `Resources-Construct-${props?.stackName}`,
      {
        stack_name: props.stackName || "",
        rest_api: this.rest_api_construct.rest_api,
        dynamodb_construct: props.main_stack.dynamodb_construct,
      }
    );
  }
}
