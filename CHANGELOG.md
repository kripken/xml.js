# Changelog

## 4.0.0

Add two new options, `initialMemoryPages` and `maxMemoryPages`, to control
how much memory the WebAssembly module allocates by default and is allowed
to allocate for the validation. 
[PR #16](https://github.com/noppa/xmllint-wasm/pull/13),
fixes [issue #8](https://github.com/noppa/xmllint-wasm/issues/8).  
Thanks [@MLSTRM](https://github.com/MLSTRM)!

The "**breaking change**" here is that we also raise the default maximum
memory cap from the old implicit 16MiB to double of that, 32MiB.  
With this new default, you may not even need to use the `maxMemoryPages` option
yourself, as 32MiB is probably already high enough for quite a lot of use cases.

In some _very_ memory constrained environments, this raised limit could impose
a problem if it causes the main process to run out of memory, so that's why
I'm calling it a breaking change. For most applications, though, this should
not be a problem. You can opt into the old limit by setting
```javascript
  maxMemoryPages: 16 * xmllint.memoryPages.MiB,
```

## 3.0.1

Fixes a broken build for Node in the previous version: Worker path
was defined relative to the index JS file, when Node actually resolves
relative Worker paths relative to the current working directory.
Fix by creating an absolute path with `path.resolve(__dirname, ..)`.

## 3.0.0

Should not contain breaking changes for most users, but there are
some internal file renames so I'm doing a major version bump just
in case someone was importing old files like index.js directly. 
`require('xmllint-wasm')` should still work as before.

* Upgrade libxml2 to 2.10.3
* Add browser support (fixes [#1](https://github.com/noppa/xmllint-wasm/issues/1)),
  thanks [@fhaftmann](https://github.com/fhaftmann) and [@th-we](https://github.com/th-we)!

## 2.2.0

No breaking changes to 2.0.0 - 2.1.0.

* Allow `schema` parameter to be omitted if `normalization` is set. i.e. allow
  formatting without doing validation to the XML ([PR #5](https://github.com/noppa/xmllint-wasm/pull/5)).

## 2.1.0

No known breaking changes to 2.0.0.

* Add support for xmllint option `--format` or `--c14n` via new config option
  `normalization` ([PR #3](https://github.com/noppa/xmllint-wasm/pull/3))
* Upgrade libxml2 version to 2.9.12 (fixes [#4](https://github.com/noppa/xmllint-wasm/issues/4) &
  [CVE-2021-3541](https://gitlab.gnome.org/GNOME/libxml2/-/commit/8598060bacada41a0eb09d95c97744ff4e428f8e))

