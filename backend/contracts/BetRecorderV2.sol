// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BetRecorderV2 {

    uint256 public nextBetId = 1;

    struct Bet {

        uint256 betId;

        address player;

        string asset;

        bool higher;

        uint256 amount;

        uint256 startPrice;

        uint256 duration;

        uint256 timestamp;

        bool settled;

        uint256 endPrice;

        bool won;
    }

    mapping(uint256 => Bet) public bets;

    event BetPlaced(
        uint256 indexed betId,
        address indexed player
    );

    event BetSettled(
        uint256 indexed betId,
        bool won,
        uint256 endPrice
    );

    function recordBet(

        string calldata asset,

        bool higher,

        uint256 amount,

        uint256 startPrice,

        uint256 duration

    )
        external
        returns(uint256)
    {

        uint256 betId = nextBetId++;

        bets[betId] = Bet({

            betId: betId,

            player: msg.sender,

            asset: asset,

            higher: higher,

            amount: amount,

            startPrice: startPrice,

            duration: duration,

            timestamp: block.timestamp,

            settled: false,

            endPrice: 0,

            won: false

        });

        emit BetPlaced(
            betId,
            msg.sender
        );

        return betId;
    }

    function settleBet(

        uint256 betId,

        uint256 endPrice,

        bool won

    )
        external
    {

        Bet storage bet =
            bets[betId];

        require(
            !bet.settled,
            "Already settled"
        );

        bet.settled = true;

        bet.endPrice = endPrice;

        bet.won = won;

        emit BetSettled(
            betId,
            won,
            endPrice
        );
    }

    function getBet(
        uint256 betId
    )
        external
        view
        returns(Bet memory)
    {
        return bets[betId];
    }

}