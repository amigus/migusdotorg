+++
date = 2024-11-09
keywords = [
    'arithmetic',
    'binary',
    'byte',
    'math',
    'powershell'
]
tags = ['powershell']
title = 'Byte Conversion with PowerShell'
summary = 'PowerShell Commands that convert and express byte values, i.e., powers of two, e.g., 1048576 = 1 Megabyte'
weight = 30
+++

Powershell includes [numeric multipliers](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_numeric_literals#numeric-multipliers)
that allow users to use 1kb instead of 1024 and so on with megabytes, gigabytes, terabytes, and petabytes.

This is feature of PowerShell is commonly used with commands like [Set-VMMemory](https://learn.microsoft.com/en-us/powershell/module/hyper-v/set-vmmemory?view=windowsserver2022-ps):

```PowerShell
Set-VMMemory -StartupBytes 4gb -MinimumBytes 2gb MyVirtualMachine
```

It also makes conversion a simple matter of division, multiplication and (optionally) typecasting:

```PowerShell
Get-ChildItem -File |
Sort-Object Length |
Select-Object -Last 10 @{
    Name='Size (MB)'
    Expression={[long]($_.Length / 1mb)}
}, Name, Modified
```

That works, but I found it tedious to type and that it made my code less readable.
So I wrote [ByteCalculationFunctions.ps1](https://gist.github.com/amigus/555b34d0b1c872c33f3fee55c7ed17e9)
to make it easier to read and type commands that include byte conversion.

For example, to get an integer representation of the number of bytes in 9 gigabyte:

```PowerShell
bytesfromgigs 9 # will return 9663676416
```

So, the expression above is (slightly) easier to write and read:

```PowerShell
Get-ChildItem -File |
Sort-Object Length |
Select-Object -Last 10 @{
    Name='Size (MB)'
    Expression={bytestomegs $_.Length}
}, Name, Modified
```

Also, they take advantage of PowerShell
[Pipelines](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pipelines)
to make inline conversion easier and more readable:

```PowerShell
1024 | bytestok # 1
260046848 | bytestomegs # 260046848
7 | bytesfromgigs | bytestomegs # 7168
259072 | bytesfrommegs | bytestogigs # 253
```

To use them, import them into your current PowerShell session:

```PowerShell
Invoke-WebRequest https://mig.us/bcfps1 | Invoke-Expression
```
