> For the complete documentation index, see [llms.txt](https://evaa.gitbook.io/intro/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://evaa.gitbook.io/intro/details-of-protocol/isolated-lending-pools.md).

# Isolated Lending Pools

<figure><img src="https://1040463142-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FTfA5iMemw433uoFe1ekJ%2Fuploads%2FN2AgNc3Se3SetkvFCZo4%2Fimage.png?alt=media&amp;token=913c574a-b752-40c4-9e74-54afa676a3fb" alt=""><figcaption></figcaption></figure>

The **EVAA protocol** is designed with a high level of security at its core by utilizing the concept of **isolated pools**.

Isolated pools in EVAA help make TON DeFi a safer place by placing liquidity of different groups of tokens with different types of risks and demands on independent pools that cannot interact with each other.

If something goes wrong with one concrete asset placed in a particular pool in which you participate - a sudden price drop or liquidity problems - it will not affect your assets in other pools because they are isolated from each other at the smart contract level, which reduces the risk to your portfolio as a whole.

## EVAA’s Original Pools <a href="#heading-evaas-original-pools" id="heading-evaas-original-pools"></a>

For instance, the **Main Pool** in EVAA is just one of several isolated pools. Upcoming isolated pools include the **LP Pool** and the **ALTS Pool**.&#x20;

Each of these pools has a distinct set of assets and operates separately from the others:

* **Main Pool**: Includes core assets: USDT, TON, stTON, tsTON, USDe, tsUSDe.
* **LP Pool**: Enables liquidity loops with EVAA, DeDust, and Storm Trade. Assets: USDT, TON, DeDust TON/USDT LP, Storm Trade TON LP, Storm Trade USDT LP.
* **ALTS Pool**: Features ecosystem tokens: USDT, TON, DOGS, NOT.
* **Stable Pool**: Supports lending and looping strategies. Assets: tsUSDe, PT tsUSDe, USDe, USDT.&#x20;

In **isolated pools**, each pool has its own specific rules governing which assets can be borrowed or supplied, how much can be borrowed, and the repayment terms. These rules are unique to each pool and help maintain the security and integrity of the system, as any issues are contained within the individual pool, leaving the rest of the protocol unaffected.

## Third-party Pools <a href="#heading-third-party-pools" id="heading-third-party-pools"></a>

**Other builders can fork EVAA’s existing smart contracts to create their isolated pools with a custom list of the assets, including all existing tokens on TON** to build new lending products while **taking full control and responsibility.**

This allows users to select different pools based on risk in the open market. If a problem occurs in an isolated pool from third-party developers, it remains within that pool, ensuring that original pools are unaffected.

For example, these isolated custom pools could allow users to deposit **USDt** as collateral and borrow tokens from the pool administrator, who also acts as the main liquidity provider. Since native USDt on TON is stable, it minimizes risk while enabling users to short tokens by borrowing, selling, and repaying them later at a lower price.

The risk stays within the isolated pool. If a particular token crashes, only the assets in that pool are affected, keeping the remaining lending pools deployed on TON secure.

<br>
