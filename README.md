# ChainFresh

ChainFresh is a decentralized supply chain consortium.

## Prerequesites

The following section outlines the software requirements and their intended use.

**Blockchain**:

- [Rust](https://www.rust-lang.org/) - System programming language.
- [Substrate](https://substrate.dev/docs/en/knowledgebase/getting-started/) - Modular blockchain development framework.

**Frontend**:

- [Node.js](https://nodejs.org/en/) - JavaScript runtime for the frontend.
- [Yarn](https://classic.yarnpkg.com/en/) - Package manager for node modules.

**Scripts**:

- [Python](https://www.python.org/) - Scripts for blockchain interaction.

## Solochain setup

This project utilzes a [Rust toolchain](https://substrate.dev/docs/en/knowledgebase/getting-started/#rust-nightly-toolchain)
for Wasm compilation. Ensure that these commands are executed as part of the installation process:

```bash
rustup toolchain install nightly-2020-08-23
rustup target add wasm32-unknown-unknown --toolchain nightly-2020-08-23
cargo +nightly-2020-08-23 build --release
```

- Run the [Off-Chain Worker (OCW) listener](sys-src/solochain/scripts/ocw) to receive OCW notifications.

  ```bash
  cd scripts/ocw
  pip install -r requirements.txt
  python ocw.py [--host=localhost --port=3005]
  ```

- Launch the [blockchain](sys-src/solochain/chain).

  ```bash
  cd chain
  # Launch the node in development mode and do not persist chain state
  ./target/release/chainfresh --dev --tmp
  ```

- Launch the [frontend](sys-src/solochain/frontend) to interact with the blockchain via web GUI.

  ```bash
  cd frontend
  yarn install && yarn start
  ```

- [Optional] Run the [initialization script](sys-src/solochain/scripts/init) to bootstrap a consortium.

  ```bash
  cd scripts/init
  pip install -r requirements.txt
  python init.py
  ```

## Multichain setup

TODO

## Commands

For both subprojects the following commands are available:

|Command|Description|
|---|---|
|`cargo doc --open`|Open the reference docs.|
|`cargo test`|Run the tests.|

## Disclaimer

This project is not audited nor ready for production use. Therefore, the project serves only the purpose of demonstration.
