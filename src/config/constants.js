const ConfigurableValues = () => {

  const SERVER_URL = process.env.SERVER_URL ?? "http://localhost:4000/";
  const WS_SERVER_URL = process.env.WS_SERVER_URL ?? "ws://localhost:4000/";
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? "";
  const STRIPE_PUBLIC_KEY = "";

  return {
    SERVER_URL,
    WS_SERVER_URL,
    GOOGLE_CLIENT_ID,
    STRIPE_PUBLIC_KEY
  };
};

export default ConfigurableValues;
