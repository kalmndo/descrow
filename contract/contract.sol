// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Escrow - Easy to Deploy and Use
 * @dev Simplified escrow contract for basic escrow functionality
 * 
 * Simple Flow:
 * 1. Buyer creates escrow with ETH
 * 2. Seller delivers service/product
 * 3. Buyer releases payment OR raises dispute
 * 4. If dispute, arbiter decides outcome
 */

// Minimal OpenZeppelin imports
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Escrow is ReentrancyGuard {
    
    // Simple status enum
    enum Status {
        Active,     // 0 - Escrow is active
        Completed,  // 1 - Payment released to seller
        Disputed,   // 2 - In dispute
        Refunded    // 3 - Refunded to buyer
    }
    
    // Escrow struct
    struct Escrow {
        address buyer;
        address seller;
        address arbiter;
        uint256 amount;
        Status status;
        string description;
        uint256 deadline;
    }
    
    // State variables
    mapping(uint256 => Escrow) public escrows;
    uint256 public escrowCount;
    uint256 public arbiterFee = 2; // 2% fee for arbiter
    
    // Events
    event EscrowCreated(uint256 escrowId, address buyer, address seller, uint256 amount);
    event PaymentReleased(uint256 escrowId, address seller, uint256 amount);
    event DisputeRaised(uint256 escrowId);
    event DisputeResolved(uint256 escrowId, address winner, uint256 amount);
    event EscrowRefunded(uint256 escrowId, address buyer, uint256 amount);
    
    // Simple errors
    error NotAuthorized();
    error InvalidStatus();
    error InsufficientFunds();
    error TransferFailed();
    error DeadlinePassed();
    
    /**
     * @dev Create new escrow (buyer sends ETH)
     * @param _seller Address of seller
     * @param _arbiter Address of arbiter (can be contract deployer initially)
     * @param _description What the seller should deliver
     * @param _daysUntilDeadline Number of days until deadline
     */
    function createEscrow(
        address _seller,
        address _arbiter,
        string memory _description,
        uint256 _daysUntilDeadline
    ) external payable {
        require(msg.value > 0, "Must send ETH");
        require(_seller != address(0) && _arbiter != address(0), "Invalid address");
        require(_seller != msg.sender, "Cannot escrow to yourself");
        require(_daysUntilDeadline > 0 && _daysUntilDeadline <= 365, "Invalid deadline");
        
        uint256 deadline = block.timestamp + (_daysUntilDeadline * 1 days);
        
        escrows[escrowCount] = Escrow({
            buyer: msg.sender,
            seller: _seller,
            arbiter: _arbiter,
            amount: msg.value,
            status: Status.Active,
            description: _description,
            deadline: deadline
        });
        
        emit EscrowCreated(escrowCount, msg.sender, _seller, msg.value);
        escrowCount++;
    }
    
    /**
     * @dev Buyer releases payment to seller
     * @param _escrowId ID of the escrow
     */
    function releasePayment(uint256 _escrowId) external nonReentrant {
        Escrow storage escrow = escrows[_escrowId];
        
        require(msg.sender == escrow.buyer, "Only buyer can release");
        require(escrow.status == Status.Active, "Escrow not active");
        
        escrow.status = Status.Completed;
        
        // Transfer payment to seller
        (bool success, ) = escrow.seller.call{value: escrow.amount}("");
        if (!success) revert TransferFailed();
        
        emit PaymentReleased(_escrowId, escrow.seller, escrow.amount);
    }
    
    /**
     * @dev Raise a dispute (buyer or seller)
     * @param _escrowId ID of the escrow
     */
    function raiseDispute(uint256 _escrowId) external {
        Escrow storage escrow = escrows[_escrowId];
        
        require(
            msg.sender == escrow.buyer || msg.sender == escrow.seller,
            "Only buyer or seller can dispute"
        );
        require(escrow.status == Status.Active, "Escrow not active");
        
        escrow.status = Status.Disputed;
        
        emit DisputeRaised(_escrowId);
    }
    
    /**
     * @dev Arbiter resolves dispute
     * @param _escrowId ID of the escrow
     * @param _favorBuyer true = refund buyer, false = pay seller
     */
    function resolveDispute(uint256 _escrowId, bool _favorBuyer) external nonReentrant {
        Escrow storage escrow = escrows[_escrowId];
        
        require(msg.sender == escrow.arbiter, "Only arbiter can resolve");
        require(escrow.status == Status.Disputed, "No active dispute");
        
        uint256 arbiterPayment = (escrow.amount * arbiterFee) / 100;
        uint256 remainingAmount = escrow.amount - arbiterPayment;
        
        if (_favorBuyer) {
            // Refund to buyer
            escrow.status = Status.Refunded;
            
            (bool success1, ) = escrow.buyer.call{value: remainingAmount}("");
            (bool success2, ) = escrow.arbiter.call{value: arbiterPayment}("");
            
            if (!success1 || !success2) revert TransferFailed();
            
            emit DisputeResolved(_escrowId, escrow.buyer, remainingAmount);
        } else {
            // Pay seller
            escrow.status = Status.Completed;
            
            (bool success1, ) = escrow.seller.call{value: remainingAmount}("");
            (bool success2, ) = escrow.arbiter.call{value: arbiterPayment}("");
            
            if (!success1 || !success2) revert TransferFailed();
            
            emit DisputeResolved(_escrowId, escrow.seller, remainingAmount);
        }
    }
    
    /**
     * @dev Buyer can refund if deadline passed and no work done
     * @param _escrowId ID of the escrow
     */
    function refundIfExpired(uint256 _escrowId) external nonReentrant {
        Escrow storage escrow = escrows[_escrowId];
        
        require(msg.sender == escrow.buyer, "Only buyer can refund");
        require(escrow.status == Status.Active, "Escrow not active");
        require(block.timestamp > escrow.deadline, "Deadline not passed");
        
        escrow.status = Status.Refunded;
        
        (bool success, ) = escrow.buyer.call{value: escrow.amount}("");
        if (!success) revert TransferFailed();
        
        emit EscrowRefunded(_escrowId, escrow.buyer, escrow.amount);
    }
    
    // VIEW FUNCTIONS
    
    /**
     * @dev Get escrow details
     */
    function getEscrow(uint256 _escrowId) external view returns (
        address buyer,
        address seller,
        address arbiter,
        uint256 amount,
        Status status,
        string memory description,
        uint256 deadline,
        bool isExpired
    ) {
        Escrow memory escrow = escrows[_escrowId];
        return (
            escrow.buyer,
            escrow.seller,
            escrow.arbiter,
            escrow.amount,
            escrow.status,
            escrow.description,
            escrow.deadline,
            block.timestamp > escrow.deadline
        );
    }
    
    /**
     * @dev Get multiple escrows for a user
     */
    function getUserEscrows(address _user) external view returns (uint256[] memory) {
        uint256[] memory userEscrows = new uint256[](escrowCount);
        uint256 count = 0;
        
        for (uint256 i = 0; i < escrowCount; i++) {
            if (escrows[i].buyer == _user || escrows[i].seller == _user) {
                userEscrows[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = userEscrows[i];
        }
        
        return result;
    }
    
    /**
     * @dev Check if user is involved in escrow
     */
    function isUserInvolved(uint256 _escrowId, address _user) external view returns (bool) {
        Escrow memory escrow = escrows[_escrowId];
        return (_user == escrow.buyer || _user == escrow.seller || _user == escrow.arbiter);
    }
    
    /**
     * @dev Get contract stats
     */
    function getContractStats() external view returns (
        uint256 totalEscrows,
        uint256 contractBalance,
        uint256 currentArbiterFee
    ) {
        return (
            escrowCount,
            address(this).balance,
            arbiterFee
        );
    }
    
    /**
     * @dev Calculate arbiter fee for amount
     */
    function calculateArbiterFee(uint256 _amount) external view returns (uint256) {
        return (_amount * arbiterFee) / 100;
    }
    
    // Emergency function - only if funds get stuck
    function emergencyWithdraw() external {
        // Only allow if no active escrows
        for (uint256 i = 0; i < escrowCount; i++) {
            require(
                escrows[i].status == Status.Completed || 
                escrows[i].status == Status.Refunded,
                "Active escrows exist"
            );
        }
        
        // If all escrows are resolved, allow withdrawal of any remaining funds
        payable(msg.sender).transfer(address(this).balance);
    }
}