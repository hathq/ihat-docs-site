"""Bounded metadata reads; credentials never follow redirects or foreign hosts."""
import json
import urllib.parse
import urllib.request


class RefuseRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise ValueError('Metadata redirect refused before forwarding')


def request(url, token=None):
    target = urllib.parse.urlsplit(url)
    if (target.scheme != 'https' or not target.hostname or target.username is not None
            or target.password is not None or target.fragment or target.port not in (None, 443)):
        raise ValueError('Invalid metadata URL')
    if token is not None and target.hostname not in ('api.github.com', 'api.cloudflare.com'):
        raise ValueError('Credential destination is not an approved provider')
    headers = {'User-Agent': 'owner-site-release', 'Accept': 'application/json'}
    if token:
        headers['Authorization'] = 'Bearer ' + token
    opener = urllib.request.build_opener(RefuseRedirect())
    with opener.open(urllib.request.Request(url, headers=headers), timeout=30) as response:
        if response.url != url:
            raise ValueError('Metadata destination changed')
        data = response.read(10 * 1024 * 1024 + 1)
        if len(data) > 10 * 1024 * 1024:
            raise ValueError('Oversized metadata')
        return json.loads(data)
