const sessionCookie = 'connect.sid=s%3Au_WPVCFQFsjYI-j4c3iJbHIGKFDSpUYq.VcoJEpnmOAsz3%2F%2BLwqvITdJ0geT%2Bkm3dt%2FPMb4NPzvk';

async function test() {
  const res = await fetch(`http://localhost:3001/applicant/hire`, {
    method: 'POST',
    headers: { 'Cookie': sessionCookie, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'email=shuklaharikrishn805%40gmail.com'
  });
  console.log(res.status);
  const text = await res.text();
  console.log(text.substring(0, 500));
}
test();
