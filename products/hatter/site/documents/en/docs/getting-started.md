---
path: "/docs/getting-started"
title: "Install and start Hatter"
summary: "Check your environment, install Hatter and launch it for the first time."
kind: "page"
label: "Setup guide"
category: ""
status: "published"
---

## 1. Check your environment

Use Linux or WSL on x86\_64 with a trusted existing Node 22.23.4+ or 24.22.1+. This release is tested on Ubuntu 24.04. Node is not installed automatically, and native Windows is not supported.

## 2. Run the installation command

Copy the command from the installation page into your terminal. Review the version and destinations, then type “install”. The installer and product archive are verified before execution and extraction.

::document-link{title="Get the installation command" href="/download"}
::

## 3. Start Hatter

Run \~/.local/bin/hatter in your terminal, then open the local URL it displays. If \~/.local/bin is already in your PATH, you can use hatter. Shell settings are not edited and no persistent service is registered.

## 4. Select work and permissions

Installation does not initialize storage, credentials, roles or execution permissions. Review the required preparation separately; acquiring a HAT does not authorize its execution. Live Registry synchronization is still being prepared.

