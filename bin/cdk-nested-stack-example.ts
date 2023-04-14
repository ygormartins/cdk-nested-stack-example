#!/usr/bin/env node
/* ---------- External ---------- */
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";

/* ---------- Stacks ---------- */
import { RegularStackMain } from "@/lib/regular-stack-main";
import { RegularStackAPI } from "@/lib/regular-stack-api";

const app = new cdk.App();

/* ----------
 * Regular Stacks
 * ---------- */
const regular_stack_main = new RegularStackMain(app, "RegularStack-MAIN", {
  stackName: "RegularStack-MAIN",
  env: { region: "us-east-1" },
  description: "Main stack containing data resources - not nested",
});

new RegularStackAPI(app, "RegularStack-API", {
  stackName: "RegularStack-API",
  env: { region: "us-east-1" },
  description: "API resources for RegularStack - not nested",
  main_stack: regular_stack_main,
});
