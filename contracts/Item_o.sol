pragma solidity ^0.8.0;

import "./SupplyChain.sol";

contract Item_o {

    SupplyChain parentcontract;
    uint public balance;
    uint public price;
    uint public index;
    uint public paidWei;

    constructor (SupplyChain supplychain, uint _price, uint _index) {
        price = _price;
        index = _index;
        parentcontract = supplychain;
    }


    receive() external payable {
        require (price == msg.value, "Insufficient payment");
        require (paidWei == 0, "Item is already paid for");
        paidWei += msg.value;
        (bool success, ) = address(parentcontract).call{value: msg.value}(abi.encodeWithSignature("TriggerPayment(uint256)", index));
        require (success, "Trigger unsuccessful");
    }


    function get_balance() public view returns(uint) {
        return address(this).balance;
    }

    

}
