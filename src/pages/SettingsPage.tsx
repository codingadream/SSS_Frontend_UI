/* eslint-disable @typescript-eslint/no-unused-vars */
import { Grid, Box, Typography, TextField, Button, Checkbox, FormControlLabel } from "@mui/material";
import React, { useContext, useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios from 'axios';
import { UserContext } from "../App";


export default function SettingPage() {

  const userContext = useContext(UserContext);

  const [linkToken, setLinkToken] = useState(null);
  const generateToken = async () => {
    const response = await fetch(`${process.env.BASE_URL}api/create_link_token`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${userContext?.fbToken}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    setLinkToken(data);
    console.log(data);
  };
  useEffect(() => {
    generateToken();
  }, []);


  return (
    linkToken != null ? <Link linkToken={linkToken} /> : <></>
  );
}

interface LinkProps {
  linkToken: string | null;
}
const Link: React.FC<LinkProps> = (props: LinkProps) => {
  const onSuccess = React.useCallback((public_token, metadata) => {
    // send public_token to server
    const response = fetch('/api/set_access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_token }),
    });
    // Handle response ...
  }, []);
  const config: Parameters<typeof usePlaidLink>[0] = {
    token: props.linkToken!,
    onSuccess,
  };
  const { open, ready } = usePlaidLink(config);
  return (
    <button onClick={() => open()} disabled={!ready}>
      Link account
    </button>
  );
};