// The on-switch grammar every SessionStart implementation must agree on:
// session-start.sh and session-start.ps1. The sheet is UTF-8, or UTF-16 LE when
// it starts with that byte-order mark, which is what Windows PowerShell 5.1's
// `>` writes. A leading byte-order mark is dropped, lines end at LF, and one CR
// before the LF is dropped; any other CR is part of the line. Only a line that
// is then exactly `session hook: on` enables injection. A sheet that cannot be
// read as a file leaves injection off, as a missing sheet does.
import { chmodSync, mkdirSync, writeFileSync } from "node:fs";

export const UNREADABLE = Symbol("unreadable sheet");
export const NO_READ_PERMISSION = Symbol("sheet without read permission");

// chmod cannot deny a read on Windows, or to root.
export const chmodDeniesReads = process.platform !== "win32" && process.getuid?.() !== 0;

export const sheetCases = [
  { name: "no session hook line", sheet: "bug-fix: configured-model\n", on: false },
  { name: "off", sheet: "bug-fix: configured-model\nsession hook: off\n", on: false },
  { name: "on", sheet: "bug-fix: configured-model\nsession hook: on\n", on: true },
  { name: "on without a trailing newline", sheet: "session hook: on", on: true },
  { name: "on with CRLF endings", sheet: "bug-fix: configured-model\r\nsession hook: on\r\n", on: true },
  { name: "on after a byte-order mark", sheet: "\uFEFFsession hook: on\n", on: true },
  { name: "on in UTF-16 LE after a byte-order mark", sheet: Buffer.from("\uFEFFsession hook: on\r\n", "utf16le"), on: true },
  { name: "a CR before the LF and another after on", sheet: "session hook: on\r\r\n", on: false },
  { name: "lone CRs around on", sheet: "a\rsession hook: on\r", on: false },
  { name: "a CR inside on", sheet: "session hook: o\rn\n", on: false },
  { name: "capitalised key", sheet: "Session hook: on\n", on: false },
  { name: "uppercase value", sheet: "session hook: ON\n", on: false },
  { name: "leading space", sheet: " session hook: on\n", on: false },
  { name: "trailing space", sheet: "session hook: on \n", on: false },
  { name: "longer value", sheet: "session hook: online\n", on: false },
  { name: "a directory in place of the file", sheet: UNREADABLE, on: false },
  ...(chmodDeniesReads ? [{ name: "no read permission on the file", sheet: NO_READ_PERMISSION, on: false }] : []),
];

// Write a case's sheet at path; UNREADABLE puts a directory there instead, and
// NO_READ_PERMISSION an on sheet that only a reader ignoring permissions could see.
export function writeSheet(path, sheet) {
  if (sheet === UNREADABLE) mkdirSync(path);
  else if (sheet === NO_READ_PERMISSION) {
    writeFileSync(path, "session hook: on\n");
    chmodSync(path, 0o000);
  } else writeFileSync(path, sheet);
}
