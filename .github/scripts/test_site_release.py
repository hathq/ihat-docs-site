import copy
import hashlib
import io
import json
from pathlib import Path
import tarfile
import tempfile
import unittest
from unittest.mock import patch
from site_release import select, pack, unpack, admit, deploy


class SiteReleaseTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root / 'site.json').write_text('{"origin":"https://example.org"}')
        self.site = {'id':'example','version':'0.1.0','account':'a'*32,'worker':'example-site',
            'environment':'site-production-example','origin':'https://example.org','domain':'example.org',
            'siteConfig':'site.json','appDirectory':'.','assetDirectory':'public','buildKind':'single'}
        self.contract = {'schemaVersion':1,'repository':'example/site','defaultBranch':'main',
                         'requiredWorkflows':['ci.yml'],'sites':[self.site]}
        self.env = {'GITHUB_SHA':'b'*40,'GITHUB_REPOSITORY':'example/site','GITHUB_REF_TYPE':'tag'}

    def test_exact_site_version_and_owned_origin(self):
        self.assertEqual(select(self.root,self.contract,'site/example/v0.1.0'),self.site)
        for tag in ['v0.1.0','site/other/v0.1.0','site/example/v0.2.0']:
            with self.assertRaises(ValueError): select(self.root,self.contract,tag)
        (self.root / 'site.json').write_text('{"origin":"https://other.example"}')
        with self.assertRaises(ValueError):select(self.root,self.contract,'site/example/v0.1.0')

    def test_output_traversal_symlink_and_environment_output_injection_rejected(self):
        for key,value in [('assetDirectory','../public'),('appDirectory','./\nother=bad'),('environment','site-production-x\nother=bad')]:
            contract=copy.deepcopy(self.contract);contract['sites'][0][key]=value
            with self.assertRaises(ValueError):select(self.root,contract,'site/example/v0.1.0')
        (self.root/'public').mkdir();(self.root/'public/index.html').symlink_to(self.root/'site.json')
        with self.assertRaises(ValueError):pack(self.root,self.site,'b'*40,self.root/'archive')

    def prepare(self):
        (self.root/'public').mkdir();(self.root/'public/index.html').write_text('<h1>Approved</h1>')
        digest=pack(self.root,self.site,'b'*40,self.root/'archive')
        return self.root/'archive/site.tgz',digest

    def test_archive_binds_all_asset_bytes_to_immutable_source_and_target(self):
        archive,digest=self.prepare();receipt=unpack(archive,digest,self.root/'verified')
        self.assertEqual(receipt['source'],'b'*40);self.assertEqual(receipt['site'],self.site)
        self.assertIn('.well-known/release.json',receipt['files'])
        with self.assertRaises(ValueError):unpack(archive,'c'*64,self.root/'bad')
        with self.assertRaises(ValueError):unpack(archive,digest,self.root/'verified')

    def test_archive_links_and_traversal_rejected_before_extraction(self):
        for name in ['../outside','assets/../../outside','/outside']:
            archive=self.root/'bad.tgz'
            with tarfile.open(archive,'w:gz') as out:
                info=tarfile.TarInfo(name);info.size=1;out.addfile(info,io.BytesIO(b'x'))
            digest=hashlib.sha256(archive.read_bytes()).hexdigest()
            with self.assertRaises(ValueError):unpack(archive,digest,self.root/'never-created')
            self.assertFalse((self.root/'never-created').exists())

    def test_source_admission_rejects_foreign_owner_before_git_or_network(self):
        with patch('site_release.subprocess.run') as run,patch('site_release.request') as request:
            with self.assertRaises(ValueError):admit(self.root,self.contract,{**self.env,'GITHUB_REPOSITORY':'fork/site'})
            run.assert_not_called();request.assert_not_called()

    def test_unprotected_environment_cannot_reach_cloudflare_or_deployment(self):
        _,digest=self.prepare()
        with patch.dict('os.environ',{**self.env,'GH_TOKEN':'synthetic-test-token'}),patch('site_release.request',return_value={'protection_rules':[]}) as request,patch('site_release.subprocess.run') as run:
            with self.assertRaises(ValueError):deploy(self.root,self.contract,self.site,self.root/'archive',digest)
            self.assertEqual(request.call_count,1);run.assert_not_called()


if __name__ == '__main__':
    # The same tests also validate the real owner contract after copying into a repo.
    contract_path = Path('.github/site-release.json')
    if contract_path.exists():
        contract = json.loads(contract_path.read_text())
        for site in contract['sites']:
            select(Path.cwd(), contract, f"site/{site['id']}/v{site['version']}")
    unittest.main()
