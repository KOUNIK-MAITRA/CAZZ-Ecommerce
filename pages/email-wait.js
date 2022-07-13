import React from 'react';
import Head from 'next/head'
function emailwait() {
  return (
    <div style={{ display: 'flex', height: "90vh", alignItems: "center", justifyContent: "center", padding: "0 2rem" }}>
      <Head>
        <title>Waiting...</title>
      </Head>
      <div>
        <h2>Check your email and click on the link that has been sent to you.</h2>
        <p> Note: Mails sometimes may be found under Promotions or Socials </p>
        <p>Thank you ~ From Cazz </p>
      </div>
    </div>);
}

export default emailwait;
