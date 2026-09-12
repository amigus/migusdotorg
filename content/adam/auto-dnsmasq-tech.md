+++
date = 2025-09-30
draft = true
keywords = [
    'ansible',
    'dhcp',
    'dns',
    'dnsmasq',
]
tags = ['dns', 'linux', 'networking']
title = 'Automating and Managing Dnsmasq'
summary = 'Using Ansible and dnsmasq-web to automate and manage Dnsmasq servers'
weight = 20
+++

Dnsmasq is a DHCP server and DNS forwarder designed for small networks. It's not built for scale but highly extendable and flexible. I used that extensibility to add some automation and manageability:

- [dnsmasq-web](https://github.com/amigus/dnsmasq-web): a REST (JSON/HTTP) API that provides access to client, lease, and request data and reservation management.
- [amigus.dnsmasq](https://amigus.github.io/dnsmasq-ansible/): a collection of Ansible Roles available on Ansible [Galaxy](https://galaxy.ansible.com/ui/repo/published/amigus/dnsmasq/) that install and configure Dnsmasq as a DHCP and/or DNS server

# Features

## Readable YAML

It features readable YAML and spares the user from the terse configuration syntax of Dnsmasq, e.g., 

```
---
dnsmasq_dns_servers:
  - address: 192.168.1.253
    domain: wired.lan
    network: 192.168.2.0/24
  - address: 192.168.1.1
```

Becomes:

```
rev-server=192.168.2.0/24,192.168.1.253
server=192.168.1.1
server=/wired.lan/192.168.1.253
```

A DHCP server that leases the entire subnet starting from `.10` using `.1` as the gateway:

```
---
dnsmasq_dhcp_interfaces:
  - device: eth0
    router: 1
    start: 10
```

The YAML does not need to contain the IP subnet information because Ansible gets it from the interface.

For example, if the `eth0` interface of the server is `192.168.100.2/24`, the resulting configuration parameters are:

```
dhcp-range=interface:eth0,192.168.100.10,192.168.100.254
dhcp-option=interface:eth0,option:router,192.168.100.1
```

## SQLite Database

Dnsmasq does not use a database; it keeps _current_ lease information in an (undocumented) flat file and does not have an API.
However, lease management can be delegated via the `dhcp-script` and related options.

The role collection contains an SQLite database schema and a shell script for implementing a lease management database. It has tables for `requests`, `clients`, and `leases`.

## REST API

Dnsmasq also supports reading DHCP lease reservations from files in a specific directory.
The [dnsmasq_web](https://galaxy.ansible.com/ui/repo/published/amigus/dnsmasq/content/role/dnsmasq_web/)
role installs dnsmasq-web, which uses that feature to enable management of DHCP lease reservations over HTTP.
It also exposes the DHCP database data.

The database and REST API are optional and only present on the target system when the required options are in the configuration YAML.

# Try it: run a server on localhost

## Prerequisites

Ansible is a [Python](https://www.python.org/) program.
The DHCP tasks also need the Python [netaddr](https://pypi.org/project/netaddr/) library.
So the system that will run Ansible needs both.
Additionally, the target system must be an Alpine (apk), Red Hat (dnf), or OpenSUSE (zypper) variant.
The same system will be _both_ in this case.

The variables below will configure DHCP to _itself_ as the network gateway,
and leases the whole IP subnet starting from 10.
It will also set itself as the DNS server and forward all queries to `1.1.1.1`.
To configure the DNS part only, omit the `dnsmasq_dhcp_interfaces` variable:

## Target localhost

Create an [Inventory](https://docs.ansible.com/ansible-core/2.19/inventory_guide/),
Add the `localhost` to the `dnsmasq` group,
Add the required variables to `vars`,
and save it as `inventory.yaml`:

```
---
dnsmasq:
  hosts:
    localhost:
      ansible_connection: local
  vars:
    dnsmasq_dhcp_interfaces: [{ device: eth0, start: 10 }]
    dnsmasq_dns_options: [bogus-priv, domain-needed, no-resolv]
    dnsmasq_dns_servers: [{ address: 1.1.1.1 }]
```

## Run the playbook

Then install Ansible and the amigus.dnsmasq collection,
then run the Playbook:

```
pip install ansible-core
ansible-galaxy collection install amigus.dnsmasq
ansible-playbook -i inventory.yaml amigus.dnsmasq.dnsmasq
```

# More information

Check out the [documentation](https://amigus.github.io/dnsmasq-ansible)
for more information and examples!
