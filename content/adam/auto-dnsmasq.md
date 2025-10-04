+++
date = 2025-09-30
draft = false
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

When I started my network and systems administration career in the late 90s,
I used static IP addresses far more than I ever configured or used DHCP relays or servers.
Remote recursive DNS, i.e., “DNS resolvers,” were common, but so were servers that did their own lookups.

However, over time, DHCP has become ubiquitous, and nowadays, setting a static IP address is rarely required.
At the same time, configuring DNS now amounts to choosing a resolver instead of running one for most users.
[Dnsmasq](https://dnsmasq.org/doc.html), which combines DHCP and DNS _forwarding_ into a single server,
makes offering both to a small network easy.

This post is about the software wrote to automate and manage Dnsmasq:

- [amigus.dnsmasq](https://galaxy.ansible.com/ui/repo/published/amigus/dnsmasq/): a collection of Ansible Roles that install and configure Dnsmasq as a DHCP and/or DNS server
- [dnsmasq-web](https://github.com/amigus/dnsmasq-web): a REST (JSON/HTTP) API that provides access to client, lease, and request data and reservation management.

## Why Dnsmasq

Dnsmasq is designed explicitly for small servers and networks.
Many commercial small and home office (SOHO) routers use it as their DHCP and DNS server.
The libvirt API that I use also uses it to manage virtual networks,
which is how I learned about it!
There are two things that makes Dnsmasq so flexible and well-suited to those contexts;
the management of domain and host names, DNS zones, DHCP leases and options, etc. are all extendable,
and it accepts all configuration parameters via the command line or arbitrary configuration files.

However, while the extensibility makes scripting everything possible,
the terse syntax can be difficult to read and comprehend.
And, while the simplicity of Dnsmasq makes it great for managing _a_ small network,
it does not do anything to help with the task of managing _many_ small networks at once.

## Why not an IPAM

The standard solution for that problem is to deploy an IP Address Management (IPAM) solution.
These solutions can reliably manage many networks, and most can delegate management of parts of the network.
However, centralizing IP address management might not work as well when the networks have more autonomy.
Simply automating management tools across networks to scale horizontally can work better in such cases.

## Automation with Ansible

Automation is following a consistent, efficient process to repeat the same action at scale.
Ansible, a popular automation platform for Linux, does this well for configuration management across groups of servers.
The user keeps an _inventory_ of servers and manages the configuration data as declarative YAML.
Ansible then runs _tasks_ to translate the data into system configuration and state.

As a simple example, it can translate this YAML:

```yaml
---
dnsmasq_dns_servers:
  - address: 192.168.1.253
    domain: wired.lan
    network: 192.168.2.0/24
  - address: 192.168.1.1
```

Into these Dnsmasq configuration parameters:

```ini
rev-server=192.168.2.0/24,192.168.1.253
server=192.168.1.1
server=/wired.lan/192.168.1.253
```

Ansible can also use data is collects from the server as task input.

So, I can declare a server that leases the entire subnet starting from `.10` using `.1` as the gateway, like this:

```yaml
---
dnsmasq_dhcp_interfaces:
  - device: eth0
    router: 1
    start: 10
```

The YAML does not need to contain the IP subnet information because Ansible gets it from the interface itself.

For example, if the `eth0` interface of the server is `192.168.100.2/24`, the resulting configuration parameters are:

```ini
dhcp-range=interface:eth0,192.168.100.10,192.168.100.254
dhcp-option=interface:eth0,option:router,192.168.100.1
```

## Adding a DHCP Database and REST API

Running many small networks also requires real-time management of clients and DHCP leases on _some_ of them.
Even on small networks, knowing which clients are leasing IP addresses now and in the past, can be important.
In other cases, users need manage DHCP reservations without updating the system.

Dnsmasq itself does not use a database—it keeps _current_ lease information in a flat file—nor does it have an API.
But it is extensible in two important ways.

### The DHCP Database

Dnsmasq has a feature that allows users to delegate DHCP lease management to a script.
The [dnsmasq_dhcp_db](https://galaxy.ansible.com/ui/repo/published/amigus/dnsmasq/content/role/dnsmasq_dhcp_db/)
role includes a script that uses this feature to manage DHCP leases in an [SQLite](https://sqlite.org/)
database, which it configures Dnsmasq to use.

### dnsmasq-web

Dnsmasq also supports reading DHCP lease reservations from files in a specific directory.
The [dnsmasq_web](https://galaxy.ansible.com/ui/repo/published/amigus/dnsmasq/content/role/dnsmasq_web/)
role installs dnsmasq-web, which allows users to manage those DHCP lease reservations over HTTP.
It also includes endpoints that provide client, lease and request information access.

Both are optional and only present on the target system when the required options are present in the configuration YAML.

## TL;DR

While [Dnsmasq](https://dnsmasq.org/doc.html) is made for small networks and was not designed for automation or scalability,
however, it can be scaled horizontally by managing the configuration with Ansible.
It can also be extended, which [dnsmasq-web](https://github.com/amigus/dnsmasq-web) does to a DHCP database and REST API.

## Run a server on localhost

### Prerequisites

Ansible is a [Python](https://www.python.org/) program.
The DHCP tasks also need the Python [netaddr](https://pypi.org/project/netaddr/) library.
So the system that will run Ansible needs both.
Additionally, the target system must be an Alpine (apk), Redhat (dnf) or OpenSUSE (zypper) variant.
The same system will be _both_ in this case.

The variables below will configure DHCP to _itself_ as the network gateway,
and leases the whole IP subnet starting from 10.
It will also set itself as the DNS server and forward all queries to `1.1.1.1`.
To configure the DNS part only, omit the `dnsmasq_dhcp_interfaces` variable:

### Target localhost

Create an [Inventory](https://docs.ansible.com/ansible-core/2.19/inventory_guide/),
add the `localhost` to the `dnsmasq` group,
add the required variables to `vars`,
and save it as `inventory.yaml`:

```yaml {hl_lines="7"}
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

### Run the playbook

Then install Ansible and the amigus.dnsmasq collection,
then run the Playbook:

```sh
pip install ansible-core
ansible-galaxy collection install amigus.dnsmasq
ansible-playbook -i inventory.yaml amigus.dnsmasq.dnsmasq
```

## Getting Started

Check out the [documentation](https://amigus.github.io/dnsmasq-ansible)
for more information and examples!
