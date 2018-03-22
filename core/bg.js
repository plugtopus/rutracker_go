var App = {


    servers: {
        "reserved_nl2": `PROXY ru1.yavalenok.ru:8800; HTTPS ru1.yavalenok.ru;  HTTPS rtk1.pass.xzvpn.net:443; uk.freevpn.pw:443; ca.freevpn.pw:443; fr.freevpn.pw:443; us.freevpn.pw:443; de.freevpn.pw:443; jp.freevpn.pw:443; HTTPS nl.freevpn.pw:443`,
    },


    domains: ["rutracker.org", "www.rutracker.org"]


};
class Proxy {
    constructor() {
        this.rules = [];
    }

    buildRule(item, isFirst) {
        return `${!isFirst?`else `:``}if(${item.exp}){ return "${this.resolveHost[(item.srv)]}"; }`;
    }

    addRule(exp, srv = 'reserved_nl2') {
        this.rules.push({
            exp,
            srv
        });
        return this;
    }

    resolveTo(host) {
        this.resolveHost = host;
        return this;
    }

    buildPacScript(cb) {
        var s = [`function FindProxyForURL(url, host){`];
        var self = this;

        this.rules.forEach(
            (item, id) => s.push(self.buildRule(item, id === 0))
    );

        s.push(' else { return "DIRECT"; } }');

        return cb(s.join(' '));
    }
}

var prxy = new Proxy();
App.domains.forEach(item => prxy.addRule(`shExpMatch(url, "*${item}*")`));
chrome.proxy.settings.clear({
    scope: "regular"
});

prxy.resolveTo(App.servers).buildPacScript((data) => {
    chrome.proxy.settings.set({
    value: {
        mode: "pac_script",
        pacScript: {
            data: data
        }
    },
    scope: "regular"
})
});