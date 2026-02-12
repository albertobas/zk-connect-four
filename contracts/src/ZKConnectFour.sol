// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

/// @dev Interface of the PLONK verifier
interface IPlonkVerifier {
    function verifyProof(bytes memory proof, uint[] memory pubSignals) external view returns (bool);
}

/**
 * @dev Contract that uses a PLONK verifier in order to verify zero-knowledge proofs on the game of
 *     Connect Four and emit events with the result of the verifications.
 */
contract ZKConnectFour {
    /// @dev Address of the PLONK verifier
    address _plonkVerifier;

    /// @dev Emitted when a proof is verified
    event ProofVerification(address indexed user, bytes32 indexed proofHash, bool success, uint256 timestamp);

    /**
     * @dev Initializes the contract by setting an address to the PLONK verifier.
     * @param plonkVerifier_  address of the verifier
     */
    constructor(address plonkVerifier_) {
        _plonkVerifier = plonkVerifier_;
    }

    /**
     * @dev Verifies the validity of the proof `proof`.
     *     Emits the event ProofVerification.
     * @param proof the proof to be verified.
     * @param pubSignals public signals.
     */
    function verifyProof(bytes memory proof, uint256[] memory pubSignals) external {
        bool result = IPlonkVerifier(_plonkVerifier).verifyProof(proof, pubSignals);
        bytes32 proofHash = keccak256(proof);
        emit ProofVerification(msg.sender, proofHash, result, block.timestamp);
    }
}
