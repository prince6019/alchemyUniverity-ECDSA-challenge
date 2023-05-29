import { useState } from "react";
import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { Buffer } from "buffer";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const message = {
      from: address,
      to: recipient,
      amount: sendAmount,
    };

    const jsonMessage = JSON.stringify(message);
    console.log(jsonMessage);
    const messageToByte = utf8ToBytes(jsonMessage);
    const messageHash = keccak256(messageToByte);
    console.log(messageHash);
    const privateKey1Buffer = Buffer.from(privateKey, "hex");
    console.log(privateKey1Buffer);
    const sign = secp256k1.sign(messageHash, privateKey1Buffer);
    console.log(sign);

    // // verify transaction
    const publicKey = secp256k1.getPublicKey(privateKey);
    const verify = secp256k1.verify(sign, messageHash, publicKey);
    setIsVerified(verify);

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
      });
      console.log(balance);
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <div>
      <form className="container transfer" onSubmit={transfer}>
        <h1>Send Transaction</h1>

        <label>
          Send Amount
          <input
            placeholder="1, 2, 3..."
            value={sendAmount}
            onChange={setValue(setSendAmount)}
          ></input>
        </label>

        <label>
          Recipient Wallet Address
          <input
            placeholder="Type an address, for example: 0x2"
            value={recipient}
            onChange={setValue(setRecipient)}
          ></input>
        </label>

        <input type="submit" className="button" value="Transfer" />
      </form>
      {isVerified && <p>transaction verified!!</p>}
    </div>
  );
}

export default Transfer;
