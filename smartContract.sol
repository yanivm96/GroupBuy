pragma solidity ^0.8.0;

contract ItemPurchase {
    uint public itemPrice;
    uint public itemsTarget;
    uint public itemsOrdered;
    address payable public itemOwnerAddress;
    mapping(address => uint) public itemClients;
    bool public isActiveGroup;
    bool public purchaseMade;
    uint public deadline;
    address[] public clients;

    event PaymentReceived(address indexed payer, uint amount);
    event PurchaseMade();
    event RefundRequired();

    constructor(uint _itemPrice, uint _itemsTarget, address payable _itemOwnerAddress, uint _deadline) {
        itemPrice = _itemPrice;
        itemsTarget = _itemsTarget;
        itemOwnerAddress = _itemOwnerAddress;
        deadline = _deadline;
        isActiveGroup = true;
        itemsOrdered = 0;
        checkDeadline();
    }

    function buyItems(uint _numItems) public payable {
        require(isActiveGroup, "This item group is not currently active.");
        require(_numItems > 0, "You must purchase at least one item.");
        require(msg.value == itemPrice * _numItems, "The amount sent does not match the item price times the number of items being purchased.");
        require(_numItems <= itemsTarget - itemsOrdered, string(abi.encodePacked("only ", itemsTarget - itemsOrdered, " items left")));
        checkDeadline();

        itemClients[msg.sender] += _numItems;
        if (itemClients[msg.sender] == _numItems) {
            clients.push(msg.sender);
        }
        itemsOrdered += _numItems;
        emit PaymentReceived(msg.sender, msg.value);
        if (itemsOrdered == itemsTarget && block.timestamp < deadline) {
            payToOwner();
        }
    }

    function refund() public {
        require(!purchaseMade, "A purchase has already been made for this item group.");
        require(itemClients[msg.sender] > 0, "You have not made a purchase for this item group.");

        payable(msg.sender).transfer(itemPrice);
        itemClients[msg.sender]--;
        if (itemClients[msg.sender] == 0) {
            for (uint i = 0; i < clients.length; i++) {
                if (clients[i] == msg.sender) {
                    clients[i] = clients[clients.length - 1];
                    clients.pop();
                    break;
                }
            }
        }

        itemsOrdered--;
        emit PaymentReceived(msg.sender, itemPrice);
    }

    function payToOwner() private {
        require(itemsOrdered == itemsTarget && block.timestamp < deadline, "The items target has not been met or the deadline has passed.");
        require(!purchaseMade, "A purchase has already been made for this item group.");

        purchaseMade = true;
        itemOwnerAddress.transfer(address(this).balance);
        isActiveGroup = false;
        emit PurchaseMade();
    }

    function refundAll() public {
        require(block.timestamp >= deadline, "The deadline has not passed.");

        for (uint i = 0; i < clients.length; i++) {
            address payable payee = payable(clients[i]);
            uint numItems = itemClients[payee];

            payee.transfer(numItems * itemPrice);
            itemClients[payee] = 0; // Reset itemClients to 0 for refunded clients
        }

        itemsOrdered = 0; // Reset itemsOrdered to 0 after refunding all clients
        clients = new address[](0); // Clear the clients array
    }

    function checkDeadline() public {
        if (block.timestamp >= deadline) {
            isActiveGroup = false;
            emit RefundRequired();
            refundAll();
        }
    }

    receive() external payable {
        buyItems(msg.value / itemPrice);
    }
}
