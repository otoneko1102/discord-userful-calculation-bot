const version = require("./package.json");
const c = require("./commands/math/conv.js")
const d = require("./commands/math/decide.js")
const m = require("./commands/math/math.js");
const r = require("./commands/math/random.js")
const s = require("./commands/math/script.js")

module.exports = {
        px: 'c#',
        playing: `discord.js v${version.dependencies["discord.js"].replace('^','')} | mathjs v${version.dependencies["mathjs"].replace('^','')}`,
        ccmds: c.cmds,
        dcmds: d.cmds,
        cmds: m.cmds,
        rcmds: r.cmds,
        scmds: s.cmds,
};
