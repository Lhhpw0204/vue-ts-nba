export default {
    setTeamsTid(state, teamsTid) {
        localStorage.teamsTid = JSON.stringify(teamsTid);
        state.teamsTid = teamsTid;
    }
}