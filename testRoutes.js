const sessionCookie = 'connect.sid=s%3Au_WPVCFQFsjYI-j4c3iJbHIGKFDSpUYq.VcoJEpnmOAsz3%2F%2BLwqvITdJ0geT%2Bkm3dt%2FPMb4NPzvk';
const routes = ['/home', '/host', '/dashboard', '/worker', '/joblisting', '/hired', '/profile', '/feedback'];
async function test() {
  for(const r of routes) {
    try {
      const res = await fetch(`http://localhost:3001${r}`, { headers: { Cookie: sessionCookie } });
      console.log(r, res.status);
    } catch(e) {
      console.log(r, e.message);
    }
  }
}
test();
