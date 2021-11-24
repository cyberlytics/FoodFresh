<div align="center">

![account selector](sys-doc/assets/chainfresh.png)
<br />
[![License](https://img.shields.io/github/license/cyberlytics/ChainFresh?color=green)](https://github.com/cyberlytics/ChainFresh/blob/main/LICENSE)
[![Substrate version](https://img.shields.io/badge/Substrate-2.0.0-brightgreen?logo=Parity%20Substrate)](https://substrate.io/)

</div>

- [1. Introduction](#1-introduction)
- [2. Prerequesites](#2-prerequesites)
- [3. Run](#3-run)
  - [3.1. Solochain](#31-solochain)
  - [3.2. Multichain](#32-multichain)
- [4. Test](#4-test)

# 1. Introduction

ChainFresh is a decentralized supply chain consortium.

__Note__: This section is still work in progress. More information will follow.

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


# 3. Run

Install Rust:

```bash
curl https://sh.rustup.rs -sSf | sh
```

You may need additional dependencies, checkout [substrate.io](https://docs.substrate.io/v3/getting-started/installation) for more info.

# 3.1. Solochain

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
  
# 3.2 Multichain

__Note__: Compiling this project is a resource intensive process! Use a machine with no less than:

- 8 GB of RAM (16 GB is suggested)
- 4 CPU cores (8 cores are suggested)
- 50 GB of free HDD/SSD space

Without the minimal RAM here, you are likely run out of memory resulting in a `SIGKILL` error during the compilation process.

# 4. Test

For both subprojects the following commands are available:

|Command|Description|
|---|---|
|`cargo doc --open`|Open the reference docs.|
|`cargo test`|Run the tests.|

## Disclaimer

This project is not audited nor ready for production use. Therefore, the project serves only the purpose of demonstration.
