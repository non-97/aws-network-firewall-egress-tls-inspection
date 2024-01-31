import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export interface NetworkFirewallTlsInspectionProps {
  certificateAuthorityArn: string;
}

export class NetworkFirewallTlsInspection extends Construct {
  readonly tlsInspectionConfiguration: cdk.aws_networkfirewall.CfnTLSInspectionConfiguration;

  constructor(
    scope: Construct,
    id: string,
    props: NetworkFirewallTlsInspectionProps
  ) {
    super(scope, id);

    this.tlsInspectionConfiguration =
      new cdk.aws_networkfirewall.CfnTLSInspectionConfiguration(
        this,
        "TlsInspectionConfiguration",
        {
          tlsInspectionConfiguration: {
            serverCertificateConfigurations: [
              {
                certificateAuthorityArn: props.certificateAuthorityArn,
                checkCertificateRevocationStatus: {
                  revokedStatusAction: "REJECT",
                  unknownStatusAction: "REJECT",
                },
                scopes: [
                  {
                    destinationPorts: [
                      {
                        fromPort: 443,
                        toPort: 443,
                      },
                    ],
                    destinations: [
                      {
                        addressDefinition: "0.0.0.0/0",
                      },
                    ],
                    protocols: [6],
                    sourcePorts: [
                      {
                        fromPort: 0,
                        toPort: 65535,
                      },
                    ],
                    sources: [
                      {
                        addressDefinition: "0.0.0.0/0",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          tlsInspectionConfigurationName: "tls-inspection",
        }
      );
  }
}
