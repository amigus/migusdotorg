+++
title = 'Byte Math with PowerShell'
+++

A lot of powershell modules accept byte values in different formats.
For example a utility might request values in bytes or megabytes.
In addition, some utilities require values that are powers of two.
Doing the math can and converting to and from the right factors can be tedious.
So, I wrote [ByteCalculationFunctions.ps1](https://gist.github.com/amigus/555b34d0b1c872c33f3fee55c7ed17e9)
to make it easier.

Import the functions into a PowerShell session and use them:

{{< powershell >}}
Invoke-WebRequest https://mig.us/bcfps1 | Invoke-Expression
{{< /powershell >}}

Get an integer representation of the number of bytes in 9 gigabyte:

{{< powershell >}}
bytesfromgigs 9
{{< /powershell >}}

Use the value with the Hyper-V [Set-VMMemory](https://learn.microsoft.com/en-us/powershell/module/hyper-v/set-vmmemory) command run:

{{< powershell >}}
Set-VMMemory -StartupBytes (4| bytesfromgigs) -MinimumBytes (2| bytesfromgigs) MyVirtualMachine
{{< /powershell >}}

Convert values:

{{< powershell no-copy >}}
1024 | bytestok # 1
7 | bytesfromgigs| bytestomegs # 7168
259072 | bytesfrommegs| bytestogigs # 253
768 | bytesfrommegs| bytestok # 786432
{{< /powershell >}}
