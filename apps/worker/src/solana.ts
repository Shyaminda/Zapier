import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import base58  from "bs58";

const connection = new Connection("https://api.mainnet-beta.solana.com", "finalized"); //or (https://solana-mainnet.g.alchemy.com/")   //got this link from alchemy solana

export async function sendSol (to: string, amount: string) {
    const keypair = Keypair.fromSecretKey(base58.decode((process.env.SOL_PRIVATE_KEY ?? "")));
    const transferTransaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: keypair.publicKey,
            toPubkey: new PublicKey(to),
            lamports: parseFloat(amount) * LAMPORTS_PER_SOL,   //0.1 => 100000000
        })
    )
    await sendAndConfirmTransaction(connection, transferTransaction, [keypair]);
}