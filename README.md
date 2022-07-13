# Narrative-Trails
Project Description

**Name:** Narrative Trails Letterboxing dApp

**Summary:**

This project creates an NFT layer for the established activity known as “letterboxing”.  In letterboxing parties explore the (”real”) world to find the stamps placed or hidden by other users.  “Stamps” in the real world general refers to linocut stamps which are used in conjunction with the finder of the letterbox’s inkpad and notebook to create a keepsake/log of the find. Often the letterbox will also contain a log book in which the finder will leave an impression of their own stamp.  The result is that each box contains a notebook which accumulates stamps from all those who have visited it, and each stamp hunter posses a notebook which accumulates stamps of all the letterboxes they have “found”.

Here we add RMRK multi-resource NFTs to the mix and allow each letterbox to have an NFT associated with it, and each letterbox hunter to mint a stamp nft of their own. When a hunter finds a letterbox, they are able to “stamp” the letterboxes NFT (add their stamp as a resource to the letterbox) and stamp their NFT from the letterbox (get the primary resource of the letterbox added to their NFT as a resource).

**Creators:**

Shawn - shawn@narrativetrails.xyz

Tom - tom@narrativetrails.xyz

**Category:  We have entered in Category 5: NFTs.**

**Problem:**

There are several problems.  

First, on the blockchain side there is a need to get more end-users onboarded into web3 and accustomed to using wallets and interacting on-chain.  We have much broader long-term vision for what we will create, but this project aims to provide us a fun tool for on-boarding “normies” into the world of web3 (wallets, etc) as well as testing out some functionality that would enable the broader vision. 

In addition, we aim to solve a few problems that plague actual, physical letterboxes. First, they are hidden in the world and subject to the elements so it is not uncommon to find a letterbox and discover that the notebook inside has been damaged by water. A notebook filled with terrific stamps from people all over the world and it is destroyed before the person who planted the box is able to retrieve it and enjoy it.  Additionally, some boxes are planted by people as they travel and therefore are geographically not easily retrievable by the planter - therefore the logbook of stamps is never collected.  Lastly, if a log book inside a letterbox does manage to survive and is retrieved, it is like a reset - now the finders of the book cannot see or experience the other finders stamps.   By having an NFT they get to enjoy the stamps left in their box as they happen and for the long term, and the log can be displayed to other users who have found the box.

The last problem this project intended to solve was specific to the individual creators. Both Tom and Shawn are curious followers of the Dotsama ecosystem and were looking for a way to learn and develop their understanding of some technologies in this space. 

**Substrate or other:**

This project was build to be deployed on Moonriver (currently testing on Moonbase Alpha) using RMRKs EVM implementation and therefore did not directly use substrate.

**Tech Stack:**

Hardhat was used to build and deploy smart contracts to Moonbase Alpha (and later Moonriver). 

RMRKs EVM repo was used in an attempt to implement an ERC-721 compliant NFT that is also an implementation of the RMRK evm standard. 

Fleek was used for deploying the react front-end and storing NFT images and metadata. While we do intend to further explore the use of Crust, a few issue encountered during the launch of our dApp prompted us to set aside that use for the time being.

When the dApp is launched to Moonriver we intend to use Moonsafe multisig so that our (future) DAO can have appropriate multisig storage of any revenue generated.

**Pitch Video:**

**Demo Link:**

[https://rapid-mountain-0556.on.fleek.co/](https://rapid-mountain-0556.on.fleek.co/)

**Smart Contracts:**
0x9892ad54986aA0ec1554557dD5dAF9E2d42dD480

**Smart Contract Repository**
https://github.com/shawn-nt/LetterboxingContract/tree/master
