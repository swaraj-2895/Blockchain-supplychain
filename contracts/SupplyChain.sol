pragma solidity ^0.8.0;

import "./Item_o.sol";


contract SupplyChain {
    address public this_con = address(this);

    address public this_addr;

    enum Status {Created, Paid, Dispatched}

    struct Items {
        Item_o item;
        uint id;
        uint price;
        Status status;
    }

    mapping (uint => Items) public items;

    uint index = 0;

    event SupplyChainStep(uint _itemindex, Status _step, address _address);
    

    function CreateItem (uint _id, uint _price) public {
        
        Item_o Item_con = new Item_o(this, _price, index);
        items[index].id = _id;
        items[index].price = _price;
        items[index].status = Status.Created;
        this_addr = address(Item_con);
        emit SupplyChainStep(index, Status.Created, address(Item_con)); 
        index++;
    }

    function view_address () public view returns (address) {
        return address(this_addr);
    }

    function TriggerPayment (uint _id) public payable {
        //require (address(item_n) == msg.sender, "function can only be triggered internally");
        items[_id].status = Status.Paid;
    }

    function Dispatch(uint _id) public payable {
        require (items[_id].status == Status.Paid, "Item is not paid for");
        items[_id].status = Status.Dispatched;
    }

    function get_balance() public view returns (uint) {
        return (address(this).balance);
    }

    function get_item(uint i) public view returns (uint, uint) {
        return (items[i].price, items[i].id);
    }
    

}
