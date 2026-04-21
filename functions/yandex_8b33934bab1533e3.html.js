export const onRequestGet = () =>
  new Response(
    `<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>Verification: 8b33934bab1533e3</body>
</html>`,
    { headers: { "Content-Type": "text/html; charset=UTF-8" } }
  )
