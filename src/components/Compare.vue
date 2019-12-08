<template>
  <div class="compare">
    <div class="team_input">
      <input readonly @input="handleEnterTeam($event, 'guest')" placeholder="guest" v-model="guestName"/>
      <span>VS</span>
      <input readonly @input="handleEnterTeam($event, 'host')" placeholder="host" v-model="hostName"/>
    </div>
    <div class="team_diff">
      <ul class="diff_list">
        <li 
          v-for="(item, index) in team_diff_data" 
          :key="index">
          <span :class="['item_guest', calItem(item, item.guest, item.host)]">{{ item.guest }}</span>
          <span class="item_item">{{ wordMap[item.item] ? wordMap[item.item] : item.item }}
            <span>{{" (" + (item.host - item.guest).toFixed(2) + ")"}}</span>
          </span>
          <span :class="['item_host', calItem(item, item.host, item.guest)]">{{ item.host }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import tools from "../utils/tools"
  import { mapState } from "vuex"

  export default {
    name: "Rank",
    data() {
      return {
        teamTidMap: [],
        wordMap: {
          points: "得分",
          rebounds: "篮板",
          assists: "助攻",
          steals: "抢断",
          turnovers: "失误",
          blocks: "盖帽",
          field_goals_att: "场均出手",
          field_goals_pct: "命中率",
          three_points_att: "场均三分得分",
          three_points_pct: "三分命中率",
          assists_turnover_ratio: "助攻失误比",
          personal_fouls: "犯规",

        },
        guestName: "",
        hostName: "",
        team_diff_obj: {},
        team_diff_data: []
      }
    },
    computed: {
      ...mapState({
        teamsTid: 'teamsTid'
      })
    },
    created() {
      document.title = "球队比较-" + this.$route.query.guestName + "vs" + this.$route.query.hostName;
      this.getQuery();
    },
    methods: {
      async getQuery() {
        let query = this.$route.query;
        this.guestName = query.guestName;
        this.hostName = query.hostName;

        let guestTid = this.getTeamTid(this.guestName, this.teamsTid);
        let hostTid = this.getTeamTid(this.hostName, this.teamsTid);
        let guestAjax = this.getSingleTeamData(guestTid);
        let hostAjax = this.getSingleTeamData(hostTid);
        Promise.all([guestAjax, hostAjax]).then( (res) => {
          let guestData = res[0].data.result.data.reg.average,
              hostData = res[1].data.result.data.reg.average;
          // guestData = guestData.sort(tools.selfSort("item"));
          // hostData = hostData.sort(tools.selfSort("item"));
          for (let i = 0,iLen = guestData.length;i < iLen;i ++) {
            for (let j = 0,jLen = hostData.length;j < jLen;j ++) {
              if(guestData[i].item === hostData[j].item){
                if(guestData[i].item.indexOf("_pct") > 0) {
                  this.team_diff_data.push({
                    item: guestData[i].item,
                    guest: (guestData[i].score * 100).toFixed(2) + "%",
                    host: (hostData[j].score * 100).toFixed(2) + "%"
                  });
                } else {
                  this.team_diff_data.push({
                    item: guestData[i].item,
                    guest: guestData[i].score,
                    host: hostData[j].score
                  })
                }
              }
            }
          }
          this.team_diff_data = this.team_diff_data.filter( item => {
            return this.wordMap[item.item]
          });
        })
      },
      getTeamTid(currTeamName ,tids) {
        let currTeamTid = "";
        for(let i = 0, len = tids.length;i < len;i ++) {
          if(currTeamName === tids[i].team_name_cn) {
            currTeamTid = tids[i].tid;
            break;
          }
        }
        return currTeamTid;
      },
      handleEnterTeam: tools.debounce(function(e, type) {
        let value = e.target.value;
        let team_tip = '';
        for(let i = 0, len = this.teamTidMap.length;i < len;i ++) {
          if(value === this.teamTidMap[i].team_name_cn) {
            team_tip = this.teamTidMap[i].tid;
          }
        }
        this.getSingleTeamData(team_tip, type)
      }, 1000),
      // eslint-disable-next-line
      getSingleTeamData(tid, type) {
        return this.$axios.get(`/api?p=radar&p=radar&s=leaders&a=team&tid=${tid}&_=` + (new Date()).getTime());
      },
      calItem(item, guest, host) {
        if(item.item === 'turnovers') {
          return item.guest === item.host ? " " : guest > host ? "item_lose" : "item_win";
        } else {
          return item.guest === item.host ? " " : guest > host ? "item_win" : "item_lose";
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .compare{
    background: #f4f4f9;
    padding-top: 120px;
    min-height: 100vh;
    .team_input{
      display: flex;
      justify-content: center;
      align-items: center;
      span{
        display: inline-block;
        width: 240px;
        text-align: center;
      }
      input{
        border: solid 1px #ececec;
        border-radius: 2px;
        padding: 7px 0 7px 12px;
        font-size: 14px;
        background: transparent;
        border-color: #ccc;
      }
    }
    .team_diff{
      display: flex;
      margin-top: 30px;
      justify-content: center;
      align-items: center;
      text-align: center;
      .diff_list{
        li {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 4px 0 ;
          span{
            color: #616161;
            &.item_guest{
              text-align: right;
              width: 100px;
            }
            &.item_win{
              color: #6aa9e8;
              font-weight: bold;
            }
            &.item_lose{
              color: #ec6a86;
            }
            &.item_host{
              text-align: left;
              width: 100px;
            }
            &.item_item{
              display: inline-block;
              width: 240px;
            }
          }
        }
      }
    }
  }
</style>
