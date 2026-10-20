"""Observe every binding of one Worker without account-wide discovery."""
import urllib.parse


def observe_domains(request, prefix, token, site):
    query = urllib.parse.urlencode({'service': site['worker']})
    data = request(prefix + '/domains?' + query, token)
    rows = data.get('result')
    info = data.get('result_info', {})
    # Cloudflare total_count is unfiltered; count describes this filtered result.
    if (data.get('success') is not True or not isinstance(rows, list)
            or info.get('total_pages', 1) > 1
            or info.get('count', len(rows)) != len(rows)):
        raise ValueError('Incomplete Worker domain observation')
    observed = []
    for row in rows:
        hostname = row.get('hostname', '')
        zone = site.get('zoneName', site['domain'])
        if (row.get('service') != site['worker'] or row.get('zone_id') != site['zone']
                or not (hostname == zone or hostname.endswith('.' + zone))
                or row.get('environment') != 'production' or not row.get('id')):
            raise ValueError('Worker binding outside the approved deployment boundary')
        observed.append({key: row[key] for key in ('id', 'hostname', 'service', 'environment')})
    if len({row['hostname'] for row in observed}) != len(observed):
        raise ValueError('Duplicate Worker binding')
    return sorted(observed, key=lambda row: row['hostname'])
