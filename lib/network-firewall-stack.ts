import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Vpc } from "./constructs/vpc";
import { Ec2Instance } from "./constructs/ec2-instance";
import { NetworkFirewall } from "./constructs/network-firewall";

export class NetworkFirewallStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new Vpc(this, "Vpc");

    // EC2 Instance
    new Ec2Instance(this, "Ec2InstanceA", {
      vpc: vpc.vpc,
    });

    // Network Firewall
    new NetworkFirewall(this, "NetworkFirewall", {
      vpc: vpc.vpc,
      certificateAuthorityArn: "<証明書のARN>",
    });
  }
}
