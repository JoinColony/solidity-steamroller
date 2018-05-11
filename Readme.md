# solidity-steamroller

🚜 Flatten your Solidity contracts with ease.

This flattens your Solidity contracts by recursively resolving your dependencies and merging them into your contract file. Dependencies won't be included twice. Pragma statements are reduced to one and aligned to the newest version.

### Why?

To verify your contracts over at [Etherscan](https://etherscan.io/verifyContract) or play around with it in the [remix IDE](https://remix.ethereum.org/).

### Install!

```sh
yarn global add solidity-steamroller
```

### Use!

```sh
steamroller path/to/my/Contract.sol
```

The flattened contract is printed to stdout. Just pipe it to a file if you fancy:

```sh
steamroller path/to/my/Contract.sol > Contract_flattened.sol
```

### Contribute!

If encountering any issues please open one at [GitHub](https://github.com/JoinColony/solidity-steamroller/issues). PRs are very welcome as well.

### TODO

- Tests

### License!

GPL-3.0
