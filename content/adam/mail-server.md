+++
date = 2024-11-17
draft = false
keywords = [
    'cyrus',
    'email',
    'imap',
    'openldap',
    'postfix',
]
tags = ['linux']
title = 'My Email Server'
summary = 'About my containerized Cyrus IMAP + OpenLDAP + Postfix email server'
weight = 20
+++

I have been running my own email server since 2001.
I started with [Sendmail](https://en.wikipedia.org/wiki/Sendmail)
and [Courier IMAP](https://www.courier-mta.org/imap/)
but switched to [Cyrus IMAP](https://www.cyrusimap.org/)
and [Postfix](https://www.postfix.org/)
within a year and have used them ever since.
I ran [SquirrelMail](https://www.squirrelmail.org/) for a few years but nowadays
I use it via Outlook and a mobile client over IMAPS and SMTP Submission.
Likewise it used to do content-filtering using [amavis](https://www.amavis.org/) and [clamav](https://www.clamav.net/)
but I outsourced that to [Mailroute](https://mailroute.net/)
when I ported it to the cloud, so it no longer accepts SMTP from the internet.

### Transition to Linux in the Cloud (2012)

Initially, it ran on a physical server on my home network running SunOS 5.x,
a.k.a., [Solaris](https://en.wikipedia.org/wiki/Oracle_Solaris).
Then, in 2003, I began working on [FreeBSD](https://freebsd.org) professionally.
So, I ported the server to it in 2004 and ran that until migrating to the cloud.
That happened in 2012 when AWS became a reasonable alternative to running local hardware.
But they only offered Linux at the time,
so I ported it from FreeBSD to [Amazon Linux](https://aws.amazon.com/amazon-linux-ami/)
and ran it on that until they deprecated the AMI in 2023.

### Deployment with Containers (2023)

Very few Linux distributions included Cyrus IMAP in 2023.
[OpenSUSE](https://opensuse.org)
[Leap](https://www.opensuse.org/#Leap)
had it, though, so I ported to that.
But then I had trouble with their package so I decided to build Cyrus from source.
That meant creating a maintaining a environment for the runtime.
I was also keen to avoid vendor lock-in after the forced move from Amazon Linux.
So I decided to "containerize" it.
I used [Buildah](https://buildah.io/)
instead of [Docker](https://www.docker.com) mainly
because they let me maintain it as (POSIX) Shell instead of Dockerfiles.

### Published on GitHub (2024)

I published the scripts, a Makefile, a pod.yaml, and a README.md on [GitHub](https://github.com/amigus/cyrus-imap-server).
Note, however, that the repository does not contain configuration or scripts to create containers.
Thus, an existing configuration and expertise is required.
