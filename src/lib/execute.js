import { toast } from "sonner";
import { executeEvmStep } from "./execute-evm";

export async function execute(plan, bundle, networkName) {
  if (!plan?.steps?.length) throw new Error("No steps to execute");
  const step = plan.steps[0];
  let receipt;
  try {
    if (step.chain === "EVM") {
      receipt = await executeEvmStep(step, bundle, networkName);
    } else if (step.chain === "Solana") {
      throw new Error("Solana execute not implemented yet");
    } else if (step.chain === "Sui") {
      throw new Error("Sui execute not implemented yet");
    } else {
      throw new Error(\Unsupported chain: \\);
    }
  } catch (e) {
    console.error(e);
    toast.error(e?.message || "Execute failed");
    throw e;
  }
  toast.success(\Executed on \: \…\);
  return receipt;
}
