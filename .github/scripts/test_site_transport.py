"""Provider-bound reads tested with vendor HTTP machinery and no sockets."""
import copy
from email.message import Message
import io
import unittest
from unittest.mock import patch
import urllib.response
from site_transport import request
from site_bindings import observe_domains


class TransportTests(unittest.TestCase):
    def test_redirect_never_forwards_a_credential(self):
        for status in (301, 302, 303, 307, 308):
            for destination in ('https://outside.example/steal', 'https://api.github.com/next'):
                with self.subTest(status=status, destination=destination):
                    def response(req):
                        self.assertEqual(req.get_header('Authorization'), 'Bearer synthetic')
                        headers = Message()
                        headers['Location'] = destination
                        result = urllib.response.addinfourl(io.BytesIO(b''), headers, req.full_url, status)
                        result.msg = 'Redirect'
                        return result
                    with patch('urllib.request.HTTPSHandler.https_open', side_effect=response) as send:
                        with self.assertRaises(ValueError):
                            request('https://api.github.com/initial', 'synthetic')
                        self.assertEqual(send.call_count, 1)

    def test_foreign_or_unsafe_credential_destination_never_reaches_transport(self):
        urls = ['https://outside.example/', 'http://api.github.com/',
                'https://api.github.com:444/', 'https://user@api.github.com/',
                'https://api.github.com/#fragment', 'https://api.github.com.evil.example/']
        with patch('urllib.request.HTTPSHandler.https_open') as send:
            for url in urls:
                with self.assertRaises(ValueError):
                    request(url, 'synthetic')
            send.assert_not_called()

    def test_exact_provider_response_is_read_with_a_bound(self):
        for host in ('api.github.com', 'api.cloudflare.com'):
            url = 'https://' + host + '/metadata'
            result = urllib.response.addinfourl(io.BytesIO(b'{"ok":true}'), Message(), url, 200)
            result.msg = 'OK'
            with patch('urllib.request.HTTPSHandler.https_open', return_value=result) as send:
                self.assertEqual(request(url, 'synthetic'), {'ok': True})
                self.assertEqual(send.call_count, 1)


class BindingTests(unittest.TestCase):
    def setUp(self):
        self.site = {'worker': 'example-site', 'domain': 'product.example.org',
                     'zoneName': 'example.org', 'zone': 'c' * 32}
        self.row = {'id': 'binding', 'hostname': 'product.example.org',
                    'service': 'example-site', 'zone_id': 'c' * 32, 'environment': 'production'}
        self.data = {'success': True, 'result': [self.row],
                     'result_info': {'count': 1, 'total_count': 500, 'total_pages': 1}}

    def observe(self, data):
        def read(url, token):
            self.assertEqual(url, 'https://api.cloudflare.com/workers/domains?service=example-site')
            self.assertEqual(token, 'synthetic')
            return data
        return observe_domains(read, 'https://api.cloudflare.com/workers', 'synthetic', self.site)

    def test_service_filter_does_not_confuse_global_total_with_filtered_count(self):
        self.assertEqual(len(self.observe(self.data)), 1)

    def test_foreign_bindings_are_rejected_instead_of_hidden(self):
        for key, value in [('service', 'another-worker'), ('zone_id', 'd' * 32),
                           ('hostname', 'outside.example'), ('environment', 'staging')]:
            data = copy.deepcopy(self.data)
            data['result'][0][key] = value
            with self.assertRaises(ValueError):
                self.observe(data)

    def test_incomplete_or_duplicate_observation_is_rejected(self):
        for info in ({'count': 2}, {'total_pages': 2}):
            data = copy.deepcopy(self.data)
            data['result_info'] = info
            with self.assertRaises(ValueError):
                self.observe(data)
        data = copy.deepcopy(self.data)
        data['result'].append(copy.deepcopy(self.row))
        data['result_info']['count'] = 2
        with self.assertRaises(ValueError):
            self.observe(data)


if __name__ == '__main__':
    unittest.main()
