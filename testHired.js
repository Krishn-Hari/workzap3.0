const sessionCookie = 'connect.sid=s%3Au_WPVCFQFsjYI-j4c3iJbHIGKFDSpUYq.VcoJEpnmOAsz3%2F%2BLwqvITdJ0geT%2Bkm3dt%2FPMb4NPzvk';
async function test() {
  const res = await fetch(`http://localhost:3001/hired`, { redirect: 'manual', headers: { Cookie: sessionCookie } });
  console.log(res.status);
}
test();
