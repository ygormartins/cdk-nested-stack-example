/* ---------- External ---------- */
import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

/* ---------- Interfaces ---------- */
interface Props {
  stack_name: string;
}

export class DynamoDBConstruct extends Construct {
  public readonly main_table: Table;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    /* ---------- Tables ---------- */
    this.main_table = new Table(scope, `MainTable-${props.stack_name}`, {
      partitionKey: { name: "partition_key", type: AttributeType.STRING },
      sortKey: { name: "sort_key", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
      tableName: `MainTable-${props.stack_name}`,
    });
  }
}
