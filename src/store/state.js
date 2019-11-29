let localTeamsTid = [];
try {
    if (localStorage.teamsTid) {
        localTeamsTid = JSON.parse(localStorage.teamsTid);
    }
 // eslint-disable-next-line no-empty
 } catch (e) {}

export default {
    teamsTid: localTeamsTid
}