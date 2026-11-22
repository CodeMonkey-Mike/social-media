> For the complete documentation index, see [llms.txt](https://evaa.gitbook.io/intro/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://evaa.gitbook.io/intro/introduction/faq.md).

# FAQ

### What is TON and how does it work? <a href="#what-is-ton" id="what-is-ton"></a>

TON, short for The Open Network, is a decentralized ecosystem that has the TON Blockchain as its core component. Created by the team behind Telegram, TON aims to address the limitations of existing blockchains, such as scalability, speed, and usability.

TON uses a [Proof of Stake](https://academy.binance.com/en/articles/proof-of-stake-explained) consensus mechanism, where validators are selected based on the number of TON tokens they hold and [stake](https://academy.binance.com/en/articles/what-is-staking) as collateral. Validators are responsible for verifying transactions and adding them to the blockchain. In return, they earn rewards in the form of TON tokens.

TON adopts a multi-chain architecture that includes the TON blockchain as the *masterchain* and smaller chains known as *workchains*. The TON *masterchain* is responsible for managing the core ecosystem data, including protocol updates, blockchain validations, and operations between different chains. The *workchains* are customizable networks that can operate independently and serve different purposes.

### **How does EVAA integrate with Telegram?** <a href="#how-does-evaa-integrate-with-telegram" id="how-does-evaa-integrate-with-telegram"></a>

EVAA is designed to work seamlessly within the TON ecosystem and offers an intuitive user experience through integration with Telegram Messenger.

It's implemented as a Telegram Mini App, allowing users to manage their assets directly within the familiar Telegram interface. This integration making TON DeFi accessible for Telegram's vast user base.

### **What are the benefits of using EVAA for depositors?** <a href="#what-are-the-benefits-of-using-evaa-for-depositors" id="what-are-the-benefits-of-using-evaa-for-depositors"></a>

Depositors on EVAA can earn passive income by providing liquidity to the market. They receive interest on the assets they deposit into the protocol. This allows users to put their crypto assets to work, earning returns instead of having tokens sit in a wallet.

### **How does the borrowing process work on EVAA?** <a href="#how-does-the-borrowing-process-work-on-evaa" id="how-does-the-borrowing-process-work-on-evaa"></a>

EVAA uses an over-collateralized borrowing model. To borrow, users need to provide collateral in an asset that is different from the asset they wish to borrow. This overcollateralization helps ensure the stability and security of the protocol.

The amount of collateral required is determined by the [Collateral Factor (CF)](https://evaa.gitbook.io/intro/details-of-protocol/liquidation). This ratio specifies the maximum amount of assets that can be borrowed against a particular collateral.

$$
\text{For example, if the TON price is 5 USDT,} \\
\text{and you want to borrow 1000 USDT using TON as collateral} \\
\text{with a Collateral Factor (CF) of 65%, you would need to provide at least:} \\\[2ex]
\text{Required TON} = \frac{1000 , \text{USDT}}{0.65 \times 5 , \text{USDT/TON}} \approx 308 , \text{TON}
$$

The interest rate on borrowed loans fluctuates, adjusting dynamically based on the asset's supply and demand ratio. Loans don't have a set repayment date, but interest accrues with each block. The longer the loan duration, the higher the interest accumulates. For more, see the [APY section.](https://evaa.gitbook.io/evaa-docs-2.0/details-of-protocol/apy-calculation)

It's important to note that if the value of your collateral decreases or the value of borrowed assets increases, your position may be at risk of liquidation. To prevent this, users should maintain a healthy account balance by either repaying the loan or adding more collateral as necessary.

### **When do I have to pay the loan back?** <a href="#when-do-i-have-to-pay-the-loan-back" id="when-do-i-have-to-pay-the-loan-back"></a>

Loans don't have a set repayment date, but your debt accrues. The longer the loan duration, the higher the interest accumulates.

### **What makes EVAA different from other liquidity protocols?** <a href="#what-makes-evaa-different-from-other-liquidity-protocols" id="what-makes-evaa-different-from-other-liquidity-protocols"></a>

EVAA stands out as an original protocol, not a fork of existing platforms. It's been developed based on best market practices and is implemented using the low-level FunC language specifically for the TON Blockchain.

EVAA developed an [SDK](https://www.npmjs.com/package/@evaafi/sdk), which will enable developers' community build new DeFi tools for TON users on top of EVAA.

### **How does EVAA ensure the security of users' assets?** <a href="#how-does-evaa-ensure-the-security-of-users-assets" id="how-does-evaa-ensure-the-security-of-users-assets"></a>

EVAA prioritizes security through smart contracts on TON, an overcollateralized borrowing model, and the team's extensive DeFi experience. Currently undergoing an audit by top-tier auditor Quanstamp.

Additionally, EVAA collaborates with the Hacken Proof bug bounty platform and an open-source community of white hat hackers at all stages of product development.
