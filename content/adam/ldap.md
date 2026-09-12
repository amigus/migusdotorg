+++
date = 2024-11-21
draft = true
keywords = [
    'ldap',
    'openldap',
]
tags = ['ldap', 'linux', 'networking']
title = 'Secure Authentication in OpenLDAP'
summary = 'An OpenLDAP configuration that uses SASL to enforce a secure login'
+++

LDAP (technically, LDAPv3) is a standard protocol for accessing and managing "directories."
A directory is something like a database but for "network resources," e.g., users and computers.
The most common LDAP directory on the market today is [Active Directory](https://en.wikipedia.org/wiki/Active_Directory) (AD).
A prevalent alternative that runs on Linux/UNIX is [OpenLDAP](https://www.openldap.org/).

## AD vs. OpenLDAP

While the two servers are very different in terms of installation, configuration and maintenance,
they can be used to achieve the same ends in almost all cases.
That said, the default configurations are quite different.
Not only the schemas but also the default authentication scheme.
While AD uses [Kerberos](https://en.wikipedia.org/wiki/Kerberos_(protocol)) for authentication,
OpenLDAP uses `plaintext` authentication that is insecure unless combined with transport-layer security (TLS).
Thankfully it has pluggable authentication to support other common types, like Kerberos when configured correctly.

## OpenLDAP Authentication

LDAP authentication is defined in terms of security strength factors (SSF).
Different forms of authentication achieve different strength factors.
The better (stronger) the authentication, the higher the SSF.
Servers then have enforce minimum SSFs depending on the operation.
For example, a server may require SSF=56 to read data but SSF=128 to modify it.

### With TLS

How a server measures SSF is configurable, however,
most will consider authentication performed over a TLS-encrypted channel as strong enough to do modifications even when coupled with plaintext passwords.
Conversely, not all forms of digest authentication (which all avoid plaintext passwords) will unless they are coupled with it.

### With SASL

OpenLDAP uses the [Simple Authentication and Security Layer](https://en.wikipedia.org/wiki/Simple_Authentication_and_Security_Layer) (SASL),
authentication framework to offer pluggable authentication.
On Linux, [Cyrus SASL](https://www.cyrusimap.org/sasl/),
has plugins to implement digest authentication using a range of algorithms, Kerberos, OpenID, etc.

### Common practices

Most servers will prohibit plaintext authentication unless it is over a TLS-encrypted channel.
It is also common for servers to require a higher minimum SSF for modifications, e.g., password changes.
