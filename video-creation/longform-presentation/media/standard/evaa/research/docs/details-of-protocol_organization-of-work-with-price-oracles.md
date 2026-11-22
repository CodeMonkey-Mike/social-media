> For the complete documentation index, see [llms.txt](https://evaa.gitbook.io/intro/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://evaa.gitbook.io/intro/details-of-protocol/organization-of-work-with-price-oracles.md).

# Organization of Work with Price Oracles

<figure><img src="https://1040463142-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FTfA5iMemw433uoFe1ekJ%2Fuploads%2Fcxn2v3O9rwkALtxZfFbl%2FInformation%20post_2%20(5).png?alt=media&amp;token=5dbf709b-8213-476e-a680-66e49c8aaff2" alt=""><figcaption></figcaption></figure>

## **What is an Oracle** <a href="#heading-what-is-an-oracle" id="heading-what-is-an-oracle"></a>

Within the EVAA ecosystem, an oracle node is a separate data collector (see Data Collection) and price publisher.

Each oracle has a unique identifier and a secret (and public) key, which it uses to sign price packages.

Each oracle instance operates independently and collects data from specified sources. Since different sources provide prices for partially overlapping assets, the median price is taken for each asset. After this, the oracle publishes the final set of prices to all available sources (see Data Publishing).

## **Why Price Data is Needed in EVAA** <a href="#heading-why-price-data-is-needed-in-evaa" id="heading-why-price-data-is-needed-in-evaa"></a>

Price data is essential for users and liquidators to execute operations like **withdrawal** and **liquidation**. It determines how much a user can borrow during a **withdrawal** and how much collateral a liquidator receives during a **liquidation**. Reliable data ensures fair transactions.

It’s worth noting that in the case of a **withdrawal** operation without any borrowed assets on the user's balance, the operation does not require a price package.

## **Data Collection and Processing by the Oracle** <a href="#heading-data-collection-and-processing-by-the-oracle" id="heading-data-collection-and-processing-by-the-oracle"></a>

Each oracle instance, operating independently from other instances, collects price data from several reliable sources. This data is combined, and a cryptographically secured package is created, which can be safely used as a price source for financial operations.

## **List of Assets** <a href="#heading-list-of-assets" id="heading-list-of-assets"></a>

Oracle nodes collect prices for all assets used in the EVAA ecosystem, namely:

* **Main Pool Assets:** TON, USDT, USDC, jUSDC, jUSDT, tsTON, stTON;
* **LP Assets:** TON, USDT, TON\_STORM, TON\_USDT, TON\_USDT\_DEDUST;
* **Alts Pool Assets**: TON, USDT, NOT, DOGS, CATI;

This list will grow over time.

It should be noted that the prices for jUSDC and jUSDT are not obtained directly from external oracles but are considered equal to USDC and USDT, respectively.

For example, for Redstone, oracle node obtains a list of prices from different sources for USDT and USDC, calculate the *median values* for them, and assume that for the Redstone oracle, the prices for jUSDC and jUSDT are equal to the prices of USDT and USDC for that oracle.

## **Data Collection: Sources of Price Data** <a href="#heading-data-collection-sources-of-price-data" id="heading-data-collection-sources-of-price-data"></a>

We ensure that the provided prices are up-to-date and reliable by obtaining them from trusted market sources, such as oracle providers, as well as directly from the blockchain. Data integrity is verified during this process.

We integrate data from the following sources:

* **Pyth Network**:[ https://www.pyth.network/](https://www.pyth.network/)A decentralized oracle network providing real-time financial market data.List of processed assets::
  * TON
  * USDT
  * USDC
  * DOGS
  * NOT
* **Redstone Oracles**:[ https://www.redstone.finance/](https://www.redstone.finance/)An oracle infrastructure offering access to various data, including financial data, weather data, and random numbers, with a flexible reward system for data providers.List of processed assets:
  * TON
  * USDT
  * jUSDT
  * jUSDC
* **Stork Oracle**:[ https://docs.stork.network/](https://docs.stork.network/)A decentralized oracle platform.List of processed assets:
  * TON
  * USDT
  * USDC
  * NOT
  * DOGS
  * CATI
* Data from **TON** network contracts: Prices are calculated directly from data returned by the corresponding token contracts and asset prices from the oracle providers mentioned above.List of processed assets:
  * tsTON
  * stTON
  * USDT\_STORM
  * TON\_STORM
  * TON\_USDT\_DEDUST

## **Data Publishing** <a href="#heading-data-publishing" id="heading-data-publishing"></a>

Packages with up-to-date asset prices are periodically published in the following networks:

Two of them operate on blockchains:

1. **ICP**:[ https://internetcomputer.org/](https://internetcomputer.org/)
2. **IOTA**:[ https://www.iota.org/](https://www.iota.org/)

Publishing data on the blockchain is much more reliable than a single node because it ensures:

* Resistance to hacking and reliable storage
* Decentralization of access points, resistance to DDoS attacks

Additionally, another endpoint is:[ evaa.space](http://evaa.space/)

Specific endpoint addresses can be obtained from the latest version of the SDK.

It should be noted that:

* There can be many oracle instances, each with its ID, and they publish independently.
* Packages from different oracles may lose their relevance before the transaction is executed, and blockchain operations have a duration, so only those packages with a time buffer should be selected.

The solution that simplifies data collection from access points and price updates is the **EVAA SDK**.

## **Reliability of the Oracle System** <a href="#heading-reliability-of-the-oracle-system" id="heading-reliability-of-the-oracle-system"></a>

Using multiple sources ensures that the system does not depend on a single source. If some sources temporarily stop working or provide incorrect data, up-to-date data is still eligible for transactions.

It is important to understand that *no matter where the package is obtained from* if it has not yet lost its relevance, it can be used because it contains the signature of a trusted source, which guarantees authenticity and integrity, and cannot be forged but can be verified. The **EVAA smart contract** will verify the integrity and authenticity of the package, and if everything is in order, it will use the prices for the requested operation.

## **What Data Do Oracles Publish?** <a href="#heading-what-data-do-oracles-publish" id="heading-what-data-do-oracles-publish"></a>

A price package is a cryptographically secured message containing information about asset prices and having a limited validity period.

The published package has the following structure:

```typescript
{
  status: 'ok' | 'error'; 
  timestamp: number;
  packedPrices: string;
  signature: string;
  assets: string[];
  publicKey: string;
}
```

Here is a breakdown of the package data:

* **status** indicates the success or failure of collecting up-to-date prices by the oracle instance.
* **timestamp** is the time stamp of the package creation.
* **packedPrices** is a serialized hex-encoded data cell containing the timestamp and a dictionary of prices for assets: **AssetID => Price**. **AssetID** is the asset identifier (see Glossary), **Price** is the cost of one unit of the asset in **USD**, converted to a single *precision value* of **decimals** = 9.
* **signature** is the result of signing **packedPrices** with the oracle's private key.
* **assets** is a list of assetIDs - identifiers of the assets present in the package, each of which is a string representing a hex-encoded 256-bit number.
* **publicKey** is the hex-encoded public key of the oracle.

## **How the SDK Works with Prices** <a href="#heading-how-the-sdk-works-with-prices" id="heading-how-the-sdk-works-with-prices"></a>

To obtain up-to-date prices, the SDK implements a special price collector that gathers prices from all sources where they are published in the EVAA ecosystem (see Data Publishing).

By default, a predefined list of oracles specified in the **SDK** is used. This list, as well as the public keys for the current version of the SDK, correspond to the oracle data specified in the **EVAA smart contract configuration**.

The **EVAA** smart contract allows prices with a validity of up to 3 minutes. However, blockchain operations do not happen instantly, and the SDK takes this into account: the collector filters out prices older than 2 minutes, as well as those whose signatures do not pass verification.

If the number of sources becomes less than required according to the pool configuration, the operation throws an exception, as the smart contract will not accept such a set.

The SDK sorts the price packages by relevance and selects the necessary number of the most recent packages.

Price data and oracle data, as well as integrity proofs, are serialized into a structure based on **MPT (Merkle Patricia Trie)** and passed to the contract when performing an operation. It is worth noting that assembling this structure independently can be challenging, and it is highly recommended to use the EVAA SDK when working with EVAA smart contracts.

## **How the EVAA Contract Works with Prices** <a href="#heading-how-the-evaa-contract-works-with-prices" id="heading-how-the-evaa-contract-works-with-prices"></a>

The EVAA contract requires not a single price package, but a set of up-to-date packages from **N** different oracles in the serialized form as described above.

The value of **N** is set in the contract configuration and is taken into account in the **SDK**.

At the very beginning of an operation that requires price data, the data is verified.

Prices and oracle data are serialized in such a way that when the smart contract is executed, the TVM automatically verifies their integrity, simplifying checks within the contract itself.

For data packages, the contract checks that:

* The provided data is valid and has the correct format.
* All oracles in the provided data are unique, and the required number of oracles is achieved without duplication, and that the set honestly presents different instances of price packages.
* The signature of each package is correct, meaning the package was signed by the specified oracle.
* The timestamp is valid and up-to-date (less than 3 minutes from the time of verification).

If one of the packages fails verification or if there are insufficient price sources, the operation will not be performed.

The price for each asset, which will be used by the contract, is already determined within the transmitted data. The contract only verifies that it is the median for the set. This is done for simplicity, as calculating the median price requires sorting, and the median price for the set is uniquely determined, without compromising security.

After the packages are verified, the contract takes the median prices and compiles them into a dictionary, which will be used in the operation.

## **Glossary** <a href="#heading-glossary" id="heading-glossary"></a>

**Asset** - A general term for all currencies, synonymous with **token** or **coin** in the context of cryptocurrencies.

**Asset Precision** - The value of **decimals** (number of decimal places), which also represents the *number of indivisible units* in one unit of the asset. This ensures sufficient precision during exchanges and other calculations. In **TON**, the most common value is 9. For example, if an asset **XXX** has a precision of 6, the value **1 XXX** will be recorded and transmitted in the blockchain as 1000000.

**AssetID** - A unique identifier for an asset, used in **EVAA** smart contracts and anywhere assets need to be distinguished. It is represented as an *unsigned 256-bit number*, defined as the *sha256 hash of the asset name*.

**Median Value** - The middle value in a sorted array if the number of elements is odd, or the arithmetic mean of the two middle elements if the number is even.

**Oracle** - A data source, such as asset prices.

**Price Package** - A message published by an oracle.

**EVAA SDK** - A set of tools for working with **EVAA** smart contracts.

**EVAA Pool** - An EVAA smart contract with a specific configuration. Different instances of the EVAA contract serve different sets of assets.

**EVAA Pool Configuration** - A combination consisting of the EVAA smart contract address, a list and description of assets, a list of oracles, the minimum number of oracles, and other settings related to the pool.

**Merkle Patricia Trie** - A data structure, originally proposed by Ralph Merkle in 1979, representing a prefix and hash tree. It is used for efficient storage, integrity verification, and authentication of large datasets, combining cryptographic reliability, storage optimization, and efficient prefix search.
