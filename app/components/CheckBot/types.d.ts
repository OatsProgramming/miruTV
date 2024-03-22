type TurnstileResponse = {
  success: boolean;
  "error-codes": any[];
  challenge_ts: string;
  hostname: string;
  action: string;
  cdata: string;
  metadata: {
    interactive: boolean;
  };
};
