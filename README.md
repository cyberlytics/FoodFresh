<div align="center">

<img src="sys-doc/assets/chainfresh.png" width="460">

<br />

[![License](https://img.shields.io/github/license/cyberlytics/ChainFresh?color=green)](https://github.com/cyberlytics/ChainFresh/blob/main/LICENSE)
[![Substrate version](https://img.shields.io/badge/Substrate-2.0.0-brightgreen?logo=Parity%20Substrate)](https://substrate.io/)

</div>

- [1. Introduction](#1-introduction)
- [2. Prerequesites](#2-prerequesites)
- [3. Building](#3-building)
  - [3.1. Presentation Tier](#31-presentation-tier)
  - [3.2. Application Tier](#32-application-tier)
  - [3.3. Relay Tier](#33-relay-tier)
- [4. Testing](#4-testing)

# 1. Introduction

ChainFresh is a decentralized supply chain consortium.

# Project Layout

This section outlines the project structure.

```
├── sys-doc                   // System documentation
│  └── wireframes             // Wireframe sketches for GUI
│  └──  ...                   // Other resources for documentation purposes
└── sys-src                   // System source code
   ├── evaluation             
   │  └── xcm-test            // 
   ├── frontend               // Frontend for interacting with the blockchain
   │  ├── public              // 
   │  ├── src                 // Useful development scripts
   │  │   ├── components      //
   │  │   ├── config          //
   │  │   ├── fonts           //
   │  │   ├── hooks           //
   │  │   ├── substrate-lib   //
   │  │   ├── utils           //
   │  │   ├── views           //
   │  │   └── ... 
   │  └── ...                 // 
   ├── solochain              // Standalone blockchain
   │  ├── chain               // The actual "blockchain"
   │  └── scripts             // Useful development scripts
   └── multichain             // Scaleable blockchain relay
      ├── parachain-collator  // Parachain code
      └── rococo_local        // Relay chain specification file       
```

# 2. Prerequesites

The following section outlines the software requirements and their intended use.

**Blockchain**:

- [Rust](https://www.rust-lang.org/) - System programming language.
- [Substrate](https://substrate.dev/docs/en/knowledgebase/getting-started/) - Modular blockchain development framework.

**Frontend**:

- [Node.js](https://nodejs.org/en/) - JavaScript runtime for the frontend.
- [Yarn](https://classic.yarnpkg.com/en/) - Package manager for node modules.

**Scripts**:

- [Python](https://www.python.org/) - Scripts for blockchain interaction.


# 3. Building

Install Rust:

```bash
curl https://sh.rustup.rs -sSf | sh
```

You may need additional dependencies, checkout [substrate.io](https://docs.substrate.io/v3/getting-started/installation) for more info.

Install Node.js:

```bash
curl "https://nodejs.org/dist/latest/node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"
```

# 3.1. Solochain

This project utilzes a [Rust toolchain](https://substrate.dev/docs/en/knowledgebase/getting-started/#rust-nightly-toolchain)
for Wasm compilation. Ensure that these commands are executed as part of the installation process:

```bash
rustup toolchain install nightly-2020-08-23
rustup target add wasm32-unknown-unknown --toolchain nightly-2020-08-23
cargo +nightly-2020-08-23 build --release
```

# 3.1 Presentation Tier
The presentation tier encompasses the web frontend and a Web3 browser extension. 
The web frontend is built with NodeJS and uses the Polkadot JavaScript client library to interact and query the application tier nodes. 
The capabilities that the client library expose are implemented on top of the substrate RPC API. 

- Launch the [frontend](sys-src/solochain/frontend)

  ```bash
  cd frontend
  yarn install && yarn start
  ```

# 3.2 Application Tier 
The application tier encapsulates the business logic in the collator node. The business logic is decomposed into the following FRAME pallets:

The rbac pallet maintains an on-chain registry of roles and the users to which those roles are assigned. 
A role is a tuple with the name of a pallet and a permission that qualifies the level of access granted by the role. 
A permission is an enum with the variants Execute and Manage. The Execute permission allows a user to invoke a pallet's dispatchable functions. 
The Manage permission allows a user to assign and revoke roles for a pallet and also implies the Execute permission. 
Access control validation is done within the transaction pool validation by way of the RBAC pallet's Authorize signed extension. 
Therefore, permissions are configured in the chain specification file.  

The registrar inherits DID capabilities from the did pallet and uses these capabilities to implement an organization registry. 
This pallet maintains a list of organizations and maps each organization to a list of members. 
Organizations are identified by the account ID that registered it. 
They are also associated with a name, which is designated by the value of the Org attribute on the did of the organization owner. 
Organization owners are the only accounts that may add members to their organizations. 
When an account is added to an organization as a member, the organization owner creates an OrgMember delegate for the member's did. 
In this way, the organization owner can certify an account's membership in the organization.
The registrar pallet exposes a custom origin, EnsureOrg, that validates whether or not an account owns or is a member of at least one organization. 
The EnsureOrg origin is used to control access to many of the chain's capabilities, including the ability to create roles with the rbac pallet.

The documentRegistry pallet uses proof of existence. 
Instead of storing the original document in the blockchain, only a hash value generated by the web frontend, a proof that the document exists, is stored. 
This requires (i) a user, (ii) a file hash (or file digest), and (iii) the timestamp of the verification. 
Before a document is registered, the digest is compared to all stored document digests to ensure that the same document can be registered at most once. 
The runtime storage is only modified after all checks are completed. 
This is important because if the transaction fails at some later point, the storage is modified and will remain so.

The productRegistry provides functionality for registering products (also known as trade items) exchanged in a supply chain among various stakeholders. 
A product owner (i.e., a member of an organization) registers product data in the system to be visible for other supply chain participants. 
The productRegistry maintains a registry of products, which maps each product to the organization it belongs. 
On successful registration, the productRegistry assigns a unique ID to the registered product for systemwide identification. 
The origin trait EnsureOrg is used to control the accounts that are allowed to create products.

The ProductTracking pallet provides functionality for tracking shipments. 
One can monitor the storage and transportation conditions for a shipment along the supply chain. 
Shipments are associated with an organization and have an assigned ID. 
This pallet supports tracking several types of shipping events: registration, pickup, scan, and delivery. 
With the exception of registration, shipment events may be associated with a list of sensor readings. 
For instance, the operations manager registers a shipment, and the `ShipmentStatus` turns to "pending." 
When the company transport operator tracks the pickup operation, the `ShipmentStatus` turns to "in transit." 
During the transport, multiple scan operations can occur, but the `ShipmentStatus` does not change. 
Finally, when a shipment arrives at its destination, the transport operator can track a delivery operation, and the `ShipmentStatus` turns to "delivered." 
To communicate with the outside world about the product tracking and conditions, the collator node architecture is extended with an OCW subsystem. 
Shipment events are placed in a queue that is monitored by an OCW. 
When events appear in this queue, the OCW sends them to an off-chain service via a REST API.

- Run the [Off-Chain Worker (OCW) listener](sys-src/solochain/scripts/ocw) to receive OCW notifications.

  ```bash
  cd sys-src/solochain/scripts/ocw
  pip install -r requirements.txt
  python ocw.py [--host=localhost --port=3005]
  ```
  
- Launch the [blockchain](sys-src/solochain/chain).

  ```bash
  cd chain
  # Launch the node in development mode and do not persist chain state
  ./target/release/chainfresh --dev --tmp
  ```

# 3.3 Relay Tier
The relay tier is where the cross-chain messages are relayed from a source parachain to a target parachain.  ChainFresh leverages the relay chain implementation of Polkadot. __Note__: Compiling this project is a resource intensive process! Use a machine with no less than:

- 8 GB of RAM (16 GB is suggested)
- 4 CPU cores (8 cores are suggested)
- 50 GB of free HDD/SSD space

Without the minimal RAM here, you are likely run out of memory resulting in a `SIGKILL` error during the compilation process.

```
+----------------+             +----------------+
|                |             |                |
| Organization A |             | Organization B |
|                |             |                |
+-------+--------+             +--------+-------+
        ^                               ^
        |       +---------------+       |
        |       |               |       |
        +-----> |  Relay Chain  | <-----+
                |               |
                +---------------+
```

# 4. Testing

The testing strategy for ChainFresh is twofold:

### (1) Unit testing 

Unit tests cover small scale correctness tests of individual pallets and their functions.

Testing a pallet requires a mock runtime which can be found in `mock.rs`.
Test cases for a pallet are defined in `test.rs`.

### (2) XCM Testing 

Available commands :

|Command|Description|
|---|---|
|`cargo doc --open`|Open the reference docs.|
|`cargo test`|Run the tests.|

## Disclaimer

This project is not audited nor ready for production use. 
Therefore, the project serves only the purpose of demonstration.
