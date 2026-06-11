// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BetRecorder {

    struct Bet {
        address player;
        bool higher;
        uint256 amount;
        uint256 startPrice;
        uint256 duration;
        uint256 timestamp;
    }

    Bet[] public bets;

    event BetRecorded(
        address indexed player,
        bool higher,
        uint256 amount,
        uint256 startPrice,
        uint256 duration,
        uint256 timestamp
    );

    function recordBet(
        bool higher,
        uint256 amount,
        uint256 startPrice,
        uint256 duration
    ) external {

        bets.push(
            Bet({
                player: msg.sender,
                higher: higher,
                amount: amount,
                startPrice: startPrice,
                duration: duration,
                timestamp: block.timestamp
            })
        );

        emit BetRecorded(
            msg.sender,
            higher,
            amount,
            startPrice,
            duration,
            block.timestamp
        );
    }

    function getBetCount()
        external
        view
        returns (uint256)
    {
        return bets.length;
    }
}