import release from './installer.json' with { type: 'json' }
export { release }
export function installationCommand(record: typeof release = release): string {
  if (!/^\d+\.\d+\.\d+$/.test(record.version)
    || !/^[a-f0-9]{40}$/.test(record.installerSource)
    || !/^[a-f0-9]{64}$/.test(record.installerSha256)) throw new Error('Invalid immutable installer reference')
  const url = `https://raw.githubusercontent.com/hathq/hatter-releases/${record.installerSource}/install.sh`
  return [
    '(', '  set -eu', '  dir=$(mktemp -d)', `  trap 'rm -rf -- "$dir"' EXIT`,
    `  curl -q --fail --show-error --silent --location --proto '=https' --proto-redir '=https' \\`,
    `    --connect-timeout 10 --max-time 30 --max-filesize 65536 \\`,
    `    '${url}' --output "$dir/install.sh"`,
    `  printf '%s  %s\\n' '${record.installerSha256}' "$dir/install.sh" | sha256sum --check --status`,
    '  bash "$dir/install.sh"', ')'
  ].join('\n')
}
