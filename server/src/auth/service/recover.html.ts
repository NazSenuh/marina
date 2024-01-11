export const recoveryHTML = (link:string, recepientEmail:string) =>`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">

    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    
    <title>React App</title>
  </head>
  <body>
  <h3> Recover your password</h3><br/>
  <h3 style="margin-bottom:5px;">Let us help you.<h3>
  <br/>
  <a  style="all:unset; text-decoration:none; padding:5px; border-radius: 2px; border: 1px solid #2E4880;background:  #2E4880; color:white;" href="${process.env.CLIENT_URL}/newpass/${link}?email=${recepientEmail}">Recover password</a>
  <br/>
  <p style="font-size:1rem; font-weight:400;">
    The password recovery link is valid for 15 minutes. If the time has expired, please request a new link.
    If you didn’t request this email, there’s nothing to worry about — you can safely ignore it.
  </p>
    
  </body>
</html>`
