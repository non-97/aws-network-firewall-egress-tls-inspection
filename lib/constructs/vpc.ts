import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export interface VpcProps {}

export class Vpc extends Construct {
  readonly vpc: cdk.aws_ec2.IVpc;

  constructor(scope: Construct, id: string, props?: VpcProps) {
    super(scope, id);

    this.vpc = new cdk.aws_ec2.Vpc(this, "Default", {
      ipAddresses: cdk.aws_ec2.IpAddresses.cidr("10.1.1.0/24"),
      enableDnsHostnames: true,
      enableDnsSupport: true,
      natGateways: 1,
      maxAzs: 1,
      subnetConfiguration: [
        {
          name: "Public",
          subnetType: cdk.aws_ec2.SubnetType.PUBLIC,
          cidrMask: 27,
          mapPublicIpOnLaunch: false,
        },
        {
          name: "Egress",
          subnetType: cdk.aws_ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 27,
        },
        {
          name: "Firewall",
          subnetType: cdk.aws_ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 28,
        },
        {
          name: "Isolated",
          subnetType: cdk.aws_ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 27,
        },
      ],
    });

    // VPC Endpoint
    // SSM
    new cdk.aws_ec2.InterfaceVpcEndpoint(this, "VpcEndpointSsm", {
      vpc: this.vpc,
      service: cdk.aws_ec2.InterfaceVpcEndpointAwsService.SSM,
      subnets: this.vpc.selectSubnets({
        subnetGroupName: "Isolated",
      }),
    });

    // SSM MESSAGES
    new cdk.aws_ec2.InterfaceVpcEndpoint(this, "VpcEndpointSsmMessages", {
      vpc: this.vpc,
      service: cdk.aws_ec2.InterfaceVpcEndpointAwsService.SSM_MESSAGES,
      subnets: this.vpc.selectSubnets({
        subnetGroupName: "Isolated",
      }),
    });

    // EC2 MESSAGES
    new cdk.aws_ec2.InterfaceVpcEndpoint(this, "VpcEndpointEc2Messages", {
      vpc: this.vpc,
      service: cdk.aws_ec2.InterfaceVpcEndpointAwsService.EC2_MESSAGES,
      subnets: this.vpc.selectSubnets({
        subnetGroupName: "Isolated",
      }),
    });
  }
}
